import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Container, Divider, FormControl, FormErrorMessage, FormLabel, Heading, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { Fragment, useMemo } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { OrderData } from '../../../backend/src/services/orders/orders.schema'
import dayjs from 'dayjs'
import { useOrderCreateMutation, useOrderDates } from "../queries/orders";
import { useAllProducts } from "../queries/products";
import localeData from 'dayjs/plugin/localeData'
import fr from 'dayjs/locale/fr'
import { QueryStatus } from "../components/queries/query-status";
import { useNavigate } from "react-router-dom";
import { ProductInput } from "../components/products/product-input";
import { OrderInstructions } from "../components/orders/order-instructions";
import { useAllCategories } from "../queries/categories";
dayjs.extend(localeData)

export const Order = () => {
  const navigate = useNavigate()
  const orderCreateMutation = useOrderCreateMutation()
  const allProductsQuery = useAllProducts({disabled: 0})
  const allCategoriesQuery = useAllCategories()
  const { nextWeek, nextDeliveryDates } = useOrderDates().data || {}
  const methods = useForm<OrderData>();
  const { handleSubmit, register, control, watch, clearErrors, setError, formState: { errors, isDirty } } = methods;
  const fieldArray = useFieldArray({
    control,
    name: "orderItems",
    rules: { required: true }
  });

  const allProductsSelected = watch('orderItems')
  const allProductsByCategory = allCategoriesQuery.data?.map(category => ({
    ...category,
    products: allProductsQuery.data?.filter(product => product.categoryId === category.id)
  }))
  const total = allProductsQuery.data && allProductsSelected
    ?
    allProductsSelected
      .map(productSelected => ({ ...productSelected, price: allProductsQuery.data.find(product => productSelected.productId === product.id)?.price ?? 0 }))
      .reduce((acc, curr) => acc + (isNaN(curr.amount) ? 0 : curr.amount) * Math.round(curr.price * 100) / 100, 0)
    : 0

  const onSubmit = async (values: OrderData) => {
    orderCreateMutation.mutate(values)
  };

  const nextWeekLabel = useMemo(() => {
    return dayjs(nextWeek).locale(fr).format('dddd DD MMMM YYYY')
  }, [nextWeek])

  if (orderCreateMutation.isSuccess) navigate(`/order/${orderCreateMutation.data.id}/`)

  return (
    <>
      <QueryStatus query={allProductsQuery}>
        <Box mb={10}>
          <Heading>Formulaire de commande</Heading>
          <Text fontSize={'xl'}><>Pour la semaine du {nextWeekLabel}</></Text>
          <Text fontSize='sm'>
            Commandes jusque dimanche minuit
          </Text>
        </Box>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <>
              <FormControl mb={5} isInvalid={Boolean(errors.delivery)} isRequired>
                <FormLabel>
                  <Heading size={'md'} mb={3} display='inline'>Enlèvement</Heading>
                </FormLabel>
                <RadioGroup>
                  <Stack >
                    {nextDeliveryDates?.map(
                      date => (
                        <Radio
                          value={date}
                          key={date}
                          {...register(
                            "delivery",
                            {
                              required: "Veuillez choisir une date d'enlèvement",
                            }
                          )}
                        >
                          {dayjs(date).locale(fr).format('dddd DD MMMM YYYY')}
                        </Radio>
                      )
                    )}
                  </Stack>
                </RadioGroup>
                <FormErrorMessage>{errors.delivery?.message?.toString()}</FormErrorMessage>
              </FormControl>
              <Accordion mt={5} allowToggle mb={10}>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex='1' textAlign='left'>
                        Informations de commande et enlèvement
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}><OrderInstructions /></AccordionPanel>
                </AccordionItem>
              </Accordion>
              <FormControl isRequired mt={10} isInvalid={Boolean(errors.orderItems?.root?.type === 'required')}>
                <FormLabel>
                  <Heading size={'lg'} mb={3} display='inline'>Votre Commande</Heading>
                </FormLabel>
                <FormErrorMessage mb={3}>{'Veuillez ajouter au moins un produit à votre commande'}</FormErrorMessage>
                {
                  allProductsByCategory?.map(category => {
                    return <>
                      {category.products?.length > 0 && (
                        <Fragment key={category.id}>
                          <Heading size='md' mt={5}>{category.name}</Heading>
                          <Divider my={3} />
                        </Fragment>
                      )}
                      {category.products?.map((product, index) => {
                        return (
                          <ProductInput product={product} key={product.id} fieldArray={fieldArray} />
                        )
                      })}</>
                  })
                }
                <FormErrorMessage>{'Veuillez ajouter au moins un produit à votre commande'}</FormErrorMessage>
              </FormControl>
              <Box display='flex' justifyContent='space-between' mt={6}>
                <Heading size={'lg'} mb={3}>Total</Heading>
                <Heading size={'lg'} mb={3}>{total}€</Heading>
              </Box>
              <br />
              <br />
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
