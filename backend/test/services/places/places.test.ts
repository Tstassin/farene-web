// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app'
import { describe } from 'mocha'
import { assertRejects } from '../../utils/assert-rejects'
import { BadRequest } from '@feathersjs/errors/lib'
import { cleanAll } from '../../utils/clean-all'

const placeMock = { name: 'OFFBar', description: 'Rue Emile Franqui 6, 1435 Mont-Saint-Guibert' }

describe('places service', () => {
  it('registered the service', () => {
    const service = app.service('places')

    assert.ok(service, 'Registered the service')
  })
  describe('Create', () => {
    beforeEach(cleanAll)
    it('creates a place', async () => {
      const service = app.service('places')
      const offbar = await service.create({ name: 'OFFBar', description: 'Rue Emile Franqui 6, 1435 Mont-Saint-Guibert' })
      assert.equal(offbar.name, 'OFFBar')
      assert.equal(offbar.description, 'Rue Emile Franqui 6, 1435 Mont-Saint-Guibert')
    })
    it('requires a name', async () => {
      const service = app.service('places')
      // @ts-expect-error no name provided
      const createFn = () => service.create({ description: 'Rue Emile Franqui 6, 1435 Mont-Saint-Guibert' })
      await assertRejects(createFn, BadRequest, "validation failed")
    })

    it('requires a description', async () => {
      const service = app.service('places')
      // @ts-expect-error no description provided
      const createFn = () => service.create({ name: 'OFFBar', })
      await assertRejects(createFn, BadRequest, "validation failed")
    })
    it('Doesnt allow the same name to be duplicated', async () => {
      const service = app.service('places')
      await service.create({ name: 'OFFBar', description: 'Rue Emile Franqui 6, 1435 Mont-Saint-Guibert' })
      const createFn = () => service.create({...placeMock})
      await assertRejects(createFn, BadRequest, "A place with the same name already exists")
    })
  })
  describe('Update', () => {
    beforeEach(cleanAll)
    it('Updates a place name', async () => {
      const service = app.service('places')
      const created = await service.create({ name: 'OFFBar', description: 'Rue Emile Franqui 6, 1435 Mont-Saint-Guibert' })
      const updated = await service.patch(created.id, { name: 'offbar' })
      assert.equal(updated.name, 'offbar')
    })
    it('updates a place description', async () => {
      const service = app.service('places')
      const created = await service.create({ name: 'OFFBar', description: 'Rue Emile Franqui 6, 1435 Mont-Saint-Guibert' })
      const updated = await service.patch(created.id, { description: 'Emile Franqui Street 6, 1435 Mont-Saint-Guibert' })
      assert.equal(updated.description, 'Emile Franqui Street 6, 1435 Mont-Saint-Guibert')
    })
  })
})
