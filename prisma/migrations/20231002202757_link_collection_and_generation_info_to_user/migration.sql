-- CreateEnum
CREATE TYPE "GenerationSpeed" AS ENUM ('RELAX', 'FAST');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add a default user of id 00000000-0000-0000-0000-000000000000
INSERT INTO "User" ("id", "username", "email", "password", "createdAt", "updatedAt") VALUES ('00000000-0000-0000-0000-000000000000', "default-user", "default@default.com", "hash", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';

-- AlterTable
ALTER TABLE "GenerationInfo" ADD COLUMN     "speed" "GenerationSpeed" NOT NULL DEFAULT 'RELAX',
ADD COLUMN     "userId" TEXT NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';

-- AddForeignKey
ALTER TABLE "GenerationInfo" ADD CONSTRAINT "GenerationInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
