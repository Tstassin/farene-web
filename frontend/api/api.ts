import { createClient } from '../../backend/src/client'
import rest from '@feathersjs/rest-client'

export const apiHostname = process.env.API_HOSTNAME || 'http://localhost:3030'

const fetch = window.fetch.bind(window)
const connection = rest(apiHostname).fetch(fetch)
export const client = createClient(connection)