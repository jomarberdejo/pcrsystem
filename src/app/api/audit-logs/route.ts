import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(): Promise<NextResponse> {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const logs = await prisma.auditLog.findMany({
        orderBy: {
            timestamp: "desc",
        },
        take: 1000,
        include: {
            performedByAdmin: true
        }
    });

    const auditLogs = logs.map((log) => ({
        id: log.id,
        action: log.action,
        timestamp: log.timestamp,
        recordId: log.recordId,
        user: log.performedByAdmin.username,
    }));

    return NextResponse.json(auditLogs);

}
