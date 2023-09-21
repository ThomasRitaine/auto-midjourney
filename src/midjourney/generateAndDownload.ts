import createClient from "./createClient";
import downloadImages from "./downloadImages";
import { GenerationRequest, GenerationResponse } from "./types";
import generateImage from "./generateImage";


// async function generateAndDownload(prompts: string[]): Promise<void> {
async function generateAndDownload(generationRequestList: GenerationRequest[]): Promise<void> {

    const client = await createClient();
    
    
    for (const generationRequest of generationRequestList) {
        console.log(`Generating prompt : ${generationRequest.prompt}`);
        let generationResponseList = await generateImage(client, generationRequest);
        console.log(`Generation finished for prompt : ${generationRequest.prompt}`);

        // Sleep for one second
        await new Promise(resolve => setTimeout(resolve, 1000));
        await downloadImages(generationResponseList);
    }
    
}

export default generateAndDownload;
