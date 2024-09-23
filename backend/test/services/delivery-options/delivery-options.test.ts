// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app'
import { describe } from 'mocha'
import { cleanAll } from '../../utils/clean-all'
import { Place } from '../../../src/services/places/places.schema'
import { getPlaceMock } from '../places/places.mocks'
import dayjs from 'dayjs'
import { isoDateFormat, today } from '../../../src/utils/dates'
import { DeliveryOption } from '../../../src/client'
import { DeliveryOptionService } from '../../../src/services/delivery-options/delivery-options.class'
import { assertRejects } from '../../utils/assert-rejects'
import { BadRequest } from '@feathersjs/errors/lib'

describe('delivery-options service', () => {

  const service = app.service('delivery-options')
  let place: Place

  const useBaseDeliveryOptionsMocks = () => {
    beforeEach(async () => {
      place = await app.service("places").create(getPlaceMock());
    })

    afterEach(cleanAll);
  }
  it('registered the service', () => {
    const service = app.service('delivery-options')

    assert.ok(service, 'Registered the service')
  })
  describe('Find', () => {
    useBaseDeliveryOptionsMocks()
    it('retrieves delivery options without authentication', async () => {
      const service = app.service('delivery-options')
      const deliveryOptions = await service.find({paginate: false, provider: 'rest'})
      assert.equal(deliveryOptions.length, 0)
    })
  })
  describe('Create', () => {
    useBaseDeliveryOptionsMocks()
    it('creates a delivery option', async () => {
      const service = app.service('delivery-options')
      const deliveryOption = await service.create({ placeId: place.id, day: today, from: 9, to: 17, description: 'test' })
      assert.equal(deliveryOption.place.id, place.id)
    })
  })
  describe('Edit', () => {
    useBaseDeliveryOptionsMocks()
    let service: DeliveryOptionService
    let deliveryOption: DeliveryOption
    beforeEach(async () => {
      service = app.service('delivery-options')
      deliveryOption = await service.create({ placeId: place.id, day: today, from: 9, to: 17, description: 'test' })
    })
    it('edits description', async () => {
      const updatedDeliveryOption = await service.patch(deliveryOption.id, { description: 'edit' })
      assert.equal(updatedDeliveryOption.description, 'edit')
    })
    it('edits day', async () => {
      const updatedDeliveryOption = await service.patch(deliveryOption.id, { day: '2023-06-13' })
      assert.equal(updatedDeliveryOption.day, '2023-06-13')
    })
    it('edits from hour', async () => {
      const updatedDeliveryOption = await service.patch(deliveryOption.id, { from: 10 })
      assert.equal(updatedDeliveryOption.from, 10)
    })
    it('edits to hour', async () => {
      const updatedDeliveryOption = await service.patch(deliveryOption.id, { to: 12 })
      assert.equal(updatedDeliveryOption.to, 12)
    })
    it('checks that from hour is before to hour', async () => {
      const updateDeliveryOptionFn = () => service.patch(deliveryOption.id, { to: 8 })
      await assertRejects(updateDeliveryOptionFn, BadRequest, "Error resolving data")
    })
    it('checks that to hour is after from hour', async () => {
      const updateDeliveryOptionFn = () => service.patch(deliveryOption.id, { from: 18 })
      await assertRejects(updateDeliveryOptionFn, BadRequest, "Error resolving data")
    })
  })
})
