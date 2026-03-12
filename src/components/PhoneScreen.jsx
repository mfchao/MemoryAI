import { useRef, useMemo, useEffect, useState } from "react";
import { types, val, onChange } from "@theatre/core";

const PHONE_VIDEO_OBJECT_CONFIG = {
  opacity: types.number(1, { range: [0, 1], label: "Opacity" }),
  frame: types.number(0, { range: [0, 1], label: "Frame" }),
};

export default function PhoneScreen({ sheet, scrollOffset = 0 }) {
  const videoRef = useRef(null);
  const [videoDuration, setVideoDuration] = useState(0);

  const videoObj = useMemo(() => {
    if (!sheet) return null;
    return sheet.object("phoneVideo", PHONE_VIDEO_OBJECT_CONFIG, {
      reconfigure: true,
    });
  }, [sheet]);

  const [videoOpacity, setVideoOpacity] = useState(1);

  useEffect(() => {
    if (!videoObj) return;
    setVideoOpacity(val(videoObj.props.opacity));
    const unsub = onChange(videoObj.props.opacity, () =>
      setVideoOpacity(val(videoObj.props.opacity))
    );
    return () => unsub();
  }, [videoObj]);

  useEffect(() => {
    if (!videoObj || !sheet) return;
    const syncVideoToFrame = () => {
      const video = videoRef.current;
      if (!video || !Number.isFinite(videoDuration) || videoDuration <= 0) return;
      const frame = val(videoObj.props.frame);
      const videoTime = Math.min(
        videoDuration,
        Math.max(0, frame * videoDuration)
      );
      video.currentTime = videoTime;
    };
    syncVideoToFrame();
    const unsub = onChange(sheet.sequence.pointer.position, syncVideoToFrame);
    return () => unsub();
  }, [videoObj, sheet, videoDuration]);

  const handleLoadedMetadata = () => {
    if (videoRef.current?.duration) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  return (
    <div
      className="relative w-[736px] h-[1594px] flex items-center justify-center bg-white box-border overflow-hidden rounded-[60px] [clip-path:inset(0_round_60px)]"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <img
        src="/Phone.png"
        alt="Phone screen"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <video
        ref={videoRef}
        src="/videos/capture1.mp4"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: videoOpacity }}
        muted
        playsInline
        onLoadedMetadata={handleLoadedMetadata}
        preload="metadata"
      />
    </div>
  );
}
