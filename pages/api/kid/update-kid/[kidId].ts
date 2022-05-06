import { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../../../db";
import { getSession } from "next-auth/react";

interface KidRequest {
    firstName?: string,
    lastName?: string,
    relationship?: string,
    dni?: string,
    gender?: string
}

interface ExtendedNextApiRequest extends NextApiRequest {
    body: KidRequest;
}

export default async function handler(
    req: ExtendedNextApiRequest,
    res: NextApiResponse<{ message: string }>
) {
    const session = await getSession({ req })
    const { query } = req

    if (!session) return res.status(404).json({ message: 'No autorizado' });

    if (req.method === 'PUT') {
        const { dni, firstName, lastName, gender, relationship } = req.body
        try {
            const foundKid = await db.kid.findUnique({
                where: {
                    id: query.kidId.toString()
                }
            })

            if (!foundKid) return res.status(404).json({ message: 'Menor no encontrado' });

            await db.kid.update({
                data: {
                    identification_number: dni,
                    last_name: lastName,
                    first_name: firstName,
                    gender,
                    relationship
                },
                where: {
                    id: foundKid.id
                }
            })

            return res.status(200).json({ message: 'Menor actualizado' })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: 'Hubo un error. Por favor contacte con el administrador' })
        }
    }
}