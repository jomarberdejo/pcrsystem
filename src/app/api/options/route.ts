import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function mapPersonnelRole({ id, name, role }: { id: string; name: string; role: string }) {
    const isDriver = role === "DRIVER" || role === "BOTH";
    const isCrew = role === "CREW" || role === "BOTH";

    return { id, name, role, isDriver, isCrew };
}

export async function GET() {
    const personnel = await prisma.personnel.findMany({
        select: {
            id: true,
            name: true,
            role: true,
        },
    });

    const result = personnel.map(mapPersonnelRole);

    return NextResponse.json(result);
}
