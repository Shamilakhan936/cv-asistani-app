-- CreateTable
CREATE TABLE "CVOptimization" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CVOptimization_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CVOptimization" ADD CONSTRAINT "CVOptimization_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "CV"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CVOptimization" ADD CONSTRAINT "CVOptimization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
