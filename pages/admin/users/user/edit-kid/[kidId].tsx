import * as yup from 'yup'
import { GetServerSideProps } from 'next'
import { Layout } from '../../../../../components/layout/Layout'
import { NextPageWithLayout } from '../../../../../interfaces/layout'
import { ReactElement } from 'react'
import { kid, PrismaClient } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { getSession } from 'next-auth/react'
import { clientAxios } from '../../../../../axios/clientAxios'
import { toast } from 'react-toastify'
import { FormInput } from '../../../../../components/form-input/FormInput'
import Link from 'next/link'
import { useRouter } from 'next/router'

const prisma = new PrismaClient()

interface EditKidData {
  firstName: string
  lastName: string
  dni: string
  relationship: string
  gender: string
}

const editKidSchema = yup
  .object({
    firstName: yup.string().required('Nombres son obligatorios'),
    lastName: yup.string().required('Apellidos son obligatorios'),
    dni: yup
      .string()
      .min(8, 'Se requiere 8 caracteres')
      .max(8, 'Se requiere 8 caracteres')
      .required('DNI es obligatorio'),
    gender: yup.string().required('Género es obligatorio'),
    relationship: yup.string().required('Parentesco es obligatorio'),
  })
  .required()

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

  const kidId = params?.kidId?.toString()

  const kidFound = await prisma.kid.findUnique({
    where: {
      id: kidId,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      relationship: true,
      gender: true,
      identification_number: true,
      user_id: true,
    },
  })

  if (!kidFound) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    }
  }

  return {
    props: {
      kid: kidFound,
    },
  }
}

const EditKid: NextPageWithLayout<{ kid: kid }> = ({ kid }) => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditKidData>({
    defaultValues: {
      firstName: kid.first_name,
      lastName: kid.last_name,
      dni: kid.identification_number,
      relationship: kid.relationship,
      gender: kid.gender,
    },
    resolver: yupResolver(editKidSchema),
  })

  const onSubmit = async (data: EditKidData) => {
    try {
      const resp = await clientAxios.put(`/kid/update-kid/${kid.id}`, {
        ...data,
      })
      if (resp.status === 200) {
        toast.success(resp.data.message)
        router.push(`/admin/users/user/${kid.user_id}`)
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message)
    }
  }
  return (
    <div>
      <h3 className="text-[30px] border-b-black dark:border-b-gray-300 text-gray-300 border-b-[3px] w-full pb-3 mb-5">
        Datos del menor
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex space-x-16 justify-center">
          <FormInput
            className="max-w-[450px]"
            error={errors.firstName?.message}
            placeholder="Ingrese los nombres"
            inputClassName="h-[60px] w-full rounded text-2xl"
            type="text"
            register={register('firstName')}
          />
          <FormInput
            className="max-w-[450px]"
            error={errors.lastName?.message}
            placeholder="Ingrese los apellidos"
            inputClassName="h-[60px] w-full rounded text-2xl"
            type="text"
            register={register('lastName')}
          />
        </div>
        <div className="flex space-x-16 justify-center">
          <FormInput
            className="max-w-[450px]"
            error={errors.dni?.message}
            placeholder="Ingrese el dni"
            inputClassName="h-[60px] w-full rounded text-2xl"
            type="text"
            register={register('dni')}
          />
          <FormInput
            className="max-w-[450px]"
            error={errors.gender?.message}
            placeholder="Ingrese el género"
            inputClassName="h-[60px] w-full rounded text-2xl max-w-[450px]"
            type="text"
            register={register('gender')}
          />
        </div>
        <div className="flex space-x-16 justify-center">
          <FormInput
            className="max-w-[450px]"
            error={errors.relationship?.message}
            placeholder="Ingrese el parentesco"
            inputClassName="h-[60px] w-full rounded text-2xl max-w-[450px]"
            type="text"
            register={register('relationship')}
          />
          <div className="w-full max-w-[450px]"></div>
        </div>
        <div className="flex space-x-16 justify-center">
          <button
            className="w-[222px] h-10 rounded text-white text-xl bg-primary dark:bg-blue-800 flex justify-center items-center"
            type="submit"
          >
            Guardar
          </button>
          <Link href={`/admin/users/user/${kid.user_id}`} passHref>
            <a className="w-[222px] h-10 rounded text-white text-xl bg-red-500 dark:bg-red-600 flex justify-center items-center">
              Cancelar
            </a>
          </Link>
        </div>
      </form>
    </div>
  )
}

EditKid.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Editar niño" headTitle="Editar niño">
      {page}
    </Layout>
  )
}

export default EditKid
