/*
  Warnings:

  - Changed the type of `timeCalled` on the `Record` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `timeDispatched` on the `Record` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `timeAtScene` on the `Record` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `timeTransport` on the `Record` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `timeEndorsed` on the `Record` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `timeArrivedAt` on the `Record` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Record" DROP COLUMN "timeCalled",
ADD COLUMN     "timeCalled" TIMESTAMP(3) NOT NULL,
DROP COLUMN "timeDispatched",
ADD COLUMN     "timeDispatched" TIMESTAMP(3) NOT NULL,
DROP COLUMN "timeAtScene",
ADD COLUMN     "timeAtScene" TIMESTAMP(3) NOT NULL,
DROP COLUMN "timeTransport",
ADD COLUMN     "timeTransport" TIMESTAMP(3) NOT NULL,
DROP COLUMN "timeEndorsed",
ADD COLUMN     "timeEndorsed" TIMESTAMP(3) NOT NULL,
DROP COLUMN "timeArrivedAt",
ADD COLUMN     "timeArrivedAt" TIMESTAMP(3) NOT NULL;
