import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { queryClient } from ".."
import { Category, CategoryData, CategoryPatch } from "../../../backend/src/services/categories/categories.schema"
import { FormType } from "../../../backend/src/services/delivery-options/delivery-options.schema"
import { client } from "../../api/api"

export const useAllCategories = (formType?: FormType) => {
  return useQuery({
    queryKey: ['categories', formType],
    queryFn: () => client.service('categories').find({ paginate: false, query: { type: formType } })
  })
}

const fetchCategory = async (id: Category['id'] | undefined) => {
  return typeof id === 'undefined'
    ? Promise.reject(new Error('Invalid id'))
    : client.service('categories').get(id)
}
export const useCategory = (id: Category['id'] | undefined) => {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => fetchCategory(id),
    enabled: Boolean(id)
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
    mutationFn: (values: { id: Category['id'] } & CategoryPatch) => {
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