import { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  useGLTF,
  OrbitControls,
  Environment,
  Html,
  ScrollControls, useScroll
} from "@react-three/drei";
import SamsungPhone from "./components/SamsungPhone";
import PhoneScreen from "./components/PhoneScreen";
import { HtmlPortalProvider } from "./context/HtmlPortalContext";

import studio from '@theatre/studio'
import { editable as e, SheetProvider, useCurrentSheet } from '@theatre/r3f'
import { getProject, val } from "@theatre/core";



studio.initialize()


function App() {
  const sheet = getProject("Fly Through").sheet("Scene");

  return (
    <>
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
        <OrbitControls enablePan enableZoom={false} target={[0, 0, 0]} />
      </Canvas>
    </>
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
      <SamsungPhone screenContent={<PhoneScreen />} />
    
    </>
  )

}

export default App;