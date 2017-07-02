
import { ENTITY_NAMES, EntityNameType } from './entities';
import { createEnum } from '../utils'

const WikiEntityFieldsArray = ['id', 'lang', 'label', 'abbr', 'description', 'aliases', 'props', 'type', 'types', 'pageTitle', 'pageId', 'extract', 'slug', 'name', 'cc2', 'rank', 'countQuizzes', 'countQuizItems', 'createdAt', 'updatetAt'];
const QuizItemFieldsArray = ['id', 'lang', 'entity', 'propertyId', 'value', 'qualifier', 'title', 'question', 'description', 'image', 'topics', 'createdAt', 'updatedAt'];
const QuizFieldsArray = ['id', 'lang', 'target', 'title', 'question', 'description', 'image', 'items', 'topics', 'createdAt', 'updatetAt'];

export const WikiEntityFields = createEnum(WikiEntityFieldsArray)
export type WikiEntityFields = keyof typeof WikiEntityFields

const FieldsMap: { [index: string]: string[] } = {};

FieldsMap[ENTITY_NAMES.Quiz] = QuizFieldsArray;
FieldsMap[ENTITY_NAMES.QuizItem] = QuizItemFieldsArray;
FieldsMap[ENTITY_NAMES.WikiEntity] = WikiEntityFieldsArray;

export function getTypeFields(typeName: EntityNameType): string[] {
    return FieldsMap[typeName];
}

export function fieldExists(typeName: EntityNameType, fieldName: string): boolean {
    const result = /^([a-zA-Z][\w\d]+)/i.exec(fieldName);
    if (result.length < 2) {
        return false;
        // throw new CodeError({ message: `Invalid field name=${fieldName} for type ${typeName}` });
    }
    const name = result[1];
    const index = getTypeFields(typeName).indexOf(name);

    return index >= 0;
}
