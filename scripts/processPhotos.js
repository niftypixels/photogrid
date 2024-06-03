import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config();

function deleteDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      const curPath = path.join(dir, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteDirectory(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dir);
  }
}

async function processPhotos(directory) {
  try {
    const files = fs.readdirSync(directory);
    const photos = [];
    const thumbs = [];

    const parentDirectory = path.resolve(directory, '..');
    const thumbnailDirectory = path.join(parentDirectory, 'thumbs');

    deleteDirectory(thumbnailDirectory);

    if (!fs.existsSync(thumbnailDirectory)) {
      fs.mkdirSync(thumbnailDirectory);
    }

    for (const file of files) {
      if (file === '.gitkeep') continue; // ignore .gitkeep

      const fileName = path.parse(file).name;
      const filePath = path.join(directory, file);
      const thumbnailPath = path.join(thumbnailDirectory, file);      
      const { width, height } = await sharp(filePath).metadata();
      const aspectRatio = width / height;
      const thumbnailHeight = 1.1 * process.env.VITE_ROW_HEIGHT;

      await sharp(filePath).resize({ height: thumbnailHeight }).toFile(thumbnailPath);
      
      thumbs.push({
        alt: fileName,
        title: `Title for ${fileName}`,
        src: `/${path.relative(parentDirectory, thumbnailPath)}`,
        width: Math.floor(thumbnailHeight * aspectRatio),
        height: thumbnailHeight,
      });

      photos.push({
        title: `Title for ${fileName}`,
        description: `Description of ${fileName}`,
        src: `/${path.relative(parentDirectory, filePath)}`,
        width,
        height,
      });
    }

    fs.writeFileSync(
      path.join(parentDirectory, 'gallery.json'),
      JSON.stringify({ photos, thumbs }, null, 1),
    );

    console.log(`Processed ${photos.length} photos`);
  } catch (e) {
    console.error('Error reading public/photos:', e);
  }
}

processPhotos('public/photos');
