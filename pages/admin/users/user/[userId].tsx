import { NextPage } from 'next'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import { Layout } from '../../../../components/layout/Layout'
import { ParentAvatar } from '../../../../components/parent-avatar/ParentAvatar'
import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { kid, PrismaClient, user } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { getMonthDifference } from '../../../../helpers/kids'
import { komodoroAxiosClient } from '../../../../axios/komodoroAxios'
import { TestsChart } from '../../../../components/tests-chart/TestsChart'
import { SingleTestChart } from '../../../../components/single-test-chart/SingleTestChart'
import {
  EvaluationType,
  IKidsQuestionnaries,
  Questionnaire,
} from '../../../../interfaces/questionnaires'
import {
  getEvaluationByType,
  getEvaluationRatingMessage,
} from '../../../../helpers/evaluations'

const prisma = new PrismaClient()

type NextPageWithLayout<T> = NextPage<T> & {
  getLayout?: (page: ReactElement) => ReactNode
}

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

  const parent = await prisma.user.findUnique({
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

  const kidsFound = await prisma.kid.findMany({
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
      komodoroAxiosClient
        .get<IKidsQuestionnaries[]>(
          `/admin/questionnaires-completed/${parent.id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        )
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
    <section className="flex w-full h-full">
      <div className="max-w-[350px] w-full">
        <ParentAvatar user={parent} hasEditButton={true} />
        <hr className="my-5 border-primary dark:border-blue-800 border-b-" />
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
        {activeKid && !loading && (
          <div className="leading-8 text-xl dark:text-gray-300 mt-5">
            <p>Nombres: {activeKid.first_name}</p>
            <p>Apellidos: {activeKid.last_name}</p>
            <p>Edad: {activeKid.months} meses</p>

            <Link href={`/admin/users/user/edit-kid/${activeKid.id}`}>
              <a className="text-white bg-primary dark:bg-blue-800 rounded px-8 text-[25px] w-full md:w-auto inline-block mt-3">
                Editar
              </a>
            </Link>

            <strong className="block mt-5">
              Pruebas realizadas en total: {activeKidTests.length}
            </strong>
          </div>
        )}
      </div>
      <div className="min-h-full w-1 bg-primary dark:bg-blue-800 mx-12"></div>
      <div className="h-full w-full">
        {activeKidTests.length ? (
          <div>
            <div className="min-w-[400px] max-w-[90%]">
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
              <h4 className="dark:text-gray-300 mb-4 text-[25px] font-bold">
                Pruebas psicomotrices
              </h4>
              <ul className="w-full">
                {activeKidTests.map((test, idx) => (
                  <li
                    key={test.id}
                    className="border border-primary dark:border-blue-800 rounded mb-3 px-5 py-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[25px] dark:text-gray-300">
                        PS-{idx + 1}
                      </span>
                      {testOpenId === test.id ? (
                        <button onClick={setTestOpenId.bind(this, null)}>
                          <div className="border-solid border-b-primary dark:border-b-blue-800 border-b-8 border-x-transparent border-x-8 border-t-0" />
                        </button>
                      ) : (
                        <button onClick={setTestOpenId.bind(this, test.id!)}>
                          <div className="border-solid border-t-primary dark:border-t-blue-800 border-t-8 border-x-transparent border-x-8 border-b-0" />
                        </button>
                      )}
                    </div>
                    {testOpenId === test.id && (
                      <div className="flex">
                        <div className="w-2/5">
                          <SingleTestChart
                            tests={{
                              current: test,
                              previous: idx ? activeKidTests[idx - 1] : null,
                            }}
                          />
                        </div>
                        <div className="dark:text-gray-300">
                          <div className="flex w-full px-4 mb-2">
                            <span className="flex-1">Comunicación</span>
                            <span
                              className="flex-1"
                              style={{
                                color: getEvaluationRatingMessage(
                                  getEvaluationByType(
                                    test.evaluations,
                                    EvaluationType.communication
                                  )
                                ).evaluationDiagnosisColor,
                              }}
                            >
                              {
                                getEvaluationRatingMessage(
                                  getEvaluationByType(
                                    test.evaluations,
                                    EvaluationType.communication
                                  )
                                ).evaluationDiagnosis
                              }
                            </span>
                          </div>
                          <div className="flex w-full px-4 mb-2">
                            <span className="flex-1">Motora Gruesa</span>
                            <span
                              className="flex-1"
                              style={{
                                color: getEvaluationRatingMessage(
                                  getEvaluationByType(
                                    test.evaluations,
                                    EvaluationType.gross_motor
                                  )
                                ).evaluationDiagnosisColor,
                              }}
                            >
                              {
                                getEvaluationRatingMessage(
                                  getEvaluationByType(
                                    test.evaluations,
                                    EvaluationType.gross_motor
                                  )
                                ).evaluationDiagnosis
                              }
                            </span>
                          </div>
                          <div className="flex w-full px-4 mb-2">
                            <span className="flex-1">Motora Fina</span>
                            <span
                              className="flex-1"
                              style={{
                                color: getEvaluationRatingMessage(
                                  getEvaluationByType(
                                    test.evaluations,
                                    EvaluationType.fine_motor
                                  )
                                ).evaluationDiagnosisColor,
                              }}
                            >
                              {
                                getEvaluationRatingMessage(
                                  getEvaluationByType(
                                    test.evaluations,
                                    EvaluationType.fine_motor
                                  )
                                ).evaluationDiagnosis
                              }
                            </span>
                          </div>
                          <div className="flex w-full px-4 mb-2">
                            <span className="flex-1">
                              Resolución de Problemas
                            </span>
                            <span
                              className="flex-1"
                              style={{
                                color: getEvaluationRatingMessage(
                                  getEvaluationByType(
                                    test.evaluations,
                                    EvaluationType.problem_solving
                                  )
                                ).evaluationDiagnosisColor,
                              }}
                            >
                              {
                                getEvaluationRatingMessage(
                                  getEvaluationByType(
                                    test.evaluations,
                                    EvaluationType.problem_solving
                                  )
                                ).evaluationDiagnosis
                              }
                            </span>
                          </div>
                          <div className="flex w-full px-4">
                            <span className="flex-1">Socio-Individual</span>
                            <span
                              className="flex-1"
                              style={{
                                color: getEvaluationRatingMessage(
                                  getEvaluationByType(
                                    test.evaluations,
                                    EvaluationType.problem_solving
                                  )
                                ).evaluationDiagnosisColor,
                              }}
                            >
                              {
                                getEvaluationRatingMessage(
                                  getEvaluationByType(
                                    test.evaluations,
                                    EvaluationType.problem_solving
                                  )
                                ).evaluationDiagnosis
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
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
          <a className="text-white bg-red-400 dark:bg-red-700 rounded px-8 py-1 text-[25px] w-full md:w-auto">
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
