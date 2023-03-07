import { Box, Button, Checkbox, Container, FormControl, FormErrorMessage, FormLabel, Heading, Input, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { OrderData } from '../../../backend/src/services/orders/orders.schema'
import { client } from "../../api/api";
import { useQuery } from "@tanstack/react-query";

export const Order = () => {
  const { handleSubmit, register, clearErrors, setError, formState: { errors, isDirty } } = useForm<OrderData>();

  const onSubmit = async (values: OrderData) => {
    //
  };

  const breadsQuery = useQuery(['breads'],
    () => client.service('products').find()
  )

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
            {JSON.stringify(breadsQuery.data)}
            <Stack>
              <Checkbox value='naruto'>Petit épeautre 450g</Checkbox>
              <Checkbox value='sasuke'>Grand épeautre 900g</Checkbox>
            </Stack>
          </FormControl>

          <Box>
            <Button type="submit">Se connecter</Button>
          </Box>
        </>
      </form>
    </Container>
  )
}