import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useChatSession } from "#/features/chat";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";

export const Route = createFileRoute("/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  const [message, setMessage] = useState("");
  const { state, initialize, sendMessage, reconnect, endSession } =
    useChatSession();

  useEffect(() => {
    void initialize();
  }, [initialize]);

  const canSend = useMemo(() => {
    return message.trim().length > 0 && !state.pendingSend;
  }, [message, state.pendingSend]);

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSend) {
      return;
    }

    const outbound = message.trim();
    setMessage("");
    await sendMessage(outbound);
  };

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-4">
      <header className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-bg-light p-4">
        <div>
          <h1 className="text-xl font-semibold">Chat Session</h1>
          <p className="text-sm text-muted-foreground">
            Status: <span className="font-medium">{state.connection}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Conversation: {state.conversationId ?? "not started"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={reconnect}>
            Retry
          </Button>
          <Button type="button" variant="destructive" onClick={endSession}>
            End Session
          </Button>
        </div>
      </header>

      {state.lastError && (
        <section className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <p className="font-medium">{state.lastError.message}</p>
          <p>Recoverable: {state.lastError.recoverable ? "yes" : "no"}</p>
        </section>
      )}

      <section className="h-[60vh] overflow-y-auto rounded-xl border border-border bg-background p-4">
        {state.timeline.length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          <div className="space-y-3">
            {state.timeline.map((item) => {
              const isUser = item.role === "user";
              return (
                <article
                  key={item.id}
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    isUser
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "mr-auto bg-muted text-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{item.content}</p>
                  {!!item.citations?.length && (
                    <div className="mt-2 space-y-1">
                      {item.citations.map((citation, index) => (
                        <p
                          key={`${item.id}-citation-${index}`}
                          className="text-xs opacity-80"
                        >
                          {citation.url ? (
                            <a
                              href={citation.url}
                              target="_blank"
                              rel="noreferrer"
                              className="underline"
                            >
                              {citation.title ?? citation.url}
                            </a>
                          ) : (
                            (citation.title ?? "Citation")
                          )}
                        </p>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <form onSubmit={handleSend} className="flex items-center gap-2">
        <Input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Send a message"
          disabled={state.connection === "auth-failed"}
        />
        <Button type="submit" disabled={!canSend}>
          {state.pendingSend ? "Sending..." : "Send"}
        </Button>
      </form>
    </main>
  );
}
