
import { ENTITY_NAMES, EntityNameType } from './entities';
import { createEnum } from '../utils';

export const WikiEntityFields = createEnum(['id', 'lang', 'label', 'abbr', 'description', 'aliases', 'props', 'type', 'types', 'pageTitle', 'pageId', 'extract', 'slug', 'name', 'cc2', 'rank', 'countQuizzes', 'countQuizItems', 'createdAt', 'updatedAt'])
export type WikiEntityFields = keyof typeof WikiEntityFields;
export const QuizItemFields = createEnum(['id', 'lang', 'entity', 'property', 'qualifier', 'title', 'question', 'description', 'image', 'topics', 'createdAt', 'updatedAt'])
export type QuizItemFields = keyof typeof QuizItemFields;
export const QuizFields = createEnum(['id', 'lang', 'target', 'title', 'question', 'description', 'image', 'items', 'topics', 'createdAt', 'updatetAt'])
export type QuizFields = keyof typeof QuizFields;

const FieldsMap: { [index: string]: { keys: string[], incrementable?: string[] } } = {};

FieldsMap[ENTITY_NAMES.Quiz] = { keys: Object.keys(QuizFields) };
FieldsMap[ENTITY_NAMES.QuizItem] = { keys: Object.keys(QuizItemFields) };
FieldsMap[ENTITY_NAMES.WikiEntity] = { keys: Object.keys(WikiEntityFields) };

export function getTypeFields(typeName: EntityNameType): string[] {
    return FieldsMap[typeName].keys;
}

export function existsTypeField(typeName: EntityNameType, fieldName: string): boolean {
    const name = getRootFieldName(fieldName);
    if (!name) {
        return false;
    }
    const index = getTypeFields(typeName).indexOf(name);

    return index >= 0;
}

export function getRootFieldName(fieldName: string) {
    const result = /^([a-zA-Z][\w\d]+)/i.exec(fieldName);
    return result.length > 1 ? result[1] : null;
}
