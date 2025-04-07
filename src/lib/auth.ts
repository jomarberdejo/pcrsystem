
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import prisma from './prisma'
// import { cookies } from 'next/headers';


// const JWT_SECRET = process.env.JWT_SECRET!;


// const hashPashword = async (password: string): Promise<string> => {
//     return bcrypt.hash(password, 12)
// }

// const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
//     return bcrypt.compare(password, hashedPassword)
// }

// const createSession = async (userId: string) => {
//     const coookieStore = await cookies()

//     const sessionToken = jwt.sign({
//         userId
//     }, JWT_SECRET, {
//         expiresIn: '7d'
//     })

//     const session = await prisma.session.create({
//         data: {
//             userId,
//             sessionToken,
//             expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//         }
//     })

//     coookieStore.set('sessionToken', sessionToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV == "production",
//         sameSite: 'lax',
//         maxAge: 60 * 60 * 24 * 7,
//         path: '/',
//     })

//     return session;
// }

// const getCurrentUser = async () => {
//     const coookieStore = await cookies();

//     const sessionToken = coookieStore.get('sessionToken')?.value;

//     if (!sessionToken) {
//         return null
//     }

//     try {
//         const { userId } = jwt.verify(sessionToken, JWT_SECRET) as { userId: string }

//         const user = await prisma.admin.findUnique({
//             where: {
//                 id: userId
//             },
//             include: {
//                 sessions: {
//                     where: {
//                         sessionToken,
//                     }
//                 }
//             }
//         })
//         if (!user || !user.session.length) {
//             return null
//         }

//         return user;


//     } catch (error) {
//         console.error("Error getting current user", error)
//         return null
//     }



// }

// const logout = async () => {
//     const cookieStore = await cookies();

//     const sessionToken = cookieStore.get('sessionToken')?.value;
//     if (!sessionToken) {
//         return;
//     }
//     await prisma.session.deleteMany({
//         where: {
//             sessionToken
//         }
//     })

//     cookieStore.delete('sessionToken')
// }