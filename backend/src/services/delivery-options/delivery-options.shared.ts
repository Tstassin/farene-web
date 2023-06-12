// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  DeliveryOption,
  DeliveryOptionData,
  DeliveryOptionPatch,
  DeliveryOptionQuery,
  DeliveryOptionService
} from './delivery-options.class'

export type { DeliveryOption, DeliveryOptionData, DeliveryOptionPatch, DeliveryOptionQuery }

export type DeliveryOptionClientService = Pick<
  DeliveryOptionService<Params<DeliveryOptionQuery>>,
  (typeof deliveryOptionMethods)[number]
>

export const deliveryOptionPath = 'delivery-options'

export const deliveryOptionMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const deliveryOptionClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(deliveryOptionPath, connection.service(deliveryOptionPath), {
    methods: deliveryOptionMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [deliveryOptionPath]: DeliveryOptionClientService
  }
}
