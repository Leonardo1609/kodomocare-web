import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from '@prisma/client'
import { verifyPassword } from "../../../helpers/auth";
const prisma = new PrismaClient()

export default NextAuth({
    pages: {
        signIn: '/login'
    },
    session: {
        strategy: 'jwt',
        maxAge: 3600 * 24,
    },
    secret: '123456',
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", placeholder: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials?.email
                    }
                })
                if (!user) throw new Error("No user found")

                const passwordsMatch = await verifyPassword(credentials?.password!, user?.password)

                if (!passwordsMatch) throw new Error("Invalid credentials")

                return {
                    id: user?.id.toString(),
                    email: user?.email,
                    name: `${user?.first_name} ${user?.last_name}`,
                    image: user?.avatar_image
                }
            }
        })
    ]
})