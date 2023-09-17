import { Midjourney } from "midjourney";

async function createClient(): Promise<Midjourney> {

    // Initialize Midjourney client
    var client = new Midjourney({
        ServerId: <string>process.env.SERVER_ID,
        ChannelId: <string>process.env.CHANNEL_ID,
        SalaiToken: <string>process.env.SALAI_TOKEN,
        Debug: false,
        Ws: true,
    });
    await client.init();

    return client
}

export default createClient;
