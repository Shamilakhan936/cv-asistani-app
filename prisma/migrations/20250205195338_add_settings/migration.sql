-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "cloudinaryCloudName" TEXT,
    "cloudinaryApiKey" TEXT,
    "cloudinaryUploadPresetCV" TEXT,
    "cloudinaryUploadPresetBlog" TEXT,
    "replicateApiToken" TEXT,
    "googleClientId" TEXT,
    "googleClientSecret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
