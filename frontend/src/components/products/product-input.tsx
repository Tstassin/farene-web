import { Box, Button, Collapse, Divider, Input, InputGroup, InputRightAddon, Slide, Text, useDisclosure } from "@chakra-ui/react"
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
    name: "orderItems",
  });
  const isProductSelected = fields.some(field => field.productId === product.id)
  const fieldArrayIndex = fields.findIndex(field => field.productId === product.id)
  const amount = watch(`orderItems.${fieldArrayIndex}.amount`)
  const price = product.price
  const total = product.price * amount

  return (
    <Box mb={3}>
      <Box>
        <Box display='flex' mb={1} >
          <Box flex={1}>
            <ProductInputDetails product={product} onToggle={onToggle} />
          </Box>
          <Box display={'flex'} height='fit-content'>
            <Box>
              {
                isProductSelected &&
                <ProductInputRemoveButton product={product} remove={remove} fieldArrayIndex={fieldArrayIndex} />
              }
            </Box>
            <Box ml={3}>
              {
                isProductSelected &&
                <Box>
                  <InputGroup size='sm'>
                    <ProductQuantityInput register={register} fieldArrayIndex={fieldArrayIndex} />
                  </InputGroup>
                </Box>
              }
            </Box>
            <Box ml={3}>
              {
                !isProductSelected &&
                <ProductInputAddButton product={product} append={append} />
              }
            </Box>
            {
              isProductSelected && (
                <Box ml={3} display='flex'>
                  <Text as='b' fontSize={'xl'}>{total}€</Text>
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
      <Text>Poid: {product.weight}g</Text>
      <Text>Prix: {product.price}€</Text>
      <Box my={3}>
        <Button variant='outline' onClick={onToggle} size='xs' mr={1} flexGrow={0}>Détails</Button>
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
      size='sm'
      onClick={() => {
        remove(fieldArrayIndex)
      }}>
      Supprimer
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
      size='sm'
      textAlign='center'
      type='number'
      maxW={'50px'}
      minW={'50px'}
      min={1}
      max={99}
      defaultValue={1}
      {...register(
        `orderItems.${fieldArrayIndex}.amount`,
        {
          valueAsNumber: true
        }
      )}
    />
  )
}