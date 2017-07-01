
import * as Joi from 'joi';
import { WikiEntityType, PropertyValueType, QuizTarget } from './entities';

const entityIdRegex = /^Q\d+$/;
const propertyIdRegex = /^P\d+$/;
const langRegex = /^[a-z]{2}$/;
const countryRegex = langRegex;
const propertyTypes = [PropertyValueType.ENTITY, PropertyValueType.NUMBER, PropertyValueType.STRING];
const quizTargets = [QuizTarget.PVALUE, QuizTarget.QVALUE];
const wikiEntityTypes = [WikiEntityType.EVENT, WikiEntityType.LOCATION, WikiEntityType.ORG, WikiEntityType.PERSON, WikiEntityType.PRODUCT];
const labelMaxLength = 200;
const labelMinLength = 1;
const abbrMinLength = 1;
const abbrMaxLength = 50;
const descriptionMinLength = 10;
const descriptionMaxLength = 200;
const titleMinLength = 1;
const titleMaxlength = 200;
const questionMinLength = 1;
const questionMaxlength = 200;
const extractMinLength = 10;
const extractMaxLength = 500;
const slugMinLength = 1;
const slugMaxLength = 200;
const nameMinLength = 1;
const nameMaxLength = 200;
const propMinLength = 1;
const propMaxLength = 200;
const imageMinDatalength = 10;
const imageMaxDataLength = 200;
const valueMinLength = 1;
const valueMaxValue = 200;

const maxQuizItemsCount = 40;
const maxTopicsCount = 5;
const maxLabelsCount = 10;
const maxPropsCount = 20;
const maxPropsItemsCount = 5;
const maxEntityTypesCount = 10;

// create WikiEntity

const baseWikiEntity = Joi.object().keys({
    abbr: Joi.string().trim().min(abbrMinLength).max(abbrMaxLength),
    description: Joi.string().trim().min(descriptionMinLength).max(descriptionMaxLength),
    aliases: Joi.array().items(Joi.string().trim().min(labelMinLength).max(labelMaxLength)).min(1).max(maxLabelsCount).unique(),
    props: Joi.object().pattern(propertyIdRegex, Joi.array().items(Joi.string().trim().min(propMinLength).max(propMaxLength)).min(1).max(maxPropsItemsCount)).min(1).max(maxPropsCount),
    type: Joi.allow(wikiEntityTypes),
    types: Joi.array().items(Joi.string().trim().min(3).max(16)).min(1).max(maxEntityTypesCount).unique(),
    pageTitle: Joi.string().trim().min(titleMinLength).max(titleMaxlength),
    pageId: Joi.number().integer().min(1),
    extract: Joi.string().trim().min(extractMinLength).max(extractMaxLength),
    slug: Joi.string().lowercase().trim().min(slugMinLength).max(slugMaxLength),
    name: Joi.string().trim().min(nameMinLength).max(nameMaxLength),
    cc2: Joi.string().regex(countryRegex),
    rank: Joi.number().integer().min(0),
    countQuizItems: Joi.number().integer().min(0),
    countQuizzes: Joi.number().integer().min(0)
});

const createWikiEntityObj = baseWikiEntity.keys({
    id: Joi.string().regex(entityIdRegex).required(),
    lang: Joi.string().regex(langRegex).required(),
    label: Joi.string().trim().min(labelMinLength).max(labelMaxLength).required(),
    createdAt: Joi.number().min(0)
});

// update WikiEntity

const updateWikiEntityObj = baseWikiEntity.keys({
    id: Joi.string().regex(entityIdRegex).required(),
    // lang: Joi.string().regex(langRegex).required(),
    label: Joi.string().trim().min(labelMinLength).max(labelMaxLength),
    updatedAt: Joi.number().min(0)
});

const createImage = Joi.object({
    data: Joi.string().trim().min(imageMinDatalength).max(imageMaxDataLength).required(),
    propertyId: Joi.string().regex(propertyIdRegex).required()
});

const createDescriptionSchema = Joi.object().keys({
    title: Joi.string().trim().min(titleMinLength).max(titleMaxlength),
    question: Joi.string().trim().min(questionMinLength).max(questionMaxlength),
    description: Joi.string().trim().min(descriptionMinLength).max(descriptionMaxLength),
    image: createImage
});

const createValueSchema = Joi.object().keys({
    type: Joi.valid(propertyTypes).required(),
    value: Joi.string().trim().min(valueMinLength).max(valueMaxValue).when('type', { is: PropertyValueType.ENTITY, then: Joi.string().equal(Joi.ref('entity.id')).required() }).required(),
    entity: Joi.when('type', { is: PropertyValueType.ENTITY, then: createWikiEntityObj.required() })
});

const createQuizItemObj = createDescriptionSchema.keys({
    id: Joi.string().trim().min(1).max(40),
    lang: Joi.string().regex(langRegex).required(),
    entity: createWikiEntityObj.required(),
    propertyId: Joi.string().regex(propertyIdRegex).required(),
    value: createValueSchema.required(),
    qualifier: createValueSchema.keys({
        id: Joi.string().regex(propertyIdRegex).required()
    }),
    topics: Joi.array().items(createWikiEntityObj.required()).min(1).max(maxTopicsCount).unique((a, b) => a.id === b.id)
});

const createQuizObj = createDescriptionSchema.keys({
    id: Joi.string().trim().min(1).max(40),
    lang: Joi.string().regex(langRegex).required(),
    target: Joi.valid(quizTargets).required(),
    topics: Joi.array().items(createWikiEntityObj.required()).min(1).max(maxTopicsCount).unique((a, b) => a.id === b.id),
    items: Joi.array().items(createDescriptionSchema.keys({
        order: Joi.number().integer().min(1).max(maxQuizItemsCount),
        target: Joi.valid(quizTargets),
        item: Joi.object().keys({ id: Joi.string().trim().required() }).required()
    })).min(1).max(maxQuizItemsCount).unique((a, b) => a.item.id === b.item.id)
});

export const createWikiEntity = createWikiEntityObj.required();
export const createQuizItem = createQuizItemObj.required();
export const createQuiz = createQuizObj.required();
export const updateWikiEntity = updateWikiEntityObj.required();