import { Role, type User } from "@prisma/client";
import { type RequestHandler } from "express";

/**
 * Middleware to require specific roles for accessing a route.
 * @param allowedRoles - List of roles allowed to access the route.
 * @returns {RequestHandler} Express middleware for role-based access control.
 */
const requireRole = (...allowedRoles: string[]): RequestHandler => {
  return (req, res, next) => {
    // This middleware runs after requireAuth, so req.user should be defined
    const user = req.user as User;

    // Allow if user is admin
    if (user.roles.includes(Role.ADMIN)) {
      next();
      return;
    }

    const hasRequiredRole = allowedRoles.some((role) =>
      user.roles.includes(role as Role),
    );

    if (hasRequiredRole) {
      next();
    } else {
      res.status(403).send({ message: "Access denied." });
    }
  };
};

export default requireRole;
