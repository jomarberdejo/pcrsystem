/*
  Warnings:

  - Made the column `vehiclesInvolved` on table `Record` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Record" ALTER COLUMN "vehiclesInvolved" SET NOT NULL,
ALTER COLUMN "vehiclesInvolved" SET DEFAULT 'None';
