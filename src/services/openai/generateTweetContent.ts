import OpenAI from "openai";

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

/**
 * Trims the tweet content to fit within 255 characters. It preserves the original formatting,
 * including line breaks, by removing words from the end until the length is within the limit.
 *
 * @param tweetContent - The initial tweet content.
 * @returns The trimmed tweet content within the character limit.
 */
function trimTweetContent(tweetContent: string): string {
  while (tweetContent.length > 258) {
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

/**
 * Generates tweet content using OpenAI based on a given image prompt.
 *
 * @param prompt - The prompt describing the image.
 * @returns A string containing the generated tweet content.
 * @throws Throws an error if the OpenAI API call fails.
 */
export default async (prompt: string): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      max_tokens: 100,
      messages: [
        {
          role: "system",
          content:
            "You are a professional community manager and *brand developer* with over 20 years of experience. Your task is to write the content of a *tweet* that presents an AI generated Art image. The user will give the prompt used to generate the image, and you will respond with the tweet's content. You should include lot of hashtags, keywords, and encourage to visit ai-art.tv website for more images and for custom art. The Tweet must be *less than 250 characters*.",
        },
        {
          role: "user",
          content:
            "Emotional palette of nostalgia, an old wooden pier extending into a tranquil lake, surrounded by autumn trees shedding golden leaves, a soft melancholic aura with warm sunrays breaking through the trees, Illustration, watercolor on textured paper, --ar 1:1 --v 5",
        },
        {
          role: "assistant",
          content: `Autumn reimagined in AI watercolors 🍂🖌️ Your mood, our canvas. Create your fall masterpiece

Serenity awaits at ai-art.tv

#AI #AiArt #Midjourney #Fall #ArtLovers #Innovation #Inspiration #Art #Painting #Nature #Inspiration #Beautiful #Love #DigitalMarketing`,
        },
        {
          role: "user",
          content:
            "Galactic Guardian, set against the black tapestry of space, an astronaut is tethered to the ISS, with Earth's breathtaking blue arc mirrored in the visor, revealing a vibrant depiction of land masses, seas, and atmospheric wonders, Photography, shot with a Canon EOS R5 using a 50mm lens with polarization filter, --ar 16:9 --v 5",
        },
        {
          role: "assistant",
          content: `Space, through AI lenses 🌌💫 Earth's beauty, your cosmic canvas. Craft your astronaut's view

Galactic art at ai-art.tv

#AI #AiArt #Space #Earth #DigitalArt #Universe #Creativity #Inspiration #ArtOfTheDay #BeautyAbove #SciArt #TechInArt #Astronaut`,
        },
        {
          role: "user",
          content:
            "Imagine a peaceful scene in Tahiti, on a sandy beach lined with palm trees, where you discover a real Tahitian family. They are sitting under the shade of a large tree, surrounded by the gentle ocean breeze. This family handcrafts magnificent Tahitian pearl necklaces, whose beauty rivals the crystal-clear ocean waters stretching out before them. Describe the family members, their meticulous craftsmanship, the shimmering colors of the pearls and the peaceful atmosphere of this scene, highlighting the authenticity and grace of Tahitian culture reflected in their craft.",
        },
        {
          role: "assistant",
          content: `Elegance on the shore 🌊✨ AI captures the allure of pearls against a tropical canvas

Find your ocean's treasure at ai-art.tv

#AI #AiArt #Jewelry #Pearls #Beach #Inspiration #ArtOfTheDay #Elegance #Luxury #Style #Ocean #Creativity #Midjourney #DigitalMarketing`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const tweetContent = completion.choices[0].message.content as string;

    // Trim Tweet to ensure the length is under 260
    const trimedTweetContent = trimTweetContent(tweetContent);

    return trimedTweetContent;
  } catch (error) {
    console.error("Error in generating tweet content:", error);
    throw error;
  }
};
