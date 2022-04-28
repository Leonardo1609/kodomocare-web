import DashboardItem from '../../components/dashboard-item/DashboardItem'
import { DashboardChart } from '../../components/dashboard-chart/DashboardChart'
import { Layout } from '../../components/layout/Layout'
import { ReactElement } from 'react'

const Home = () => {
  return (
    <>
      <h3 className="text-[25px] mb-10 inline-block dark:text-gray-300">
        Usuarios Activos
      </h3>
      <div className="max-w-[725px] max-h-[361px] w-full">
        <DashboardChart
          data={{
            labels: ['Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
            datasets: [
              {
                data: [120, 80, 240, 250, 40],
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
            result={13.5}
          />
        </div>
        <div className="col-span-1">
          <DashboardItem
            title="Cantidad de usuarios registrados / mes"
            result={20}
          />
        </div>
        <div className="col-span-1">
          <DashboardItem
            title="Edad en meses promedio de las pruebas / mes"
            result={35.3}
          />
        </div>
        <div className="col-span-1">
          <DashboardItem title="Cantidad de usuarios inactivos" result={3} />
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
