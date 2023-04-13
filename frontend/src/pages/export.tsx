import { Box, Button, Heading } from '@chakra-ui/react'
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
      <Box>
        {!ordersExportMutation.isSuccess && <Button isLoading={ordersExportMutation.isLoading} onClick={() => ordersExportMutation.mutate()}>Démarrer l'export</Button>}
        <Button visibility={ordersExportMutation.isSuccess ? 'visible' : 'hidden'} as='a' disabled={Boolean(!ordersExportMutation.isSuccess)} download ref={downloadButtonRef}>Télécharger</Button>
      </Box>
    </>
  )
}