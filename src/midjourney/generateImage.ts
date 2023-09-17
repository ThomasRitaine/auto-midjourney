import { Midjourney } from "midjourney";
import upscaleImages from "./upscaleImages";
import { GenerationRequest, GenerationResponse } from "../types";
import {v4 as uuidv4} from 'uuid';


async function generateImage(client: Midjourney, generationRequest: GenerationRequest): Promise<GenerationResponse[]> {

  var generationResponseList: GenerationResponse[] = [];
  
  for (let i = 0; i < generationRequest.batch; i++) {
    
        const imagineMJMessage = await client.Imagine(
          generationRequest.prompt,
          (uri: string, progress: string) => {
            // console.log("loading", uri, "progress", progress);
            console.log("progress", progress);
          }
        );
      
        if (!imagineMJMessage) {
          console.log("no message");
          return [];
        }
        
        const upscaledResults = await upscaleImages(client, imagineMJMessage);

        const clientName = generationRequest.clientName;

        generationResponseList = generationResponseList.concat(
          upscaledResults.map(item => {
            return {
              id: uuidv4(),
              uri: item.uri,
              clientName: clientName,
            };
          })
        );
    }
            
    return generationResponseList;
}

export default generateImage;
