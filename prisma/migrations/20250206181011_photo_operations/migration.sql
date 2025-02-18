/*
  Warnings:

  - You are about to drop the column `canCancel` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Photo` table. All the data in the column will be lost.
  - Added the required column `operationId` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Photo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OperationStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PhotoType" AS ENUM ('ORIGINAL', 'AI_GENERATED');

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_userId_fkey";

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "canCancel",
DROP COLUMN "status",
DROP COLUMN "userId",
ADD COLUMN     "operationId" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "PhotoType" NOT NULL;

-- CreateTable
CREATE TABLE "PhotoOperation" (
    "id" TEXT NOT NULL,
    "status" "OperationStatus" NOT NULL DEFAULT 'PENDING',
    "canCancel" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "PhotoOperation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PhotoOperation" ADD CONSTRAINT "PhotoOperation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "PhotoOperation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
