
import { QuizItem } from './quiz-item'

export type QuizItemInfo = {
    id: string
    order?: number
    item?: QuizItem
}

export type Quiz = {
    id?: string
    lang?: string
    title?: string
    question?: string
    description?: string
    items?: QuizItemInfo[]
    createdAt?: number
    updatedAt?: number
}
