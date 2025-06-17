// hooks/useGetChatClient.ts
import { useChatContext } from "stream-chat-react";
import type { StreamChat } from "stream-chat";

/**
 * Custom hook to retrieve the Stream Chat client instance from context.
 * Returns null if the client is not yet initialized.
 */
export function useGetChatClient(): StreamChat | null {
  const { client } = useChatContext();

  // client will be undefined initially until StreamProvider sets it up
  return client ?? null;
}
