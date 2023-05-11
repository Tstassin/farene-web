import { Button, ListItem, Table, TableContainer, Tbody, Td, Th, Thead, Tr, UnorderedList } from "@chakra-ui/react"
import { Order } from "../../../../backend/src/services/orders/orders.shared"
import { Paginated } from "@feathersjs/feathers"
import { dayLabel } from "../../../../backend/src/utils/dates"
import { eur, mult } from "../../../../shared/prices"
import { useState } from "react"
import { OrderEditModal } from "./order-edit-modal"

type TableKeys = keyof Order | 'edit'

export const OrdersList = ({orders}: {orders: Paginated<Order>}) => {
  const [currentOrderToEdit, setCurrentOrderToEdit] = useState<Order['id'] | undefined>(undefined)
  const tableKeys: Array<TableKeys> = ['id', 'userId', 'delivery', 'deliveryPlace', 'orderItems', 'paymentIntent', 'price', 'edit']
  const getValue = (order: Order, key: TableKeys) => {
    switch (key) {
      case 'id':
        return order[key]
      case 'createdAt':
        return dayLabel(order[key])
      case 'delivery':
        return dayLabel(order[key])
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
      <TableContainer>
        <Table size={'sm'}>
          <Thead>
            <Tr>
              {tableKeys.map(key => <Th>{key}</Th>)}
            </Tr>
          </Thead>
          <Tbody>
            {
              orders.data.map(order => {
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
      <OrderEditModal showOrder={currentOrderToEdit} setShowOrder={(id) => setCurrentOrderToEdit(id)} />
    </>
  )
}