import { IgApiClient } from "instagram-private-api";

const client = new IgApiClient();

/**
 * Initializes and logs into an Instagram client.
 *
 * This function generates a device specific to the user's Instagram account and logs in using the credentials
 * provided in the environment variables. It returns an instance of the Instagram client.
 *
 * @throws Throws an error if the login to Instagram fails.
 * @returns An instance of the IgApiClient, logged in and ready for use.
 */
export default async (): Promise<IgApiClient> => {
  client.state.generateDevice(process.env.INSTAGRAM_USER_NAME as string);
  await client.account.login(
    process.env.INSTAGRAM_USER_NAME as string,
    process.env.INSTAGRAM_USER_PASSWORD as string,
  );
  return client;
};
