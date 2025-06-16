// hooks/useGetChatClient.ts
import { useChatContext } from "stream-chat-react";
import type { StreamChat } from "stream-chat";

/**
 * Custom hook to retrieve the Stream Chat client instance from context.
 * Throws an error if the client is not yet initialized.
 *
 * @returns {StreamChat} - Initialized StreamChat client
 */
export function useGetChatClient(): StreamChat {
  const { client } = useChatContext();
  if (!client) {
    throw new Error(
      "Stream Chat client is not available. Make sure you are rendering within <Chat> context."
    );
  }
  return client;
}
