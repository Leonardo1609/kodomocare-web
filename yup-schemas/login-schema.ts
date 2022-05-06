import * as yup from 'yup'

export const loginSchema = yup
    .object({
        email: yup
            .string()
            .email('Ingrese un correo válido')
            .required('El campo está vacío, ingrese un correo electrónico'),
        password: yup
            .string()
            .required('El campo está vacío, ingrese una contraseña'),
    })
    .required()