import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js'
import { FC } from 'react'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface IDashboardChart {
  data: ChartData<'line', number[], string>
}

export const DashboardChart: FC<IDashboardChart> = ({ data }) => {
  return (
    <Line
      options={{
        plugins: {
          legend: { display: false },
        },
        scales: {
          yAxis: {
            suggestedMin: 0,
          },
        },
      }}
      data={data}
    />
  )
}
