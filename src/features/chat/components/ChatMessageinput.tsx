import { Button } from "#/components/ui/button";
import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

type ChatMessageInputProps = {
  onSubmit: (content: string) => void | Promise<void>;
  onStop?: () => void;
  disabled?: boolean;
  showStop?: boolean;
};

const ChatMessageInput = ({
  onSubmit,
  onStop,
  disabled = false,
  showStop = false,
}: ChatMessageInputProps) => {
  const [msg, setMsg] = useState("");
  const trimmed = msg.trim();

  const handleSubmit = async () => {
    if (!trimmed || disabled) {
      return;
    }

    await onSubmit(trimmed);
    setMsg("");
  };

  return (
    <form
      className="w-2/3 mt-2"
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
    >
      <div className="rounded-full border border-border flex bg-white p-1 gap-2 items-center">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-3 px-6 text-base outline-none disabled:opacity-60"
          value={msg}
          onChange={(event) => setMsg(event.target.value)}
          disabled={disabled}
        />

        {showStop && onStop ? (
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={onStop}
          >
            Stop
          </Button>
        ) : null}

        <Button
          type="submit"
          className="rounded-full h-full aspect-square"
          disabled={!trimmed || disabled}
        >
          <FaPaperPlane />
        </Button>
      </div>
    </form>
  );
};

export default ChatMessageInput;
