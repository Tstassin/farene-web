import { Button } from "@chakra-ui/react"
import { useAllCategories, useCategoryRemoveMutation } from "../../queries/categories"
import { QueryStatus } from "../queries/query-status"

export const CategoriesList = () => {
  const allCategoriesQuery = useAllCategories()
  const categoryRemoveMutation = useCategoryRemoveMutation()
  return (
    <QueryStatus query={allCategoriesQuery}>
      <ul>
        {allCategoriesQuery.data?.map(category => <li key={category.id}>
          {category.name}
          <Button size={'xs'} onClick={() => categoryRemoveMutation.mutate(category.id)}>supprimer</Button>
        </li>)}
      </ul>
    </QueryStatus>
  )
}