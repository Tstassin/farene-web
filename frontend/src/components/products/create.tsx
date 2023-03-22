import { Box, Button, Container, FormControl, FormLabel, Input, Radio, RadioGroup, Select, SelectField, Stack } from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { ProductData } from "../../../../backend/src/services/products/products.schema";
import { useAllCategories } from "../../queries/categories";
import { useProductCreateMutation } from "../../queries/products";

export const CreateProduct = () => {
  const allCategoriesQuery = useAllCategories()
  const productCreateMutation = useProductCreateMutation()
  const { handleSubmit, register, clearErrors, setError, formState: { errors, isDirty } } = useForm<ProductData>();

  const onSubmit = async (values: ProductData) => {
    console.log(values)
    productCreateMutation.mutate(values)
  };

  return (
    <Container>
      <Box mb={10}>
        {/* <Heading>Formulaire de commande</Heading>
        <Text fontSize={'xl'}>Semaine du XXXX</Text> */}
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <>
          <FormControl mb={5} isInvalid={Boolean(errors.name)}>
            <FormLabel>Nom</FormLabel>
            <Input
              type='text'
              {...register('name', {
                required: 'Ce champ est obligatoire'
              })}
            />
          </FormControl>
          <FormControl mb={5} isInvalid={Boolean(errors.description)}>
            <FormLabel>Description</FormLabel>
            <Input
              type='text'
              {...register('description', {
                required: 'Ce champ est obligatoire'
              })}
            />
          </FormControl>
          <FormControl mb={5} isInvalid={Boolean(errors.price)}>
            <FormLabel>Prix</FormLabel>
            <Input
              type='number'
              step={0.01}
              min={0}
              max={1000}
              {...register('price', {
                required: 'Ce champ est obligatoire',
                valueAsNumber: true
              })}
            />
          </FormControl>
          <FormControl mb={5} isInvalid={Boolean(errors.weight)}>
            <FormLabel>Poids (en grammes)</FormLabel>
            <Input
              type='number'
              step={1}
              min={0}
              max={10000}
              {...register(
                'weight',
                {
                  required: 'Ce champ est obligatoire',
                  valueAsNumber: true
                },
              )}
            />
          </FormControl>
          <FormControl mb={5} isInvalid={Boolean(errors.categoryId)}>
            <FormLabel>Catégorie</FormLabel>
            <Select
              {...register('categoryId', {
                required: 'Ce champ est obligatoire',
              })}
            >
              {allCategoriesQuery.data?.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
            </Select>
          </FormControl>
          <Box>
            <Button type="submit">Ajouter</Button>
          </Box>
        </>
      </form>
    </Container>
  )
}