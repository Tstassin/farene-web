import { CategoryData } from "../../../src/services/categories/categories.schema";
import { FormType } from "../../../src/services/delivery-options/delivery-options.schema";

export const baseCategoryMock: CategoryData = {
  name: "Boulangerie",
  type: FormType.standard
};

export const getCategoryMock = (data?: Partial<CategoryData>) => {
  return {
    ...baseCategoryMock,
    ...data,
  };
};
