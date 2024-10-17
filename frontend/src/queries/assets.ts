import { useMutation } from "@tanstack/react-query"
import { Asset } from "../../../backend/src/client"
import { apiHostname } from "../../api/api"
import { getAuthentication } from "./users"

export const assetCreateMutationkey = ['asset-create-mutation']

const createAsset = (data: FormData) => {
  const accessToken = getAuthentication()?.accessToken
  const Authorization = 'Bearer ' + accessToken
  return fetch(apiHostname + '/assets', { method: 'POST', body: data, headers: { Authorization } }) as unknown as Promise<Asset>
}

export const useAssetCreateMutation = () => {
  return useMutation({
    mutationFn: (data: FormData) => {
      return createAsset(data)
    },
    mutationKey: ['asset-create-mutation']
  })
}
