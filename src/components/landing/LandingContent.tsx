import { Route } from "#/routes/__root";
import { Link } from "@tanstack/react-router";
import HeroSection from "./Hero";

const painPoints = [
  {
    icon: "🔎",
    title: "Keyword-based filters miss what really matters",
    description:
      "Traditional search tools often ignore context like your profile depth, future goals, and nuanced criteria.",
  },
  {
    icon: "📋",
    title: "Complex eligibility rules are hard to interpret manually",
    description:
      "Scholarship requirements vary widely, making it difficult to reliably assess your fit by hand.",
  },
  {
    icon: "⏰",
    title: "Expired deadlines waste your time",
    description:
      "Outdated listings and late discoveries cause missed opportunities and frustration for students.",
  },
];

const workflowSteps = [
  {
    title: "Upload Your CV",
    description:
      "PDF parsing extracts your academic background, skills, and experience automatically.",
  },
  {
    title: "AI Retrieves & Reasons",
    description:
      "Vector retrieval finds relevant opportunities while LLM reasoning evaluates eligibility and ranks fit contextually.",
  },
  {
    title: "Get Ranked Recommendations",
    description:
      "You receive active scholarships with concise explanations of why each one matches your profile.",
  },
];

const features = [
  {
    icon: "🧠",
    title: "Contextual Reasoning",
    description:
      "LLM analysis evaluates complex eligibility criteria instead of relying on surface similarity.",
  },
  {
    icon: "📅",
    title: "Deadline-Aware Filtering",
    description:
      "Only active, valid scholarships are surfaced in your recommendation list.",
  },
  {
    icon: "📄",
    title: "Smart CV Parsing",
    description:
      "Extracts GPA, field, skills, and experience from your PDF automatically.",
  },
  {
    icon: "💬",
    title: "Chatbot Assistance",
    description:
      "Interactive guidance helps you refine your search and understand options.",
  },
  {
    icon: "🔌",
    title: "Platform Integration",
    description:
      "Universities and scholarship portals can integrate NEXTstep through API and widget options.",
  },
  {
    icon: "📊",
    title: "Explainable Results",
    description:
      "Each match includes a clear reason so recommendations are transparent and actionable.",
  },
];

const v2Comparison = [
  {
    metric: "Matching Method",
    v1: "Cosine similarity",
    v2: "Vector retrieval + LLM reasoning",
  },
  {
    metric: "Eligibility Logic",
    v1: "No",
    v2: "Yes",
  },
  {
    metric: "Deadline Awareness",
    v1: "No",
    v2: "Yes",
  },
  {
    metric: "Explainability",
    v1: "No",
    v2: "Yes",
  },
  {
    metric: "External Integration",
    v1: "No",
    v2: "API + Widget",
  },
];

const partnerBenefits = [
  "Easy integration via script tag",
  "API key authentication",
  "Usage monitoring dashboard",
];

const teamMembers = [
  { name: "Abel Girmay", role: "Backend & AI Pipeline" },
  { name: "Awet Bisrat", role: "Frontend & UX" },
  { name: "Netsanet Teklegiorgis", role: "Data & Retrieval Engineering" },
  { name: "Yohannes Fishaye", role: "System Integration & QA" },
];

