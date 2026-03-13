import { createFileRoute, Outlet } from "@tanstack/react-router";

import DashboardSidebar from "#/components/shared/DashboardSidebar";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-bg-base">
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <main className="flex-1 bg-background p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
