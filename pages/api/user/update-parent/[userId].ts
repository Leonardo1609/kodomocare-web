import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

interface ParentRequest {
    firstName?: string,
    lastName?: string,
    email?: string,
    dni?: string,
    password?: string
}

interface ExtendedNextApiRequest extends NextApiRequest {
    body: ParentRequest;
}

export default async function handler(
    req: ExtendedNextApiRequest,
    res: NextApiResponse<{ message: string }>
) {
    const session = await getSession({ req })
    const { query } = req

    if (!session) return res.status(404).json({ message: 'No autorizado' });

    if (req.method === 'PUT') {
        const { dni, firstName, lastName, password, email } = req.body
        try {
            const foundUser = await prisma.user.findUnique({
                where: {
                    id: query.userId.toString()
                }
            })

            if (!foundUser) return res.status(404).json({ message: 'Usuario no encontrado' });

            if (!password) {
                await prisma.user.update({
                    data: {
                        identification_number: dni,
                        last_name: lastName,
                        first_name: firstName,
                        email
                    },
                    where: {
                        id: foundUser.id
                    }
                })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                await prisma.user.update({
                    data: {
                        identification_number: dni,
                        last_name: lastName,
                        first_name: firstName,
                        email,
                        password: hashedPassword
                    },
                    where: {
                        id: foundUser.id
                    }
                })
            }

            return res.status(200).json({ message: 'Perfil actualizado' })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: 'Hubo un error. Por favor contacte con el administrador' })
        }
    }
}