export default (oAuthVersion: number): string => {
  const appDomain =
    process.env.NODE_ENV === "production"
      ? `https://${process.env.APP_DOMAIN_NAME_LABS as string}`
      : "http://localhost";

  const callbackUrl = `${appDomain}/oauth${oAuthVersion}/twitter/callback`;
  return callbackUrl;
};
