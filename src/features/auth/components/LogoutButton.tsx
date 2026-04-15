import { Button } from "#/components/ui/button";
import { ClientOnly, useNavigate } from "@tanstack/react-router";
import { signout } from "../services";
import { useMutation } from "@tanstack/react-query";

const LogoutButton = () => {
  const navigator = useNavigate();
  const { mutate: signoutUser } = useMutation({
    mutationFn: signout,
    onSuccess: () => {
      navigator({ to: "/" });
    },
  });

  return (
    <ClientOnly
      fallback={
        <Button variant="outline" disabled>
          Logout
        </Button>
      }
    >
      <Button onClick={() => signoutUser({})}>Logout</Button>
    </ClientOnly>
  );
};

export default LogoutButton;
