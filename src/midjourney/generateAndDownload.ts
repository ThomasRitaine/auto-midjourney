import createClient from "./createClient";
import generateImage from "./generateImage";
import { GenerationInfo } from "@prisma/client";


// async function generateAndDownload(prompts: string[]): Promise<void> {
async function generateAndDownload(generationInfoGroup: GenerationInfo[]): Promise<void> {

    const client = await createClient();
    
    for (const generationInfo of generationInfoGroup) {
        console.log(`Generating prompt : ${generationInfo.prompt}`);
        let imageList = await generateImage(client, generationInfo);
        console.log(`Generation finished for prompt : ${generationInfo.prompt}`);

        // Sleep for one second
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
}

export default generateAndDownload;
