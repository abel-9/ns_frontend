import SignupScreen from "#/features/auth/screens/Signup";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SignupScreen />;
}
