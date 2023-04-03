// For more information about this file see https://dove.feathersjs.com/guides/cli/log-error.html
import { app } from "../app";
import { user } from "../services/users/users";
import { User } from "../services/users/users.schema";
import { logErrorToConsole } from "./log-error";

export const sendNewAccountEmail = async (user: User) => {
  try {
    await app.service('notifications').create({
      from: app.get('notifications').postmark.sender.email,
      to: user.email,
      subject: 'Farène - Votre compte a été créé ',
      body: 'Vous pouvez maintenant commander du pain chaque semaine'
    })
  } catch (error: any) {
    // We do not throw the error to the user
    // Move to error-hook
    logErrorToConsole(error)
  }
};