import { PersonnelRole, Status, Team } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma'
import { logAction } from "@/actions";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: {
    params: Promise<{ id: string }>
}): Promise<NextResponse> {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const id = (await params).id;
        const { name, team, role, status, archivedAt }: { name?: string, team?: Team, role?: PersonnelRole, status: Status, archivedAt?: string } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const crew = await prisma.personnel.findUnique({
            where: { id },
        });

        if (!crew) {
            return NextResponse.json({ error: "Driver not found" }, { status: 404 });
        }

        const personnel = await prisma.personnel.update({
            where: { id },
            data: {
                name,
                ...(team && { team }),
                role,
                status,
                archivedAt,
            },
        });

        await logAction(
            `UPDATED_PERSONNEL: ${personnel.name} → ${name || personnel.name}${team ? ` (Team ${team})` : ""}${role ? ` as ${role}` : ""}`,
            currentUser.id
        );

        return NextResponse.json({ message: "Update successful" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update driver" }, { status: 500 });
    }
}