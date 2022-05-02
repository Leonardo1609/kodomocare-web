import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TitleOptions,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Última prueba psicomotriz vs Primera prueba psicomotriz',
      color: '#5680E9',
      font: { size: 20 },
    } as TitleOptions,
  },
}

const labels = [
  'Comunicación',
  'Motora-Gruesa',
  'Motora-fina',
  'Resolución de problemas',
  'Socio-Individual',
]

export const data = {
  labels,
  datasets: [
    {
      label: 'Última prueba',
      data: [25, 20, 30, 20, 30],
      backgroundColor: '#8bdc5c',
    },
    {
      label: 'Primera prueba',
      data: [15, 10, 20, 10, 20],
      backgroundColor: '#8961a9',
    },
  ],
}

export const TestsChart = () => {
  return <Bar options={options} data={data} />
}
