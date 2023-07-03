import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import { FieldValues, Path, UseFormReturn } from "react-hook-form"
import { Place, PlaceData } from "../../../../backend/src/services/places/places.schema"

interface PlaceEditComponentProps {
  form: UseFormReturn<PlaceData>
}

export const PlaceEditComponent = ({ form }: PlaceEditComponentProps) => {
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
        <FormLabel>Description</FormLabel>
        <Input
          type='text'
          {...register('description', {
            required: 'Ce champ est obligatoire'
          })}
        />
      </FormControl>
    </>
  )
}