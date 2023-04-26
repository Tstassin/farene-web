import { Box, Container } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { CategoryData } from "../../../../backend/src/services/categories/categories.schema";
import { useCategoryCreateMutation } from "../../queries/categories";
import { RequestButton } from "../elements/request-button";
import { CategoryEditComponent } from "./edit";

export const CreateCategory = () => {
  const categoryCreateMutation = useCategoryCreateMutation()
  const form = useForm<CategoryData>();
  const { handleSubmit } = form

  const onSubmit = async (values: CategoryData) => {
    categoryCreateMutation.mutate(values)
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <>
          <CategoryEditComponent form={form} />
          <Box>
            <RequestButton status={categoryCreateMutation.status} type="submit">Ajouter</RequestButton>
          </Box>
        </>
      </form>
    </Container>
  )
}
