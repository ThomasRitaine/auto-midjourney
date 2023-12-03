import authenticateJWT from "./authenticateJWT";

/**
 * Middleware to identify a user based on JWT token but doesn't restrict access if not authenticated.
 */
const identifyUser = authenticateJWT(false);

export default identifyUser;
