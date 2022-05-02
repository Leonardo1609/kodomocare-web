export interface IKidsQuestionnaries {
    id: string
    firstName: string
    lastName: string
    avatarImage: string
    months: number
    questionnaires: Questionnaire[]
}

export interface Questionnaire {
    id: string
    status: number
    updatedDate: Date
    evaluations: Evaluation[]
}

export interface Evaluation {
    id: string
    type: EvaluationType
    answers: string
    score: number
    rating: number
}

export enum EvaluationType {
    'individual_social' = 'individual_social',
    "problem_solving" = "problem_solving",
    "gross_motor" = "gross_motor",
    "fine_motor" = "fine_motor",
    "communication" = "communication"
}
