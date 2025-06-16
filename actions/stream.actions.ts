"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";
import { StreamChat } from "stream-chat";

// Environment variables - renamed for clarity
const videoApiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_KEY;
const videoApiSecret = process.env.STREAM_VIDEO_SECRET;
const chatApiKey = process.env.NEXT_PUBLIC_STREAM_CHAT_KEY;
const chatApiSecret = process.env.STREAM_CHAT_SECRET;

export const tokenProvider = async () => {
  const user = await currentUser();

  // Validate all required values exist
  if (!user) throw new Error("User is not logged in");
  if (!videoApiKey) throw new Error("No Stream Video API key");
  if (!videoApiSecret) throw new Error("No Stream Video API secret");
  if (!chatApiKey) throw new Error("No Stream Chat API key");
  if (!chatApiSecret) throw new Error("No Stream Chat API secret");

  // Initialize clients
  const videoClient = new StreamClient(videoApiKey, videoApiSecret);
  const chatClient = StreamChat.getInstance(chatApiKey, chatApiSecret);

  // Token configuration
  const exp = Math.round(Date.now() / 1000) + 60 * 60; // 1 hour expiration
  const issued = Math.floor(Date.now() / 1000) - 60; // 1 minute clock skew

  // Generate tokens
  const videoToken = videoClient.createToken(user.id, exp, issued);
  const chatToken = chatClient.createToken(user.id, exp, issued);

  return { videoToken, chatToken };
};
