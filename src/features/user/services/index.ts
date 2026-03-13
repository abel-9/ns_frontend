import { api } from "#/lib/api";
import { authMiddleware } from "#/middlewares";
import { createServerFn } from "@tanstack/react-start";

export const getMe = createServerFn({method: 'GET'}).middleware([authMiddleware]).handler(async ({context}) => {
    const response = await api.get('/users/me', {
        headers: {
            Authorization: `Bearer ${context.accessToken}`,
        },
    });
    return response.data;
})