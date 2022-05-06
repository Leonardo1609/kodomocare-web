import { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../../db";
import { getSession } from "next-auth/react";

interface ProfileRequest {
    firstName?: string,
    lastName?: string,
    dni?: string,
    id?: string
}

interface ExtendedNextApiRequest extends NextApiRequest {
    body: ProfileRequest;
}

export default async function handler(
    req: ExtendedNextApiRequest,
    res: NextApiResponse<{ message: string }>
) {
    const session = await getSession({ req })

    if (!session) return res.status(404).json({ message: 'No autorizado' });

    if (req.method === 'PUT') {
        const { dni, firstName, lastName } = req.body
        try {
            const foundUser = await db.user.findUnique({
                where: {
                    id: session?.user?.uid
                }
            })

            if (!foundUser) return res.status(404).json({ message: 'Usuario no encontrado' });

            await db.user.update({
                data: {
                    identification_number: dni,
                    last_name: lastName,
                    first_name: firstName
                },
                where: {
                    id: foundUser.id
                }
            })

            return res.status(200).json({ message: 'Perfil actualizado' })
        } catch (err) {
            res.status(500).json({ message: 'Hubo un error. Por favor contacte con el administrador' })
        }
    }
}