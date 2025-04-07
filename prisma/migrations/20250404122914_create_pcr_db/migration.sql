-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('EMERGENCY', 'TRANSPORT');

-- CreateEnum
CREATE TYPE "PersonnelRole" AS ENUM ('DRIVER', 'CREW', 'BOTH');

-- CreateTable
CREATE TABLE "Personnel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "role" "PersonnelRole" NOT NULL,

    CONSTRAINT "Personnel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Record" (
    "id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "timeCalled" TEXT NOT NULL,
    "timeDispatched" TEXT NOT NULL,
    "timeAtScene" TEXT NOT NULL,
    "timeTransport" TEXT NOT NULL,
    "timeEndorsed" TEXT NOT NULL,
    "timeArrivedAt" TEXT NOT NULL,
    "typeOfIncident" TEXT NOT NULL,
    "placeOfIncident" TEXT NOT NULL,
    "receivingFacility" TEXT NOT NULL,
    "typeOfConduction" TEXT NOT NULL,
    "vehiclesInvolved" TEXT,
    "chiefComplaint" TEXT NOT NULL,
    "noOfCasualty" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "vehicleUsed" TEXT NOT NULL,
    "documentation" JSONB NOT NULL,
    "operationType" "OperationType" NOT NULL,
    "ambulanceDriverId" UUID,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecordCrew" (
    "id" UUID NOT NULL,
    "recordId" UUID NOT NULL,
    "crewId" UUID NOT NULL,

    CONSTRAINT "RecordCrew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecordCrew_recordId_crewId_key" ON "RecordCrew"("recordId", "crewId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_ambulanceDriverId_fkey" FOREIGN KEY ("ambulanceDriverId") REFERENCES "Personnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordCrew" ADD CONSTRAINT "RecordCrew_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordCrew" ADD CONSTRAINT "RecordCrew_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Personnel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
