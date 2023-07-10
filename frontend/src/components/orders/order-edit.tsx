import { FormControl, FormHelperText, FormLabel, Select } from "@chakra-ui/react";
import { UseFormReturn } from "react-hook-form";
import { OrderPatch } from "../../../../backend/src/services/orders/orders.schema";
import { useDeliveryOption, useNextDeliveryOptions } from "../../queries/delivery-options";

interface OrderEditComponentProps {
  form: UseFormReturn<OrderPatch>
}

export const OrderEditComponent = ({ form }: OrderEditComponentProps) => {
  const { register, formState: { errors, defaultValues } } = form
  const defaultDeliveryOptionQuery = useDeliveryOption(defaultValues?.deliveryOptionId)
  const allDeliveryOptionsQuery = useNextDeliveryOptions()

  return (
    <>
      <FormControl mb={5} isInvalid={Boolean(errors.deliveryOptionId)}>
        <FormLabel>Date d'enlèvement</FormLabel>
        <Select
          placeholder="Modifier la date de livraison"
          {...register('deliveryOptionId', {
            required: 'Ce champ est obligatoire',
          })}
        >
          {allDeliveryOptionsQuery.data?.map(
            dO => <option value={dO.id}>{dO.place.name} - {dO.day}</option>
          )}
        </Select>
        {defaultValues?.deliveryOptionId !== undefined && <FormHelperText>Date actuelle : {defaultDeliveryOptionQuery.data?.place.name} - {defaultDeliveryOptionQuery.data?.day}</FormHelperText>}
      </FormControl>
    </>
  )
}