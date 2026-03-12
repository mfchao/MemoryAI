import { useRef, useMemo, useEffect, useState } from "react";
import { types, val, onChange } from "@theatre/core";

const PHONE_VIDEO_OBJECT_CONFIG = {
  playing: types.boolean(false, { label: "Play" }),
  opacity: types.number(1, { range: [0, 1], label: "Opacity" }),
};

export default function PhoneScreen({ sheet }) {
  const videoRef = useRef(null);

  const videoObj = useMemo(() => {
    if (!sheet) return null;
    return sheet.object("phoneVideo", PHONE_VIDEO_OBJECT_CONFIG, {
      reconfigure: true,
    });
  }, [sheet]);

  const prevPlayingRef = useRef(false);
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
    const onPositionOrPlayingChange = () => {
      if (!videoRef.current) return;
      const currentPlaying = val(videoObj.props.playing);
      const justEnteredKeyframe = currentPlaying && !prevPlayingRef.current;

      if (justEnteredKeyframe) {
        videoRef.current.currentTime = 0;
        videoRef.current.play?.();
      } else if (!currentPlaying) {
        videoRef.current.pause?.();
      }

      prevPlayingRef.current = currentPlaying;
    };

    onPositionOrPlayingChange();
    const unsubPlaying = onChange(videoObj.props.playing, onPositionOrPlayingChange);
    const unsubPosition = onChange(sheet.sequence.pointer.position, onPositionOrPlayingChange);
    return () => {
      unsubPlaying();
      unsubPosition();
    };
  }, [videoObj, sheet]);

  const handleVideoEnded = () => {
    if (!videoObj) return;
    videoRef.current?.pause?.();
    prevPlayingRef.current = false;
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
        onEnded={handleVideoEnded}
      />
    </div>
  );
}
