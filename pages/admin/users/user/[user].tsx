import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'
import { Layout } from '../../../../components/layout/Layout'
import { ParentAvatar } from '../../../../components/parent-avatar/ParentAvatar'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { kid, PrismaClient, user } from '@prisma/client'

const prisma = new PrismaClient()

type NextPageWithLayout<T> = NextPage<T> & {
  getLayout?: (page: ReactElement) => ReactNode
}

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
      id: params?.user?.toString(),
    },
    select: {
      avatar_image: true,
      first_name: true,
      id: true,
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

  const kidsFound = await prisma.kid.findMany({
    where: {
      user_id: parent.id,
    },
  })

  const kids: Array<Partial<kid | { birthdate: string }>> = kidsFound.map(
    (kid) => {
      const kidParsed = {
        ...kid,
        birthdate: JSON.stringify(kid.birthdate),
      }

      return kidParsed
    }
  )

  return {
    props: {
      parent,
      kids,
    },
  }
}

const ParentUser: NextPageWithLayout<{ parent: user; kids: kid[] }> = ({
  parent,
  kids,
}) => {
  return (
    <section className="flex w-full">
      <div>
        <ParentAvatar user={parent} hasEditButton={true} />
      </div>
    </section>
  )
}

ParentUser.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Apoderado" headTitle="Apoderado">
      {page}
    </Layout>
  )
}

export default ParentUser
