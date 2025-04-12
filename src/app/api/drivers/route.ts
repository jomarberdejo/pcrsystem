import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OperationType, PersonnelRole, Team } from "@prisma/client";

export interface DriverResponse {
  id: string;
  name: string;
  team: Team | null,
  role: PersonnelRole,
  totalNumberOfOperations: number;
  totalEmergencyCases: number;
  totalTransportCases: number;
  records: {
    operationType: OperationType;
    date: string;
  }[];
}

export async function GET(): Promise<NextResponse> {
  const personnels = await prisma.personnel.findMany({
    where: {
      OR: [
        { role: PersonnelRole.DRIVER },
        { role: PersonnelRole.BOTH },
      ],
    },
    select: {
      id: true,
      name: true,
      team: true,
      role: true,
      recordsAsDriver: {
        select: {
          operationType: true,
          date: true,
        },
      },
      recordsAsCrew: {
        select: {
          record: {
            select: {
              operationType: true,
              date: true,
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc"
    }
  });

  const result: DriverResponse[] = personnels.map((person) => {
    const driverRecords = person.recordsAsDriver;

    const crewRecords = person.recordsAsCrew.map(rc => rc.record);

    const allRecords = [...driverRecords, ...crewRecords];

    const totalNumberOfOperations = allRecords.length;
    const totalEmergencyCases = allRecords.filter(r => r.operationType === "EMERGENCY").length;
    const totalTransportCases = allRecords.filter(r => r.operationType === "TRANSPORT").length;

    return {
      id: person.id,
      name: person.name,
      team: person.team,
      role: person.role,
      totalNumberOfOperations,
      totalEmergencyCases,
      totalTransportCases,
      records: allRecords.map(r => ({
        operationType: r.operationType,
        date: r.date.toISOString(),
      })),
    };
  });

  return NextResponse.json(result);
}



export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { name, team } = await request.json();

    if (!name || !team) {
      return NextResponse.json({ error: "Name or Team is required" }, { status: 400 });
    }

    const newPersonnel = await prisma.personnel.create({
      data: {
        name,
        team,
        role: PersonnelRole.DRIVER,
      },
    });

    const newPersonnelData = {
      ...newPersonnel,
      totalNumberOfOperations: 0,
      totalEmergencyCases: 0,
      totalTransportCases: 0,
    };

    return NextResponse.json(newPersonnelData, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create personnel" }, { status: 500 });
  }
}
