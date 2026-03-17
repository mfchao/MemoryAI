import {
    useGLTF,
    Html,
  } from "@react-three/drei";
import { editable as e } from '@theatre/r3f'
import { useHtmlPortal } from "../context/HtmlPortalContext";


const MODEL_URL = "/samsung-s25/source/SAMSUNG%20S25.gltf";
const SCREEN_MATERIAL_NAME = "Wallpapers";




function SceneNode({ object, screenContent, screenPortalRef }) {
  if (!object) return null;
  if (object.isGroup) {
    return (
      <group
        position={object.position.clone()}
        quaternion={object.quaternion.clone()}
        scale={object.scale.clone()}
      >
        {object.children.map((child) => (
          <SceneNode
            key={child.uuid}
            object={child}
            screenContent={screenContent}
            screenPortalRef={screenPortalRef}
          />
        ))}
      </group>
    );
  }

  if (object.isMesh && object.material?.name === SCREEN_MATERIAL_NAME) {
    return (
        <Html
          portal={screenPortalRef}
          className="phone-screen-html w-[736px] h-[1594px] rounded-[60px] overflow-hidden border-none pointer-events-auto"
          transform
          occlude="blending"
          position={[0, 0, 0.11]}
          rotation={[0, 0, Math.PI]}
          scale={0.114}
        >
          <div
            className="phone-screen-wrapper w-full h-full rounded-[60px] overflow-hidden"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {screenContent}
          </div>
        </Html>
    );
  }

  if (object.isMesh) {
    return (
      <mesh
        position={object.position.clone()}
        quaternion={object.quaternion.clone()}
        scale={object.scale.clone()}
        geometry={object.geometry}
        material={object.material}
      />
    );
  }

  return null;
}

function SamsungPhone({ screenContent, theatreKey = "Phone" }) {
  const { scene } = useGLTF(MODEL_URL);
  const screenPortalRef = useHtmlPortal();
  return (
    <e.group theatreKey={theatreKey}>
      <SceneNode object={scene} screenContent={screenContent} screenPortalRef={screenPortalRef} />
    </e.group>
  );
}

export default SamsungPhone;