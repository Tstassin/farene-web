import { Box, Button, Collapse, Divider, Input, InputGroup, InputRightAddon, Slide, Text, useDisclosure } from "@chakra-ui/react"
import { UseFieldArrayAppend, UseFieldArrayRemove, UseFieldArrayReturn, useFormContext, UseFormGetValues, UseFormRegister, UseFormSetValue } from "react-hook-form"
import { OrderData } from "../../../../backend/src/services/orders/orders.schema"
import { Product } from "../../../../backend/src/services/products/products.schema"
import { eur, mult, price } from "../../../../shared/prices"

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
  const total = mult(product.price, amount)

  return (
    <Box mb={3}>
      <Box>
        <Box display='flex' mb={1} >
          <Box flex={1}>
            <ProductInputDetails product={product} onToggle={onToggle} />
          </Box>
          <Box display={'flex'} height='fit-content'>

            <Box ml={3}>
              {
                isProductSelected &&
                <Box display={'flex'} flexDirection='column' alignItems={'center'}>
                  <InputGroup>
                    <ProductQuantityInput register={register} fieldArrayIndex={fieldArrayIndex} getValues={getValues} setValue={setValue} />
                  </InputGroup>
                  <Box mt={3}>
                    {
                      isProductSelected &&
                      <ProductInputRemoveButton product={product} remove={remove} fieldArrayIndex={fieldArrayIndex} />
                    }
                  </Box>
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
                <Box ml={3} minWidth={'8ch'} textAlign='right'>
                  <Text as='b' fontSize={'xl'}>{eur(total)}</Text>
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
      <Text>Prix: {eur(product.price)}</Text>
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
        size={'md'}
        isDisabled={isMin}
        onClick={() => setValue(fieldName, currentValue - 1)}
      >
        -
      </Button>
      <Input
        size='md'
        textAlign='center'
        fontWeight='bold'
        type='number'
        maxW={'6ch'}
        minW={'6ch'}
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
        size={'md'}
        disabled={isMax}
        onClick={() => setValue(fieldName, currentValue + 1)}
      >
        +
      </Button>
    </>
  )
}