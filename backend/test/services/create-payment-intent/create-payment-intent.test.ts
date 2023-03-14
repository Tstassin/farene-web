// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app'

describe('create-payment-intent service', () => {
  it('registered the service', () => {
    const service = app.service('create-payment-intent')

    assert.ok(service, 'Registered the service')
  })
})
