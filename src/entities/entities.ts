
import { IPlainObject, createEnum } from '../utils'

export const ENTITY_NAMES = createEnum(['WikiEntity', 'QuizItem', 'Quiz'])
export type EntityNameType = ENTITY_NAMES;
export type ENTITY_NAMES = keyof typeof ENTITY_NAMES

export const PropertyValueType = createEnum(['STRING', 'NUMBER', 'ENTITY'])
export type PropertyValueType = keyof typeof PropertyValueType

export const QuizTarget = createEnum(['PVALUE', 'QVALUE'])
export type QuizTarget = keyof typeof QuizTarget

export const WikiEntityType = createEnum(['PERSON', 'PRODUCT', 'ORG', 'LOCATION', 'EVENT'])
export type WikiEntityType = keyof typeof WikiEntityType

export type Image = {
    // format: ImageFormat
    data?: string
    propertyId?: string
}

export type EntityPropertyQualifier = {
    id: string
    type: PropertyValueType
    value: string
    entity?: WikiEntity
}

export type EntityPropertyValue = {
    value: string
    entity?: WikiEntity
    qualifiers?: EntityPropertyQualifier[]
}

export type EntityProperty = {
    id: string
    type: PropertyValueType
    values: EntityPropertyValue[]
}

export type WikiEntity = {
    id?: string
    lang?: string
    label?: string
    abbr?: string
    description?: string
    aliases?: string[]
    props?: IPlainObject<string[]>
    type?: WikiEntityType
    types?: string[]
    pageTitle?: string
    pageId?: number
    extract?: string
    // categories?: WikiEntity[]
    slug?: string
    name?: string
    /**
     * Country code (ISO 3166-1 alpha-2 code), upper case
     */
    cc2?: string
    rank?: number
    countQuizItems?: number
    countQuizzes?: number
    createdAt?: number
    updatedAt?: number
}

export type QuizItem = {
    id?: string
    lang?: string
    entity?: WikiEntity
    property?: EntityProperty

    title?: string
    question?: string
    description?: string
    image?: Image

    topics?: WikiEntity[]

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
    lang?: string
    target?: QuizTarget
    title?: string
    question?: string
    description?: string
    image?: Image
    items?: QuizItemInfo[]

    topics?: WikiEntity[]

    createdAt?: number
    updatedAt?: number
}

export type OneEntityType = WikiEntity | QuizItem | Quiz;
