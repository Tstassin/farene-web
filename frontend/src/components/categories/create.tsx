import { Box, Button, Container, FormControl, FormLabel, Input, Radio, RadioGroup, Select, Stack } from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { CategoryData } from "../../../../backend/src/services/categories/categories.schema";
import { useAllCategories, useCategoryCreateMutation } from "../../queries/categories";

export const CreateCategory = () => {
  const categoryMutation = useCategoryCreateMutation()
  const { handleSubmit, register, clearErrors, setError, formState: { errors, isDirty } } = useForm<CategoryData>();

  const onSubmit = async (values: CategoryData) => {
    categoryMutation.mutate(values)
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
          <Box>
            <Button type="submit">Ajouter</Button>
          </Box>
        </>
      </form>
    </Container>
  )
}