import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { useState } from "react"
import { Product } from "../../../../backend/src/services/products/products"
import { useAllCategories } from "../../queries/categories"
import { useAllProducts, useProduct, useProductRemoveMutation } from "../../queries/products"
import { QueryStatus } from "../queries/query-status"
import { UpdateProduct } from "./update"

export const ProductsList = () => {
  const allProductsQuery = useAllProducts()
  const allCategoriesQuery = useAllCategories()
  const productRemoveMutation = useProductRemoveMutation()
  const [showUpdateModalValue, setShowUpdateModalValue] = useState<Product['id']>()
  const currentProductQuery = useProduct(showUpdateModalValue)

  return (
    <QueryStatus query={allProductsQuery}>
      <ul>
        {allProductsQuery.data?.map(product => <li key={product.id}>
          {product.disabled ? 'X ' : '✓ '}
          [{product.sku}]{' '}
          {product.name}
          {/* <Button ml={5} size={'xs'} onClick={() => productRemoveMutation.mutate(product.id)}>Supprimer</Button> */}
          <Button ml={5} size={'xs'} onClick={() => setShowUpdateModalValue(product.id)}>Modifier</Button>
        </li>)}
      </ul>
      <Modal isOpen={Boolean(showUpdateModalValue)} onClose={() => setShowUpdateModalValue(undefined)}>
        <ModalOverlay />
        <ModalContent>
          <QueryStatus query={currentProductQuery}>
            <ModalHeader>Produit: {currentProductQuery.data?.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {currentProductQuery.isSuccess && <UpdateProduct id={currentProductQuery.data.id} />}
            </ModalBody>
            <ModalFooter />
          </QueryStatus>
        </ModalContent>
      </Modal>
    </QueryStatus>
  )
}