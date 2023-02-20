// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app'

describe('order-items service', () => {
  it('registered the service', () => {
    const service = app.service('order-items')

    assert.ok(service, 'Registered the service')
  })
})
