type MessageHandler = (data: any) => void;

class SocketPubSub {
  private subscribers: Map<string, Set<MessageHandler>> = new Map();
  // Buffer to store messages that arrived before any subscribers
  private messageBuffer: Map<string, any[]> = new Map();

  subscribe(type: string, handler: MessageHandler) {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set());
    }
    this.subscribers.get(type)!.add(handler);

    // REPLAY LOGIC: If there are buffered messages for this type, send them now
    if (this.messageBuffer.has(type)) {
      const messages = this.messageBuffer.get(type)!;
      messages.forEach((data) => handler(data));
      // Clear buffer after replaying so they aren't sent again to future subscribers
      // (Or keep them if you want every new subscriber to see history)
      this.messageBuffer.delete(type);
    }

    return () => this.subscribers.get(type)?.delete(handler);
  }

  publish(type: string, data: any) {
    const handlers = this.subscribers.get(type);

    if (handlers && handlers.size > 0) {
      // If someone is listening, send it immediately
      handlers.forEach((handler) => handler(data));
    } else {
      // If NO ONE is listening, store it for later
      if (!this.messageBuffer.has(type)) {
        this.messageBuffer.set(type, []);
      }
      this.messageBuffer.get(type)!.push(data);
    }
  }
}

export const socketPubSub = new SocketPubSub();
