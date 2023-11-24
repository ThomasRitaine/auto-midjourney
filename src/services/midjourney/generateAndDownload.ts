import sleep from "../../util/sleep";
import createClient from "./createClient";
import generateImage from "./generateImage";
import { type GenerationInfo } from "@prisma/client";

async function generateAndDownload(
  generationInfoGroup: GenerationInfo[],
): Promise<void> {
  const client = await createClient();

  for (const generationInfo of generationInfoGroup) {
    console.log(`Generating prompt : ${generationInfo.prompt}`);
    await generateImage(client, generationInfo);
    console.log(`Generation finished`);

    // Sleep for one second
    await sleep(1000);
  }
}

export default generateAndDownload;
