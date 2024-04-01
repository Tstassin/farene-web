import { Order } from "../services/orders/orders.schema";
import { User } from "../services/users/users.schema";
import { Notification} from "../services/notifications/notifications.schema"
import { calculateOrderPrice } from "../services/orders/orders.utils";
import dayjs from "dayjs";
import fr from 'dayjs/locale/fr'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { app } from "../app";
import { logErrorToConsole } from "./log-error";

dayjs.extend(utc)
dayjs.extend(timezone)

export const sendPaymentSuccess = async (user: User, order: Order, receipt_url?: string) => {
  const links: Notification['links'] = []
  if (receipt_url) {
    links.push({
      text: 'Reçu de votre paiement',
      url: receipt_url
    })
  }
  try {
    await app.service('notifications').create({
      from: app.get('notifications').postmark.sender.email,
      to: user.email,
      subject: '250° - Votre commande',
      body: 'Votre commande a bien été reçue'
        + '<br>'
        + '<br>'
        + 'Détail de la commande :'
        + '<br>'
        + order.orderItems.map(orderItem => `${orderItem.amount} x ${orderItem.product.name}`).join('<br>')
        + '<br>'
        + '<br>'
        + 'Prix Total :'
        + '<br>'
        + await calculateOrderPrice(order) + ' €'
        + '<br>'
        + '<br>'
        + "Date d'enlèvement :"
        + '<br>'
        + dayjs(order.delivery, 'YYYY-MM-DD').tz('Europe/Paris').locale(fr).format('dddd DD MMMM')
        + '<br>'
        + "Lieu :"
        + '<br>' + order.deliveryPlace
        + '<br>'
        + '<br>'
        + "Les informations pour le lieu et l'horaire d'enlèvement sont détaillées sur le site web",
      links
    })
  } catch (error: any) {
    // We do not throw the error to the user
    // Move to error-hook
    logErrorToConsole(error)
  }
};