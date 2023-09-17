import { sleep } from "bun";
import { MJMessage, Midjourney } from "midjourney";

async function upscaleImages(client: Midjourney, imagineMJMessage: MJMessage): Promise<MJMessage[]> {
  const upscaleOptions = ["U1", "U2", "U3", "U4"];
  const upscaledImages = [];

  for (const option of upscaleOptions) {
    const customID = imagineMJMessage.options?.find((o) => o.label === option)?.custom;
    if (!customID) {
      console.log(`no ${option}`);
      continue;
    }

    const Upscale = await client.Custom({
      msgId: imagineMJMessage.id,
      flags: imagineMJMessage.flags,
      customId: customID,
      loading: (uri, progress) => {
        // console.log("loading", uri, "progress", progress);
        // console.log("progress", progress);
      },
    });
    
    if (!Upscale) {
        console.log(`no Upscale for ${option}`);
        continue;
    }
    
    upscaledImages.push(Upscale);
    
    await sleep(500);
  }

  return upscaledImages;
}

export default upscaleImages;
