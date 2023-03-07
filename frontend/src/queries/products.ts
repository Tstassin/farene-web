import { useQuery } from "@tanstack/react-query"
import { client } from "../../api/api"

export const useAllProducts = () => {
  return useQuery({ queryKey: ['products'], queryFn: () => client.service('products').find({paginate: false}) })
}

export const useProductMutation = () => {
  
}