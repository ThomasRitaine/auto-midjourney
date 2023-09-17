import { sleep } from "bun";
import { GenerationResponse } from "../types";
import fs from 'node:fs';


async function downloadImages(generationResponseList: GenerationResponse[]): Promise<void> {
    
    for (const generationResponse of generationResponseList) {
        console.log(`Downloading image : ${generationResponse.uri}`);
        
        const image = await fetch(generationResponse.uri);
        const extension = generationResponse.uri.split(".").pop();
        const filename = `${generationResponse.id}.${extension}`;

        fs.mkdirSync(`image/${generationResponse.clientName}`, { recursive: true });
        await Bun.write(`image/${generationResponse.clientName}/${filename}`, image);
        await sleep(1000);
    }
}

export default downloadImages;
