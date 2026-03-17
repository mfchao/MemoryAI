import { PhoneVideo } from "./PhoneScreen";

/**
 * Second phone screen: share2 video only (same play/opacity from Theatre phoneVideoShare2).
 */
export default function PhoneScreenShare2({ sheet }) {
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
      <PhoneVideo
        sheet={sheet}
        objectKey="phoneVideoShare2"
        src="/videos/share2.mp4"
      />
    </div>
  );
}
