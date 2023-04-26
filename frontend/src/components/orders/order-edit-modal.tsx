import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { useOrder } from "../../queries/orders"
import { QueryStatus } from "../queries/query-status"
import { UpdateOrder } from "./order-update"

export const OrderEditModal = ({ showOrder, setShowOrder }: { showOrder?: number, setShowOrder: ((product: number | undefined) => void) }) => {
  const orderQuery = useOrder(showOrder)

  return (
    <Modal isOpen={Boolean(showOrder)} onClose={() => setShowOrder(undefined)}>
      <ModalOverlay />
      <ModalContent>
        <QueryStatus query={orderQuery}>
          <ModalHeader>Modifier la commande</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {orderQuery.isSuccess && <UpdateOrder id={orderQuery.data.id} />}
          </ModalBody>
          <ModalFooter />
        </QueryStatus>
      </ModalContent>
    </Modal>
  )
}