import createClient from "./createClient";
import sharp from "sharp";

/**
 * Posts content with an image to Instagram.
 *
 * This function first initializes the Instagram client using `createClient`.
 * It then converts the specified image to a JPEG format using the `sharp` library
 * and posts it to Instagram along with the provided content.
 *
 * @param postContent - The text content of the Instagram post.
 * @param imagePath - The path of the image file to be posted.
 * @throws Throws an error if there's a failure in any of the steps: initializing the client, processing the image, or posting to Instagram.
 */
export default async (
  postContent: string,
  imagePath: string,
): Promise<void> => {
  try {
    // Initialize the Instagram client
    const client = await createClient();

    // Convert the image at the specified path to a JPEG buffer
    const imageJpegBuffer = await sharp(imagePath).jpeg().toBuffer();

    // Post the image to Instagram with the provided content as caption
    await client.publish.photo({
      file: imageJpegBuffer,
      caption: postContent,
    });
  } catch (error) {
    // Log and rethrow the error for further handling
    console.error("Error in posting on Instagram:", error);
    throw error;
  }
};
