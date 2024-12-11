import { FormControl, FormErrorMessage, FormLabel, Input, Select } from "@chakra-ui/react"
import { FieldValues, Path, UseFormReturn } from "react-hook-form"
import { Category, CategoryData, CategoryUpdate } from "../../../../backend/src/services/categories/categories.schema"
import { FormType } from "../../../../backend/src/services/delivery-options/delivery-options.schema"

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
      <FormControl mb={5} isInvalid={Boolean(errors.type)}>
        <FormLabel>Type de Formulaire</FormLabel>
        <Select
          defaultValue={FormType.standard}
          placeholder='Choisir le type de formulaire'
          {...register('type', {
            required: 'Ce champ est obligatoire',
          })}
        >
          {Object.keys(FormType).map(
            formType => <option value={formType}>{formType}</option>
          )}
        </Select>
        <FormErrorMessage>{errors.type?.message}</FormErrorMessage>
      </FormControl>
    </>
  )
}