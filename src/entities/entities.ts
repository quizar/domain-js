
import { IPlainObject, createEnum } from '../utils'

export const PropertyValueType = createEnum(['STRING', 'NUMBER', 'ENTITY'])
export type PropertyValueType = keyof typeof PropertyValueType

export const QuizTarget = createEnum(['PVALUE', 'QVALUE'])
export type QuizTarget = keyof typeof QuizTarget

export type EntityCategory = {
    id?: string
    name?: string
}

export type Image = {
    // format: ImageFormat
    data?: string
    propertyId?: string
}

export type PropertyQualifier = {
    id?: string
    value?: string
    type?: PropertyValueType
}

export type PropertyValue = {
    type?: PropertyValueType
    value?: string
    entity?: WikiEntity
}

export type WikiEntity = {
    id?: string
    lang?: string
    label?: string
    description?: string
    aliases?: string[]
    props?: IPlainObject<string>
    types?: string[]
    pageTitle?: string
    extract?: string
    categories?: EntityCategory[]
}

export type QuizItem = {
    id?: string
    entity?: WikiEntity
    propertyId?: string
    value?: PropertyValue
    qualifier?: PropertyQualifier

    lang?: string

    title?: string
    question?: string
    description?: string
    image?: Image

    topics?: Topic[]

    createdAt?: number
    updatedAt?: number
}

export type QuizItemInfo = {
    order?: number
    item?: QuizItem
    image?: Image
    title?: string
    question?: string
    description?: string
    target?: QuizTarget

    createdAt?: number
    updatedAt?: number
}

export type Quiz = {
    id?: string
    target?: QuizTarget
    lang?: string
    title?: string
    question?: string
    description?: string
    items?: QuizItemInfo[]
    image?: Image

    topics?: Topic[]

    createdAt?: number
    updatedAt?: number
}

export type Topic = {
    id?: string
    name: string
    entity?: WikiEntity
    description?: string
    createdAt?: number
    updatedAt?: number
}
