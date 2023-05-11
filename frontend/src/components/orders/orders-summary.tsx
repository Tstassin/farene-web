import { Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from "@chakra-ui/react"
import type { OrdersSummary } from "../../../../backend/src/services/orders/orders.shared"
import { eur } from "../../../../shared/prices"

interface OrdersSummaryProps {
  ordersSummary: OrdersSummary
}

export const OrdersSummaryTable = ({ ordersSummary }: OrdersSummaryProps) => {

  return (
    <>
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
              ordersSummary.orderItems.map(item => <Tr>
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
              <Th>{ordersSummary.amount} (total)</Th>
              <Th>{eur(ordersSummary.price)} (total)</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </>
  )
}