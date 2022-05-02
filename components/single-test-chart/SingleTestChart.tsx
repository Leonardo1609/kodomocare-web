import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

export const data = {
  labels: [
    'Comunicación',
    'Motora-Gruesa',
    'Motora-fina',
    'Resolución de problemas',
    'Socio-Individual',
  ],
  datasets: [
    {
      label: 'Actual',
      data: [25, 20, 30, 20, 30],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
    {
      label: 'Previo',
      data: [15, 10, 20, 10, 20],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
}

export const SingleTestChart = () => {
  return <Radar data={data} />
}
