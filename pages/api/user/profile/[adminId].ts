import { PrismaClient, user } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react";

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ message: string } | { user: user }>
) {
    const session = await getSession({ req })
    const { query } = req

    if (!session) return res.status(404).json({ message: 'No autorizado' });

    if (req.method === 'GET') {
        try {
            const foundUser = await prisma.user.findUnique({
                where: {
                    id: query.adminId.toString()
                }
            })

            if (!foundUser) return res.status(404).json({ message: 'Usuario no encontrado' });

            return res.status(200).json({ user: foundUser })
        } catch (err) {
            res.status(500).json({ message: 'Hubo un error. Por favor contacte con el administrador' })
        }
    }
}