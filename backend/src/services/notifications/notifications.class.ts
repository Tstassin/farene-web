// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import type {
  Notification,
  NotificationData,
} from './notifications.schema'

import * as postmark from "postmark"
import { app } from '../../app'
import { MessageSendingResponse } from 'postmark/dist/client/models'

export type { Notification, NotificationData }

export interface NotificationServiceOptions {
  app: Application
}

export interface NotificationParams extends Params { }
let postmarkClient: postmark.ServerClient

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class NotificationService<ServiceParams extends NotificationParams = NotificationParams>
  implements ServiceInterface<MessageSendingResponse, NotificationData, ServiceParams>
{
  constructor(public options: NotificationServiceOptions) {
      postmarkClient = new postmark.ServerClient(app.get('notifications').postmark.key)
      // Will validate the API KEY
      postmarkClient.getServer().catch(err => {
        console.error('error: Please provide a valid PostMark API Key')
        throw err
      })
  }

  async create(data: NotificationData, params?: ServiceParams): Promise<MessageSendingResponse>
  async create(data: NotificationData[], params?: ServiceParams): Promise<MessageSendingResponse[]>
  async create(
    data: NotificationData | NotificationData[],
    params?: ServiceParams
  ): Promise<MessageSendingResponse | MessageSendingResponse[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    const { from, to, subject, body, links } = data

    let htmlBody = body

    htmlBody += '<br /><br />---<br />'
    if (links && links.length > 0) {
      for (const link of links) {
        htmlBody += `<br /><br /><p><a href="${link.url}">${link.text}</a></p>`
      }
    }
    htmlBody += `<br /><br /><p><a href="http://farene.be">Farène microboulangerie</a></p>`

    return await postmarkClient.sendEmail({
      'From': from,
      'To': to,
      'Subject': subject,
      'HtmlBody': htmlBody
    })
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
