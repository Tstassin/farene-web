import { useQuery } from "@tanstack/react-query"
import { OrderItemQuery } from "../../../backend/src/services/order-items/order-items.schema"
import { client } from "../../api/api"

export const useOrderItems = (query?: OrderItemQuery, enabled = true) => {
  return useQuery({
    queryKey: ['order-items', query],
    queryFn: () => client.service('order-items').find({ query: { $limit: 250, ...query } }),
    enabled
  })
}