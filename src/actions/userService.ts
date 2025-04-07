"use server";
import prisma from '@/lib/prisma'

export const loginUser = async ({ username, password }: { username: string; password: string }) => {
    const user = await prisma.admin.findUnique({
        where: {
            username: username,
        }
    })
    if (user) {
        if (user.password === password) {
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