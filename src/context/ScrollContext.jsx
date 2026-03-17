import { createContext, useContext, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";

const THRESHOLD = 0.02;

export const ScrollContext = createContext(null);

export function useScrollContext() {
  return useContext(ScrollContext);
}

/** Renders inside Canvas (e.g. in Scene). Updates context when scroll crosses threshold. */
export function ScrollOffsetBridge() {
  const ctx = useScrollContext();
  const scroll = useScroll();
  const lastShowRef = useRef(true);

  useFrame(() => {
    const setScrollState = ctx?.setScrollState;
    if (!setScrollState) return;
    const offset = scroll.offset;
    const shouldShow = offset < THRESHOLD;
    if (shouldShow !== lastShowRef.current) {
      lastShowRef.current = shouldShow;
      setScrollState((s) => ({ ...s, scrollOffset: offset, showScrollHint: shouldShow }));
    }
  });

  return null;
}
