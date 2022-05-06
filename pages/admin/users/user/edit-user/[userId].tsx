import Link from 'next/link'
import { EditParentData } from '../../../../../interfaces/forms/edit-data'
import { FormInput } from '../../../../../components/form-input/FormInput'
import { GetServerSideProps } from 'next'
import { Layout } from '../../../../../components/layout/Layout'
import { NextPageWithLayout } from '../../../../../interfaces/layout'
import { ReactElement } from 'react'
import { db } from '../../../../../db'
import { editParentSchema } from '../../../../../yup-schemas'
import { getSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { updateParent } from '../../../../../services/client/users'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { user } from '@prisma/client'
import { yupResolver } from '@hookform/resolvers/yup'

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req })
  const userId = params?.userId?.toString()

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const parent = await db.user.findUnique({
    where: {
      id: userId,
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
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditParentData>({
    defaultValues: {
      firstName: user.first_name,
      lastName: user.last_name,
      dni: user.identification_number,
      email: user.email,
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(editParentSchema),
  })

  const onSubmit = async ({
    firstName,
    lastName,
    dni,
    email,
    password,
  }: EditParentData) => {
    const body = {
      firstName,
      lastName,
      dni,
      email,
      password,
    }

    try {
      const resp = await updateParent(user.id, body)
      if (resp.status === 200) {
        toast.success(resp.data.message)
        router.push(`/admin/users/user/${user.id}`)
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message)
    }
  }

  return (
    <form
      className="flex flex-col md:px-20"
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
    >
      <div className="flex flex-col w-full items-start">
        <h3 className="text-xl md:text-[30px] border-b-black dark:border-b-gray-300 text-gray-300 border-b-[3px] w-full pb-3 mb-5">
          Datos personales
        </h3>
        <div className="grid grid-cols-2 md:gap-20 w-full">
          <div className="col-span-2 md:col-span-1">
            <FormInput
              inputClassName="text-base md:text-lg h-[45px] md:h-[54px] w-full rounded"
              error={errors.firstName?.message}
              placeholder="Ingrese los nombres"
              register={register('firstName')}
              type="text"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <FormInput
              inputClassName="text-base md:text-lg h-[45px] md:h-[54px] w-full rounded"
              error={errors.lastName?.message}
              placeholder="Ingrese los apellidos"
              type="text"
              register={register('lastName')}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <FormInput
              inputClassName="text-base md:text-lg h-[45px] md:h-[54px] w-full rounded"
              error={errors.dni?.message}
              placeholder="Ingrese el DNI"
              type="text"
              register={register('dni')}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <FormInput
              inputClassName="text-base md:text-lg h-[45px] md:h-[54px] w-full rounded"
              error={errors.email?.message}
              placeholder="Ingrese el correo"
              type="email"
              register={register('email')}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full items-start">
        <h3 className="text-lg md:text-[30px] border-b-black border-b-[3px] dark:border-b-gray-300 text-gray-300 w-full pb-3 mb-5">
          Contraseña
        </h3>
        <div className="grid grid-cols-2 md:gap-20 w-full">
          <div className="col-span-2 md:col-span-1">
            <FormInput
              inputClassName="text-base md:text-lg h-[45px] md:h-[54px] w-full rounded"
              error={errors.password?.message}
              placeholder="Contraseña"
              type="password"
              register={register('password')}
              autoComplete="new-password"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <FormInput
              inputClassName="text-base md:text-lg h-[45px] md:h-[54px] w-full rounded"
              error={errors.confirmPassword?.message}
              placeholder="Confirmar contraseña"
              type="password"
              register={register('confirmPassword')}
            />
          </div>
        </div>
      </div>
      <div className="flex space-x-[40px] md:space-x-[86px] justify-center">
        <button
          className="w-[222px] h-10 rounded text-white text-lg md:text-xl bg-primary dark:bg-blue-800 flex justify-center items-center"
          type="submit"
        >
          Guardar
        </button>
        <Link href={`/admin/users/user/${user.id}`} passHref>
          <a className="w-[222px] h-10 rounded text-white text-lg md:text-xl bg-red-500 dark:bg-red-600 flex justify-center items-center">
            Cancelar
          </a>
        </Link>
      </div>
    </form>
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
