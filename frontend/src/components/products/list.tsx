import { Button, Checkbox, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Skeleton } from "@chakra-ui/react"
import { SortableContext, SortableData, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useState } from "react"
import { Product } from "../../../../backend/src/services/products/products"
import { useAllProducts, useProduct, useProductPatchMutation, useProductRemoveMutation } from "../../queries/products"
import { RequestButton } from "../elements/request-button"
import { QueryStatus } from "../queries/query-status"
import { UpdateProduct } from "./update"
import { CSS } from '@dnd-kit/utilities';
import { DataRef, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"

const move = (array: number[], from: number, to: number) => {
  array.splice(to, 0, array.splice(from, 1)[0]);
};

export const ProductsList = () => {
  const allProductsQuery = useAllProducts()
  const productRemoveMutation = useProductRemoveMutation()
  const productPatchMutation = useProductPatchMutation()
  const [showUpdateModalValue, setShowUpdateModalValue] = useState<Product['id']>()
  const currentProductQuery = useProduct(showUpdateModalValue)
  const [isDeletionConfirmed, setIsDeletionConfirmed] = useState<Product['id']>()

  const sensors = useSensors(
    useSensor(PointerSensor),
  );

  const hangleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over?.id && active.data && over.data && active.id !== over.id) {
      const activeData = active.data as DataRef<SortableData>
      const overData = over.data as DataRef<SortableData>
      if (activeData.current?.sortable && overData.current?.sortable) {
        const items = [...activeData.current.sortable.items] as number[]
        move(items, activeData.current.sortable.index, overData.current?.sortable.index)
        for (let [index, productId] of items.entries()) {
          if (allProductsQuery.data?.find(p => p.id === productId)?.sortOrder !== index) {
            await productPatchMutation.mutateAsync({ id: productId, sortOrder: index })
          }
        }
      }
    }
  }

  return (
    <QueryStatus query={allProductsQuery}>
      <DndContext sensors={sensors} onDragEnd={hangleDragEnd}>
        <SortableContext strategy={verticalListSortingStrategy} items={allProductsQuery.data ?? []}>
          <Skeleton isLoaded={!productPatchMutation.isLoading}>
            <ul>
              {allProductsQuery.data?.map(product => (
                <ProductItem product={product} setShowUpdateModalValue={setShowUpdateModalValue} key={product.id} />
              ))}
            </ul>
          </Skeleton>
        </SortableContext>
      </DndContext>
      {
        currentProductQuery.isSuccess &&
        <Modal isOpen={Boolean(showUpdateModalValue)} onClose={() => setShowUpdateModalValue(undefined)}>
          <ModalOverlay />
          <ModalContent>
            <QueryStatus query={currentProductQuery}>
              <ModalHeader>Produit: {currentProductQuery.data.name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <UpdateProduct id={currentProductQuery.data.id} />
              </ModalBody>
              <ModalFooter>
                <Checkbox onChange={(e) => setIsDeletionConfirmed(e.target.checked ? currentProductQuery.data.id : undefined)}>Supprimer</Checkbox>
                {
                  isDeletionConfirmed === currentProductQuery.data.id &&
                  <RequestButton
                    query={productRemoveMutation}
                    ml={5}
                    size={'xs'}
                    onClick={() => productRemoveMutation.mutate(currentProductQuery.data.id)}
                  >
                    Confirmer la suppression
                  </RequestButton>
                }
              </ModalFooter>
            </QueryStatus>
          </ModalContent>
        </Modal>
      }
    </QueryStatus >
  )
}

const ProductItem = (
  { product, setShowUpdateModalValue }:
    { product: Product, setShowUpdateModalValue: (value: React.SetStateAction<number | undefined>) => void }
) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes}>
      <span {...listeners}>
        {product.disabled ? 'X ' : '✓ '}
        [{product.sku}]{' '}
        {product.name}
      </span>
      <Button ml={5} size={'xs'} onClick={(e) => { setShowUpdateModalValue(product.id) }}>Modifier</Button>
    </li>
  )
}