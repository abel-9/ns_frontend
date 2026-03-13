import { Link } from "@tanstack/react-router";
import LogoutButton from "#/features/auth/components/LogoutButton";
import { Route } from "#/routes/__root";

type AppBarLink = {
  label: string;
  href: string;
};

type AppBarProps = {
  navLinks: AppBarLink[];
};

const AppBar = ({ navLinks }: AppBarProps) => {
  const { user } = Route.useLoaderData();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg-light">
      <nav className="page-wrap flex flex-wrap items-center gap-3 py-4">
        <div className="mr-auto">
          <a href="#top" className="no-underline">
            <p className="m-0 text-lg font-extrabold text-sea-ink">NEXTstep</p>
            <p className="m-0 text-xs text-muted-foreground">
              AI-Powered Scholarship Matching
            </p>
          </a>
        </div>

        <div className="order-3 flex w-full flex-wrap items-center gap-1 text-sm sm:order-0 sm:w-auto sm:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-foreground no-underline hover:bg-link-bg-hover"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-foreground">
                Welcome, {user.email}
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                to="/auth/signin"
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground no-underline hover:bg-secondary"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default AppBar;
