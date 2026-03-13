import { ClientOnly } from "@tanstack/react-router";
import { FaGoogle } from "react-icons/fa";
import { googleOAuthUrl } from "../services";

const GoogleButton = () => {
  return (
    <ClientOnly
      fallback={
        <button
          className="cursor-not-allowed inline-flex h-11 items-center justify-center rounded-md border border-border bg-secondary/50 px-3 text-sm font-medium text-secondary-foreground transition-colors"
          type="button"
          disabled
        >
          <FaGoogle className="mr-2 h-4 w-4" />
          Google
        </button>
      }
    >
      <button
        className="cursor-pointer inline-flex h-11 items-center justify-center rounded-md border border-border bg-secondary px-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-link-bg-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        type="button"
        onClick={async () => {
          const googleUrl = await googleOAuthUrl();
          window.location.href = googleUrl;
        }}
      >
        <FaGoogle className="mr-2 h-4 w-4" />
        Google
      </button>
    </ClientOnly>
  );
};

export default GoogleButton;
