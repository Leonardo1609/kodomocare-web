import { FC, ReactElement, ReactNode } from 'react'
import { Layout } from '../../components/layout/Layout'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { PrismaClient, user } from '@prisma/client'
import Image from 'next/image'
const prisma = new PrismaClient()

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

  const users = await prisma.user.findMany({
    select: {
      id: true,
      first_name: true,
      last_name: true,
      identification_number: true,
      avatar_image: true,
    },
  })

  return {
    props: {
      users,
    },
  }
}

type NextPageWithLayout<T> = NextPage<T> & {
  getLayout?: (page: ReactElement) => ReactNode
}

const UserRow: FC<{ user: user }> = ({ user }) => {
  return (
    <div className="mb-6 flex space-x-6">
      <div className="flex space-x-4">
        <div className="border border-primary dark:border-blue-800 rounded p-2 shadow-sm shadow-primary dark:shadow-blue-800">
          <Image
            src={`/images/avatars/profile/${user.avatar_image}`}
            alt="admin"
            width={132}
            height={132}
          />
        </div>
        <div className="dark:text-gray-300 leading-8 text-xl">
          <p>Nombres: {user.first_name}</p>
          <p>Apellidos: {user.last_name}</p>
          <p>DNI: {user.identification_number}</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center flex-1 max-w-2xl justify-center space-y-6 md:space-x-6 md:space-y-0">
        <button className="text-white bg-green-500 dark:bg-green-700 rounded px-8 text-[25px] w-full md:w-auto">
          Acceder
        </button>
        <button className="text-white bg-red-500 dark:bg-red-700 rounded px-6 text-[25px] w-full md:w-auto">
          Desactivar
        </button>
      </div>
    </div>
  )
}

const List: NextPageWithLayout<{ users: user[] }> = ({ users }) => {
  return (
    <section>
      <ul>
        {users.map((user) => (
          <UserRow key={user.id} user={user} />
        ))}
      </ul>
    </section>
  )
}

export default List

List.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Apoderados" headTitle="Apoderados">
      {page}
    </Layout>
  )
}
