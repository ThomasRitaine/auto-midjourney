import { GenerationResponse } from "./types";
import https from 'https';
import fs from 'fs';
import { mkdir } from "fs/promises";

async function downloadImages(generationResponseList: GenerationResponse[]): Promise<void> {
    
    for (const generationResponse of generationResponseList) {
        console.log(`Downloading image : ${generationResponse.uri}`);
        
        const extension = generationResponse.uri.split(".").pop();
        const filename = `${generationResponse.id}.${extension}`;
        const folder = `image/${generationResponse.collection}`;
        
        if (!fs.existsSync(folder)) await mkdir(folder, { recursive: true });
        
        const file = fs.createWriteStream(`${folder}/${filename}`);
        const request = https.get(generationResponse.uri, function(response) {
            response.pipe(file);
        });

        // Sleep one second to avoid getting rate limited
        await new Promise(resolve => setTimeout(resolve, 1000));
        
    }
}

export default downloadImages;
