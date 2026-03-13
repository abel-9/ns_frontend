import { createFileRoute } from "@tanstack/react-router";
import LandingContent from "@/components/landing/LandingContent";
import AppBar from "@/components/shared/AppBar";
import Footer from "@/components/shared/Footer";
import { Route as RootRoute } from "#/routes/__root";
import ChatbotButton from "#/components/shared/ChatbotButton";

export const Route = createFileRoute("/")({
  component: App,
});

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "For Partners", href: "#for-partners" },
  { label: "About", href: "#about" },
];

function App() {
  const { user } = RootRoute.useLoaderData();
  return (
    <div className="bg-background text-foreground">
      <AppBar navLinks={navLinks} />
      <LandingContent />
      <Footer />
      <div className="fixed bottom-4 left-4">{user && <ChatbotButton />}</div>
    </div>
  );
}
