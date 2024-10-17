// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app'

const service = app.service('assets')

describe('assets service', () => {

  it('registered the service', () => {

    assert.ok(service, 'Registered the service')
  })
  
})
