import { createMiddleware } from "@tanstack/react-start";
import { useAppSession } from "../lib/session";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await useAppSession();

  if (!session.data.access_token) {
    throw new Error("Unauthorized");
  }

  // Pass the token into the function's context
  return next({
    context: {
      accessToken: session.data.access_token,
    },
  });
});
