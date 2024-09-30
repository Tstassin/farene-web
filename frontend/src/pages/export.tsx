import { Alert, AlertIcon, Box, Button, FormControl, FormLabel, Heading, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useRef } from 'react'
import { OrderItem } from '../../../backend/src/services/order-items/order-items.schema'
import { useWeekSelector, WeekSelector } from '../components/filters/week-selector'
import { useOrderItems } from '../queries/order-items'
import { useOrders, useOrdersExport } from '../queries/orders'

export const ExportPage = () => {
  const downloadButtonRef = useRef<HTMLAnchorElement>(null)
  const { week, onChange, weeksISO } = useWeekSelector()
  const startOfWeekIso = dayjs(week).toISOString()
  const endOfWeekIso = dayjs(week).endOf('w').toISOString()
  const ordersExportMutation = useOrdersExport({ $gte: startOfWeekIso, $lte: endOfWeekIso })
  const allPayedOrdersQuery = useOrders({ paymentSuccess: 1, 'delivery': { $gte: startOfWeekIso, $lte: endOfWeekIso }, $limit: 250 }, Boolean(startOfWeekIso))
  const allOrderItemsQuery = useOrderItems({ orderId: { $in: allPayedOrdersQuery.data?.data?.map(o => o.id) }, $limit: 250 }, Boolean(startOfWeekIso && allPayedOrdersQuery.isSuccess && allPayedOrdersQuery.data.total > 0))

  let totalAmount = 0
  const productsAmountsOrdered =
    allOrderItemsQuery?.data?.data?.reduce((acc: Record<OrderItem['product']['sku'], number>, curr) => {
      acc[curr.product.sku] = (acc[curr.product.sku] ?? 0) + curr.amount
      totalAmount += curr.amount
      return acc
    }, {})


  if (ordersExportMutation.data && downloadButtonRef.current) {
    const { csv } = ordersExportMutation.data
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8,' })
    const objUrl = URL.createObjectURL(blob)
    downloadButtonRef.current.href = objUrl
    downloadButtonRef.current.download = `eshop-export-${new Date()}.csv`
  }

  return (
    <>
      <Box my={5}>
        <Heading>Commandes cette semaine</Heading>
      </Box>

      <Box mb={10}>
        <FormControl>
          <FormLabel>Choisir le semaine de livraison</FormLabel>
          <WeekSelector
            value={week}
            onChange={
              (e) => {
                ordersExportMutation.reset()
                onChange(e)
              }
            }
            weeksISO={weeksISO}
          />
        </FormControl>
      </Box>
      {
        allOrderItemsQuery.data && (
          allOrderItemsQuery?.data?.total > allOrderItemsQuery?.data?.limit && (
            <Alert status='warning'>
              <AlertIcon />
              Attention ! Il y a plus de 250 produits commandés cette semaine !<br />
              Ils ne sont pas tous affichés
            </Alert>
          )
        )
      }
      <Box my={5}>
        <TableContainer>
          <Table size='sm'>
            <Thead>
              <Tr>
                <Th>
                  SKU
                </Th>
                <Th>
                  Quantité
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {
                productsAmountsOrdered && Object.keys(productsAmountsOrdered)?.map(sku => <Tr><Td>{sku}</Td><Td>{productsAmountsOrdered?.[sku]}</Td></Tr>)
              }
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Total</Th>
                <Th>{totalAmount}</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </Box>

      <Box mb={10}>
        <Heading>Export des commandes</Heading>
      </Box>
      <ul>
        <li>{totalAmount} items dans les commandes de la semaine</li>
        {ordersExportMutation.isSuccess ? <li>{ordersExportMutation.data?.total} items dans le tableau exporté</li> : undefined}
      </ul>
      <br />
      <br />
      <Box mb={10}>
        {!ordersExportMutation.isSuccess && <Button isLoading={ordersExportMutation.isLoading} onClick={() => ordersExportMutation.mutate()}>Démarrer l'export</Button>}
        <Button visibility={ordersExportMutation.isSuccess ? 'visible' : 'hidden'} as='a' disabled={Boolean(!ordersExportMutation.isSuccess)} download ref={downloadButtonRef}>Télécharger</Button>
      </Box>
      {
        ordersExportMutation.data && ordersExportMutation.data.forCsv.length > 0 && (
          <TableContainer>
            <Table size='sm'>
              <Thead>
                <Tr>
                  {Object.keys(ordersExportMutation.data.forCsv[0]).map(key => <Th key={key}>{key}</Th>)}
                </Tr>
              </Thead>
              <Tbody>
                {ordersExportMutation.data.forCsv.map(row => <Tr>{Object.keys(row).map(key => <Td>{row[key]}</Td>)}</Tr>)}
              </Tbody>
            </Table>
          </TableContainer>
        )
      }
    </>
  )
}