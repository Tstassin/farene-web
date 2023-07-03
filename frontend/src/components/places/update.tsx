import { Box, Container } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Place, PlaceData } from "../../../../backend/src/services/places/places.schema";
import { usePlace, usePlaceUpdateMutation } from "../../queries/places";
import { RequestButton } from "../elements/request-button";
import { PlaceEditComponent } from "./edit";

export const UpdatePlace = ({ id }: { id: Place['id'] }) => {
  const currentPlaceQuery = usePlace(id)
  const placeUpdateMutation = usePlaceUpdateMutation()
  const form = useForm<PlaceData>({ defaultValues: currentPlaceQuery.data });
  const { handleSubmit } = form

  const onSubmit = async (values: PlaceData) => {
    placeUpdateMutation.mutate({ ...values, id })
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <>
          <PlaceEditComponent form={form} />
          <Box>
            <RequestButton status={placeUpdateMutation.status} type="submit">Mettre à jour</RequestButton>
          </Box>
        </>
      </form>
    </Container>
  )
}
