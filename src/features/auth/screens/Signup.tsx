import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useState } from "react";
import { signup } from "../services";
import GoogleButton from "../components/GoogleButton";

const SignupScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const { mutate: signupUser } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      navigate({
        to: "/auth/email-verification",
        search: {
          email,
        },
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to sign up");
    },
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);
    setEmail(payload.email as string);
    signupUser({ data: payload });
  };

  return (
    <div className="min-h-screen bg-bg-base px-4 py-10 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-xl items-center justify-center">
        <div className="w-full rounded-xl border border-border bg-bg-light p-6 sm:p-8">
          <div className="mb-6 space-y-2 text-center">
            <p className="text-xs font-semibold tracking-[0.14em] text-kicker uppercase">
              Create account
            </p>
            <h1 className="text-2xl font-semibold text-foreground">
              Sign up to continue
            </h1>
            <p className="text-sm text-muted-foreground">
              Use your email and password, or continue with a provider.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2 text-left">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="email"
              >
                Email
              </label>
              <input
                autoComplete="email"
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                id="email"
                name="email"
                placeholder="you@example.com"
                type="email"
              />
            </div>

            <div className="space-y-2 text-left">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="password"
              >
                Password
              </label>
              <input
                autoComplete="new-password"
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                id="password"
                minLength={8}
                name="password"
                placeholder="At least 8 characters"
                type="password"
              />
            </div>

            <button
              className="mt-1 cursor-pointer inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-light focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              type="submit"
            >
              Sign up with email
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="text-xs text-muted-foreground uppercase tracking-[0.12em]">
              or continue with
            </span>
            <div className="h-px flex-1 bg-line" />
          </div>

          <div className="grid gap-3 sm:grid-cols-1">
            <GoogleButton />
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a
              className="font-semibold text-primary transition-colors hover:text-primary-light focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              href="/auth/signin"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;
