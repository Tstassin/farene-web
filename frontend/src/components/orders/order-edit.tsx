import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { UseFormReturn } from "react-hook-form";
import { OrderPatch } from "../../../../backend/src/services/orders/orders.schema";
import { useOrderDates } from "../../queries/orders";

interface OrderEditComponentProps {
  form: UseFormReturn<OrderPatch>
}

export const OrderEditComponent = ({ form }: OrderEditComponentProps) => {
  const orderDatesQuery = useOrderDates()
  const { register, formState: { errors } } = form
  const deliveryDates = orderDatesQuery.data?.deliveryDates
  const allDeliveryDates = deliveryDates ? Object.values(deliveryDates).flatMap(d => d) : []

  return (
    <>
      <FormControl mb={5} isInvalid={Boolean(errors.delivery)}>
        <FormLabel>Date d'enlèvement</FormLabel>
        <Select
          {...register('delivery', {
            required: 'Ce champ est obligatoire',
          })}
        >
          {allDeliveryDates.map(
            deliveryDate => <option value={deliveryDate}>{deliveryDate}</option>
          )}
        </Select>
      </FormControl>
    </>
  )
}