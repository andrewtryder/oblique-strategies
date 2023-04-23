import cloudinary from 'cloudinary';
import { readFileSync } from 'fs';
import { join } from 'path';

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_FOLDER_NAME } = process.env;

// Set up Cloudinary configuration
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// Read quotes file into memory
const quotesFilePath = join(process.cwd(), 'public', 'oblique.txt');
const quotesFile = readFileSync(quotesFilePath, { encoding: 'utf-8' });
const quotes = quotesFile.split('\n');

export default async (req, res) => {
  try {
    // Get list of images in Cloudinary folder
    const prefix = CLOUDINARY_FOLDER_NAME + '/';
    const { resources } = await cloudinary.v2.api.resources({
      type: 'upload',
      prefix: prefix,
    });
    console.log('Resources:', resources);

    // Select random image from list
    const randomIndex = Math.floor(Math.random() * resources.length);
    const image = resources[randomIndex];
    console.log('Selected image:', image);

    // Render random quote and image
    const randomQuoteIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomQuoteIndex];
    console.log('Selected quote:', quote);
    const lastCommaIndex = quote.lastIndexOf(',');
    const displayedQuote = lastCommaIndex === -1 ? quote : quote.substring(lastCommaIndex + 1).trim();
    const imageUrl = cloudinary.v2.url(image.public_id, { width: 1920, height: 1280, crop: 'fill' });
    const textColor = '#ff0000';

    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1280">
        <image href="${imageUrl}" width="1920" height="1280"/>
        <text x="50%" y="50%" fill="${textColor}" text-anchor="middle">${displayedQuote}</text>
      </svg>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};
