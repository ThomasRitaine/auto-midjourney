import createClient from "./createClient";
import sharp from "sharp";

export default async (
  postContent: string,
  imagePath: string,
): Promise<void> => {
  try {
    // Get the Instagram client
    const client = await createClient();

    // Convert the image to a jpeg buffer
    const imageJpegBuffer = await sharp(imagePath).jpeg().toBuffer();

    // Post the image
    await client.publish.photo({
      file: imageJpegBuffer,
      caption: postContent,
    });
  } catch (error) {
    console.error("Error in posting on instagram:", error);
    throw error;
  }
};
