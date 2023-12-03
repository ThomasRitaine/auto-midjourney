import { IgApiClient } from "instagram-private-api";

const client = new IgApiClient();

export default async (): Promise<IgApiClient> => {
  client.state.generateDevice(process.env.INSTAGRAM_USER_NAME as string);
  //   client.state.proxyUrl = process.env.IG_PROXY;
  await client.account.login(
    process.env.INSTAGRAM_USER_NAME as string,
    process.env.INSTAGRAM_USER_PASSWORD as string,
  );
  return client;
};
