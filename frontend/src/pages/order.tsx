import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Button, Container, FormControl, FormLabel, Heading, Input, InputGroup, InputRightAddon, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { OrderData } from '../../../backend/src/services/orders/orders.schema'
import { client } from "../../api/api";
import dayjs from 'dayjs'
import { useOrderCreateMutation, useOrderDates } from "../queries/orders";
import { useAllProducts } from "../queries/products";
import localeData from 'dayjs/plugin/localeData'
import fr from 'dayjs/locale/fr'
import { QueryStatus } from "../components/queries/query-status";
import { useNavigate } from "react-router-dom";
dayjs.extend(localeData)

export const Order = () => {
  const navigate = useNavigate()
  const orderCreateMutation = useOrderCreateMutation()
  const allProductsQuery = useAllProducts()
  const { nextWeek, nextDeliveryDates } = useOrderDates().data || {}
  const { handleSubmit, register, control, watch, clearErrors, setError, formState: { errors, isDirty } } = useForm<OrderData>();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: "products",
  });

  const onSubmit = async (values: OrderData) => {
    values.products.forEach(p => p.productId = parseInt(p.productId))
    orderCreateMutation.mutate(values)
  };

  const nextWeekLabel = useMemo(() => {
    return dayjs(nextWeek, 'YYYY-MM-DD').locale(fr).format('DD MMMM')
  }, [nextWeek])

  const selectedProductsIndexes = allProductsQuery.data
    ?.reduce((acc, curr, index) => {
      if (fields.some(f => f.productId === curr.id)) {
        return [...acc, index]
      }
      return acc
    }, [] as number[])

  if (orderCreateMutation.isSuccess) navigate(`/order/${orderCreateMutation.data.id}/`)

  return (
    <Container>
      <QueryStatus query={allProductsQuery}>
        <Box mb={10}>
          <Heading>Formulaire de commande</Heading>
          <Text fontSize={'xl'}><>Semaine du {nextWeekLabel}</></Text>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <>
            <FormControl mb={5} isInvalid={false}>
              <FormLabel>Je viendrai chercher mon pain</FormLabel>
              <RadioGroup >
                <Stack >
                  {nextDeliveryDates?.map(
                    date => (
                      <Radio
                        value={date}
                        key={date}
                        {...register(
                          "delivery",
                          {
                            required: "Required",
                          }
                        )}
                      >
                        {dayjs(date, 'YYYY-MM-DD').locale(fr).format('dddd DD MMMM YYYY')}
                      </Radio>
                    )
                  )}
                </Stack>
              </RadioGroup>
            </FormControl>
            <Accordion allowMultiple index={selectedProductsIndexes}>
              {allProductsQuery.data?.map((product, index) => {
                return (
                  <AccordionItem key={product.id}>
                    {({ isExpanded }) => {
                      const fieldIndex = fields.findIndex(field => field.productId === product.id)
                      const fieldAmount = watch(`products.${fieldIndex}.amount`)
                      return (
                        <>
                          <h3>
                            <AccordionButton>
                              <Box as="span" flex='1' display='flex' justifyContent='space-between' mr={3}>
                                <Text as='b'>
                                  {product.name}
                                </Text>
                                <Text>
                                  {product.price}€ pièce {isExpanded && 'x ' + fieldAmount + ' = ' + product.price * fieldAmount + '€'}
                                </Text>
                              </Box>
                              {!isExpanded && <Button onClick={() => {
                                append({ amount: 1, productId: product.id })
                              }}>
                                Ajouter
                              </Button>}
                            </AccordionButton>
                          </h3>
                          <AccordionPanel pb={6}>
                            <FormControl>
                              <FormLabel>Quantité</FormLabel>
                              <InputGroup>
                                <Input
                                  type='number'
                                  min={1}
                                  {...register(
                                    `products.${fieldIndex}.amount`,
                                    {
                                      valueAsNumber: true
                                    }
                                  )}
                                />
                                <InputRightAddon px={0}>
                                  <Button onClick={() => {
                                    remove(fieldIndex)
                                  }}>
                                    Supprimer
                                  </Button>
                                </InputRightAddon>
                              </InputGroup>
                            </FormControl>
                          </AccordionPanel>
                        </>)
                    }}
                  </AccordionItem>
                )
              })}
            </Accordion>
            <Box>
              <Button type="submit">Commander</Button>
            </Box>
          </>
        </form>
      </QueryStatus >
    </Container>

  )
}