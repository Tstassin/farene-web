import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { useState } from "react"
import { Place } from "../../../../backend/src/services/places/places.schema"
import { useAllPlaces, usePlace, usePlaceRemoveMutation } from "../../queries/places"
import { QueryStatus } from "../queries/query-status"
import { CreatePlace } from "./create"
import { UpdatePlace } from "./update"

export const PlacesList = () => {
  const allPlacesQuery = useAllPlaces()
  const placeRemoveMutation = usePlaceRemoveMutation()
  const [showUpdateModalValue, setShowUpdateModalValue] = useState<Place['id']>()
  const currentPlaceQuery = usePlace(showUpdateModalValue)
  {console.log(allPlacesQuery)}
  return (
    <QueryStatus query={allPlacesQuery}>
      <ul>
        {allPlacesQuery.data?.map(place => <li key={place.id}>
          {place.name} 
          {/* <Button ml={5} size={'xs'} onClick={() => placeRemoveMutation.mutate(place.id)}>Supprimer</Button> */}
          <Button ml={5} size={'xs'} onClick={() => setShowUpdateModalValue(place.id)}>Modifier</Button><br />
          <i>{place.description}</i>
        </li>)}
      </ul>
      <Modal isOpen={Boolean(showUpdateModalValue)} onClose={() => setShowUpdateModalValue(undefined)}>
        <ModalOverlay />
        <ModalContent>
          <QueryStatus query={currentPlaceQuery}>
          <ModalHeader>Lieu : { currentPlaceQuery.data?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {currentPlaceQuery.isSuccess && <UpdatePlace id={currentPlaceQuery.data.id} />}
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