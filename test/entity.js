
const { WikiEntity, EntityCreate } = require('../lib');
const assert = require('assert');
const Bluebird = require('bluebird');

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

describe('Entity', function () {
    describe('CreateEntity', function () {
        it('should create a valid wiki entity', function () {
            return createEntity.execute({ id: 'Q1', lang: 'ro', label: 'Moldova' });
        })
        it('should NOT create a null entity', function () {
            return createEntity.execute(null).then(() => { assert.fail() }, e => assert.ok(e));
        })
    })
})

function fakePromise(error, data) {
    if (error) {
        return Bluebird.reject(error)
    }
    return Bluebird.resolve(data)
}