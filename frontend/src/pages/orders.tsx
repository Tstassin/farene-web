import { Box, FormControl, FormLabel, Heading } from "@chakra-ui/react";
import dayjs from "dayjs";
import { dayLabel, isoDateFormat } from "../../../backend/src/utils/dates";
import { useWeekSelector, WeekSelector } from "../components/filters/week-selector";
import { OrdersList } from "../components/orders/orders-list";
import { OrdersSummaryTable } from "../components/orders/orders-summary";
import { useOrderDates, useOrders, useOrdersSummary } from "../queries/orders";


export const Orders = () => {
  const [week, onChange] = useWeekSelector()
  const orderDatesQuery = useOrderDates()
  const weekDate = orderDatesQuery.data?.weeks?.[week]
  const weekDateLabel = weekDate ? dayLabel(weekDate) : ''
  const ordersQueryPayload = { paymentSuccess: 1, delivery: { $gte: weekDate, $lte: dayjs(weekDate).add(1, 'week').format(isoDateFormat) } }
  const ordersQuery = useOrders(ordersQueryPayload, Boolean(weekDate))
  const orderSummaryQuery = useOrdersSummary(ordersQueryPayload, Boolean(weekDate))

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