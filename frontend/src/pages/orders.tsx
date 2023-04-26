import { Box, Button, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import dayjs from "dayjs";
import fr from 'dayjs/locale/fr'
import timezone from 'dayjs/plugin/timezone'
import { Order } from "../../../backend/src/services/orders/orders.schema";
import { useOrders } from "../queries/orders";
dayjs.extend(timezone)

type TableKeys = keyof Order | 'edit'

export const Orders = () => {
  const ordersQuery = useOrders({ paymentSuccess: 1 })

  const tableKeys: Array<TableKeys> = ['userId', 'createdAt', 'delivery', 'paymentIntent', 'price', 'edit']
  const getValue = (order: Order, key: TableKeys) => {
    switch (key) {
      case 'createdAt':
        return dayjs(order[key]).locale(fr).format('dddd DD MMMM')
      case 'delivery':
        return dayjs(order[key]).locale(fr).format('dddd DD MMMM')
      case 'paymentIntent':
        return order[key] ? 'stripe' : 'code'
      case 'price':
        return order[key]
      case 'edit':
        return <Button size='sm'>modifier</Button>
      default:
        return order[key].toString()
    }
  }

  return (
    <>
      <Box mb={10}>
        <Heading>Historique des commandes</Heading>
      </Box>
      <Box>
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
    </>
  )
}