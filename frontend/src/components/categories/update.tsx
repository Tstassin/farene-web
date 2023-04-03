import { Box, Button, Container } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { CategoryData, CategoryUpdate } from "../../../../backend/src/services/categories/categories.schema";
import { useCategory, useCategoryUpdateMutation } from "../../queries/categories";
import { CategoryEditComponent } from "./edit";

export const UpdateCategory = ({ id }: { id: CategoryUpdate['id'] }) => {
  const currentCategoryQuery = useCategory(id)
  const categoryUpdateMutation = useCategoryUpdateMutation()
  const form = useForm<CategoryData>({defaultValues: currentCategoryQuery.data});
  const { handleSubmit } = form

  const onSubmit = async (values: CategoryData) => {
    categoryUpdateMutation.mutate({...values, id})
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <>
          <CategoryEditComponent form={form} />
          <Box>
            <Button type="submit">Mettre à jour</Button>
          </Box>
        </>
      </form>
    </Container>
  )
}
