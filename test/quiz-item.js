
const { QuizItemCreate, EntityCreate, EntityUpdate } = require('../lib')
const assert = require('assert')
const Bluebird = require('bluebird')

class Repository {
    create(data) {
        return fakePromise(null, data);
    }
    update(data) {
        return fakePromise(null, data);
    }
    remove(id) {
        return fakePromise(null, typeof id === 'string');
    }
}

const createEntity = new EntityCreate(new Repository());
const updateEntity = new EntityUpdate(new Repository());
const createQuizItem = new QuizItemCreate(new Repository(), createEntity, updateEntity);

describe('QuizItem', function () {
    describe('Create QuizItem', function () {
        it('should create a valid QuizItem', function () {
            return createQuizItem.execute({
                lang: 'ro',
                entity: { id: 'Q1', lang: 'ro', label: 'Moldova' },
                property: { id: 'P12', type: 'ENTITY', values: [{ value: 'Q2', entity: { id: 'Q2', lang: 'ro', label: 'label' } }] }
            });
        })
        it('should NOT create a null QuizItem', function () {
            return createQuizItem.execute(null).then(() => { assert.fail() }, e => assert.ok(e));
        })
    })
})

function fakePromise(error, data) {
    if (error) {
        return Bluebird.reject(error)
    }
    return Bluebird.resolve(data)
}