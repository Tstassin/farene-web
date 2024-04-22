import { Box, Container } from "@chakra-ui/react";
import { FeathersErrorJSON } from "@feathersjs/errors/lib";
import { useForm } from "react-hook-form";
import { DeliveryOptionData } from "../../../../backend/src/services/delivery-options/delivery-options.schema";
import { useDeliveryOptionCreateMutation } from "../../queries/delivery-options";
import { RequestButton } from "../elements/request-button";
import { DeliveryOptionEditComponent } from "./edit";

export const CreateDeliveryOption = () => {
  const deliveryOptionCreateMutation = useDeliveryOptionCreateMutation()
  const form = useForm<DeliveryOptionData>();
  const { handleSubmit } = form

  const onSubmit = async (values: DeliveryOptionData) => {
    deliveryOptionCreateMutation.mutate(values)
  };
  
  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <>
          <DeliveryOptionEditComponent form={form} />
          <Box>
            <RequestButton query={deliveryOptionCreateMutation} type="submit">Ajouter</RequestButton>
          </Box>
        </>
      </form>
    </Container>
  )
}
