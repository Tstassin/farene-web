import { Box, Button, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { useRef } from 'react'
import { useOrdersExport } from '../queries/orders'

export const ExportPage = () => {
  const ordersExportMutation = useOrdersExport()
  const downloadButtonRef = useRef<HTMLAnchorElement>(null)

  if (ordersExportMutation.data && downloadButtonRef.current) {
    const { csv } = ordersExportMutation.data
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8,' })
    const objUrl = URL.createObjectURL(blob)
    downloadButtonRef.current.href = objUrl
    downloadButtonRef.current.download = `farene-export-${new Date()}.csv`
  }

  return (
    <>
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