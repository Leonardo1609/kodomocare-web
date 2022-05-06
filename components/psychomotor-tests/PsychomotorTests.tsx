import { EvaluationType, Questionnaire } from '../../interfaces/questionnaires'
import { FC } from 'react'
import {
  getEvaluationByType,
  getEvaluationRatingMessage,
} from '../../helpers/evaluations'
import { SingleTestChart } from '../single-test-chart/SingleTestChart'

export const PsychomotorTests: FC<{
  activeKidTests: Questionnaire[]
  testOpenId: string | null
  setTestOpenId: (value: string | null) => void
}> = ({ activeKidTests, testOpenId, setTestOpenId }) => {
  return (
    <>
      <h4 className="dark:text-gray-300 mb-4 text-lg md:text-[25px] font-bold">
        Pruebas psicomotrices
      </h4>
      <ul className="w-full">
        {activeKidTests.map((test, idx) => (
          <li
            key={test.id}
            className="border border-primary dark:border-blue-800 rounded mb-3 px-5 py-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-xl md:text-[25px] dark:text-gray-300">
                PS-{idx < 9 ? '0' : ''}
                {idx + 1}
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
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/5">
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
                    <span className="flex-1">Resolución de Problemas</span>
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
    </>
  )
}
