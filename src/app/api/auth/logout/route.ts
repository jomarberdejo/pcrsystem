import { logout } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await logout()
        const response = NextResponse.json(
            { success: true },
            { status: 200 }
        )
        return response
    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json(
            { error: 'Failed to logout' },
            { status: 500 }
        )
    }
}