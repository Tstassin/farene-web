import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Alert, AlertTitle, Box, Divider, FormControl, FormErrorMessage, FormLabel, Heading, HStack, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { Fragment } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { OrderData } from '../../../backend/src/services/orders/orders.schema'
import dayjs from 'dayjs'
import { useOrderCreateMutation } from "../queries/orders";
import { useAllProducts } from "../queries/products";
import localeData from 'dayjs/plugin/localeData'
import fr from 'dayjs/locale/fr'
import { QueryStatus } from "../components/queries/query-status";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ProductInput } from "../components/products/product-input";
import { useAllCategories } from "../queries/categories";
import { RequestButton } from "../components/elements/request-button";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { eur, mult } from "../../../shared/prices";
import { useNextWeekDeliveryOptions, useSpecialDeliveryOptions } from "../queries/delivery-options";
import { getNextWeekStart } from "../../../backend/src/utils/dates";
import { DeliveryOptions } from "../components/delivery-options/delivery-options";
import { FormType } from "../../../backend/src/services/delivery-options/delivery-options.schema";
dayjs.extend(localeData)

export const Order = () => {
  const [searchParams] = useSearchParams()
  const formType = searchParams.get('special') ? FormType.special : FormType.standard
  const navigate = useNavigate()
  const orderCreateMutation = useOrderCreateMutation()
  const allProductsQuery = useAllProducts({ disabled: 0 })
  const allCategoriesQuery = useAllCategories(formType)
  const nextWeekDeliveryOptions = useNextWeekDeliveryOptions().data ?? []
  const specialDeliveryOptions = useSpecialDeliveryOptions().data ?? []
  const methods = useForm<OrderData>();
  const { handleSubmit, register, control, watch, formState: { errors } } = methods;
  const fieldArray = useFieldArray({
    control,
    name: "orderItems",
    rules: { required: true }
  });
  const deliveryOptions = formType === FormType.standard ? nextWeekDeliveryOptions : specialDeliveryOptions

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
    orderCreateMutation.mutate(data)
  };

  const nextWeekLabel = getNextWeekStart().add(1, 'day')
    .locale(fr).format('dddd DD MMMM YYYY')

  if (orderCreateMutation.isSuccess) {
    orderCreateMutation.reset()
    navigate(`/order/${orderCreateMutation.data.id}/`)
  }

  return (
    <>
      <QueryStatus query={allProductsQuery}>
        <Box mb={10}>
          <Heading>Formulaire de commande</Heading>
          {formType === FormType.standard ? (
            <>
              <Text fontSize={'xl'}><>Pour la semaine du {nextWeekLabel}</></Text>
              <Text fontSize='sm'>
                Commandes jusque dimanche minuit
              </Text>
            </>
          ) : (
            <>
              <Alert
                colorScheme='pink'
                variant='subtle'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                textAlign='center'
                mb={10}
                mt={5}
              >
                <AlertTitle mt={4} mb={3} fontSize='xl'>
                  🎄 Spécial Noël 🎄
                </AlertTitle>
              </Alert>
            </>
          )}
        </Box>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <>
              <FormControl mb={5} isInvalid={Boolean(errors.deliveryOptionId)} isRequired>
                <FormLabel>
                  <Heading size={'md'} mb={3} display='inline'>Point dépôt pour enlèvement :</Heading>
                </FormLabel>
                <RadioGroup mt={3}>
                  <Stack spacing={3}>
                    {deliveryOptions?.map(
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
                          <QuestionOutlineIcon /> <Text>Informations points dépôt</Text>
                        </HStack>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} mb={0}>
                    <DeliveryOptions formType={formType} />
                  </AccordionPanel>
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
                <RequestButton query={orderCreateMutation} type="submit">Valider et Payer</RequestButton>
              </Box>
            </>
          </form>
        </FormProvider>
      </QueryStatus >
    </ >

  )
}
