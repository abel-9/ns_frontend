import ProfileDetail from "#/features/profile/screens/ProfileDetail";
import ProfileEducation from "#/features/profile/screens/ProfileEducation";
import ProfileWorkExperience from "#/features/profile/screens/ProfileWorkExperience";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="page-wrap py-10 sm:py-14">
      <ProfileDetail />
      <ProfileEducation />
      <ProfileWorkExperience />
    </main>
  );
}
