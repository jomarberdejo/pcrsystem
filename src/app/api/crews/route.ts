import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OperationType, PersonnelRole, Status, Team } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { logAction } from "@/actions";

export interface CrewResponse {
  id: string;
  name: string;
  team: Team | null;
  role: PersonnelRole;
  status: Status;
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
      role: true,
      status: true,
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
      recordsAsDriver: {
        select: {
          operationType: true,
          date: true,
        },
      },
    },
    orderBy: {
      name: "asc"
    }
  });

  const result: CrewResponse[] = crews.map((person) => {
    const crewRecords = person.recordsAsCrew.map((rc) => rc.record);
    const driverRecords = person.recordsAsDriver;
    const allRecords = [...crewRecords, ...driverRecords];
    const totalNumberOfOperations = allRecords.length;
    const totalEmergencyCases = allRecords.filter((r) => r.operationType === "EMERGENCY").length;
    const totalTransportCases = allRecords.filter((r) => r.operationType === "TRANSPORT").length;

    return {
      id: person.id,
      name: person.name,
      team: person.team,
      role: person.role,
      status: person.status,
      totalNumberOfOperations,
      totalEmergencyCases,
      totalTransportCases,
      records: allRecords.map((r) => ({
        operationType: r.operationType,
        date: r.date.toISOString(),
      })),
    };
  });

  return NextResponse.json(result);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { name, team } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newCrew = await prisma.personnel.create({
      data: {
        name,
        role: PersonnelRole.CREW,
        ...(team && { team }),
      },
    });

    const newCrewData = {
      ...newCrew,
      totalNumberOfOperations: 0,
      totalEmergencyCases: 0,
      totalTransportCases: 0,
    };
    await logAction(
      `CREATED_PERSONNEL_CREW: ${newCrew.name}${team ? ` (Team ${team})` : ""}`,
      currentUser.id
    );
    return NextResponse.json(newCrewData, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create crew" }, { status: 500 });
  }
}






