"use client";

import { tokenProvider } from "@/actions/stream.actions";
import Loader from "@/components/Loader";
import { useUser } from "@clerk/nextjs";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { StreamChat } from "stream-chat";
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";
import { ReactNode, useEffect, useState } from "react";

const STREAM_VIDEO_KEY = process.env.NEXT_PUBLIC_STREAM_VIDEO_KEY;
const STREAM_CHAT_KEY = process.env.NEXT_PUBLIC_STREAM_CHAT_KEY;

export const StreamProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const [chatClient, setChatClient] = useState<StreamChat>();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    if (!STREAM_VIDEO_KEY) throw new Error("Stream Video API key is missing");
    if (!STREAM_CHAT_KEY) throw new Error("Stream Chat API key is missing");

    let localChatClient: StreamChat | null = null;
    let localVideoClient: StreamVideoClient | null = null;

    const setupClients = async () => {
      try {
        const { videoToken, chatToken } = await tokenProvider();

        localVideoClient = new StreamVideoClient({
          apiKey: STREAM_VIDEO_KEY,
          user: {
            id: user.id,
            name: user.username || user.id,
            image: user.imageUrl,
          },
          tokenProvider: async () => videoToken,
        });

        localChatClient = StreamChat.getInstance(STREAM_CHAT_KEY);
        await localChatClient.connectUser(
          {
            id: user.id,
            name: user.username || user.id,
            image: user.imageUrl,
          },
          async () => chatToken
        );

        setVideoClient(localVideoClient);
        setChatClient(localChatClient);
      } catch (error) {
        console.error("Error initializing Stream clients:", error);
      }
    };

    setupClients();

    return () => {
      if (localChatClient) localChatClient.disconnectUser();
      if (localVideoClient) localVideoClient.disconnectUser();
    };
  }, [user, isLoaded]);
  if (!videoClient || !chatClient) return <Loader />;

  return (
    <StreamVideo client={videoClient}>
      <Chat client={chatClient}>{children}</Chat>
    </StreamVideo>
  );
};

export default StreamProvider;
