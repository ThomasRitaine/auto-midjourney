/**
 * Generates the OAuth callback URL for Twitter authentication.
 * @param {number} oAuthVersion - The OAuth version, either 1 or 2.
 * @returns {string} The callback URL to be used for Twitter OAuth authentication.
 */
export default (oAuthVersion: number): string => {
  // Determine the app domain based on the environment
  const appDomain =
    process.env.NODE_ENV === "production"
      ? `https://${process.env.APP_DOMAIN_NAME_LABS as string}`
      : "http://localhost";

  // Construct the callback URL using the app domain and OAuth version
  const callbackUrl = `${appDomain}/oauth${oAuthVersion}/twitter/callback`;

  // Return the constructed callback URL
  return callbackUrl;
};
