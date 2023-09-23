import { Midjourney } from "midjourney";
import upscaleImages from "./upscaleImages";
import { GenerationInfo, Image } from "@prisma/client";
import { createImageByUri } from "../services/prisma-crud/image";


async function generateImage(client: Midjourney, generationInfo: GenerationInfo): Promise<Image[]> {

  let images: Image[] = [];

  for (let i = 0; i < generationInfo.repeat; i++) {

    const imagineMJMessage = await client.Imagine(
      generationInfo.prompt,
      (uri: string, progress: string) => {
        // console.log("loading", uri, "progress", progress);
        console.log("progress", progress);
      }
    );
  
    if (!imagineMJMessage) {
      console.log("no message");
      return images;
    }
    
    const upscaledResults = await upscaleImages(client, imagineMJMessage);

    const uriList = upscaledResults.map(item => {
      return item.uri;
    });

    for (const uri of uriList) {
      // Sleep one second to avoid getting rate limited
      await new Promise(resolve => setTimeout(resolve, 1000));

      images.push(await createImageByUri(uri, generationInfo));
    }
  }

  return images;
}

export default generateImage;
