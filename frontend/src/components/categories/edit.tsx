import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import { FieldValues, Path, UseFormReturn } from "react-hook-form"
import { Category, CategoryData, CategoryUpdate } from "../../../../backend/src/services/categories/categories.schema"

interface CategoryEditComponentProps {
  form: UseFormReturn<CategoryData>
}

export const CategoryEditComponent = ({ form }: CategoryEditComponentProps) => {
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
    </>
  )
}