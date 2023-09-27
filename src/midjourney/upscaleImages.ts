import { type MJMessage, type Midjourney } from "midjourney";

async function upscaleImages(
  client: Midjourney,
  imagineMJMessage: MJMessage
): Promise<MJMessage[]> {
  const upscaleOptions = ["U1", "U2", "U3", "U4"];
  const upscaledImages = [];

  for (const option of upscaleOptions) {
    const customID = imagineMJMessage.options?.find(
      (o) => o.label === option
    )?.custom;
    if (customID == null) {
      console.log(`no ${option}`);
      continue;
    }

    const Upscale = await client.Custom({
      msgId: imagineMJMessage.id ?? "",
      flags: imagineMJMessage.flags,
      customId: customID,
      loading: (uri, progress) => {
        // console.log("loading", uri, "progress", progress);
        // console.log("progress", progress);
      },
    });

    if (Upscale == null) {
      console.log(`No Upscale for ${option}`);
      continue;
    }

    upscaledImages.push(Upscale);

    console.log(
      `Upscaled ${upscaledImages.length} over ${upscaleOptions.length}`
    );

    // Sleep for 500ms
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return upscaledImages;
}

export default upscaleImages;
