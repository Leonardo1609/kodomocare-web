import * as yup from 'yup'

export const profileSchema = yup
    .object({
        firstName: yup.string().required('Nombres son obligatorios'),
        lastName: yup.string().required('Apellidos son obligatorios'),
        dni: yup
            .string()
            .min(8, 'Se requiere 8 caracteres')
            .max(8, 'Se requiere 8 caracteres')
            .required('DNI es obligatorio'),
    })
    .required()
