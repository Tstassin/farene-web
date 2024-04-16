import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Divider, FormControl, FormErrorMessage, FormLabel, Heading, HStack, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { Fragment, useMemo } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { OrderData } from '../../../backend/src/services/orders/orders.schema'
import dayjs from 'dayjs'
import { useOrderCreateMutation } from "../queries/orders";
import { useAllProducts } from "../queries/products";
import localeData from 'dayjs/plugin/localeData'
import fr from 'dayjs/locale/fr'
import { QueryStatus } from "../components/queries/query-status";
import { useNavigate } from "react-router-dom";
import { ProductInput } from "../components/products/product-input";
import { OrderInstructions } from "../components/orders/order-instructions";
import { useAllCategories } from "../queries/categories";
import { RequestButton } from "../components/elements/request-button";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { eur, mult } from "../../../shared/prices";
import { useNextWeekDeliveryOptions } from "../queries/delivery-options";
import { getNextWeekStart } from "../../../backend/src/utils/dates";
dayjs.extend(localeData)

export const Order = () => {
  const navigate = useNavigate()
  const orderCreateMutation = useOrderCreateMutation()
  const allProductsQuery = useAllProducts({ disabled: 0 })
  const allCategoriesQuery = useAllCategories()
  const nextWeekDeliveryOptions = useNextWeekDeliveryOptions().data || []
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
      .reduce((acc, curr) => acc + mult(curr.amount, curr.price), 0)
    : 0

  const onSubmit = async (values: OrderData) => {
    const { deliveryOptionId, orderItems } = values
    const data: OrderData = {
      orderItems,
      deliveryOptionId: parseInt(deliveryOptionId.toString())
    }
    console.log(orderCreateMutation)
    orderCreateMutation.mutate(data)
  };

  const nextWeekLabel = getNextWeekStart().add(1, 'day')
    .locale(fr).format('dddd DD MMMM YYYY')

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
              <FormControl mb={5} isInvalid={Boolean(errors.deliveryOptionId)} isRequired>
                <FormLabel>
                  <Heading size={'md'} mb={3} display='inline'>Enlèvement</Heading>
                </FormLabel>
                <RadioGroup>
                  <Stack spacing={3}>
                    {nextWeekDeliveryOptions?.map(
                      ({ day, place: { name }, id }) => (
                        <Radio
                          value={id + ''}
                          key={id}
                          {...register(
                            "deliveryOptionId",
                            {
                              required: "Veuillez choisir une date et un lieu d'enlèvement",
                            }
                          )}
                        >
                          {dayjs(day).locale(fr).format('dddd DD MMMM YYYY')}  <span>&#8212;</span>  {name}
                        </Radio>
                      )
                    )}
                  </Stack>
                </RadioGroup>
                <FormErrorMessage>{errors.deliveryOptionId?.message?.toString()}</FormErrorMessage>
              </FormControl>
              <Accordion mt={5} allowToggle mb={10}>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex='1' textAlign='left'>
                        <HStack>

                          <QuestionOutlineIcon /> <Text>Informations de commande et enlèvement</Text>
                        </HStack>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} mb={0}><OrderInstructions /></AccordionPanel>
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
                      {(category.products?.length ?? 0) > 0 && (
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
                <Heading size={'lg'} mb={3}>{eur(total)}</Heading>
              </Box>
              <br />
              <br />
              <Box textAlign='right'>
                <RequestButton status={orderCreateMutation.status} type="submit">Valider et Payer</RequestButton>
              </Box>
            </>
          </form>
        </FormProvider>
      </QueryStatus >
    </ >

  )
}
