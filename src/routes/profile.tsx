import { createFileRoute } from "@tanstack/react-router";

const metrics = [
  {
    title: "Projects launched",
    value: "14",
    detail: "End-to-end prototypes shipped since January",
    accent: "--primary",
  },
  {
    title: "User calls",
    value: "38",
    detail: "Working sessions shadowing actual workflows",
    accent: "--accent",
  },
  {
    title: "Iterations in review",
    value: "6",
    detail: "Active variations awaiting synthesis",
    accent: "--secondary-foreground",
  },
  {
    title: "Hours logged",
    value: "212h",
    detail: "Design + research time this quarter",
    accent: "--primary-light",
  },
];

const statusUpdates = [
  {
    title: "Availability",
    detail: "Slots open from March 12",
    tone: "--success",
  },
  {
    title: "Next review",
    detail: "Prototype walkthrough · Friday 4p",
    tone: "--secondary",
  },
  {
    title: "Current focus",
    detail: "Dashboard refresh + omni-search",
    tone: "--accent",
  },
];

const timeline = [
  {
    title: "Research",
    detail:
      "Captured qualitative notes from 3 support calls and lit the backlog with verbatim needs.",
    date: "Feb 26",
  },
  {
    title: "Wireframes",
    detail:
      "Built low-fidelity flows inside Loom & synced with engineering for early feedback loops.",
    date: "Feb 28",
  },
  {
    title: "Prototype",
    detail:
      "Live build in Figma + React; prepping for user-facing validation on Monday.",
    date: "Mar 2",
  },
];

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-bg-base text-foreground px-4 py-10">
      <div className="page-wrap space-y-8">
        <section
          className="rounded-[32px] border p-8 shadow-[0_20px_45px_rgba(23,58,64,0.12)]"
          style={{
            background: "var(--surface)",
            borderColor: "var(--line)",
          }}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end">
            <div className="flex items-center gap-5">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-2xl border-2"
                style={{
                  borderColor: "var(--accent)",
                  background:
                    "color-mix(in oklab, var(--accent) 20%, transparent 80%)",
                }}
              >
                <span
                  className="text-lg font-semibold"
                  style={{ color: "var(--accent-foreground)" }}
                >
                  AB
                </span>
              </div>
              <div>
                <p
                  className="text-xs uppercase tracking-[0.4em]"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Lead designer
                </p>
                <h1
                  className="text-3xl font-semibold"
                  style={{ color: "var(--sea-ink)" }}
                >
                  Ada Bennett
                </h1>
              </div>
            </div>
            <div
              className="flex flex-1 flex-wrap gap-3 text-sm"
              style={{ color: "var(--muted-foreground)" }}
            >
              <span
                className="rounded-full border px-4 py-1"
                style={{ borderColor: "var(--line)" }}
              >
                Tealcity · Design Systems
              </span>
              <span
                className="rounded-full border px-4 py-1"
                style={{ borderColor: "var(--line)" }}
              >
                Prototype lab
              </span>
            </div>
            <button
              type="button"
              className="rounded-full px-6 py-2 text-sm font-semibold"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              Schedule review
            </button>
          </div>
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            Designing a calm, instructional profile shell for leadership to
            preview status at a glance. Each token is intentional: navy for
            actions, brass for highlights, and matte surfaces to let the content
            breathe.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {statusUpdates.map((update) => (
              <span
                key={update.title}
                className="rounded-2xl border px-4 py-2 text-sm text-foreground"
                style={{
                  borderColor: "var(--line)",
                  background: "var(--bg-light)",
                  color: `var(${update.tone})`,
                }}
              >
                <strong
                  className="block text-xs uppercase tracking-[0.3em]"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {update.title}
                </strong>
                <span>{update.detail}</span>
              </span>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {metrics.map((metric) => (
            <article
              key={metric.title}
              className="overflow-hidden rounded-3xl border p-6"
              style={{
                background: "var(--bg-light)",
                borderColor: "var(--line)",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-[0.4em]"
                style={{ color: "var(--muted-foreground)" }}
              >
                {metric.title}
              </p>
              <p
                className="mt-3 text-4xl font-semibold"
                style={{ color: `var(${metric.accent})` }}
              >
                {metric.value}
              </p>
              <p
                className="mt-1 text-sm leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                {metric.detail}
              </p>
            </article>
          ))}
        </section>

        <section
          className="rounded-[28px] border p-8"
          style={{
            background:
              "linear-gradient(160deg, var(--surface-strong), color-mix(in oklab, var(--surface) 70%, white 30%))",
            borderColor: "var(--line)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm uppercase tracking-[0.4em]"
                style={{ color: "var(--kicker)" }}
              >
                Sprint timeline
              </p>
              <h2
                className="mt-2 text-2xl font-semibold"
                style={{ color: "var(--sea-ink)" }}
              >
                What the next milestone looks like
              </h2>
            </div>
            <span
              className="px-4 py-1 text-xs font-semibold uppercase"
              style={{
                borderRadius: "999px",
                border: "1px solid var(--accent)",
                color: "var(--accent)",
              }}
            >
              Live prototype
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {timeline.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <span
                  className="mt-1 h-2 w-2 rounded-full"
                  style={{
                    background: "var(--accent)",
                  }}
                />
                <div
                  className="flex-1 border-b pb-3"
                  style={{ borderColor: "var(--line)" }}
                >
                  <div className="flex items-center justify-between">
                    <p
                      className="font-semibold"
                      style={{ color: "var(--sea-ink)" }}
                    >
                      {item.title}
                    </p>
                    <span
                      className="text-xs uppercase tracking-[0.3em]"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {item.date}
                    </span>
                  </div>
                  <p
                    className="mt-1 text-sm leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
