import * as yup from 'yup'

export const editParentSchema = yup
    .object({
        firstName: yup.string().required('Nombres son obligatorios'),
        lastName: yup.string().required('Apellidos son obligatorios'),
        dni: yup
            .string()
            .min(8, 'Se requiere 8 caracteres')
            .max(8, 'Se requiere 8 caracteres')
            .required('DNI es obligatorio'),
        email: yup
            .string()
            .email('Ingrese un correo válido')
            .required('El campo está vacío, ingrese un correo electrónico'),
        password: yup.string(),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden'),
    })
    .required()
