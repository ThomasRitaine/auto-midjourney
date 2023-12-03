import authenticateJWT from "./authenticateJWT";

/**
 * Middleware to require authentication. Redirects to the login page if the user is not authenticated.
 */
const requireAuth = authenticateJWT(true);

export default requireAuth;
