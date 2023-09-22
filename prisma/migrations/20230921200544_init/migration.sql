-- CreateTable
CREATE TABLE "ImageGenerationInfo" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "repeat" INTEGER NOT NULL,
    "collectionId" TEXT NOT NULL,
    "ImageGenerationGroupId" TEXT NOT NULL,

    CONSTRAINT "ImageGenerationInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageGenerationGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ImageGenerationGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "imageGenerationInfoId" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImageGenerationInfo" ADD CONSTRAINT "ImageGenerationInfo_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageGenerationInfo" ADD CONSTRAINT "ImageGenerationInfo_ImageGenerationGroupId_fkey" FOREIGN KEY ("ImageGenerationGroupId") REFERENCES "ImageGenerationGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_imageGenerationInfoId_fkey" FOREIGN KEY ("imageGenerationInfoId") REFERENCES "ImageGenerationInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
