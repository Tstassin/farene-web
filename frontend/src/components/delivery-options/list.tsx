import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { useState } from "react"
import { DeliveryOption } from "../../../../backend/src/services/delivery-options/delivery-options.schema"
import { getWeekStart, isoDate } from "../../../../backend/src/utils/dates"
import { useAllDeliveryOptions, useDeliveryOption, useDeliveryOptionRemoveMutation, useDeliveryOptions } from "../../queries/delivery-options"
import { QueryStatus } from "../queries/query-status"
import { CreateDeliveryOption } from "./create"
import { DeliveryOptionName } from "./delivery-option-name"
import { UpdateDeliveryOption } from "./update"

export const DeliveryOptionsList = () => {
  const allDeliveryOptionsQuery = useDeliveryOptions({day: {$gte: isoDate(getWeekStart())}})
  const [showUpdateModalValue, setShowUpdateModalValue] = useState<DeliveryOption['id']>()
  const currentDeliveryOptionQuery = useDeliveryOption(showUpdateModalValue)
  return (
    <QueryStatus query={allDeliveryOptionsQuery}>
      <ul>
        {allDeliveryOptionsQuery.data?.map(dO => <li key={dO.id}>
          <Button ml={5} size={'xs'} onClick={() => setShowUpdateModalValue(dO.id)}>Modifier</Button><br />
          <DeliveryOptionName deliveryOption={dO} />
          {/* <Button ml={5} size={'xs'} onClick={() => placeRemoveMutation.mutate(place.id)}>Supprimer</Button> */}
        </li>)}
      </ul>
      <Modal isOpen={Boolean(showUpdateModalValue)} onClose={() => setShowUpdateModalValue(undefined)}>
        <ModalOverlay />
        <ModalContent>
          <QueryStatus query={currentDeliveryOptionQuery}>
            <ModalHeader>Option de livraison : <DeliveryOptionName deliveryOption={currentDeliveryOptionQuery.data!} /></ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {currentDeliveryOptionQuery.isSuccess && <UpdateDeliveryOption id={currentDeliveryOptionQuery.data.id} />}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={() => setShowUpdateModalValue(undefined)}>
                Fermer
              </Button>
            </ModalFooter>
          </QueryStatus>
        </ModalContent>
      </Modal>
    </QueryStatus>
  )
}