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

  if (deliveryOptionCreateMutation.isError) {
    console.log(deliveryOptionCreateMutation.error)
    console.log((deliveryOptionCreateMutation.error as FeathersErrorJSON).className)
    console.log((deliveryOptionCreateMutation.error as FeathersErrorJSON).code)
    console.log((deliveryOptionCreateMutation.error as FeathersErrorJSON).data)
    console.log((deliveryOptionCreateMutation.error as FeathersErrorJSON).data.message)
    console.log((deliveryOptionCreateMutation.error as FeathersErrorJSON).errors)
    console.log((deliveryOptionCreateMutation.error as FeathersErrorJSON).message)
    console.log((deliveryOptionCreateMutation.error as FeathersErrorJSON).name)
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <>
          <DeliveryOptionEditComponent form={form} />
          <Box>
            <RequestButton status={deliveryOptionCreateMutation.status} type="submit">Ajouter</RequestButton>
          </Box>
        </>
      </form>
    </Container>
  )
}
