import fs from 'fs';
import path from 'path';

const directory = 'public/photos';
const metadataFile = path.join(directory, '..', 'metadata.json');

// Load existing metadata
let metadata = {};
if (fs.existsSync(metadataFile)) {
  metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf-8'));
}

// Scan directory for existing files
const files = fs.readdirSync(directory).filter(file => file !== '.gitkeep');

// Initialize a flag to check if metadata was updated
let updated = false;

// Add new files to metadata
files.forEach(file => {
  if (!metadata[file]) {
    metadata[file] = {
      title: '',
      description: ``,
    };
    updated = true;
  }
});

// Remove entries from metadata that no longer have corresponding files
Object.keys(metadata).forEach(file => {
  if (!files.includes(file)) {
    delete metadata[file];
    updated = true;
  }
});

// Save updated metadata if changes were made
if (updated) {
  fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
  console.log(`Updated metadata for ${files.length} photos`);
} else {
  console.log('No new photos to update and no obsolete entries to remove');
}
