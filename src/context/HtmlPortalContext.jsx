import { createContext, useContext, useRef, useLayoutEffect, useState } from "react";
import { useThree } from "@react-three/fiber";

const HtmlPortalContext = createContext(null);

/**
 * Renders a div outside the scroll container so Html with portal={portalRef}
 * stays fixed with the canvas when using ScrollControls.
 */
export function HtmlPortalProvider({ children }) {
  const portalRef = useRef(null);
  const [portalEl] = useState(() => document.createElement("div"));
  const { gl } = useThree();

  useLayoutEffect(() => {
    const parent = gl.domElement.parentNode;
    if (!parent || !portalEl) return;

    portalEl.style.cssText =
      "position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden;";
    parent.insertBefore(portalEl, gl.domElement);
    portalRef.current = portalEl;

    return () => {
      if (portalEl.parentNode) portalEl.parentNode.removeChild(portalEl);
      portalRef.current = null;
    };
  }, [gl, portalEl]);

  return (
    <HtmlPortalContext.Provider value={portalRef}>
      {children}
    </HtmlPortalContext.Provider>
  );
}

export function useHtmlPortal() {
  return useContext(HtmlPortalContext);
}
