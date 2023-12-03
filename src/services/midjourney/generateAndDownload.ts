import sleep from "../../util/sleep";
import createClient from "./createClient";
import generateImage from "./generateImage";
import { type GenerationInfo } from "@prisma/client";

/**
 * Generates and downloads images based on provided generation information.
 * @param {GenerationInfo[]} generationInfoGroup - Array of generation information objects.
 * @returns {Promise<void>}
 */
async function generateAndDownload(
  generationInfoGroup: GenerationInfo[],
): Promise<void> {
  const client = await createClient();

  for (const generationInfo of generationInfoGroup) {
    console.log(`Generating prompt : ${generationInfo.prompt}`);
    await generateImage(client, generationInfo);
    console.log(`Generation finished`);

    // Sleep for one second to prevent rapid successive requests
    await sleep(1000);
  }
}

export default generateAndDownload;
