import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { UseFormReturn } from "react-hook-form";
import { OrderPatch } from "../../../../backend/src/services/orders/orders.schema";
import { useAllDeliveryOptions } from "../../queries/delivery-options";

interface OrderEditComponentProps {
  form: UseFormReturn<OrderPatch>
}

export const OrderEditComponent = ({ form }: OrderEditComponentProps) => {
  const { register, formState: { errors } } = form
  const allDeliveryOptionsQuery = useAllDeliveryOptions()

  return (
    <>
      <FormControl mb={5} isInvalid={Boolean(errors.deliveryOptionId)}>
        <FormLabel>Date d'enlèvement</FormLabel>
        <Select
          {...register('deliveryOptionId', {
            required: 'Ce champ est obligatoire',
          })}
        >
          {allDeliveryOptionsQuery.data?.map(
            dO => <option value={dO.id}>{dO.place.name} - {dO.day}</option>
          )}
        </Select>
      </FormControl>
    </>
  )
}