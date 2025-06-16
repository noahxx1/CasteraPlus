"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useGetCallById } from "@/hooks/setGetCallById";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";

const Table = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col xl:flex-row items-start gap-2">
      <p className="lg:text-xl xl:min-w-32 font-medium text-sky-1">{title}</p>
      <p className="text-sm lg:text-lg max-sm:max-w-[320px] font-bold truncate">
        {description}
      </p>
    </div>
  );
};

const personalRoom = () => {
  const { user } = useUser();
  const meetingId = user?.id;
  const { toast } = useToast();
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`;
  const router = useRouter();

  const { call } = useGetCallById(meetingId!);
  const client = useStreamVideoClient();

  const startRoom = async () => {
    if (!client || !user) return;
    const newCall = client.call("default", meetingId!);
    if (!call) {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }
    router.push(`/meeting/${meetingId}?personal=true`);
  };

  return (
    <section className=" flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Personal Room</h1>
      <div className="flex flex-col w-full xl:max-w-[900px] gap-8"></div>
      <Table title="Topic" description={`${user?.username}'s Meeting Room`} />
      <Table title="Meeting ID" description={meetingId!} />
      <Table title="Invite Link" description={meetingLink} />
      <div className="flex gap-5">
        <Button onClick={startRoom}>Start Meeting</Button>
        <Button
          className="bg-black-300 hover:bg-black-200"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({
              title: "Link Copied",
            });
          }}
        >
          Copy Invitation
        </Button>
      </div>
    </section>
  );
};

export default personalRoom;
