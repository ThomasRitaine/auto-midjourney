/**
 * Trims the tweet content to fit within 270 characters. It preserves the original formatting,
 * including line breaks, by removing words from the end until the length is within the limit.
 *
 * @param tweetContent - The initial tweet content.
 * @returns The trimmed tweet content within the character limit.
 */
function trimTweetContent(tweetContent: string): string {
  while (tweetContent.length > 270) {
    const lines = tweetContent.split("\n"); // Split by newline
    const lastLine = lines[lines.length - 1];
    const words = lastLine.split(/\s+/); // Split the last line by whitespace

    if (words.length > 1) {
      words.pop(); // Remove the last word of the last line
      lines[lines.length - 1] = words.join(" "); // Rejoin the words of the last line
      tweetContent = lines.join("\n"); // Rejoin the lines
    } else {
      // If the last line has only one word, remove the entire line
      lines.pop();
      tweetContent = lines.join("\n");
    }
  }
  return tweetContent;
}

export default trimTweetContent;
