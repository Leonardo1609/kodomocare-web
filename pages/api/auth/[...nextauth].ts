import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";
import axios from "axios";
import { PrismaClient } from '@prisma/client'
import { verifyPassword } from "../../../helpers/auth";
import { Buffer } from 'buffer'
import { string } from "yup";

const prisma = new PrismaClient()

export default NextAuth({
    pages: {
        signIn: '/login',
        error: '/login'
    },
    session: {
        strategy: 'jwt',
        maxAge: 3600 * 24,
    },
    secret: process.env.ACCESS_TOKEN_SECRET,
    callbacks: {
        session: ({ session, token }) => {
            if (session?.user) {
                session.user.uid = token.uid as string
                session.user.backendToken = token.backendToken as string
            }

            return session
        },
        jwt: ({ user, token }) => {
            if (user) {
                token.uid = user.id
                token.backendToken = user.backendToken
            }

            return token
        }
    },
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

                const basicToken = Buffer.from(credentials?.email + ":" + credentials?.password).toString('base64');

                const { data } = await axios.post<{ token: string, profileImage: string }>('http://localhost:3001/login', {
                    username: credentials?.email,
                    password: credentials?.password
                }, {
                    headers: {
                        Authorization: 'Basic ' + basicToken,
                    }
                })

                const passwordsMatch = await verifyPassword(credentials?.password!, user?.password)

                if (!passwordsMatch) throw new Error("Invalid credentials")

                return {
                    id: user?.id,
                    email: user?.email,
                    name: `${user?.first_name} ${user?.last_name}`,
                    image: user?.avatar_image,
                    backendToken: data.token
                }
            }
        })
    ]
})