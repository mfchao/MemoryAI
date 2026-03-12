import { useMemo, useEffect, useState } from "react";
import { Text } from "@react-three/drei";
import { useCurrentSheet } from "@theatre/r3f";
import { types, val, onChange } from "@theatre/core";
import { editable as e } from "@theatre/r3f";

const DEFAULT_MAIN = "Introducing Memory AI";
const DEFAULT_CAPTION =
  "Memory AI is a new way to create and share memories. It uses AI to help you create and share memories with your friends and family.";

// Defined once so sheet.object() always receives the same config reference
const CAPTION_OBJECT_CONFIG = {
  mainText: types.string(DEFAULT_MAIN, { label: "Main Text" }),
  captionText: types.string(DEFAULT_CAPTION, { label: "Caption Text" }),
  opacity: types.number(1, { range: [0, 1], label: "Opacity" }),
  position: types.compound(
    {
      x: types.number(0, { label: "X" }),
      y: types.number(0, { label: "Y" }),
      z: types.number(0, { label: "Z" }),
    },
    { label: "Position" }
  ),
};

export function StoryCaptionsText() {
  const sheet = useCurrentSheet();

  const captionObj = useMemo(() => {
    if (!sheet) return null;
    return sheet.object("caption", CAPTION_OBJECT_CONFIG, {
      reconfigure: true,
    });
  }, [sheet]);

  const [, setTick] = useState(0);
  useEffect(() => {
    if (!captionObj) return;
    const unsubMain = onChange(captionObj.props.mainText, () =>
      setTick((t) => t + 1)
    );
    const unsubCaption = onChange(captionObj.props.captionText, () =>
      setTick((t) => t + 1)
    );
    const unsubOpacity = onChange(captionObj.props.opacity, () =>
      setTick((t) => t + 1)
    );
    const unsubPosition = onChange(captionObj.props.position, () =>
      setTick((t) => t + 1)
    );
    return () => {
      unsubMain();
      unsubCaption();
      unsubOpacity();
      unsubPosition();
    };
  }, [captionObj]);

  if (!captionObj) return null;

  const mainText = val(captionObj.props.mainText);
  const captionText = val(captionObj.props.captionText);
  const opacity = val(captionObj.props.opacity);
  const position = val(captionObj.props.position);
  const positionVec = [position.x, position.y, position.z];

  return (
    <group
      position={positionVec}
      opacity={opacity}
    >
      <Text
        fontSize={0.4}
        fontWeight="bold"
        color="#000000"
        anchorX="center"
        anchorY="top"
        textAlign="center"
        position={[0, 0, 0]}
        fillOpacity={opacity}
      >
        {mainText}
      </Text>
      <Text
        fontSize={0.2}
        fontWeight={300}
        color="#333333"
        anchorX="center"
        anchorY="top"
        textAlign="center"
        position={[0, -0.55, 0]}
        maxWidth={5}
        fillOpacity={opacity}
      >
        {captionText}
      </Text>
    </group>
  );
}
