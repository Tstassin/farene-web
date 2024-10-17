import { Box } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Product, ProductData, ProductUpdate } from "../../../../backend/src/services/products/products.schema";
import { useProduct, useProductUpdateMutation } from "../../queries/products";
import { RequestButton } from "../elements/request-button";
import { ProductEditComponent } from "./edit";

export const UpdateProduct = ({ id }: { id: Product['id'] }) => {
  const productUpdateMutation = useProductUpdateMutation()
  const currentProductQuery = useProduct(id)
  const { createdAt, updatedAt, sortOrder, ...defaultValues } = currentProductQuery.data ?? {}

  const form = useForm<ProductData>({ defaultValues });
  const { handleSubmit } = form

  const onSubmit = async (values: ProductData) => {
    productUpdateMutation.mutate({ ...values, sortOrder: sortOrder ?? 0, id })
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ProductEditComponent form={form} />
        <Box>
          <RequestButton query={productUpdateMutation} type="submit">Mettre à jour</RequestButton>
        </Box>
      </form>
    </>
  )
}