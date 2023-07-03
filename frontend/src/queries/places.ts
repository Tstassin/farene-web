import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { queryClient } from ".."
import { Place, PlaceData, PlacePatch } from "../../../backend/src/services/places/places.schema"
import { client } from "../../api/api"

export const useAllPlaces = () => {
  return useQuery({
    queryKey: ['places'],
    queryFn: () => client.service('places').find({ paginate: false })
  })
}

const fetchPlace = async ( id :  Place['id'] | undefined ) => {
  return typeof id === 'undefined'
  ? Promise.reject(new Error('Invalid id'))
  : client.service('places').get(id)
}
export const usePlace = ( id :  Place['id'] | undefined ) => {
  return useQuery({
      queryKey: ['places', id],
      queryFn: () => fetchPlace(id),
      enabled: Boolean(id)
    })
}

export const usePlaceCreateMutation = () => {
  return useMutation({
    mutationFn: (data: PlaceData) => {
      return client.service('places').create(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['places'])
    }
  })
}

export const usePlaceUpdateMutation = () => {
  return useMutation({
    mutationFn: (values: { id: Place['id'] } & PlacePatch) => {
      const { id, ...data } = values
      return client.service('places').patch(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['places'])
    }
  })
}

export const usePlaceRemoveMutation = () => {
  return useMutation({
    mutationFn: (id: Place['id']) => {
      return client.service('places').remove(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['places'])
    }
  })
}