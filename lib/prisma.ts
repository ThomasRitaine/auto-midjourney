import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient;
}

// Ensure the Prisma instance is re-used during hot-reloading
// Otherwise, a new client will be created on every reload
const prisma = global.prisma || new PrismaClient();

// Attach the Prisma Client instance to the `global` object (in development only)
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
