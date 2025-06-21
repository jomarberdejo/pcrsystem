"use server";

import { SignJWT, jwtVerify } from 'jose';
import prisma from './prisma';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { logAction } from '@/actions';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, 12);
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
}

export const createSession = async (userId: string) => {
    const cookieStore = await cookies();

    const sessionToken = await new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET);

    const session = await prisma.session.create({
        data: {
            userId,
            sessionToken,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    });

    cookieStore.set('sessionToken', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    });

    return session;
}

export const loginUser = async ({ username, password }: { username: string; password: string }) => {
    const user = await prisma.admin.findUnique({
        where: {
            username: username,
        }
    })
    if (user) {
        const verifiedPassword = await verifyPassword(password, user.password)
        if (verifiedPassword) {
            await createSession(user.id)
            await logAction('LOGGED_IN', user.id)
            return true;
        }
        else {
            return false
        }
    }
    else {
        return false
    }

}

export const getCurrentUser = async () => {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('sessionToken')?.value;

    if (!sessionToken) {
        return null;
    }

    try {
        const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
        const userId = payload.userId as string;

        const user = await prisma.admin.findUnique({
            where: { id: userId },
            include: {
                sessions: {
                    where: { sessionToken }
                }
            }
        });

        if (!user || !user.sessions.length) {
            return null;
        }

        return user;
    } catch (error) {
        console.error("Error getting current user", error);
        return null;
    }
}


export const logout = async () => {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('sessionToken')?.value;

    if (!sessionToken) {
        return;
    }

    const user = await getCurrentUser();
    if (user) {
        await logAction('LOGGED_OUT', user.id);
    }

    await prisma.session.deleteMany({
        where: { sessionToken }
    });

    cookieStore.delete('sessionToken');


}
