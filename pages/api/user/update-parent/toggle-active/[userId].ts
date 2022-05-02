import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
import { getSession } from "next-auth/react";

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ message: string, status?: number }>
) {
    const session = await getSession({ req })
    const { query } = req

    if (!session) return res.status(404).json({ message: 'No autorizado' });

    if (req.method === 'PUT') {
        try {
            const foundUser = await prisma.user.findUnique({
                where: {
                    id: query.userId.toString()
                }
            })

            if (!foundUser) return res.status(404).json({ message: 'Usuario no encontrado' });

            const user = await prisma.user.update({
                data: {
                    status: foundUser.status ? 0 : 1
                },
                where: {
                    id: foundUser.id
                }
            })

            return res.status(200).json({ message: 'Perfil actualizado', status: user.status })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: 'Hubo un error. Por favor contacte con el administrador' })
        }
    }
}