import { signinWithGoogle } from "#/features/auth/services";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";

const callbackSearchSchema = z.object({
  code: z.string().optional(),
});

export const Route = createFileRoute("/auth/callback/google")({
  validateSearch: (search) => callbackSearchSchema.parse(search),
  loaderDeps: ({ search: { code } }) => ({ code }),
  loader: async ({ deps: { code } }) => {
    if (!code) return null;

    try {
      const response = await signinWithGoogle({ data: { code } });
      return {
        success: true,
        message: response,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error?.message || "An error occurred during Google sign-up.",
      };
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const loaderData = useLoaderData({ from: "/auth/callback/google" });
  const navigate = Route.useNavigate();

  console.log("Loader data:", loaderData);

  useEffect(() => {
    // Only trigger if loaderData exists and has not been "seen" yet
    if (!loaderData) return;
    if (loaderData.success) {
      toast.success("signup successfully"); // ID prevents duplicates
      navigate({ to: "/" });
    } else if (loaderData.success === false) {
      toast.error(loaderData.message);
      navigate({ to: "/auth/signup" });
    }
  }, [loaderData]);
  return <div>Redirecting...</div>;
}
