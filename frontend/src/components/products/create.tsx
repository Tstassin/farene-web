import { Box, Button } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { ProductData } from "../../../../backend/src/services/products/products.schema";
import { useProductCreateMutation } from "../../queries/products";
import { ProductEditComponent } from "./edit";

export const CreateProduct = () => {
  const productCreateMutation = useProductCreateMutation()
  const form = useForm<ProductData>();
  const { handleSubmit } = form

  const onSubmit = async (values: ProductData) => {
    productCreateMutation.mutate(values)
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ProductEditComponent form={form} />
        <Box>
          <Button type='submit'>Ajouter</Button>
        </Box>
      </form>
    </>
  )
}