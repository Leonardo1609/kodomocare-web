import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { FC } from 'react'
import { Radar } from 'react-chartjs-2'
import {
  evaluationLabels,
  parseEvaluationsScores,
} from '../../helpers/evaluations'
import { Questionnaire } from '../../interfaces/questionnaires'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

export const SingleTestChart: FC<{
  tests: { current: Questionnaire; previous: Questionnaire | null }
}> = ({ tests }) => {
  const data = {
    labels: evaluationLabels,
    datasets: [
      {
        label: 'Actual',
        data: parseEvaluationsScores(tests.current.evaluations),
        backgroundColor: 'rgba(139,220,92,0.2)',
        borderColor: 'rgba(139,220,92,1)',
        borderWidth: 1,
      },
    ],
  }

  tests['previous'] &&
    data.datasets.push({
      label: 'Previa',
      data: parseEvaluationsScores(tests.previous.evaluations),
      backgroundColor: 'rgba(137,97,169,0.2)',
      borderColor: 'rgba(137,97,169,1)',
      borderWidth: 1,
    })

  return (
    <Radar
      data={data}
      options={{
        scales: {
          r: {
            suggestedMin: 0,
          },
        },
      }}
    />
  )
}
