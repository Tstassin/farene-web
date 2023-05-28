import {  ValidatorFn } from "feathers-hooks-common"
import { HookContext } from "@feathersjs/feathers";
import { PlaceData, PlacePatch } from "./places.class"
import { BadRequest, errors } from "@feathersjs/errors/lib";

export const noDuplicatePlaceName: ValidatorFn = async (data: PlaceData | PlacePatch, context: HookContext) => {
  if ('name' in data) {
    const { name } = data
    const placesWithSameName = await context.app.service('places').find({ query: { name }, paginate: false })
    if (placesWithSameName.length > 0) {
      throw new BadRequest('A place with the same name already exists')
    }
  }
  return data
}