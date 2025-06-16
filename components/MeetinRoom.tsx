// components/MeetinRoom.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useGetChatClient } from "@/hooks/useGetChatClient";
import {
  Channel as StreamChannel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  useChannelStateContext,
} from "stream-chat-react";
import {
  PaginatedGridLayout,
  SpeakerLayout,
  CallControls,
  useCallStateHooks,
  CallingState,
  CallStatsButton,
  CallParticipantsList,
} from "@stream-io/video-react-sdk";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { LayoutList, Users, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Loader from "./Loader";
import EndCallButton from "./EndCallButton";

// نوع تخطيط الفيديو
type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

export default function MeetinRoom() {
  const searchParams = useSearchParams();
  const meetingId = searchParams.get("id") || "default";
  const chatClient = useGetChatClient();
  const [channel, setChannel] = useState<any>(null);
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const router = useRouter();

  // ⏱️ Capture session start time
  const sessionStart = useRef(new Date());

  // إنشاء القناة ومشاهدتها
  useEffect(() => {
    if (!chatClient) return;
    const chan = chatClient.channel("messaging", meetingId);
    chan.watch().then(() => setChannel(chan));
  }, [chatClient, meetingId]);

  if (callingState !== CallingState.JOINED || !channel) {
    return <Loader />;
  }

  // 👥 Custom MessageList that filters by session time
  const CustomMessageList = () => {
    const { messages } = useChannelStateContext();

    const filteredMessages = messages?.filter(
      (msg) => new Date(msg.created_at) > sessionStart.current
    );

    return <MessageList messages={filteredMessages} hideDeletedMessages />;
  };

  // اختيار تخطيط الفيديو
  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative flex h-screen max-sm:flex-col w-full text-white overflow-hidden ">
      {/* لوحة الدردشة */}
      <div
        className={cn(
          "h-screen border-r border-gray-800 absolute top-0 left-0 z-10 transition-all max-sm:w-screen",
          {
            hidden: !showChat,
            "translate-x-0": showChat,
            "-translate-x-full": !showChat,
          }
        )}
      >
        <StreamChannel channel={channel}>
          <Window>
            <div className="h-full flex flex-col">
              {/* 🚨 Add this button for small screens */}
              <button
                onClick={() => setShowChat(false)}
                className="sm:hidden absolute top-2 right-2 z-50 text-white bg-gray-700 hover:bg-gray-600 rounded-full p-2"
              >
                ✕
              </button>

              <ChannelHeader title="Live Chat" />
              <div className="flex-1 overflow-auto">
                <CustomMessageList />
              </div>
              <div className="p-3 border-t border-gray-800">
                <MessageInput
                  focus
                  additionalTextareaProps={{
                    placeholder: "Type your message...",
                    rows: 1,
                    className:
                      "bg-gray-800 text-white rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500",
                  }}
                />
              </div>
            </div>
          </Window>
          <Thread />
        </StreamChannel>
      </div>

      {/* محتوى الفيديو */}
      <div
        className={cn(
          "relative size-full flex-center transition-all duration-300",
          {
            "ml-80": showChat,
          }
        )}
      >
        <div className="max-w-[1000px] size-full flex items-center">
          <CallLayout />
        </div>

        {/* قائمة المشاركين */}
        <div
          className={cn("h-screen hidden ml-2 absolute top-0 right-0 z-20", {
            "show-block": showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      {/* شريط التحكم */}
      <div
        className={cn(
          "fixed bottom-0 flex-center gap-5 w-full py-2 flex-wrap transition-all duration-300",
          {
            "ml-80": showChat,
            "w-[calc(100%-320px)]": showChat,
          }
        )}
      >
        <CallControls onLeave={() => router.push("/")} />

        {/* اختيار التخطيط */}
        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-black-200 bg-black-200 text-white">
            {["Grid", "Speaker-left", "Speaker-right"].map((item) => (
              <div key={item}>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-black-200" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <CallStatsButton />

        {/* تبديل عرض المشاركين */}
        <button
          onClick={() => setShowParticipants((v) => !v)}
          className="cursor-pointer transition duration-300 rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]"
        >
          <Users size={20} className="text-white" />
        </button>

        {/* تبديل الدردشة */}
        <button
          onClick={() => setShowChat((v) => !v)}
          className={cn(
            "cursor-pointer transition duration-300 rounded-2xl px-4 py-2",
            showChat
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-[#19232d] hover:bg-[#4c535b]"
          )}
        >
          <MessageSquare size={20} className="text-white" />
        </button>

        {!searchParams.get("personal") && <EndCallButton />}
      </div>
    </section>
  );
}
