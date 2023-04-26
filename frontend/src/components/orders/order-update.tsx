import { Box } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Order, OrderPatch } from "../../../../backend/src/services/orders/orders.schema";
import { useOrder, useOrderDeliveryDateMutation } from "../../queries/orders";
import { RequestButton } from "../elements/request-button";
import { OrderEditComponent } from "./order-edit";

export const UpdateOrder = ({ id }: { id: Order['id'] }) => {
  const orderDeliveryDateMutation = useOrderDeliveryDateMutation()
  const currentOrderQuery = useOrder(id)
  const { delivery } = currentOrderQuery.data ?? {}
  const form = useForm<Omit<OrderPatch, 'paymentSuccess' | 'paymentIntent'>>({ defaultValues: { delivery } });
  const { handleSubmit } = form

  const onSubmit = async (data: Omit<OrderPatch, 'paymentSuccess' | 'paymentIntent'>) => {
    console.log(data)
    orderDeliveryDateMutation.mutate({ data, id })
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <OrderEditComponent form={form} />
        <Box>
          <RequestButton status={orderDeliveryDateMutation.status} type="submit">Mettre à jour</RequestButton>
        </Box>
      </form>
    </>
  )
}