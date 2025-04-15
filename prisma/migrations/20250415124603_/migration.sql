-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Personnel" ADD COLUMN     "archivedAt" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';
