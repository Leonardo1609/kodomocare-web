import * as yup from 'yup'
import { FormInput } from '../../components/form-input/FormInput'
import { GetServerSideProps } from 'next'
import { Layout } from '../../components/layout/Layout'
import { PrismaClient, user } from '@prisma/client'
import { ReactElement, useContext } from 'react'
import { getSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { clientAxios } from '../../axios/clientAxios'
import { toast } from 'react-toastify'
import { NextPageWithLayout } from '../../interfaces/layout'
import { AdminContext } from '../../context/admin/adminContext'
import { useRouter } from 'next/router'

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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  const { uid } = session.user!
  const user = await prisma.user.findUnique({
    where: {
      id: uid,
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

const Profile: NextPageWithLayout<{ user: user }> = ({ user }) => {
  const router = useRouter()
  const { setCurrentAdmin } = useContext(AdminContext)
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

  const onSubmit = async (data: ProfileData) => {
    try {
      const resp = await clientAxios.put('/user/update-profile', { ...data })
      if (resp.status === 200) {
        setCurrentAdmin((admin) => {
          return {
            ...admin,
            dni: data.dni,
            firstName: data.firstName,
            lastName: data.lastName,
          }
        })

        toast.success(resp.data.message)
        router.push(`/admin`)
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
