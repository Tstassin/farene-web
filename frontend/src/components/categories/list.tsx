import { useAllCategories } from "../../queries/categories"
import { QueryStatus } from "../queries/query-status"

export const CategoriesList = () => {
  const allCategoriesQuery = useAllCategories()
  return (
    <QueryStatus query={allCategoriesQuery}>
      <ul>
        {allCategoriesQuery.data?.map(category => <li key={category.id}>{category.name}</li>)}
      </ul>
    </QueryStatus>
  )
}