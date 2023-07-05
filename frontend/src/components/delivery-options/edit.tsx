import { FormControl, FormErrorMessage, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select } from "@chakra-ui/react"
import { Controller, UseFormReturn } from "react-hook-form"
import { DeliveryOptionData } from "../../../../backend/src/services/delivery-options/delivery-options.schema"
import { useAllPlaces } from "../../queries/places"

interface DeliveryOptionEditComponentProps {
  form: UseFormReturn<DeliveryOptionData>
}

export const DeliveryOptionEditComponent = ({ form }: DeliveryOptionEditComponentProps) => {
  const { register, control, formState: { errors, defaultValues } } = form
  const allPlacesQuery = useAllPlaces()
  return (
    <>
      <FormControl mb={5} isInvalid={Boolean(errors.placeId)}>
        <FormLabel>Lieu de Livraison</FormLabel>
        <Select
          placeholder='Choisir un lieu de livraison'
          {...register('placeId', {
            required: 'Ce champ est obligatoire',
            valueAsNumber: true
          })}
        >
          {allPlacesQuery.data?.map(
            place => <option value={place.id}>{place.name}</option>
          )}

        </Select>
        <FormErrorMessage>{errors.placeId?.message}</FormErrorMessage>
      </FormControl>
      <FormControl mb={5} isInvalid={Boolean(errors.description)}>
        <FormLabel>Description</FormLabel>
        <Input
          type='text'
          {...register('description', {
            required: 'Ce champ est obligatoire'
          })}
        />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>
      <FormControl mb={5} isInvalid={Boolean(errors.day)}>
        <FormLabel>Jour</FormLabel>
        <Input
          type='date'
          {...register('day', {
            required: 'Ce champ est obligatoire'
          })}
        />
        <FormErrorMessage>{errors.day?.message}</FormErrorMessage>
      </FormControl>
      <FormControl mb={5} isInvalid={Boolean(errors.from)}>
        <FormLabel>Heure début</FormLabel>
        <Controller
          control={control}
          name="from"
          render={({ field: { ref, onChange: baseOnChange, ...restField } }) => (
            <NumberInput {...restField} onChange={(value) => { baseOnChange(parseFloat(value)) }} step={0.25} isRequired min={0} max={23} precision={2}>
              <NumberInputField ref={ref} name={restField.name} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          )}
        />
        <FormErrorMessage>{errors.from?.message}</FormErrorMessage>
      </FormControl>
      <FormControl mb={5} isInvalid={Boolean(errors.to)}>
        <FormLabel>Heure fin</FormLabel>
        <Controller
          control={control}
          name="to"
          render={({ field: { ref, onChange: baseOnChange, ...restField } }) => (
            <NumberInput {...restField} onChange={(value) => { baseOnChange(parseFloat(value)) }} step={0.25} isRequired min={0} max={23} precision={2}>
              <NumberInputField ref={ref} name={restField.name} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          )}
        />
        <FormErrorMessage>{errors.to?.message}</FormErrorMessage>
      </FormControl>
    </>
  )
}