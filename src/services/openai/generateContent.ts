import OpenAI from "openai";
import trimTweetContent from "../../util/trimTweetContent";
import { readFileSync } from "fs";
import path from "path";
import { parseOpenaiJsonResponse } from "../../util/parseJsonContent";
import type IGeneratedContent from "./generatedContentInterface";

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

/**
 * Generates the NFT name, description and post content using OpenAI based on a given image prompt.
 *
 * @param prompt - The prompt describing the image.
 * @param imageCreationDate - The creation date of the image.
 * @returns An object containing all the generated content.
 * @throws Throws an error if the OpenAI API call fails.
 */
export default async (
  prompt: string,
  imageCreationDate: Date,
): Promise<IGeneratedContent | undefined> => {
  let attempt = 0;
  while (attempt < 2) {
    // Allows up to 2 attempts: initial + 1 retry
    try {
      // Get the OpenAI prompt from the JSON file
      const openaiPromptPath = path.join(__dirname, "prompt.json");
      const openaiPrompt = JSON.parse(readFileSync(openaiPromptPath, "utf8"));

      // iterate through openaiPrompt and json stringify each content object for role: "assistant"
      openaiPrompt.forEach((message: { role: string; content: any }) => {
        if (message.role === "assistant") {
          message.content = JSON.stringify(message.content);
        }
      });

      // Add the user prompt to the OpenAI prompt
      openaiPrompt.push({ role: "user", content: prompt });

      const completion = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        max_tokens: 250,
        messages: openaiPrompt,
      });

      // Assume the response content is a string that needs to be parsed
      const generatedContent = completion.choices[0].message.content;
      const {
        nftName,
        nftDescription: parsedNftDescription,
        post,
      } = parseOpenaiJsonResponse(generatedContent as string);

      // Replace the "00/00/0000" creation date in the NFT description by imageCreationDate in the format dd/mm/yyyy
      const imageCreationDateFormated = imageCreationDate.toLocaleDateString(
        "fr-FR",
        {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        },
      );
      const nftDescription = parsedNftDescription.replace(
        "00/00/0000",
        imageCreationDateFormated,
      );

      // Trim Tweet to ensure the length is under 270 characters
      const trimmedPostContent = trimTweetContent(post);

      return {
        nftName,
        nftDescription,
        post: trimmedPostContent,
      };
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      attempt++;
      if (attempt >= 2) {
        throw new Error("Failed to generate content after 2 attempts.");
      }
    }
  }
};
