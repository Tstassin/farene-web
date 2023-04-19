import { Application, HookContext } from "../../declarations";

export const restrictResource = async (value: any, _: unknown, context: HookContext<Application>) => {
  if (context.params.user && !context.params.user.admin) {
    return context.params.user.id;
  }

  return value;
}