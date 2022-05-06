import DashboardItem from '../../components/dashboard-item/DashboardItem'
import { DashboardChart } from '../../components/dashboard-chart/DashboardChart'
import { GetServerSideProps } from 'next'
import { Layout } from '../../components/layout/Layout'
import { NextPageWithLayout } from '../../interfaces/layout'
import { ReactElement } from 'react'
import {
  getKidsAgesInEvaluations,
  getQuestionnariesWithMonth,
} from '../../services/server/questionnaires'
import { getSession } from 'next-auth/react'
import { monthsTranslated } from '../../helpers/dates'
import { db } from '../../db'

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

  let inactiveUsers = 0
  let averageTestsAges = 0
  let averageTestsPerMonth = 0
  let averageUsersPerMonth = 0
  let chartInfo: { labels: string[]; values: number[] } = {
    labels: [],
    values: [],
  }

  try {
    const { data: questionnaires } = await getQuestionnariesWithMonth(
      session.user.backendToken!
    )

    const questionnariesPerMonth = questionnaires.reduce<
      Record<string, number>
    >((acc, questionnary) => {
      const questionnaryDate = new Date(questionnary.updatedDate)
      const month = questionnaryDate.getMonth()
      const year = questionnaryDate.getFullYear()

      acc[`${year}-${month}`] = acc[`${year}-${month}`]
        ? acc[`${year}-${month}`] + 1
        : 1
      return acc
    }, {})

    averageTestsPerMonth = Math.round(
      Object.values<number>(questionnariesPerMonth).reduce(
        (acc: number, value: number) => {
          return acc + value
        },
        0
      ) / Object.keys(questionnariesPerMonth).length
    )

    const { data: evaluationsMonth } = await getKidsAgesInEvaluations(
      session.user.backendToken!
    )

    averageTestsAges = Math.round(
      evaluationsMonth.reduce((acc: number, evaluation: any) => {
        return acc + evaluation.month_test
      }, 0) / evaluationsMonth.length
    )

    inactiveUsers = await db.user.count({
      where: {
        status: 1,
      },
    })

    const allUsers = await db.user.findMany({
      where: {
        role_id: '1',
      },
      orderBy: {
        created_date: 'asc',
      },
    })

    const usersPerMonth = allUsers.reduce<Record<string, number>>(
      (acc, user) => {
        const userCreatedDate = user.created_date
        const month: number = userCreatedDate.getMonth()
        const year: number = userCreatedDate.getFullYear()

        acc[`${year}-${month}`] = acc[`${year}-${month}`]
          ? acc[`${year}-${month}`] + 1
          : 1

        return acc
      },
      {}
    )

    const usersPerMonthTochart = allUsers.reduce<Record<string, number>>(
      (acc, user) => {
        const userCreatedDate = user.created_date
        const month: string = monthsTranslated[userCreatedDate.getMonth() - 1]
        const year: number = userCreatedDate.getFullYear()

        acc[`${year}-${month}`] = acc[`${year}-${month}`]
          ? acc[`${year}-${month}`] + 1
          : 1

        return acc
      },
      {}
    )

    Object.keys(usersPerMonthTochart).forEach((itemKey) => {
      chartInfo.labels.push(itemKey)
      chartInfo.values.push(usersPerMonthTochart[itemKey])
    })

    averageUsersPerMonth = Math.round(
      Object.values(usersPerMonth).reduce((acc, value) => {
        return acc + value
      }, 0) / Object.keys(questionnariesPerMonth).length
    )
  } catch (err) {
    console.log(err)
  }

  return {
    props: {
      averageTestsAges,
      inactiveUsers,
      averageTestsPerMonth,
      averageUsersPerMonth,
      chartInfo,
    },
  }
}

interface IHome {
  averageTestsAges: number
  inactiveUsers: number
  averageTestsPerMonth: number
  averageUsersPerMonth: number
  chartInfo: { labels: string[]; values: number[] }
}

const Home: NextPageWithLayout<IHome> = ({
  averageTestsAges,
  inactiveUsers,
  averageTestsPerMonth,
  averageUsersPerMonth,
  chartInfo,
}) => {
  return (
    <>
      <h3 className="text-lg font-bold lg:font-normal lg:text-[25px] mb-10 inline-block dark:text-gray-300">
        Usuarios registrados
      </h3>
      <div className="max-w-[725px] max-h-[361px] w-full">
        <DashboardChart
          data={{
            labels: chartInfo.labels,
            datasets: [
              {
                data: chartInfo.values,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
              },
            ],
          }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-7">
        <div className="col-span-1">
          <DashboardItem
            title="Pruebas realizadas en promedio / mes"
            result={averageTestsPerMonth}
          />
        </div>
        <div className="col-span-1">
          <DashboardItem
            title="Cantidad de usuarios registrados / mes"
            result={averageUsersPerMonth}
          />
        </div>
        <div className="col-span-1">
          <DashboardItem
            title="Edad en meses promedio de las pruebas"
            result={averageTestsAges}
          />
        </div>
        <div className="col-span-1">
          <DashboardItem
            title="Cantidad de usuarios inactivos"
            result={inactiveUsers}
          />
        </div>
      </div>
    </>
  )
}

export default Home

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Administrador" headTitle="Administrador">
      {page}
    </Layout>
  )
}
