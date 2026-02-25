import { auth } from "~~/server/auth";
import { toWebRequest } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const webRequest = toWebRequest(event);
    return await auth.handler(webRequest);
  } catch (error) {
    console.error("[Better Auth Handler Error]:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error in Better Auth handler",
      data: error
    });
  }
});
