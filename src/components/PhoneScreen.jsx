import { useRef, useMemo, useEffect, useState } from "react";
import { types, val, onChange } from "@theatre/core";

const VIDEO_OBJECT_CONFIG = {
  playing: types.boolean(false, { label: "Play" }),
  opacity: types.number(1, { range: [0, 1], label: "Opacity" }),
};

const VIDEO_SOURCES = [
  { objectKey: "phoneVideoQuickCapture", src: "/videos/capture.mp4" },
  { objectKey: "phoneVideoCreatememory", src: "/videos/createMemory.mp4" },
  { objectKey: "phoneVideoReminder", src: "/videos/reminder.mp4" },
  { objectKey: "phoneVideoShare1", src: "/videos/share1.mp4" },
];

export function PhoneVideo({ sheet, objectKey, src, muted: mutedProp = true }) {
  const videoRef = useRef(null);
  const prevPlayingRef = useRef(false);
  const hasEndedRef = useRef(false);
  const [opacity, setOpacity] = useState(1);
  const [playBlockedSoMuted, setPlayBlockedSoMuted] = useState(false);

  const videoObj = useMemo(() => {
    if (!sheet) return null;
    return sheet.object(objectKey, VIDEO_OBJECT_CONFIG, {
      reconfigure: true,
    });
  }, [sheet, objectKey]);

  useEffect(() => {
    if (!videoObj) return;
    setOpacity(val(videoObj.props.opacity));
    return onChange(videoObj.props.opacity, () =>
      setOpacity(val(videoObj.props.opacity))
    );
  }, [videoObj]);

  useEffect(() => {
    if (!videoObj) return;
    const onPlayingChange = () => {
      const v = videoRef.current;
      if (!v) return;
      const playing = val(videoObj.props.playing);
      const justBecameTrue = playing && !prevPlayingRef.current;

      if (justBecameTrue) {
        hasEndedRef.current = false;
        v.currentTime = 0;
        const p = v.play?.();
        if (p && typeof p.catch === "function") {
          p.catch((err) => {
            if (err?.name === "NotAllowedError") {
              if (mutedProp) {
                v.muted = true;
                v.play?.().catch(() => {});
              } else {
                v.muted = true;
                setPlayBlockedSoMuted(true);
                v.play?.().catch(() => {});
              }
            }
          });
        }
      } else if (!playing) {
        v.pause?.();
        if (!hasEndedRef.current) {
          v.currentTime = 0;
        }
      }
      prevPlayingRef.current = playing;
    };

    onPlayingChange();
    return onChange(videoObj.props.playing, onPlayingChange);
  }, [videoObj]);

  const handleEnded = () => {
    const v = videoRef.current;
    if (!v || !videoObj) return;
    hasEndedRef.current = true;
    v.pause?.();
    v.currentTime = v.duration || 0;
    prevPlayingRef.current = false;
    try {
      videoObj.initialValue = { playing: false };
    } catch (_) {}
  };

  useEffect(() => {
    if (!videoRef.current || !videoObj) return;
    const v = videoRef.current;
    v.currentTime = 0;
    v.pause?.();
  }, [videoObj]);

  const muted = mutedProp || playBlockedSoMuted;

  return (
    <video
      ref={videoRef}
      src={src}
      className="absolute inset-0 w-full h-full object-cover"
      style={{ opacity }}
      playsInline
      muted={muted}
      onEnded={handleEnded}
    />
  );
}

export default function PhoneScreen({ sheet }) {
  return (
    <div
      className="relative w-[736px] h-[1594px] flex items-center justify-center bg-white box-border overflow-hidden rounded-[60px] [clip-path:inset(0_round_60px)]"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <img
        src="/screensaver.png"
        alt="Phone screen"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {VIDEO_SOURCES.map(({ objectKey, src }, index) => (
        <PhoneVideo
          key={objectKey}
          sheet={sheet}
          objectKey={objectKey}
          src={src}
          muted={index !== 0}
        />
      ))}
    </div>
  );
}
