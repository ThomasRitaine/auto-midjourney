import { Midjourney } from "midjourney";

/**
 * Creates and initializes a new Midjourney client.
 * @returns {Promise<Midjourney>} A promise that resolves to an initialized Midjourney client.
 */
async function createClient(): Promise<Midjourney> {
  // Initialize Midjourney client with configuration from environment variables
  const client = new Midjourney({
    ServerId: process.env.SERVER_ID as string,
    ChannelId: process.env.CHANNEL_ID as string,
    SalaiToken: process.env.SALAI_TOKEN as string,
    Debug: false,
    Ws: true,
  });
  await client.init();

  return client;
}

export default createClient;
