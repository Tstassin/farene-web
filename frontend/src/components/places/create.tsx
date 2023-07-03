import { Box, Container } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { PlaceData } from "../../../../backend/src/services/places/places.schema";
import { usePlaceCreateMutation } from "../../queries/places";
import { RequestButton } from "../elements/request-button";
import { PlaceEditComponent } from "./edit";

export const CreatePlace = () => {
  const categoryCreateMutation = usePlaceCreateMutation()
  const form = useForm<PlaceData>();
  const { handleSubmit } = form

  const onSubmit = async (values: PlaceData) => {
    categoryCreateMutation.mutate(values)
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <>
          <PlaceEditComponent form={form} />
          <Box>
            <RequestButton status={categoryCreateMutation.status} type="submit">Ajouter</RequestButton>
          </Box>
        </>
      </form>
    </Container>
  )
}
