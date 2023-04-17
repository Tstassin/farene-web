// For more information about this file see https://dove.feathersjs.com/guides/cli/log-error.html
import type { HookContext, NextFunction } from "../declarations";
import { logger } from "../logger";

export const logError = async (context: HookContext, next: NextFunction) => {
  try {
    await next();
  } catch (error: any) {
    logErrorToConsole(error)

    throw error;
  }
};

export const logErrorToConsole = (error: any) => {
  if (typeof error === 'string') logger.error(error)
  else {
    const { code, message } = error;
    //console.log(error)
    logger.error({ code, message });
  
    // Log validation errors
    if (error.data) {
      logger.error("Data: %O", error.data);
    }
  }
}