import { Box, Button, Checkbox, Container, FormControl, FormErrorMessage, FormLabel, Heading, Input, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { OrderData } from '../../../backend/src/services/orders/orders.schema'
import { client } from "../../api/api";
import dayjs from 'dayjs'
import { useOrderCreateMutation, useOrderDates } from "../queries/orders";
import { useAllProducts } from "../queries/products";
import localeData from 'dayjs/plugin/localeData'
import fr from 'dayjs/locale/fr'
dayjs.extend(localeData)

export const Order = () => {
  const orderCreateMutation = useOrderCreateMutation()
  const allProductsQuery = useAllProducts()
  const orderDatesQuery = useOrderDates()
  const { handleSubmit, register, clearErrors, setError, formState: { errors, isDirty } } = useForm<OrderData>();

  const onSubmit = async (values: OrderData) => {
    values.products.forEach(p => p.productId = parseInt(p.productId) + 1)
    orderCreateMutation.mutate(values)
  };

  return (
    <Container>
      <Box mb={10}>
        <Heading>Formulaire de commande</Heading>
        <Text fontSize={'xl'}>Semaine du XXXX</Text>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <>
          <FormControl mb={5} isInvalid={false}>
            <FormLabel>Je viendrai chercher mon pain</FormLabel>
            <RadioGroup >
              <Stack >
                {orderDatesQuery.data?.nextDeliveryDates.map(
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
          <FormControl mb={5} isInvalid={false}>
            <FormLabel>Les pains que je commande</FormLabel>
            <Stack>
              {allProductsQuery.data?.map((product, index) =>
              (
                <>
                  <Checkbox
                    key={product.id}
                    value={product.id}
                    {...register(
                      `products.${index}.productId`
                    )}
                  >{product.name}</Checkbox>
                  <Input
                    type='number'
                    min={0}
                    max={10}
                    {...register(
                      `products.${index}.amount`,
                      {
                        valueAsNumber: true
                      }
                    )}
                  />
                </>
              )
              )}
            </Stack>
          </FormControl>

          <Box>
            <Button type="submit">Commander</Button>
          </Box>
        </>
      </form>
    </Container>
  )
}