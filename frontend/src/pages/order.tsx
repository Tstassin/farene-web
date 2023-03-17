import { Box, Button, Container, FormControl, FormLabel, Heading, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
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
  const allProductsSelected = watch('products')
  const total = allProductsQuery.data
    ?
    allProductsSelected
      .map(productSelected => ({ ...productSelected, price: allProductsQuery.data.find(product => productSelected.productId === product.id)!.price }))
      .reduce((acc, curr) => acc + curr.amount * curr.price, 0)
    : 0


  const onSubmit = async (values: OrderData) => {
    values.products.forEach(p => p.productId = parseInt(p.productId))
    orderCreateMutation.mutate(values)
  };

  const nextWeekLabel = useMemo(() => {
    return dayjs(nextWeek, 'YYYY-MM-DD').locale(fr).format('DD MMMM')
  }, [nextWeek])

  if (orderCreateMutation.isSuccess) navigate(`/order/${orderCreateMutation.data.id}/`)

  return (
    <Container>
      <QueryStatus query={allProductsQuery}>
        <Box mb={10}>
          <Heading>Formulaire de commande</Heading>
          <Text fontSize={'xl'}><>Semaine du {nextWeekLabel}</></Text>
        </Box>
        <FormProvider {...methods}>
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
              {
                allProductsQuery.data?.map((product, index) => {
                  return (
                    <ProductInput product={product} key={product.id} />
                  )
                })
              }
              <Box display='flex' justifyContent='space-between'>
                <Box fontWeight='bold' fontSize='lg'>
                  Total
                </Box>
                <Box fontWeight='bold' fontSize='lg'>
                  {total}€
                </Box>
              </Box>
              <br /><br />
              <Box>
                <Button type="submit">Commander</Button>
              </Box>
            </>
          </form>
        </FormProvider>
      </QueryStatus >
    </Container >

  )
}
