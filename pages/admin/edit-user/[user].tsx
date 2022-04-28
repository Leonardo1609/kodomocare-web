import * as yup from 'yup'
import Link from 'next/link'
import { FormInput } from '../../../components/form-input/FormInput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

interface EditData {
  firstName: string
  lastName: string
  dni: string
  email: string
  password: string
  confirmPassword: string
}

const editSchema = yup
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

const Edit = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      dni: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(editSchema),
  })
  return (
    <>
      <form
        className="flex flex-col px-20"
        onSubmit={handleSubmit(console.log)}
      >
        <div className="flex flex-col w-full items-start">
          <h3 className="text-[30px] border-b-black border-b-[3px] w-full pb-3 mb-5">
            Datos personales
          </h3>
          <div className="grid grid-cols-2 gap-20 w-full">
            <div className="col-span-1">
              <FormInput
                inputClassName="text-lg h-[54px] w-full rounded"
                error={errors.firstName?.message}
                placeholder="Ingrese los nombres"
                register={register('firstName')}
                type="text"
              />
            </div>
            <div className="col-span-1">
              <FormInput
                inputClassName="text-lg h-[54px] w-full rounded"
                error={errors.lastName?.message}
                placeholder="Ingrese los apellidos"
                type="text"
                register={register('lastName')}
              />
            </div>
            <div className="col-span-1">
              <FormInput
                inputClassName="text-lg h-[54px] w-full rounded"
                error={errors.dni?.message}
                placeholder="Ingrese el DNI"
                type="number"
                register={register('dni')}
              />
            </div>
            <div className="col-span-1">
              <FormInput
                inputClassName="text-lg h-[54px] w-full rounded"
                error={errors.email?.message}
                placeholder="Ingrese el correo"
                type="email"
                register={register('email')}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full items-start">
          <h3 className="text-[30px] border-b-black border-b-[3px] w-full pb-3 mb-5">
            Contraseña
          </h3>
          <div className="grid grid-cols-2 gap-20 w-full">
            <div className="col-span-1">
              <FormInput
                inputClassName="text-lg h-[54px] w-full rounded"
                error={errors.password?.message}
                placeholder="Contraseña"
                type="password"
                register={register('password')}
              />
            </div>
            <div className="col-span-1">
              <FormInput
                inputClassName="text-lg h-[54px] w-full rounded"
                error={errors.confirmPassword?.message}
                placeholder="Confirmar contraseña"
                type="password"
                register={register('confirmPassword')}
              />
            </div>
          </div>
        </div>
        <div className="flex space-x-[86px] justify-center">
          <button
            className="w-[222px] h-10 rounded text-white text-xl bg-primary flex justify-center items-center"
            type="submit"
          >
            Guardar
          </button>
          <Link href="/admin/list" passHref>
            <a className="w-[222px] h-10 rounded text-white text-xl bg-primary flex justify-center items-center">
              Cancelar
            </a>
          </Link>
        </div>
      </form>
    </>
  )
}

export default Edit
