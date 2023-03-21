import { CategoryData } from "../../../src/services/categories/categories.schema";

export const baseCategoryMock: CategoryData = {
  name: 'Boulangerie'
}

export const getCategoryMock = (data?: Partial<CategoryData>) => {
  return ({
    ...baseCategoryMock,
    ...data
  })  
}