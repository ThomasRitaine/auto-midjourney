import { Midjourney } from "midjourney";

async function createClient(): Promise<Midjourney> {
  // Initialize Midjourney client
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
