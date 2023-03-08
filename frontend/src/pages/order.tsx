import { Box, Button, Checkbox, Container, FormControl, FormErrorMessage, FormLabel, Heading, Input, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { OrderData } from '../../../backend/src/services/orders/orders.schema'
import { client } from "../../api/api";
import { useQuery } from "@tanstack/react-query";
import { useOrderCreateMutation } from "../queries/orders";
import { useAllProducts } from "../queries/products";

export const Order = () => {
  const orderCreateMutation = useOrderCreateMutation()
  const allProductsQuery = useAllProducts()
  const { handleSubmit, register, clearErrors, setError, formState: { errors, isDirty } } = useForm<OrderData>();

  const onSubmit = async (values: OrderData) => {
    console.log(values)
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
              <Stack {...register("delivery", {
                required: "Required",
              })}>
                <Radio value='1'>Mardi</Radio>
                <Radio value='2'>Jeudi</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <FormControl mb={5} isInvalid={false}>
            <FormLabel>Les pains que je commande</FormLabel>
            <Stack>
              {allProductsQuery.data?.map(product => 
              <Checkbox name={product.id.toString()} key={product.id}>{product.name}</Checkbox>
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