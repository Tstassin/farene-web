import * as sinon from 'sinon'
import { NotificationService } from "../../src/services/notifications/notifications.class";
import { Models, Message } from "postmark";
import { randomUUID } from "crypto";

export const noEmails = async () => {
  const _sendEmailStub = sinon.stub(NotificationService.prototype, '_sendEmail').callsFake(async (email: Message) => {
    if (!email.To) throw new Error('No email provided ')
    const postMarkMailSuccess: Models.MessageSendingResponse = {
      To: email.To,
      SubmittedAt: new Date().toISOString(),
      MessageID: randomUUID(),
      ErrorCode: 0,
      Message: 'OK'
    }
    return postMarkMailSuccess
  })
};
