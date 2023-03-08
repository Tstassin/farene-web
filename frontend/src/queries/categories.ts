import { useMutation, useQuery } from "@tanstack/react-query"
import { queryClient } from ".."
import { CategoryData } from "../../../backend/src/services/categories/categories.schema"
import { client } from "../../api/api"

export const useAllCategories = () => {
  return useQuery({ 
    queryKey: ['categories'], 
    queryFn: () => client.service('categories').find({ paginate: false }) 
  })
}

export const useCategoryMutation = () => {
  return useMutation({
    mutationFn: (data: CategoryData) => {
      return client.service('categories').create(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories'])
    }
  })
}