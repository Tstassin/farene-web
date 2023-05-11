import { Box, Button, FormControl, FormLabel, Heading, ListItem, Select, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, UnorderedList } from "@chakra-ui/react";
import dayjs from "dayjs";
import fr from 'dayjs/locale/fr';
import timezone from 'dayjs/plugin/timezone';
import { useState } from "react";
import { Order } from "../../../backend/src/services/orders/orders.schema";
import { mult, eur } from "../../../shared/prices";
import { useWeekSelector, WeekSelector } from "../components/filters/week-selector";
import { OrderEditModal } from "../components/orders/order-edit-modal";
import { useOrderDates, useOrders, useOrdersSummary } from "../queries/orders";
dayjs.extend(timezone)

type TableKeys = keyof Order | 'edit'

export const Orders = () => {
  const [week, onChange] = useWeekSelector()
  const orderDatesQuery = useOrderDates()
  const weekDate = orderDatesQuery.data?.weeks?.[week]
  const ordersQueryPayload = { paymentSuccess: 1, delivery: { $gte: weekDate, $lte: dayjs(weekDate).add(1, 'week').format('YYYY-MM-DD') } }
  const ordersQuery = useOrders(ordersQueryPayload, Boolean(weekDate))
  const orderSummaryQuery = useOrdersSummary(ordersQueryPayload, Boolean(weekDate))
  const [currentOrderToEdit, setCurrentOrderToEdit] = useState<Order['id'] | undefined>(undefined)
  const tableKeys: Array<TableKeys> = ['id', 'userId', 'delivery', 'deliveryPlace', 'orderItems', 'paymentIntent', 'price', 'edit']
  const getValue = (order: Order, key: TableKeys) => {
    switch (key) {
      case 'id':
        return order[key]
      case 'createdAt':
        return dayjs(order[key]).locale(fr).format('dddd DD MMMM')
      case 'delivery':
        return dayjs(order[key]).locale(fr).format('dddd DD MMMM')
      case 'paymentIntent':
        return order[key] ? 'stripe' : 'code'
      case 'price':
        return eur(order[key])
      case 'deliveryPlace':
        return order[key]
      case 'edit':
        return <Button size='sm' onClick={() => setCurrentOrderToEdit(order['id'])}>modifier</Button>
      case 'userId':
        return order['user'].email
      case 'orderItems':
        return <UnorderedList styleType={'none'}>{order[key].map(oI => <ListItem>{oI.amount + ' x ' + oI.product.name + ' (' + eur(oI.product.price) + ') = ' + eur(mult(oI.amount, oI.product.price))}</ListItem>)}</UnorderedList>
      default:
        return order[key].toString()
    }
  }

  return (
    <>
      <Box mb={10}>
        <Heading>Historique des livraisons</Heading>
      </Box>
      <Box mb={10}>
        <Heading fontSize={'lg'} mb={5}>Semaine</Heading>
        <WeekSelector value={week} onChange={onChange} />
      </Box>
      <Box mb={10}>
        <Heading fontSize={'lg'} mb={5}>Résumé</Heading>
        {
          orderSummaryQuery.data && (
            <TableContainer>
              <Table size='sm'>
                <Thead>
                  <Tr>
                    <Th>Nom</Th>
                    <Th>Quantité</Th>
                    <Th>Prix</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {
                    orderSummaryQuery.data.orderItems?.map(item => <Tr>
                      <Td>
                        [{item.product.sku}] - {item.product.name}
                      </Td>
                      <Td>
                        {item.amount}
                      </Td>
                      <Td>
                        {eur(item.price)}
                      </Td>
                    </Tr>)
                  }
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th></Th>
                    <Th>{orderSummaryQuery.data?.amount} (total)</Th>
                    <Th>{eur(orderSummaryQuery.data?.price)} (total)</Th>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>
          )
        }
      </Box>
      <Box>
        <Heading fontSize={'lg'} mb={5}>Détail</Heading>
        <TableContainer>
          <Table size={'sm'}>
            <Thead>
              <Tr>
                {tableKeys.map(key => <Th>{key}</Th>)}
              </Tr>
            </Thead>
            <Tbody>
              {
                ordersQuery.isSuccess && ordersQuery.data.data.map(order => {
                  return <Tr>
                    {
                      tableKeys.map(key => {
                        return <Td>{getValue(order, key)}</Td>
                      })
                    }
                  </Tr>
                })
              }
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <OrderEditModal showOrder={currentOrderToEdit} setShowOrder={(id) => setCurrentOrderToEdit(id)} />
    </>
  )
}