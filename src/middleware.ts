import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function verifyToken(token: string): Promise<any | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch (err) {
        console.error("JWT verification failed:", err);
        return null;
    }
}

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const sessionToken = request.cookies.get("sessionToken")?.value;

    const publicRoutes = ["/"];
    const protectedRoutes = [
        "/admin/audit-logs",
    ];

    if (publicRoutes.includes(path)) {
        // Public route, no check needed
        if (!sessionToken) return NextResponse.next();

        const user = await verifyToken(sessionToken);
        if (user) return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        return NextResponse.next();
    }

    if (path.startsWith("/admin")) {
        if (!sessionToken) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        const user = await verifyToken(sessionToken);
        if (!user) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        if (protectedRoutes.includes(path)) {
            if (user.role !== "MDRRMO_ADMIN") {
                return NextResponse.redirect(new URL("/admin/dashboard", request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/"],
};
