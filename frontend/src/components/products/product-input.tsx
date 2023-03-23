import { Box, Button, Collapse, Divider, Input, InputGroup, InputRightAddon, Slide, Text, useDisclosure } from "@chakra-ui/react"
import { useState } from "react"
import { useFieldArray, UseFieldArrayAppend, UseFieldArrayRemove, UseFieldArrayReturn, useFormContext, UseFormGetValues, UseFormRegister, UseFormSetValue } from "react-hook-form"
import { OrderData } from "../../../../backend/src/services/orders/orders.schema"
import { Product } from "../../../../backend/src/services/products/products.schema"

interface OrderInputProps {
  product: Product
  fieldArray: UseFieldArrayReturn<OrderData>
}

export const ProductInput = ({ product, fieldArray }: OrderInputProps) => {
  const { isOpen, onToggle } = useDisclosure()
  const { control, register, watch, setValue, getValues } = useFormContext<OrderData>()
  const { fields, append, remove } = fieldArray
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
                    <ProductQuantityInput register={register} fieldArrayIndex={fieldArrayIndex} getValues={getValues} setValue={setValue} />
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
          <Box pb={5}>
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
      <Text as='b' fontSize={'md'}>
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
  setValue: UseFormSetValue<OrderData>
  getValues: UseFormGetValues<OrderData>
}

const ProductQuantityInput = ({ fieldArrayIndex, register, setValue, getValues }: ProductQuantityInputProps) => {
  const fieldName = `orderItems.${fieldArrayIndex}.amount` as const
  const currentValue = getValues(`orderItems.${fieldArrayIndex}.amount`)
  const min = 1
  const max = 99
  const isMin = currentValue <= min
  const isMax = currentValue >= max

  return (
    <>
      <Button
        size={'sm'}
        isDisabled={isMin}
        onClick={() => setValue(fieldName, currentValue - 1)}
      >
        -
      </Button>
      <Input
        size='sm'
        textAlign='center'
        fontWeight='bold'
        type='number'
        maxW={'50px'}
        minW={'50px'}
        min={min}
        max={max}
        defaultValue={1}
        {...register(
          fieldName,
          {
            valueAsNumber: true
          }
        )}
      />
      <Button
        size={'sm'}
        disabled={isMax}
        onClick={() => setValue(fieldName, currentValue + 1)}
      >
        +
      </Button>
    </>
  )
}