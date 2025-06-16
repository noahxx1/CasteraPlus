"use client";

import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState<boolean>(false);
  const call = useCall();
  if (!call)
    throw new Error("usecall must be used within StreamCall component");

  useEffect(() => {
    if (isMicCamToggledOn) {
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [isMicCamToggledOn, call?.camera, call?.microphone]);

  return (
    <div className="flex-center flex-col h-screen w-full gap-4 text-white">
      <h1 className="text-2xl font-bold">Setup</h1>
      <VideoPreview />
      <div className="flex-center h-16  gap-3">
        <label className="flex-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggledOn}
            className="cursor-pointer"
            onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
        onClick={() => {
          call.join();
          setIsSetupComplete(true);
        }}
        className="rounded-md bg-primary px-4 py-2.5"
      >
        Join meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;
