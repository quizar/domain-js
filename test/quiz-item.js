
const { QuizItemUseCases, WikiEntityUseCases, QuizItem } = require('../lib')
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

const quizItemUseCases = new QuizItemUseCases(new Repository(), new WikiEntityUseCases(new Repository()))

describe('QuizItem', function () {
    const rep = new Repository();
    describe('Add a QuizItem', function () {
        it('should add a QuizItem', function () {
            return quizItemUseCases.create({ subject: { id: '1', lang: 'ro', label: 'Moldova', instanceId: 'P12' }, property: { id: 'P12' }, value: { type: 'S', data: 'a' } }, rep);
        })
        it('should not add a QuizItem', function () {
            return quizItemUseCases.create(null, rep).then(() => { assert.fail() }, e => assert.ok(e));
        })
    })
})

function fakePromise(error, data) {
    if (error) {
        return Bluebird.reject(error)
    }
    return Bluebird.resolve(data)
}