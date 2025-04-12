import { PersonnelRole, Team } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: {
    params: Promise<{ id: string }>
}): Promise<NextResponse> {
    try {
        const id = (await params).id;
        const { name, team, role }: { name?: string, team?: Team, role?: PersonnelRole } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const crew = await prisma.personnel.findUnique({
            where: { id },
        });

        if (!crew) {
            return NextResponse.json({ error: "Driver not found" }, { status: 404 });
        }

        await prisma.personnel.update({
            where: { id },
            data: {
                name,
                team,
                role,
            },
        });

        return NextResponse.json({ message: "Update successful" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update driver" }, { status: 500 });
    }
}