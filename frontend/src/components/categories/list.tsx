import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { useState } from "react"
import { Category } from "../../../../backend/src/services/categories/categories.schema"
import { useAllCategories, useCategory, useCategoryRemoveMutation } from "../../queries/categories"
import { QueryStatus } from "../queries/query-status"
import { CreateCategory } from "./create"
import { UpdateCategory } from "./update"

export const CategoriesList = () => {
  const allCategoriesQuery = useAllCategories()
  const categoryRemoveMutation = useCategoryRemoveMutation()
  const [showUpdateModalValue, setShowUpdateModalValue] = useState<Category['id']>()
  const currentCategoryQuery = useCategory(showUpdateModalValue)
  return (
    <QueryStatus query={allCategoriesQuery}>
      <ul>
        {allCategoriesQuery.data?.map(category => <li key={category.id}>
          {category.name}
          {/* <Button ml={5} size={'xs'} onClick={() => categoryRemoveMutation.mutate(category.id)}>Supprimer</Button> */}
          <Button ml={5} size={'xs'} onClick={() => setShowUpdateModalValue(category.id)}>Modifier</Button>
        </li>)}
      </ul>
      <Modal isOpen={Boolean(showUpdateModalValue)} onClose={() => setShowUpdateModalValue(undefined)}>
        <ModalOverlay />
        <ModalContent>
          <QueryStatus query={currentCategoryQuery}>
          <ModalHeader>Catégorie: { currentCategoryQuery.data?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {currentCategoryQuery.isSuccess && <UpdateCategory id={currentCategoryQuery.data.id} />}
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