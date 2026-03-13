import { Link } from "@tanstack/react-router";
import { useState } from "react";

import LogoutButton from "#/features/auth/components/LogoutButton";
import { cn } from "#/lib/utils";

const sideMenus = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Chat", to: "/next-chat" },
  { label: "About", to: "/about" },
];

const DashboardSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200",
        isCollapsed ? "w-24" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between border-b border-sidebar-border px-3 py-4",
          isCollapsed && "justify-end",
        )}
      >
        <div className={cn("min-w-0", isCollapsed && "hidden")}>
          <p className="truncate text-sm font-bold text-foreground">NEXTstep</p>
          <p className="truncate text-xs text-muted-foreground">Dashboard</p>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed((value) => !value)}
          className="rounded-md border border-border bg-bg-light px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? ">" : "<"}
        </button>
      </div>

      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {sideMenus.map((menu) => (
            <li key={menu.to}>
              <Link
                to={menu.to}
                activeOptions={{ exact: menu.to === "/dashboard" }}
                className={cn(
                  "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                  isCollapsed && "justify-center px-2",
                )}
                activeProps={{
                  className:
                    "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                }}
              >
                {isCollapsed ? menu.label.slice(0, 1) : menu.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="[&_button]:w-full">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
