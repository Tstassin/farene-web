import { Box, Button, Container, Divider, FormControl, FormLabel, Heading, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { OrderData } from '../../../backend/src/services/orders/orders.schema'
import dayjs from 'dayjs'
import { useOrderCreateMutation, useOrderDates } from "../queries/orders";
import { useAllProducts } from "../queries/products";
import localeData from 'dayjs/plugin/localeData'
import fr from 'dayjs/locale/fr'
import { QueryStatus } from "../components/queries/query-status";
import { useNavigate } from "react-router-dom";
import { ProductInput } from "../components/products/product-input";
dayjs.extend(localeData)

export const Order = () => {
  const navigate = useNavigate()
  const orderCreateMutation = useOrderCreateMutation()
  const allProductsQuery = useAllProducts()
  const { nextWeek, nextDeliveryDates } = useOrderDates().data || {}
  const methods = useForm<OrderData>();
  const { handleSubmit, register, control, watch, clearErrors, setError, formState: { errors, isDirty } } = methods;
  const allProductsSelected = watch('orderItems')
  const total = allProductsQuery.data && allProductsSelected
    ?
    allProductsSelected
      .map(productSelected => ({ ...productSelected, price: allProductsQuery.data.find(product => productSelected.productId === product.id)?.price ?? 0 }))
      .reduce((acc, curr) => acc + curr.amount * curr.price, 0)
    : 0


  const onSubmit = async (values: OrderData) => {
    values.orderItems.forEach(orderItem => orderItem.productId = parseInt(orderItem.productId))
    orderCreateMutation.mutate(values)
  };

  const nextWeekLabel = useMemo(() => {
    return dayjs(nextWeek, 'YYYY-MM-DD').locale(fr).format('dddd DD MMMM')
  }, [nextWeek])

  if (orderCreateMutation.isSuccess) navigate(`/order/${orderCreateMutation.data.id}/`)

  return (
    <>
      <QueryStatus query={allProductsQuery}>
        <Box mb={10}>
          <Heading>Formulaire de commande</Heading>
          <Text fontSize={'xl'}><>Pour la semaine du {nextWeekLabel}</></Text>
        </Box>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <>
              <FormControl mb={5} isInvalid={false}>
                <Heading size={'md'} mb={3}>Enlèvement</Heading>
                <FormLabel>Je viendrai chercher mon pain le</FormLabel>
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
              <Heading size={'md'} mb={3} mt={10}>Commande</Heading>
                            <Divider mb={3}/>
              {
                allProductsQuery.data?.map((product, index) => {
                  return (
                    <ProductInput product={product} key={product.id} />
                  )
                })
              }
              <Box display='flex' justifyContent='space-between' mt={6}>
                <Heading size={'lg'} mb={3}>Total</Heading>
                <Heading size={'lg'} mb={3}>{total}€</Heading>
              </Box>
              <br /><br />
              <Box textAlign='right'>
                <Button type="submit">Valider et Payer</Button>
              </Box>
            </>
          </form>
        </FormProvider>
      </QueryStatus >
    </ >

  )
}
