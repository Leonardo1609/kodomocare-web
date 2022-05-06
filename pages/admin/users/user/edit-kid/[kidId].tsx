import Link from 'next/link'
import { EditKidData } from '../../../../../interfaces/forms/edit-data'
import { FormInput } from '../../../../../components/form-input/FormInput'
import { GetServerSideProps } from 'next'
import { Layout } from '../../../../../components/layout/Layout'
import { NextPageWithLayout } from '../../../../../interfaces/layout'
import { ReactElement } from 'react'
import { editKidSchema } from '../../../../../yup-schemas'
import { getSession } from 'next-auth/react'
import { kid } from '@prisma/client'
import { toast } from 'react-toastify'
import { updateKid } from '../../../../../services/client/kid'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'
import { db } from '../../../../../db'

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

  const kidFound = await db.kid.findUnique({
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
      const resp = await updateKid(kid.id, data)
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
      <h3 className="text-xl md:text-[30px] border-b-black dark:border-b-gray-300 text-gray-300 border-b-[3px] w-full pb-3 mb-5">
        Datos del menor
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row md:space-x-16 md:justify-center">
          <FormInput
            className="md:max-w-[450px]"
            error={errors.firstName?.message}
            placeholder="Ingrese los nombres"
            inputClassName="text-base md:text-lg h-[45px] md:h-[54px] w-full rounded"
            type="text"
            register={register('firstName')}
          />
          <FormInput
            className="md:max-w-[450px]"
            error={errors.lastName?.message}
            placeholder="Ingrese los apellidos"
            inputClassName="text-base md:text-lg h-[45px] md:h-[54px] w-full rounded"
            type="text"
            register={register('lastName')}
          />
        </div>
        <div className="flex flex-col md:flex-row md:space-x-16 md:justify-center">
          <FormInput
            className="md:max-w-[450px]"
            error={errors.dni?.message}
            placeholder="Ingrese el dni"
            inputClassName="text-base md:text-lg h-[45px] md:h-[54px] w-full rounded"
            type="text"
            register={register('dni')}
          />
          <FormInput
            className="md:max-w-[450px]"
            error={errors.gender?.message}
            placeholder="Ingrese el género"
            inputClassName="text-base md:text-lg h-[45px] md:h-[54px] w-full rounded"
            type="text"
            register={register('gender')}
          />
        </div>
        <div className="flex flex-col md:flex-row md:space-x-16 md:justify-center">
          <FormInput
            className="md:max-w-[450px]"
            error={errors.relationship?.message}
            placeholder="Ingrese el parentesco"
            inputClassName="text-base md:text-lg h-[45px] md:h-[54px] w-full rounded"
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