const LandingContent = () => {
  const { user } = Route.useLoaderData();
  return (
    <main id="top">
      <HeroSection user={user} />

      <section className="px-4 py-16">
        <div className="page-wrap">
          <p className="island-kicker m-0">Problem</p>
          <h2 className="display-title mt-3 text-3xl text-sea-ink sm:text-4xl">
            The Problem With Scholarship Search Today
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {painPoints.map((point) => (
              <article
                key={point.title}
                className="feature-card rounded-2xl border border-border p-5"
              >
                <p className="m-0 text-2xl">{point.icon}</p>
                <h3 className="mt-3 text-lg text-foreground">{point.title}</h3>
                <p className="m-0 text-sm text-muted-foreground">
                  {point.description}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-8 text-base font-medium text-foreground">
            Existing platforms are information repositories, not intelligent
            advisors.
          </p>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-y border-line bg-bg-base px-4 py-16"
      >
        <div className="page-wrap">
          <p className="island-kicker m-0">How It Works</p>
          <h2 className="display-title mt-3 text-3xl text-sea-ink sm:text-4xl">
            Intelligent Matching in 3 Steps
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {workflowSteps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-2xl border border-border bg-bg-light p-5"
              >
                <p className="m-0 text-sm font-bold text-primary">
                  Step {index + 1}
                </p>
                <h3 className="mt-2 text-lg text-foreground">{step.title}</h3>
                <p className="m-0 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Powered by RAG architecture combining semantic retrieval with large
            language model reasoning.
          </p>
        </div>
      </section>

      <section id="features" className="px-4 py-16">
        <div className="page-wrap">
          <p className="island-kicker m-0">Features</p>
          <h2 className="display-title mt-3 text-3xl text-sea-ink sm:text-4xl">
            Built for Accuracy. Designed for Equity.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="feature-card rounded-2xl border border-border p-5"
              >
                <p className="m-0 text-2xl">{feature.icon}</p>
                <h3 className="mt-3 text-lg text-foreground">
                  {feature.title}
                </h3>
                <p className="m-0 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-bg-base px-4 py-16">
        <div className="page-wrap">
          <p className="island-kicker m-0">Comparison</p>
          <h2 className="display-title mt-3 text-3xl text-sea-ink sm:text-4xl">
            A Significant Leap From Our Previous System
          </h2>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-bg-light">
            <table className="w-full min-w-160 border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-secondary text-foreground">
                  <th className="px-4 py-3">Metric</th>
                  <th className="px-4 py-3">
                    NEXTstep v1.0 (SpaCy + SentenceTransformer)
                  </th>
                  <th className="px-4 py-3">NEXTstep v2.0 (RAG)</th>
                </tr>
              </thead>
              <tbody>
                {v2Comparison.map((row) => (
                  <tr
                    key={row.metric}
                    className="border-b border-line last:border-b-0"
                  >
                    <td className="px-4 py-3 font-semibold text-foreground">
                      {row.metric}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.v1}
                    </td>
                    <td className="px-4 py-3 text-foreground">{row.v2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <blockquote className="mt-6 rounded-2xl border-l-4 border-accent bg-bg-light p-5 text-sm text-foreground">
            “NEXTstep v2 helped me discover scholarships I would have skipped
            manually because the criteria looked too complex.”
          </blockquote>
        </div>
      </section>

      <section id="for-partners" className="px-4 py-16">
        <div className="page-wrap grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p className="island-kicker m-0">For Partners</p>
            <h2 className="display-title mt-3 text-3xl text-sea-ink sm:text-4xl">
              Bring Intelligent Scholarship Matching to Your Platform
            </h2>
            <p className="mt-4 max-w-2xl text-base text-foreground">
              Universities, scholarship portals, and NGOs can integrate NEXTstep
              directly into their websites using our embeddable widget and API,
              no infrastructure required.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-bg-light p-6">
            <ul className="m-0 list-disc space-y-2 pl-5 text-sm text-foreground">
              {partnerBenefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
            <a
              href="#final-cta"
              className="mt-5 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground no-underline hover:bg-primary-light"
            >
              Request Partner Access
            </a>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="border-y border-line bg-bg-base px-4 py-16"
      >
        <div className="page-wrap">
          <p className="island-kicker m-0">About</p>
          <h2 className="display-title mt-3 text-3xl text-sea-ink sm:text-4xl">
            Built by Students, for Students
          </h2>
          <p className="mt-4 max-w-3xl text-base text-foreground">
            NEXTstep was developed at Mekelle Institute of Technology, Mekelle
            University, as a final-year research project in Computer Science and
            Engineering.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="rounded-2xl border border-border bg-bg-light p-5"
              >
                <h3 className="m-0 text-base text-foreground">{member.name}</h3>
                <p className="m-0 mt-2 text-sm text-muted-foreground">
                  {member.role}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="final-cta" className="px-4 py-16">
        <div className="page-wrap rounded-3xl border border-border bg-bg-light p-8 text-center sm:p-12">
          <p className="island-kicker m-0">Start Now</p>
          <h2 className="display-title mt-3 text-3xl text-sea-ink sm:text-4xl">
            Your Next Scholarship Is One Upload Away
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Join students who are matching smarter, not harder.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {!user && (
              <Link
                to="/auth/signup"
                className="rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground no-underline hover:bg-primary-light"
              >
                Get Started — Upload Your CV
              </Link>
            )}
            <a
              href="#about"
              className="rounded-full border border-border px-7 py-3 text-sm font-bold text-foreground no-underline hover:bg-secondary"
            >
              Learn more about the research →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingContent;
