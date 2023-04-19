import { Alert, AlertIcon, Box, Button, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { useRef } from 'react'
import { OrderItem } from '../../../backend/src/services/order-items/order-items.schema'
import { useOrderItems } from '../queries/order-items'
import { useOrderDates, useOrdersExport } from '../queries/orders'

export const ExportPage = () => {
  const ordersExportMutation = useOrdersExport()
  const downloadButtonRef = useRef<HTMLAnchorElement>(null)
  const { data: orderDates } = useOrderDates()
  const { thisWeek } = orderDates ?? {}

  const allOrderItemsQuery = useOrderItems({ 'createdAt': { $gte: thisWeek } }, Boolean(thisWeek))
  const productsAmountsOrdered =
    allOrderItemsQuery?.data?.data?.reduce((acc: Record<OrderItem['product']['sku'], number>, curr) => {
      acc[curr.product.sku] = (acc[curr.product.sku] ?? 0) + curr.amount
      return acc
    }, {})


  if (ordersExportMutation.data && downloadButtonRef.current) {
    const { csv } = ordersExportMutation.data
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8,' })
    const objUrl = URL.createObjectURL(blob)
    downloadButtonRef.current.href = objUrl
    downloadButtonRef.current.download = `farene-export-${new Date()}.csv`
  }

  return (
    <>
      <Box my={5}>
        <Heading>Commandes cette semaine</Heading>
      </Box>
      {
        allOrderItemsQuery?.data?.total > allOrderItemsQuery?.data?.limit && (
          <Alert status='warning'>
            <AlertIcon />
            Attention ! Il y a plus de 250 produits commandés cette semaine !
          </Alert>
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
          </Table>
        </TableContainer>
      </Box>
      <Box mb={10}>
        <Heading>Export des commandes</Heading>
      </Box>
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