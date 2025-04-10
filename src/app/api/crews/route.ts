import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OperationType, PersonnelRole, Team } from "@prisma/client";

export interface CrewResponse {
  id: string;
  name: string;
  team: Team,
  totalNumberOfOperations: number;
  totalEmergencyCases: number;
  totalTransportCases: number;
  records: {
    operationType: OperationType;
    date: string;
  }[];
}

export async function GET(): Promise<NextResponse> {
  const crews = await prisma.personnel.findMany({
    where: {
      OR: [
        { role: PersonnelRole.CREW },
        { role: PersonnelRole.BOTH },
      ],
    },
    select: {
      id: true,
      name: true,
      team: true,
      recordsAsCrew: {
        select: {
          record: {
            select: {
              date: true,
              operationType: true,
            },
          },
        },
      },
    },
  });

  const result: CrewResponse[] = crews.map((crew) => {
    const records = crew.recordsAsCrew.map((rc) => rc.record);
    const totalNumberOfOperations = records.length;
    const totalEmergencyCases = records.filter((r) => r.operationType === "EMERGENCY").length;
    const totalTransportCases = records.filter((r) => r.operationType === "TRANSPORT").length;

    return {
      id: crew.id,
      name: crew.name,
      team: crew.team,
      totalNumberOfOperations,
      totalEmergencyCases,
      totalTransportCases,
      records: records.map((r) => ({
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

    const newCrew = await prisma.personnel.create({
      data: {
        name,
        team,
        role: PersonnelRole.CREW,
      },
    });

    const newCrewData = {
      ...newCrew,
      totalNumberOfOperations: 0,
      totalEmergencyCases: 0,
      totalTransportCases: 0,
    };

    return NextResponse.json(newCrewData, { status: 201 });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create crew" }, { status: 500 });
  }
}





