import { type MJMessage, type Midjourney } from "midjourney";
import sleep from "../../util/sleep";

/**
 * Upscales generated images using the Midjourney client.
 * @param {Midjourney} client - The Midjourney client instance.
 * @param {MJMessage} imagineMJMessage - The initial message containing image generation results.
 * @returns {Promise<MJMessage[]>} An array of messages containing upscaled images.
 */
async function upscaleImages(
  client: Midjourney,
  imagineMJMessage: MJMessage,
): Promise<MJMessage[]> {
  const upscaleOptions = ["U1", "U2", "U3", "U4"];
  const upscaledImages = [];

  for (const option of upscaleOptions) {
    const customID = imagineMJMessage.options?.find((o) => o.label === option)
      ?.custom;
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
      `Upscaled ${upscaledImages.length} over ${upscaleOptions.length}`,
    );

    // Sleep for 500ms to manage request timing
    await sleep(500);
  }

  return upscaledImages;
}

export default upscaleImages;
