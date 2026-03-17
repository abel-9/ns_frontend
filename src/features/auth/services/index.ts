import { api } from "#/lib/api";
import { useAppSession } from "#/lib/session";
import { authMiddleware } from "#/middlewares";
import { createServerFn } from "@tanstack/react-start";

export const signup = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data }) => {
    const response = await api.post("/auth/sign-up", data);
    return response.data;
  });

export const verifyEmail = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data }) => {
    const response = await api.post("/auth/verify-email", data);
    return response.data;
  });

export const signin = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data }) => {
    const response = await api.post("/auth/sign-in", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const tokenPairs = response.data;
    const session = await useAppSession();
    await session.update({
      access_token: tokenPairs.access_token,
      refresh_token: tokenPairs.refresh_token,
    });
    return response.data;
  });

export const signinWithGoogle = createServerFn({ method: "POST" })
  .inputValidator((data: { code: string }) => data)
  .handler(async ({ data }) => {
    const response = await api.post("/auth/sign-up/google", {
      token_id: data.code,
    });
    const tokenPairs = response.data;
    const session = await useAppSession();
    await session.update({
      access_token: tokenPairs.access_token,
      refresh_token: tokenPairs.refresh_token,
    });
    return tokenPairs;
  });

export const googleOAuthUrl = createServerFn({ method: "GET" }).handler(
  async () => {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.REDIRECT_URI!,
      response_type: "code",
      scope:
        "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    }).toString();

    // MUST include /o/oauth2/v2/auth
    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  },
);

export const signout = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    console.log("Signing out...");
    const response = await api.post("/auth/sign-out", null, {
      headers: {
        Authorization: `Bearer ${context.accessToken}`,
      },
    });
    const session = await useAppSession();
    await session.clear();
    return response.data;
  });
