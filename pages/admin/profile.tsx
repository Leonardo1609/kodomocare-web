import * as yup from 'yup'
import { FormInput } from '../../components/form-input/FormInput'
import { GetServerSideProps, NextPage } from 'next'
import { Layout } from '../../components/layout/Layout'
import { PrismaClient, user } from '@prisma/client'
import { ReactElement, ReactNode } from 'react'
import { getSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { clientAxios } from '../../axios/clientAxios'
import { toast, ToastContainer } from 'react-toastify'

const prisma = new PrismaClient()

interface ProfileData {
  firstName: string
  lastName: string
  dni: string
}

const profileSchema = yup
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  const { email } = session.user!
  const user = await prisma.user.findFirst({
    where: {
      email: email || '',
    },
    select: {
      email: true,
      first_name: true,
      last_name: true,
      id: true,
      identification_number: true,
    },
  })

  return {
    props: {
      user,
    },
  }
}

type NextPageWithLayout<T> = NextPage<T> & {
  getLayout?: (page: ReactElement) => ReactNode
}

const Profile: NextPageWithLayout<{ user: user }> = ({ user }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileData>({
    defaultValues: {
      firstName: user.first_name,
      lastName: user.last_name,
      dni: user.identification_number,
    },
    resolver: yupResolver(profileSchema),
  })

  const notify = (message: string) => {
    toast(message)
  }

  const onSubmit = async (data: ProfileData) => {
    try {
      const resp = await clientAxios.put('/user/update-profile', { ...data })
      if (resp.status === 200) {
        toast.success(resp.data.message)
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message)
    }
  }

  return (
    <>
      <p className="dark:text-gray-300 text-[25px] mb-10">
        En la vista del perfil de administrador, podrá editar su nombre,
        apellido y DNI.
      </p>
      <form
        className="flex flex-col lg:flex-row p-4 w-full gap-0 lg:gap-20"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex-1">
          <div className="flex flex-col lg:max-w-[600px]">
            <FormInput
              labelFontSize={22}
              label="Nombres"
              error={errors.firstName?.message}
              placeholder="Ingrese sus nombres"
              inputClassName="h-[60px] w-full rounded text-2xl"
              type="text"
              register={register('firstName')}
            />
            <FormInput
              labelFontSize={22}
              label="Apellidos"
              error={errors.lastName?.message}
              placeholder="Ingrese sus apellidos"
              inputClassName="h-[60px] w-full rounded text-2xl"
              type="text"
              register={register('lastName')}
            />
            <FormInput
              labelFontSize={22}
              label="DNI"
              error={errors.dni?.message}
              placeholder="Ingrese su DNI"
              inputClassName="h-[60px] w-full rounded text-2xl"
              type="text"
              maxLength={8}
              register={register('dni')}
            />
          </div>
        </div>
        <div className="flex-1 py-4">
          <button
            className="w-full h-[78px] rounded text-white bg-primary text-[25px] dark:bg-blue-900"
            type="submit"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </>
  )
}

export default Profile

Profile.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Perfil" headTitle="Perfil">
      {page}
    </Layout>
  )
}
