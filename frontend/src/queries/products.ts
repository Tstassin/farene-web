import { useMutation, useQuery } from "@tanstack/react-query"
import { queryClient } from ".."
import { Product, ProductData, ProductPatch } from "../../../backend/src/services/products/products.schema"
import { client } from "../../api/api"

export const useAllProducts = () => {
  return useQuery({ queryKey: ['products'], queryFn: () => client.service('products').find({ paginate: false }) })
}

const fetchProduct = async (id: Product['id'] | undefined) => {
  return typeof id === 'undefined'
    ? Promise.reject(new Error('Invalid id'))
    : client.service('products').get(id)
}
export const useProduct = (id: Product['id'] | undefined) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => fetchProduct(id),
    enabled: Boolean(id)
  })
}

export const useProductCreateMutation = () => {
  return useMutation({
    mutationFn: (data: ProductData) => {
      return client.service('products').create(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
    }
  })
}

export const useProductUpdateMutation = () => {
  return useMutation({
    mutationFn: (values: { id: Product['id'] } & ProductPatch) => {
      const { id, ...data } = values
      return client.service('products').patch(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
    }
  })
}

export const useProductRemoveMutation = () => {
  return useMutation({
    mutationFn: (id: Product['id']) => {
      return client.service('products').remove(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
    }
  })
}