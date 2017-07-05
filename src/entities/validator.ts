
import { ValidationOptions, ObjectSchema } from 'joi';
import { DataValidationError, CodeError } from '../errors';
import { QuizItem, Quiz, WikiEntity, EntityNameType, ENTITY_NAMES } from '../entities';
import { existsTypeField } from './entity-fields';
import { createQuizItem, createQuiz, createWikiEntity, updateWikiEntity, updateQuiz } from './validate-schema';
import { RepUpdateData, RepAccessOptions, RepUpdateOptions } from '../interactors/repository';

export interface Validator<T> {
    create(data: T, options?: ValidationOptions): T
    update(data: RepUpdateData<T>, options?: ValidationOptions): RepUpdateData<T>
}

export class BaseValidator<T> implements Validator<T> {

    constructor(private typeName: EntityNameType, private createSchema: ObjectSchema, private updateSchema?: ObjectSchema) {

    }

    create(data: T, options?: ValidationOptions): T {
        return this.validate(this.createSchema, data, options);
    }

    update(data: RepUpdateData<T>, options?: ValidationOptions): RepUpdateData<T> {
        if (this.updateSchema) {
            data.item = this.validate(this.updateSchema, data.item, options);
        }
        const fields = [].concat(data.delete || []);//.concat(data.inc && Object.keys(data.inc) || []);
        if (fields.length) {
            for (let i = 0; i < fields.length; i++) {
                if (!existsTypeField(this.typeName, existsTypeField[i])) {
                    throw new CodeError({ message: `Unknown field ${fields[i]} for type ${this.typeName}` });
                }
            }
        }
        return data;
    }

    private validate(schema: ObjectSchema, data: T, options?: ValidationOptions): T {
        options = options || { abortEarly: true, convert: true, allowUnknown: false, stripUnknown: false };

        const result = schema.validate(data, options);
        if (result.error) {
            throw new DataValidationError({ error: result.error });
        }

        return result.value;
    }
}

export class QuizItemValidator extends BaseValidator<QuizItem> {
    constructor() {
        super(ENTITY_NAMES.QuizItem, createQuizItem);
    }

    private static _instance: QuizItemValidator;

    static get instance() {
        if (!QuizItemValidator._instance) {
            QuizItemValidator._instance = new QuizItemValidator();
        }

        return QuizItemValidator._instance;
    }
}

export class QuizValidator extends BaseValidator<Quiz> {
    constructor() {
        super(ENTITY_NAMES.Quiz, createQuiz, updateQuiz);
    }

    private static _instance: QuizValidator;

    static get instance() {
        if (!QuizValidator._instance) {
            QuizValidator._instance = new QuizValidator();
        }

        return QuizValidator._instance;
    }
}

export class WikiEntityValidator extends BaseValidator<WikiEntity> {
    constructor() {
        super(ENTITY_NAMES.WikiEntity, createWikiEntity, updateWikiEntity);
    }

    private static _instance: WikiEntityValidator;

    static get instance() {
        if (!WikiEntityValidator._instance) {
            WikiEntityValidator._instance = new WikiEntityValidator();
        }

        return WikiEntityValidator._instance;
    }
}
