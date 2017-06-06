
// import { Entity } from './entity'

export type PropertyValueType = 'S' | 'N' | 'Q'
export type PropertyValueDataType = WikiEntity | string | number

export type WikiEntity = {
    id: string
    lang: string
    label: string
    alises?: string[]
    countryCode?: string
    continentCode?: string
    instanceId: string
}

export type Property = {
    id: string
}

export type PropertyValue = {
    type: PropertyValueType
    data: PropertyValueDataType
}

export type QuizItem = {
    id?: string
    subject: WikiEntity
    property: Property
    value: PropertyValue
    quizIds?: string[]
    topicIds?: string[]
    createdAt?: number
    updatedAt?: number
}
