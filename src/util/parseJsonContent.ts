import type IGeneratedContent from "../services/openai/generatedContentInterface";

/**
 * Extracts, parses, and validates JSON content from a raw string.
 * The JSON must contain the keys nftName, nftDescription, and post.
 *
 * @param rawContent - The raw string containing JSON-like content.
 * @returns A valid JSON object.
 * @throws Error if the content can't be parsed or doesn't meet the requirements.
 */
export function parseOpenaiJsonResponse(rawContent: string): IGeneratedContent {
  // Find the first occurrence of '{' and the last occurrence of '}'
  const startIndex = rawContent.indexOf("{");
  const endIndex = rawContent.lastIndexOf("}");

  if (startIndex === -1 || endIndex === -1) {
    throw new Error("Invalid format: Cannot find JSON bounds.");
  }

  // Extract the JSON string
  const jsonString = rawContent.substring(startIndex, endIndex + 1);

  try {
    // Attempt to parse the JSON string
    const jsonObj = JSON.parse(jsonString);

    // Validate the structure of the JSON
    if (
      typeof jsonObj !== "object" ||
      jsonObj === null ||
      !("nftName" in jsonObj) ||
      !("nftDescription" in jsonObj) ||
      !("post" in jsonObj)
    ) {
      throw new Error(
        "Invalid JSON: Required keys (nftName, nftDescription, post) not found.",
      );
    }

    // Return the validated JSON object
    return jsonObj;
  } catch (error: any) {
    // Rethrow parsing errors as more descriptive errors
    throw new Error(`Invalid JSON: ${error.message}`);
  }
}
