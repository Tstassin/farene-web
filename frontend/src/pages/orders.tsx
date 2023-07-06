import { Box, FormControl, FormLabel, Heading } from "@chakra-ui/react";
import dayjs from "dayjs";
import { dayLabel, getNextWeekStart, isoDate, isoDateFormat } from "../../../backend/src/utils/dates";
import { useWeekSelector, WeekSelector } from "../components/filters/week-selector";
import { OrdersList } from "../components/orders/orders-list";
import { OrdersSummaryTable } from "../components/orders/orders-summary";
import { useOrders, useOrdersSummary } from "../queries/orders";


export const Orders = () => {
  const [week, onChange] = useWeekSelector()
  const weekDateLabel = week ? dayLabel(week) : ''
  const ordersQueryPayload = { paymentSuccess: 1, delivery: { $gte: week, $lte: dayjs(week).add(1, 'week').format(isoDateFormat) } }
  const ordersQuery = useOrders(ordersQueryPayload, Boolean(week))
  const orderSummaryQuery = useOrdersSummary(ordersQueryPayload, Boolean(week))

  return (
    <>
      <Box mb={10}>
        <Heading>Historique des livraisons</Heading>
      </Box>
      <Box mb={10}>
        <FormControl>
          <FormLabel>Choisir le semaine de livraison</FormLabel>
          <WeekSelector value={week} onChange={onChange} />
        </FormControl>
      </Box>
      <Box mb={10}>
        <Heading fontSize={'lg'} mb={5}>Résumé des produits à livrer pour la semaine du {weekDateLabel}</Heading>
        {
          orderSummaryQuery.data && (
            <OrdersSummaryTable ordersSummary={orderSummaryQuery.data} />
          )
        }
      </Box>
      <Box>
        <Heading fontSize={'lg'} mb={5}>Détail des produits à livrer pour la semaine du {weekDateLabel}</Heading>
        {
          ordersQuery.data && (
            <OrdersList orders={ordersQuery.data} />
          )
        }
      </Box>
    </>
  )
}