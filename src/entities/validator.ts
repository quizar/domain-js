
import { ValidationOptions, ObjectSchema } from 'joi';
import { DataValidationError } from '../errors';
import { QuizItem, Quiz, WikiEntity } from '../entities';
import { createQuizItem, createQuiz, createWikiEntity } from './validate-schema';

export interface IValidator<T> {
    create(data: T): T
    update(data: T): T
}

export class Validator<T> implements IValidator<T> {

    constructor(private createSchema: ObjectSchema, private updateSchema?: ObjectSchema) {

    }

    create(data: T, options?: ValidationOptions): T {
        return this.validate(this.createSchema, data, options);
    }

    update(data: T, options?: ValidationOptions): T {
        if (this.updateSchema) {
            return this.validate(this.updateSchema, data, options);
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

export class QuizItemValidator extends Validator<QuizItem> {
    constructor() {
        super(createQuizItem);
    }

    private static _instance: QuizItemValidator;

    static get instance() {
        if (!QuizItemValidator._instance) {
            QuizItemValidator._instance = new QuizItemValidator();
        }

        return QuizItemValidator._instance;
    }
}

export class QuizValidator extends Validator<Quiz> {
    constructor() {
        super(createQuiz);
    }

    private static _instance: QuizValidator;

    static get instance() {
        if (!QuizValidator._instance) {
            QuizValidator._instance = new QuizValidator();
        }

        return QuizValidator._instance;
    }
}

export class WikiEntityValidator extends Validator<WikiEntity> {
    constructor() {
        super(createWikiEntity);
    }

    private static _instance: WikiEntityValidator;

    static get instance() {
        if (!WikiEntityValidator._instance) {
            WikiEntityValidator._instance = new WikiEntityValidator();
        }

        return WikiEntityValidator._instance;
    }
}
