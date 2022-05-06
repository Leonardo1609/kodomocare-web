import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";
import { db } from "../../../db";
import { loginUser } from "../../../services/server/auth";
import { verifyPassword } from "../../../helpers/auth";

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
                const user = await db.user.findFirst({
                    where: {
                        email: credentials?.email,
                        role_id: '2'
                    }
                })
                if (!user) throw new Error("No autorizado")

                let token: string = ''

                try {
                    const { data } = await loginUser(credentials?.email!, credentials?.password!)
                    token = data.token
                } catch (err) {
                    throw new Error("Error interno, por favor contacte con el administrador")
                }

                if (!token) throw new Error("Error interno, por favor contacte con el administrador")

                const passwordsMatch = await verifyPassword(credentials?.password!, user?.password)

                if (!passwordsMatch) throw new Error("Credenciales inválidas")

                return {
                    id: user?.id,
                    email: user?.email,
                    name: `${user?.first_name} ${user?.last_name}`,
                    image: user?.avatar_image,
                    backendToken: token
                }
            }
        })
    ]
})