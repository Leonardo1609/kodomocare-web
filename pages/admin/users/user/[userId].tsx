import Image from 'next/image'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import {
  IKidsQuestionnaries,
  Questionnaire,
} from '../../../../interfaces/questionnaires'
import { Layout } from '../../../../components/layout/Layout'
import { NextPageWithLayout } from '../../../../interfaces/layout'
import { ParentAvatar } from '../../../../components/parent-avatar/ParentAvatar'
import { PsychomotorTests } from '../../../../components/psychomotor-tests/PsychomotorTests'
import { ReactElement, useEffect, useState } from 'react'
import { TestsChart } from '../../../../components/tests-chart/TestsChart'
import { getMonthDifference } from '../../../../helpers/kids'
import { getSession, useSession } from 'next-auth/react'
import { kid, user } from '@prisma/client'
import { getKidsByParent } from '../../../../services/client/kid'
import { db } from '../../../../db'

interface IParsedKid extends Omit<kid, 'birthdate'> {
  birthdate: string
  months: number
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

  const userId = params?.userId?.toString()

  const parent = await db.user.findUnique({
    where: {
      id: userId,
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

  const kidsFound = await db.kid.findMany({
    where: {
      user_id: parent.id,
    },
  })

  const kids: IParsedKid[] = kidsFound.map((kid) => ({
    ...kid,
    birthdate: JSON.stringify(kid.birthdate),
    months: getMonthDifference(kid.birthdate),
  }))

  return {
    props: {
      parent,
      kids,
    },
  }
}

const EditParentUser: NextPageWithLayout<{
  parent: user
  kids: IParsedKid[]
}> = ({ parent, kids }) => {
  const session = useSession()
  const token: string = session.data?.user?.backendToken!

  const [loading, setLoading] = useState<boolean>(false)
  const [activeKid, setActiveKid] = useState<IParsedKid>(kids[0])
  const [kidsTests, setKidsTests] = useState<IKidsQuestionnaries[]>([])
  const [activeKidTests, setActiveKidsTests] = useState<Questionnaire[]>([])
  const [testOpenId, setTestOpenId] = useState<string | null>(null)

  useEffect(() => {
    if (token && parent) {
      getKidsByParent(parent.id)
        .then((resp) => {
          setLoading(true)
          setKidsTests(resp.data)
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [token, parent])

  useEffect(() => {
    if (kidsTests.length) {
      setActiveKidsTests(
        kidsTests.find((item) => item.id === activeKid.id)?.questionnaires || []
      )
    }
  }, [kidsTests, activeKid])

  return (
    <section className="flex flex-col lg:flex-row w-full h-full">
      <div className="lg:max-w-[350px] w-full">
        <ParentAvatar user={parent} hasEditButton={true} />
        <hr className="my-5 border-primary dark:border-blue-800" />
        {/* Kids to select */}
        {kids.length ? (
          <ul className="flex space-x-4 overflow-x-auto pb-2">
            {kids.map((kid) => (
              <li key={kid.id}>
                <button
                  onClick={setActiveKid.bind(this, kid)}
                  className={`border-b-4 pb-2 w-16 ${
                    activeKid.id === kid.id
                      ? 'border-b-primary dark:border-b-blue-800'
                      : 'border-b-transparent'
                  }`}
                >
                  <Image
                    src={`/images/avatars/kids/${kid.avatar_image}`}
                    alt="kid"
                    width={64}
                    height={64}
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <span className="mt-10 font-bold text-center dark:text-gray-300 text-xl w-full block">
            No se registró ningún menor
          </span>
        )}
        {/* Active kid information */}
        {activeKid && !loading && (
          <div className="leading-8 text-base md:text-xl dark:text-gray-300 mt-5">
            <p>
              <strong>Nombres:</strong> {activeKid.first_name}
            </p>
            <p>
              <strong>Apellidos:</strong> {activeKid.last_name}
            </p>
            <p>
              <strong>Edad:</strong> {activeKid.months} meses
            </p>

            <Link href={`/admin/users/user/edit-kid/${activeKid.id}`}>
              <a className="text-white bg-primary dark:bg-blue-800 rounded px-8 text-xl md:text-[25px] inline-block mt-3 text-center py-1">
                Editar
              </a>
            </Link>

            <strong className="block mt-5">
              Pruebas realizadas en total: {activeKidTests.length}
            </strong>
          </div>
        )}
      </div>
      {/* Separator */}
      <div className="hidden lg:block min-h-full w-1 bg-primary dark:bg-blue-800 mx-8"></div>

      {/* Charts */}
      <div className="h-full w-full">
        {activeKidTests.length ? (
          <div>
            <div className="min-w-[400px] max-w-[90%] hidden md:block mt-10 lg:mt-0">
              <TestsChart
                tests={{
                  first: activeKidTests[0],
                  last:
                    activeKidTests.at(-1)!.id === activeKidTests[0].id
                      ? null
                      : activeKidTests.at(-1),
                }}
              />
            </div>
            <div className="mt-10">
              <PsychomotorTests
                activeKidTests={activeKidTests}
                testOpenId={testOpenId}
                setTestOpenId={setTestOpenId}
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-full grid place-items-center">
            {!loading && (
              <>
                {!kids.length ? (
                  <p className="text-center font-bold dark:text-gray-300 text-2xl">
                    No se registró ningún menor
                  </p>
                ) : (
                  <p className="text-center font-bold dark:text-gray-300 text-2xl">
                    No se tiene datos del menor
                  </p>
                )}
              </>
            )}
          </div>
        )}
        <Link href={`/admin/users`}>
          <a className="text-white bg-red-400 dark:bg-red-700 rounded px-8 py-1 text-xl md:text-[25px] w-full md:w-auto">
            Regresar
          </a>
        </Link>
      </div>
    </section>
  )
}

EditParentUser.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Apoderado" headTitle="Apoderado">
      {page}
    </Layout>
  )
}

export default EditParentUser
