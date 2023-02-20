import { createClient } from '../../backend/src/client'
import rest from '@feathersjs/rest-client'

const fetch = window.fetch.bind(window)
const connection = rest('http://localhost:3030').fetch(fetch)
export const client = createClient(connection)