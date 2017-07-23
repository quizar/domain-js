
import { PlainObject, createEnum, StringPlainObject } from '../utils'

export const ENTITY_NAMES = createEnum(['WikiEntity', 'QuizItem', 'Quiz'])
export type EntityNameType = ENTITY_NAMES;
export type ENTITY_NAMES = keyof typeof ENTITY_NAMES

export const PropertyValueType = createEnum(['STRING', 'NUMBER', 'ENTITY', 'DATE', 'WIKIIMAGE', 'BOOLEAN'])
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

export type EntityProperty = {
    id: string
    type: PropertyValueType
    value: string
    entity?: WikiEntity
}

export type WikiEntity = {
    id?: string
    lang?: string
    label?: string
    abbr?: string
    description?: string
    aliases?: string[]
    props?: PlainObject<string[]>
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
    qualifier?: EntityProperty

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

// export type DataQueryParamsType = IPlainObject<string> | IPlainObject<string>[]

export const QuestionFormat = createEnum(['VALUE', 'YESNO', 'IMAGE'])
export type QuestionFormat = keyof typeof QuestionFormat

export const QuestionValueFormat = createEnum(['NAME', 'ENTIPIC', 'WIKIIMAGE'])
export type QuestionValueFormat = keyof typeof QuestionValueFormat

export type QuestionSourceData = {
    subject?: string
    predicate?: string
    object?: string
    adverbs?: StringPlainObject
}

export type QuestionSource = {
    /** SPARQL query id */
    queryId?: string
    /** query params */
    queryParams?: StringPlainObject
    /** data question id */
    questionId?: string
    /** question data */
    data?: QuestionSourceData
    /** value data property */
    dataValue?: string
}

export type QuestionValue = {
    value: string
    entity?: WikiEntity
}

export type Question = {
    id?: string
    lang?: string
    title?: string
    question?: string
    format?: QuestionFormat
    difficulty?: number
    source?: QuestionSource
    sourceHash?: string
    valueType?: PropertyValueType
    valueFormat?: QuestionValueFormat
    values: QuestionValue[]
    topics?: WikiEntity[]
    createAt?: number
    updatedAt?: number
    dataUpdatedAt?: number
}

export type OneEntityType = WikiEntity | QuizItem | Quiz | Question;
