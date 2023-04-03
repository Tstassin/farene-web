// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import type {
  Notification,
  NotificationData,
  NotificationPatch,
  NotificationQuery
} from './notifications.schema'

export type { Notification, NotificationData, NotificationPatch, NotificationQuery }

export interface NotificationServiceOptions {
  app: Application
}

export interface NotificationParams extends Params<NotificationQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class NotificationService<ServiceParams extends NotificationParams = NotificationParams>
  implements ServiceInterface<Notification, NotificationData, ServiceParams, NotificationPatch>
{
  constructor(public options: NotificationServiceOptions) {}

  async find(_params?: ServiceParams): Promise<Notification[]> {
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<Notification> {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }

  async create(data: NotificationData, params?: ServiceParams): Promise<Notification>
  async create(data: NotificationData[], params?: ServiceParams): Promise<Notification[]>
  async create(
    data: NotificationData | NotificationData[],
    params?: ServiceParams
  ): Promise<Notification | Notification[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: NotificationData, _params?: ServiceParams): Promise<Notification> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: NotificationPatch, _params?: ServiceParams): Promise<Notification> {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<Notification> {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
