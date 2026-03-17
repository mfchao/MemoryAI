import { useRef, useState, useFrame } from "react";
import { useScroll } from "@react-three/drei";
import { createPortal } from "react-dom";

const THRESHOLD = 0.02;

export function ScrollToBegin() {
  const scroll = useScroll();
  const [visible, setVisible] = useState(true);
  const lastVisibleRef = useRef(true);

  useFrame(() => {
    const offset = scroll.offset;
    const shouldShow = offset < THRESHOLD;
    if (shouldShow !== lastVisibleRef.current) {
      lastVisibleRef.current = shouldShow;
      setVisible(shouldShow);
    }
  });

  return createPortal(
    <div
      className="scroll-to-begin"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 1000,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease-out",
      }}
    >
      <span
        style={{
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "rgba(255,255,255,0.9)",
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        Scroll to begin
      </span>
    </div>,
    document.body
  );
}
