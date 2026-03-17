import { useScrollContext } from "../context/ScrollContext";

export function ScrollToBegin() {
  const scrollState = useScrollContext();
  const visible = scrollState?.showScrollHint !== false;

  return (
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
          fontWeight: 200,
          color: "rgba(0,0,0,1.0)",
        }}
      >
        Scroll to begin
      </span>
    </div>
  );
}
