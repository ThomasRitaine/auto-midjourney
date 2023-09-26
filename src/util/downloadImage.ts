import https from 'https';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';

const writeFileAsync = promisify(fs.writeFile);

/**
 * Downloads an image from a given URI and saves it to the specified path.
 * 
 * @param uri - The HTTPS URI of the image to download.
 * @param savePath - The directory where the image should be saved.
 * @param filename - Optional name to save the file as. If not provided, the original filename from the URI is used.
 * 
 * @returns Promise<void>
 * 
 * @example
 * downloadImage("https://example.com/image.png", "/path/to/save");
 * downloadImage("https://example.com/image.png", "/path/to/save", "newname");
 */
async function downloadImage(uri: string, savePath: string, filename?: string): Promise<void> {
    return new Promise((resolve, reject) => {
        // Determine the filename from the URI if it's not provided
        const originalFilename = path.basename(uri);
        const finalFilename = filename ? `${filename}${path.extname(originalFilename)}` : originalFilename;
        const filePath = path.join(savePath, finalFilename);

        https.get(uri, response => {
            // Handle HTTP errors
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${uri}' (${response.statusCode})`));
                return;
            }

            let imageData = Buffer.from([]);

            response.on('data', chunk => {
                imageData = Buffer.concat([imageData, chunk]);
            });

            response.on('end', async () => {
                try {
                    await writeFileAsync(filePath, imageData);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });

            response.on('error', reject);
        }).on('error', reject);
    });
}

export default downloadImage;
