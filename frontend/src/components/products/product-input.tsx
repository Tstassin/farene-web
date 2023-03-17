import { Box, Button, Collapse, Divider, Input, Slide, Text, useDisclosure } from "@chakra-ui/react"
import { useState } from "react"
import { useFieldArray, UseFieldArrayAppend, UseFieldArrayRemove, useFormContext, UseFormRegister } from "react-hook-form"
import { OrderData } from "../../../../backend/src/services/orders/orders.schema"
import { Product } from "../../../../backend/src/services/products/products.schema"

interface OrderInputProps {
  product: Product
}

export const ProductInput = ({ product }: OrderInputProps) => {
  const { isOpen, onToggle } = useDisclosure()
  const { control, register, watch } = useFormContext<OrderData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });
  const isProductSelected = fields.some(field => field.productId === product.id)
  const fieldArrayIndex = fields.findIndex(field => field.productId === product.id)
  const amount = watch(`products.${fieldArrayIndex}.amount`)
  const price = product.price
  const total = product.price * amount

  return (
    <Box mb={3}>
      <Box borderLeft={`4px solid ${isProductSelected ? 'rgb(226, 232, 240)' : 'white'}`} p={3}>
        <Box display='flex' justifyContent='space-between' mb={1} >
          <ProductInputDetails product={product} onToggle={onToggle} />
          <Box display='flex' flexDirection='column' alignItems='flex-end'>
            <Box>
              {
                !isProductSelected
                  ?
                  <ProductInputAddButton product={product} append={append} />
                  :
                  <ProductInputRemoveButton product={product} remove={remove} fieldArrayIndex={fieldArrayIndex} />
              }
            </Box>
            {
              isProductSelected && (
                <Box display='flex' alignItems='center' marginTop='auto'>
                  <ProductQuantityInput register={register} fieldArrayIndex={fieldArrayIndex} />
                  <Box as='span'>&nbsp;
                    {` x ${price}€ = `}
                    <b>{total}€</b>
                  </Box>
                </Box>
              )
            }
          </Box>
        </Box>
        <Collapse in={isOpen} animateOpacity>
          <Box>
            {product.description}
          </Box>
        </Collapse>
      </Box>
      <Divider />
    </Box>
  )
}

interface ProductInputDetailsProps {
  product: Product
  onToggle: () => void
}

const ProductInputDetails = ({ product, onToggle }: ProductInputDetailsProps) => {
  return (
    <Box display='flex' flexDirection='column' mr={3}>
      <Text as='b'>
        {product.name}
      </Text>
      <Box marginTop='auto'>
        <Button variant='outline' onClick={onToggle} size='xs' mr={1}>Détails</Button>
        <Text as='span'>
          {product.price}€
        </Text>
      </Box>
    </Box>
  )
}

interface ProductInputAddButtonProps {
  product: Product
  append: UseFieldArrayAppend<OrderData>
}

const ProductInputAddButton = ({ product, append }: ProductInputAddButtonProps) => {

  return (
    <Button
      size='sm'
      onClick={() => {
        append({ amount: 1, productId: product.id })
      }}>
      Ajouter
    </Button>
  )
}

interface ProductInputRemoveButtonProps {
  product: Product
  remove: UseFieldArrayRemove
  fieldArrayIndex: number
}

const ProductInputRemoveButton = ({ product, remove, fieldArrayIndex }: ProductInputRemoveButtonProps) => {

  return (
    <Button
      size='xs'
      onClick={() => {
        remove(fieldArrayIndex)
      }}>
      X
    </Button>
  )
}

interface ProductQuantityInputProps {
  fieldArrayIndex: number
  register: UseFormRegister<OrderData>
}

const ProductQuantityInput = ({ fieldArrayIndex, register }: ProductQuantityInputProps) => {
  console.log(fieldArrayIndex)

  return (
    <Input
      textAlign='right'
      type='number'
      maxW={'50px'}
      min={1}
      max={99}
      size='sm'
      defaultValue={1}
      {...register(
        `products.${fieldArrayIndex}.amount`,
        {
          valueAsNumber: true
        }
      )}
    />
  )
}