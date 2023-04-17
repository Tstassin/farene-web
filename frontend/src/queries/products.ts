import { useMutation, useQuery } from "@tanstack/react-query"
import { queryClient } from ".."
import { OrderQuery } from "../../../backend/src/services/orders/orders.schema"
import { Product, ProductData, ProductPatch, ProductQuery, ProductUpdate } from "../../../backend/src/services/products/products.schema"
import { client } from "../../api/api"

export const useAllProducts = (query?: ProductQuery) => {
  return useQuery({ queryKey: ['products'], queryFn: () => client.service('products').find({ query, paginate: false }) })
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
    mutationFn: (values: { id: Product['id'] } & ProductUpdate) => {
      const { id, ...data } = values
      return client.service('products').update(id, data)
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