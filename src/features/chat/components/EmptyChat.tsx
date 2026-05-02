import ChatMessageInput from "./ChatMessageinput";

const EmptyChat = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <p className="text-lg font-medium">Ready to chat!</p>
      <ChatMessageInput />
      {/* {isError ? (
        <p className="mt-2 text-sm text-red-600">
          {error instanceof Error ? error.message : "Failed to send message"}
        </p>
      ) : null} */}
    </div>
  );
};

export default EmptyChat;
