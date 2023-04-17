import { Category } from "../../../src/services/categories/categories.schema";
import { ProductData } from "../../../src/services/products/products.schema";

export const baseProductMock: ProductData = {
  name: "Pain d'épeautre",
  description: "Délicieux",
  weight: 900,
  price: 5,
  categoryId: 1,
  sku: 'PE'
};
export const getProductMock = (
  categoryId: Category["id"],
  data?: Partial<ProductData>
) => {
  return {
    ...baseProductMock,
    ...data,
    categoryId,
  };
};
