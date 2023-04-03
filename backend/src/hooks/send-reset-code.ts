// For more information about this file see https://dove.feathersjs.com/guides/cli/log-error.html
import { app } from "../app";
import { User } from "../services/users/users.schema";
import { logErrorToConsole } from "./log-error";

export const sendResetCodeEmail = async (user: User) => {
  try {
    await app.service('notifications').create({
      from: app.get('notifications').postmark.sender.email,
      to: user.email,
      subject: 'Farène - Réinitialisation de votre mot de passe',
      body: `Utilisez le code suivant pour réinitialiser votre mot de passe : ${user.resetCode}`
    })
  } catch (error: any) {
    // We do not throw the error to the user
    // Move to error-hook
    logErrorToConsole(error)
  }
};