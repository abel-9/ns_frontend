import type { Me } from "#/features/user/types";
import Carousal from "../shared/Carousal";

const HeroSection: React.FC<{ user: Me | null }> = ({ user }) => {
  return (
    <Carousal className="h-[50vh] border-b border-line">
      <Carousal.ArrowLeft />
      <Carousal.ArrowRight />
      <Carousal.Item className="w-full h-full">
        <Carousal.Image
          src="/hero_1.png"
          className="opacity-70 after:absolute after:inset-0 after:bg-linear-to-r after:from-black/70 after:via-black/45 after:to-black/30"
        />
        <Carousal.Content className="page-wrap w-full h-full flex flex-col justify-center p-10 text-white">
          <p className="island-kicker m-0 text-white/85">
            Scholarship Discovery Reimagined
          </p>
          <h2 className="text-4xl font-bold drop-shadow-lg">
            Find Scholarships That Actually Match You
          </h2>
          <p className="text-xl">
            AI-powered matching based on your CV, eligibility, and deadlines.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {!user ? (
              <>
                <a
                  href="#final-cta"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground no-underline transition hover:bg-primary-light"
                >
                  Upload Your CV - Get Matched
                </a>
                <a
                  href="#how-it-works"
                  className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white no-underline transition hover:bg-white/20"
                >
                  See How It Works
                </a>
              </>
            ) : (
              <>
                <a
                  href="/dashboard"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground no-underline transition hover:bg-primary-light"
                >
                  Go to Dashboard
                </a>
                <a
                  href="#features"
                  className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white no-underline transition hover:bg-white/20"
                >
                  Explore Features
                </a>
              </>
            )}
          </div>
        </Carousal.Content>
      </Carousal.Item>
      <Carousal.Item className="w-full h-full">
        <Carousal.Image
          src="/hero_3.png"
          className="opacity-80 after:absolute after:inset-0 after:bg-linear-to-r after:from-black/70 after:via-black/45 after:to-black/30"
        />

        {/* 2. Text Content (Needs 'relative' to respect z-index) */}
        <Carousal.Content className="page-wrap w-full h-full flex flex-col justify-center p-10 text-white">
          <p className="island-kicker m-0 text-white/85">
            Scholarship Discovery Reimagined
          </p>
          <h2 className="text-4xl font-bold drop-shadow-lg">
            Upload Once, Get Ranked Matches
          </h2>
          <p className="text-xl">
            Parse your profile and receive clear recommendations in minutes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {!user ? (
              <>
                <a
                  href="/auth/signup"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground no-underline transition hover:bg-primary-light"
                >
                  Create Free Account
                </a>
                <a
                  href="#how-it-works"
                  className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white no-underline transition hover:bg-white/20"
                >
                  Learn the Process
                </a>
              </>
            ) : (
              <>
                <a
                  href="/dashboard"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground no-underline transition hover:bg-primary-light"
                >
                  View My Matches
                </a>
                <a
                  href="#features"
                  className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white no-underline transition hover:bg-white/20"
                >
                  See Platform Features
                </a>
              </>
            )}
          </div>
        </Carousal.Content>
      </Carousal.Item>
      <Carousal.Item className="w-full h-full">
        <Carousal.Image
          src="/hero_2.png"
          className="opacity-80 after:absolute after:inset-0 after:bg-linear-to-r after:from-black/70 after:via-black/45 after:to-black/30"
        />

        {/* 2. Text Content (Needs 'relative' to respect z-index) */}
        <Carousal.Content className="page-wrap w-full h-full flex flex-col justify-center p-10 text-white">
          <p className="island-kicker m-0 text-white/85">
            Scholarship Discovery Reimagined
          </p>
          <h2 className="text-4xl font-bold drop-shadow-lg">
            Never Miss Active Opportunities
          </h2>
          <p className="text-xl">
            Focus on open scholarships with transparent eligibility insights.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {!user ? (
              <>
                <a
                  href="#final-cta"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground no-underline transition hover:bg-primary-light"
                >
                  Start Matching Now
                </a>
                <a
                  href="#about"
                  className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white no-underline transition hover:bg-white/20"
                >
                  About NEXTstep
                </a>
              </>
            ) : (
              <>
                <a
                  href="/dashboard"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground no-underline transition hover:bg-primary-light"
                >
                  Continue in Dashboard
                </a>
                <a
                  href="#for-partners"
                  className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white no-underline transition hover:bg-white/20"
                >
                  Partner Information
                </a>
              </>
            )}
          </div>
        </Carousal.Content>
      </Carousal.Item>
    </Carousal>
  );
};

export default HeroSection;
