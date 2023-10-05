/*
  Warnings:

  - The `roles` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'GENERATE_RELAX', 'GENERATE_FAST', 'COLLECTION_SEE_ALL', 'COLLECTION_DELETE_ALL', 'IMAGE_DELETE_ALL', 'ADMIN');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roles",
ADD COLUMN     "roles" "Role"[] DEFAULT ARRAY['USER']::"Role"[];
