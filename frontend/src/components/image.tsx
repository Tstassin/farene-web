import { Center, Image, Input } from "@chakra-ui/react"
import { apiHostname } from "../../api/api"
import { useAssetCreateMutation } from "../queries/assets"
import React, {  useState } from "react"

export const ProductImage = ({ id, maxSize, triggerReload }: { id: number, maxSize?: number, triggerReload?: string }) => {
  const size = maxSize ?? 100
  const currentPath = (apiHostname + '/assets/products/' + id + '/' + id + '.jpg') + (triggerReload ? '?' + triggerReload : '')

  return (
    <Image src={currentPath} maxH={size} maxW={size} fallbackSrc={`https://placehold.co/${size}@2x/white/white/?text=/`}  />
  )
}

export const UpdateProductImage = ({ id, setUpdatedImageId }: { id: number, setUpdatedImageId: React.Dispatch<React.SetStateAction<number | undefined>> },) => {
  const assetCreateMutation = useAssetCreateMutation()
  const [reload, setReload] = useState('')

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const formData = new FormData()
      formData.append('service', 'products')
      formData.append('id', id.toString())
      formData.append('file', e.target.files[0])
      assetCreateMutation.mutateAsync(formData)
        .then(() => {
          setUpdatedImageId(id)
          setReload(Date.now().toString())
        })
    }
  }
  return (
    <>
      <Center>
        <ProductImage id={id} maxSize={250} triggerReload={reload} />
      </Center>
      <br />
      <Input type='file' onChange={uploadImage} />
    </>
  )
}