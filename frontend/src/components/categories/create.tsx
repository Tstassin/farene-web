import { Box, Button, Container } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { CategoryData } from "../../../../backend/src/services/categories/categories.schema";
import { useCategoryCreateMutation } from "../../queries/categories";
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
            <Button type="submit">Ajouter</Button>
          </Box>
        </>
      </form>
    </Container>
  )
}
