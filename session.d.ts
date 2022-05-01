import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            uid?: string
            backendToken: string
        } & DefaultSession["user"]
    }
}
