import authenticateJWT from "./authenticateJWT";

const requireAuth = authenticateJWT(true);

export default requireAuth;
