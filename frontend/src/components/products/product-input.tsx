import { Box, Button, Divider, Input, Text } from "@chakra-ui/react"
import {  useFieldArray, UseFieldArrayAppend, UseFieldArrayRemove, useFormContext, UseFormRegister } from "react-hook-form"
import { OrderData } from "../../../../backend/src/services/orders/orders.schema"
import { Product } from "../../../../backend/src/services/products/products.schema"

interface OrderInputProps {
  product: Product
}

export const ProductInput = ({ product }: OrderInputProps) => {
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
      <Box display='flex' justifyContent='space-between' mb={3}>
        <ProductInputDetails product={product} />

        {
          isProductSelected && <ProductQuantityInput register={register} fieldArrayIndex={fieldArrayIndex} />
        }
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
              <Box as='span' marginTop='auto'>
                {`${amount} x ${price}€ = `}
                <b>{total}€</b>
              </Box>
            )
          }
        </Box>
      </Box>
      <Divider />
    </Box>
  )
}

const ProductInputDetails = ({ product }: OrderInputProps) => {
  return (
    <Box display='flex' flexDirection='column' mr={3}>
      <Text as='b'>
        {product.name}
      </Text>
      <Text as='span'>
        {product.price}€
      </Text>
      <Text as='u' fontSize='sm'>
        détails
      </Text>
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
      type='number'
      maxW={'80px'}
      min={1}
      max={99}
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