import { Box, Button } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Product, ProductData, ProductUpdate } from "../../../../backend/src/services/products/products.schema";
import { useProduct, useProductUpdateMutation } from "../../queries/products";
import { ProductEditComponent } from "./edit";

export const UpdateProduct = ({ id }: { id: Product['id'] }) => {
  const productUpdateMutation = useProductUpdateMutation()
  const currentProductQuery = useProduct(id)
  const {createdAt, updatedAt, ...defaultValues} = currentProductQuery.data ?? {}
  const form = useForm<ProductData>({defaultValues});
  const { handleSubmit } = form

  const onSubmit = async (values: ProductData) => {
    console.log(values)
    productUpdateMutation.mutate({ ...values, id })
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ProductEditComponent form={form} />
        <Box>
          <Button type="submit">Mettre à jour</Button>
        </Box>
      </form>
    </>
  )
}