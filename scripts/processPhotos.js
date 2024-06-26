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
    const files = fs.readdirSync(directory).filter(f => f !== '.gitkeep');
    const parentDirectory = path.resolve(directory, '..');
    const thumbnailDirectory = path.join(parentDirectory, 'thumbs');
    const photos = [];
    const thumbs = [];

    const metadataPath = path.join(parentDirectory, 'metadata.json');
    let metadata = {};

    if (fs.existsSync(metadataPath)) {
      metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    }

    deleteDirectory(thumbnailDirectory);

    if (!fs.existsSync(thumbnailDirectory)) {
      fs.mkdirSync(thumbnailDirectory);
    }

    for (const file of files) {
      const filePath = path.join(directory, file);
      const { width, height } = await sharp(filePath).metadata();
      const { title = '', description = '' } = metadata[file] || {};
      const aspectRatio = width / height;
      const thumbnailHeight = Math.floor(1.1 * process.env.VITE_ROW_HEIGHT);
      const thumbnailWidth = Math.floor(thumbnailHeight * aspectRatio);
      const thumbnailPath = path.join(thumbnailDirectory, file);

      await sharp(filePath).resize({ height: thumbnailHeight }).toFile(thumbnailPath);

      thumbs.push({
        alt: path.parse(file).name,
        title,
        src: `/${path.relative(parentDirectory, thumbnailPath)}`,
        width: thumbnailWidth,
        height: thumbnailHeight,
      });

      photos.push({
        title,
        description,
        src: `/${path.relative(parentDirectory, filePath)}`,
        width,
        height,
      });
    }

    fs.writeFileSync(
      path.join(parentDirectory, '../src/assets', 'gallery.json'),
      JSON.stringify({ photos, thumbs }, null, 0),
    );

    console.log(`Processed ${photos.length} photos`);
  } catch (e) {
    console.error('Error reading public/photos:', e);
  }
}

processPhotos('public/photos');
