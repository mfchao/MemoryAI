import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import {
  useGLTF,
  OrbitControls,
  Environment,
  Html,
} from "@react-three/drei";
import SamsungPhone from "./components/SasmungPhone";
import PhoneScreen from "./components/PhoneScreen"


function App() {
  return (
    <>
      <Canvas camera={{ position: [0, 0, 20], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 2]} intensity={1.2} />
        <directionalLight position={[-1, 1, -1]} intensity={0.4} />
        <Environment preset="studio" />
          <SamsungPhone screenContent={<PhoneScreen />} />
        <OrbitControls enablePan enableZoom target={[0, 0, 0]} />
      </Canvas>
    </>
  );
}

export default App;