import { cn } from "#/lib/utils";
import { useEffect, useId, useRef, useState } from "react";
import Chat from "./Chat";

const ChatbotButton = () => {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      window.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div
        id={panelId}
        role="dialog"
        aria-label="Chat support"
        aria-hidden={!open}
        className={cn(
          "absolute bottom-16 left-0 z-30 w-[min(22rem,calc(100vw-2rem))] origin-bottom-left transition-all duration-300 ease-out",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-2 scale-95 opacity-0",
        )}
      >
        <Chat onclose={() => setOpen(false)} />
      </div>

      <div className="relative flex h-12 w-12 items-center justify-center">
        <span
          className={cn(
            "chatbot-fab-glow absolute inset-0 rounded-full bg-primary/25 blur-md",
            open && "opacity-0",
          )}
          aria-hidden="true"
        />

        <button
          type="button"
          aria-haspopup="dialog"
          aria-controls={panelId}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="chatbot-fab-float relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-bg-light shadow-lg transition hover:-translate-y-0.5 hover:bg-link-bg-hover focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
        >
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-accent ring-2 ring-bg-light" />
          <img
            src="/chatbot_logo.png"
            alt="Chatbot"
            className={cn(
              "h-7 w-7 object-contain transition-transform duration-300",
              open && "scale-95 rotate-6",
            )}
          />
        </button>
      </div>
    </div>
  );
};

export default ChatbotButton;
