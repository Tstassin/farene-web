import { Forbidden } from "@feathersjs/errors/lib";
import { HookContext } from "@feathersjs/feathers";
import { Application } from "../../declarations";

export const restrictToAdmin = (context: HookContext<Application>) => {
  if (context.params.user && !context.params.user.admin) {
    throw new Forbidden()
  }
  return context
}