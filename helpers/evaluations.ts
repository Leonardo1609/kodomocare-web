import { Evaluation, EvaluationType } from "../interfaces/questionnaires"

export const evaluationLabels = [
    'Comunicación',
    'Motora-Gruesa',
    'Motora-fina',
    'Resolución de problemas',
    'Socio-Individual',
]

export const parseEvaluationsScores = (evaluations: Evaluation[]) => {
    return [
        evaluations.find((evaluation) => evaluation.type === 'communication')
            ?.score,
        evaluations.find((evaluation) => evaluation.type === 'gross_motor')?.score,
        evaluations.find((evaluation) => evaluation.type === 'fine_motor')?.score,
        evaluations.find((evaluation) => evaluation.type === 'problem_solving')
            ?.score,
        evaluations.find((evaluation) => evaluation.type === 'individual_social')
            ?.score,
    ]
}

export const getEvaluationRatingMessage = (evaluation: Evaluation): {
    evaluationDiagnosis: string,
    evaluationDiagnosisColor: string
} => {
    let evaluationDiagnosis: string = ''
    let evaluationDiagnosisColor: string = ''

    switch (evaluation.rating) {
        case 1: evaluationDiagnosis = 'Se presenta riesgo'; evaluationDiagnosisColor = '#FF0000'; break;
        case 2: evaluationDiagnosis = 'Se presenta posible riesgo'; evaluationDiagnosisColor = '#C6A522'; break;
        case 3: evaluationDiagnosis = 'No se presenta posible riesgo'; evaluationDiagnosisColor = '#188422'; break;
        default: evaluationDiagnosis = 'Se presenta riesgo'; evaluationDiagnosisColor = '#FF0000'; break;
    }

    return {
        evaluationDiagnosis,
        evaluationDiagnosisColor
    }
}

export const getEvaluationByType = (evaluations: Evaluation[], type: EvaluationType): Evaluation => {
    return evaluations.find(evaluation => evaluation.type === type)!
}