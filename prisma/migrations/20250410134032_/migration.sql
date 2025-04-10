-- CreateEnum
CREATE TYPE "Team" AS ENUM ('CHARLIE', 'BRAVO', 'ALPHA');

-- AlterTable
ALTER TABLE "Personnel" ADD COLUMN     "team" "Team" NOT NULL DEFAULT 'ALPHA';
