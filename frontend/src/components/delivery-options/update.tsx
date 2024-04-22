import { Box, Container } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { DeliveryOption, DeliveryOptionData } from "../../../../backend/src/services/delivery-options/delivery-options.schema";
import { useDeliveryOption, useDeliveryOptionUpdateMutation } from "../../queries/delivery-options";
import { RequestButton } from "../elements/request-button";
import { DeliveryOptionEditComponent } from "./edit";

export const UpdateDeliveryOption = ({ id }: { id: DeliveryOption['id'] }) => {
  const currentDeliveryOptionQuery = useDeliveryOption(id)
  const deliveryOptionUpdateMutation = useDeliveryOptionUpdateMutation()
  const defaultValues = currentDeliveryOptionQuery.data ?? {}
  const form = useForm<DeliveryOptionData>({ defaultValues });
  const { handleSubmit } = form

  const onSubmit = async (values: DeliveryOptionData) => {
    deliveryOptionUpdateMutation.mutate({ ...values, id })
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <>
          <DeliveryOptionEditComponent form={form} />
          <Box>
            <RequestButton query={deliveryOptionUpdateMutation} type="submit">Mettre à jour</RequestButton>
          </Box>
        </>
      </form>
    </Container>
  )
}
