import { api } from "#/lib/api";
import { authMiddleware } from "#/middlewares";
import { createServerFn } from "@tanstack/react-start";
import { educationSchema } from "../schema/education";
import { workExperienceSchema } from "../schema/work_experience";

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const response = await api.get("/profile", {
      headers: {
        Authorization: `Bearer ${context.accessToken}`,
      },
    });
    return response.data;
  });

export const getProfileEducation = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const response = await api.get("/profile/education", {
      headers: {
        Authorization: `Bearer ${context.accessToken}`,
      },
    });
    return response.data;
  });

export const getProfileWorkExperience = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const response = await api.get("/profile/work-experience", {
      headers: {
        Authorization: `Bearer ${context.accessToken}`,
      },
    });
    return response.data;
  });

export const addProfileWorkExperience = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(workExperienceSchema)
  .handler(async ({ context, data }) => {
    const response = await api.post("/profile/work-experience", data, {
      headers: {
        Authorization: `Bearer ${context.accessToken}`,
      },
    });
    return response.data;
  });

export const addProfileEducation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(educationSchema)
  .handler(async ({ context, data }) => {
    const response = await api.post("/profile/education", data, {
      headers: {
        Authorization: `Bearer ${context.accessToken}`,
      },
    });
    return response.data;
  });
