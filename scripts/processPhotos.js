import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function processPhotos(directory) {
  try {
    const files = fs.readdirSync(directory);
    const photos = [];
    const thumbs = [];

    const parentDirectory = path.resolve(directory, '..');
    const thumbnailDirectory = path.join(parentDirectory, 'thumbs');

    if (!fs.existsSync(thumbnailDirectory)) {
      fs.mkdirSync(thumbnailDirectory);
    }

    for (const file of files) {
      const filePath = path.join(directory, file);
      const thumbnailPath = path.join(thumbnailDirectory, file);      
      const { width, height } = await sharp(filePath).metadata();
      const aspectRatio = width / height;
      const thumbnailHeight = 165;

      await sharp(filePath).resize({ height: thumbnailHeight }).toFile(thumbnailPath);
      
      thumbs.push({
        src: `/${path.relative(parentDirectory, thumbnailPath)}`,
        width: thumbnailHeight * aspectRatio,
        height: thumbnailHeight,
      });

      photos.push({
        src: `/${path.relative(parentDirectory, filePath)}`,
        width,
        height,
      });
    }

    fs.writeFileSync(
      path.join(parentDirectory, 'gallery.json'),
      JSON.stringify({ thumbs, photos }, null, 1),
    );

    console.log(`Processed ${photos.length} photos`);
  } catch (e) {
    console.error('Error reading public/photos:', e);
  }
}

processPhotos('public/photos');
