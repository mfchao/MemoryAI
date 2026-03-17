import { Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  useGLTF,
  OrbitControls,
  Environment,
  Html,
  ScrollControls,
  useScroll,
  Hud,
} from "@react-three/drei";
import SamsungPhone from "./components/SamsungPhone";
import PhoneScreen from "./components/PhoneScreen";
import PhoneScreenShare2 from "./components/PhoneScreenShare2";
import CircleSvg from "./components/CircleSvg";
import { HtmlPortalProvider } from "./context/HtmlPortalContext";

import studio from '@theatre/studio'
import { editable as e, SheetProvider, useCurrentSheet } from '@theatre/r3f'
import { getProject, val } from "@theatre/core";
import { StoryCaptionsText } from "./components/StoryCaptionsText";
import { ScrollToBegin } from "./components/ScrollToBegin";
import { ScrollContext, ScrollOffsetBridge } from "./context/ScrollContext";
// Exported Theatre.js state (sheet name in JSON is "Scene")
import flyThroughState from "../public/fly-through.json";

// if (import.meta.env.DEV) {
//   studio.initialize();
// }

function App() {
  const sheet = getProject("Fly Through", { state: flyThroughState }).sheet("Scene");
  const [scrollState, setScrollState] = useState({
    scrollOffset: 0,
    showScrollHint: true,
  });

  return (
    <ScrollContext.Provider value={{ ...scrollState, setScrollState }}>
      <ScrollToBegin />
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 2]} intensity={1.2} />
        <directionalLight position={[-1, 1, -1]} intensity={0.4} />
        <Environment preset="studio" />
        <ScrollControls pages={5}>
          <SheetProvider sheet={sheet}>
            <HtmlPortalProvider>
              <Scene />
            </HtmlPortalProvider>
          </SheetProvider>
        </ScrollControls>

        {/* Fixed-on-screen HTML circle, not affected by scroll */}
        <Hud>
          <group scale={0.3}>
            <CircleSvg sheet={sheet} />
          </group>
        </Hud>
        <OrbitControls enablePan enableZoom={false} target={[0, 0, 0]} />
      </Canvas>
    </ScrollContext.Provider>
  );
}

function Scene() {
  const sheet = useCurrentSheet();
  const scroll = useScroll();

  useFrame(()=> {
    const sequenceLength = val(sheet.sequence.pointer.length);
    sheet.sequence.position = scroll.offset * sequenceLength;
  });

  return (
    <>
      <ScrollOffsetBridge />
      <group position={[0, 0, 0]}>
        <SamsungPhone theatreKey="Phone" screenContent={<PhoneScreen sheet={sheet} />} />
      </group>
      <group position={[1.2, 0, 0]}>
        <SamsungPhone theatreKey="Phone2" screenContent={<PhoneScreenShare2 sheet={sheet} />} />
      </group>
      <StoryCaptionsText/>
    </>
  )

}

export default App;