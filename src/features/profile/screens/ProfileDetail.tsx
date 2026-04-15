import { useAuth } from "#/contexts/AuthContext";

const ProfileDetail = () => {
  const { user } = useAuth();

  const email = user?.email ?? "No email available";
  const role = user?.role?.trim() || "Professional";
  const displayName =
    email !== "No email available"
      ? email.split("@")[0].replace(/[._-]+/g, " ")
      : "Profile";
  const summary =
    user !== null
      ? `Authenticated profile with role ${role} and contact email ${email}.`
      : "Profile information is not available yet.";

  return (
    <section className="rise-in pb-12 sm:pb-16">
      <header className="grid gap-8 border-b border-line pb-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <h1 className="capitalize display-title text-5xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-7xl">
            {displayName}
          </h1>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:text-sm">
            {role}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Contact
          </p>
          <p className="mt-2 break-all text-sm leading-relaxed text-(--foreground)/70 sm:text-[0.94rem]">
            {email}
          </p>
        </div>
      </header>

      <div className="pt-12 sm:pt-14">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Executive Summary
        </p>
        <p className="mt-4 max-w-3xl text-[1.02rem] leading-7 text-foreground/88 sm:text-lg sm:leading-8">
          {summary}
        </p>
      </div>
    </section>
  );
};

export default ProfileDetail;
