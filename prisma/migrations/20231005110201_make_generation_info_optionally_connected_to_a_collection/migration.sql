-- DropForeignKey
ALTER TABLE "GenerationInfo" DROP CONSTRAINT "GenerationInfo_collectionId_fkey";

-- AlterTable
ALTER TABLE "GenerationInfo" ALTER COLUMN "collectionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "GenerationInfo" ADD CONSTRAINT "GenerationInfo_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
