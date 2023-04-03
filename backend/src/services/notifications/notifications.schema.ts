// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const notificationSchema = Type.Object(
  {
    id: Type.Number(),
    from: Type.String(),
    to: Type.String(),
    subject: Type.String(),
    body: Type.String(),
    links: Type.Optional(
      Type.Array(
        Type.Object({
          text: Type.String(),
          url: Type.String()
        })
      )
    )
  },
  { $id: 'Notification', additionalProperties: false }
)
export type Notification = Static<typeof notificationSchema>
export const notificationValidator = getValidator(notificationSchema, dataValidator)
export const notificationResolver = resolve<Notification, HookContext>({})

export const notificationExternalResolver = resolve<Notification, HookContext>({})

// Schema for creating new entries
export const notificationDataSchema = Type.Omit(notificationSchema, ['id'], {
  $id: 'NotificationData'
})
export type NotificationData = Static<typeof notificationDataSchema>
export const notificationDataValidator = getValidator(notificationDataSchema, dataValidator)
export const notificationDataResolver = resolve<Notification, HookContext>({})