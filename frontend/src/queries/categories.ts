import { useMutation, useQuery } from "@tanstack/react-query"
import { queryClient } from ".."
import { Category, CategoryData, CategoryPatch } from "../../../backend/src/services/categories/categories.schema"
import { client } from "../../api/api"

export const useAllCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => client.service('categories').find({ paginate: false })
  })
}

export const useCategoryCreateMutation = () => {
  return useMutation({
    mutationFn: (data: CategoryData) => {
      return client.service('categories').create(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories'])
    }
  })
}

export const useCategoryUpdateMutation = () => {
  return useMutation({
    mutationFn: (values: {id: Category['id']} & CategoryPatch) => {
      const { id, ...data } = values
      return client.service('categories').patch(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories'])
    }
  })
}

export const useCategoryRemoveMutation = () => {
  return useMutation({
    mutationFn: (id: Category['id']) => {
      return client.service('categories').remove(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories'])
    }
  })
}