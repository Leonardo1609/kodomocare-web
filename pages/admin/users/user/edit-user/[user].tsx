import * as yup from 'yup'
import Link from 'next/link'
import { FormInput } from '../../../../../components/form-input/FormInput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { NextPageWithLayout } from '../../../../../interfaces/layout'
import { PrismaClient, user } from '@prisma/client'
import { EditData } from '../../../../../interfaces/forms/edit-data'

const prisma = new PrismaClient()

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

import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { redirect } from 'next/dist/server/api-utils'
import { ReactElement } from 'react'
import { Layout } from '../../../../../components/layout/Layout'
import { clientAxios } from '../../../../../axios/clientAxios'
import { toast } from 'react-toastify'

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req })

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const parent = await prisma.user.findUnique({
    where: {
      id: session.user?.uid,
    },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      identification_number: true,
    },
  })

  if (!parent) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    }
  }

  return {
    props: {
      user: parent,
    },
  }
}

const Edit: NextPageWithLayout<{ user: user }> = ({ user }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditData>({
    defaultValues: {
      firstName: user.first_name,
      lastName: user.last_name,
      dni: user.identification_number,
      email: user.email,
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(editSchema),
  })

  const onSubmit = async ({
    firstName,
    lastName,
    dni,
    email,
    password,
  }: EditData) => {
    const body = {
      firstName,
      lastName,
      dni,
      email,
      password,
    }

    try {
      const resp = await clientAxios.put(`/user/update-parent/${user.id}`, {
        ...body,
      })
      if (resp.status === 200) {
        toast.success(resp.data.message)
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message)
    }
  }

  return (
    <>
      <form
        className="flex flex-col px-20"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
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
                type="text"
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
                autoComplete="new-password"
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

Edit.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Editar apoderado" headTitle="Editar apoderado">
      {page}
    </Layout>
  )
}
