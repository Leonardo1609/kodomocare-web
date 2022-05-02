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
import { FC } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  evaluationLabels,
  parseEvaluationsScores,
} from '../../helpers/evaluations'
import { Questionnaire } from '../../interfaces/questionnaires'

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

export const TestsChart: FC<{
  tests: { first: Questionnaire; last: Questionnaire | null | undefined }
}> = ({ tests }) => {
  const data = {
    labels: evaluationLabels,
    datasets: [
      {
        label: 'Primera prueba',
        data: parseEvaluationsScores(tests.first.evaluations),
        backgroundColor: '#8961a9',
      },
    ],
  }

  tests.last &&
    data.datasets.unshift({
      label: 'Última prueba',
      data: parseEvaluationsScores(tests.last.evaluations),
      backgroundColor: '#8bdc5c',
    })

  return <Bar options={options} data={data} />
}
