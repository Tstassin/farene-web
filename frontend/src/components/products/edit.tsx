import { FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { UseFormReturn } from "react-hook-form";
import { ProductData } from "../../../../backend/src/services/products/products.schema";
import { useAllCategories } from "../../queries/categories";

interface ProductEditComponentProps {
  form: UseFormReturn<ProductData>
}

export const ProductEditComponent = ({ form }: ProductEditComponentProps) => {
  const allCategoriesQuery = useAllCategories()
  const { register, formState: { errors } } = form

  return (
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
      <FormControl mb={5} isInvalid={Boolean(errors.name)}>
        <FormLabel>Code unique</FormLabel>
        <Input
          type='text'
          {...register('sku', {
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
            setValueAs: (value) => parseInt(value)
          })}
        >
          {allCategoriesQuery.data?.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
        </Select>
      </FormControl>
      <FormControl mb={5} isInvalid={Boolean(errors.disabled)}>
        <FormLabel>Statut du produit</FormLabel>
        <Select
          {...register('disabled', {
            required: 'Ce champ est obligatoire',
            setValueAs: value => parseInt(value)
          })}
        >
          <option value={0}>En vente</option>
          <option value={1}>Désactivé</option>
        </Select>
      </FormControl>
    </>
  )
}