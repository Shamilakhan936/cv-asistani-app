/*
  Warnings:

  - You are about to drop the `CVOptimization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CVOptimization" DROP CONSTRAINT "CVOptimization_cvId_fkey";

-- DropForeignKey
ALTER TABLE "CVOptimization" DROP CONSTRAINT "CVOptimization_userId_fkey";

-- DropTable
DROP TABLE "CVOptimization";

-- CreateTable
CREATE TABLE "CvOptimization" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CvOptimization_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CvOptimization" ADD CONSTRAINT "CvOptimization_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "CV"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CvOptimization" ADD CONSTRAINT "CvOptimization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
