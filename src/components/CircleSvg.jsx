import { Html } from "@react-three/drei";
import { useRef, useMemo, useEffect, useState } from "react";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { types, val, onChange } from "@theatre/core";

gsap.registerPlugin(MorphSVGPlugin);

const CIRCLE_OBJECT_CONFIG = {
  opacity: types.number(1, { range: [0, 1], label: "Opacity" }),
  play: types.boolean(false, { label: "Play" }),
  position: types.compound(
    {
      x: types.number(4, { label: "X" }),
      y: types.number(0.7, { label: "Y" }),
      z: types.number(0, { label: "Z" }),
    },
    { label: "Position" }
  ),
};

function runMorphSequence(circlePathRef) {
  if (!circlePathRef.current) return;
  gsap.killTweensOf(circlePathRef.current);
  const tl = gsap.timeline({
    defaults: { duration: 0.2, ease: "power2.inOut" },
  });
  tl.to(circlePathRef.current, { morphSVG: "#circle-clicked-shape" })
    .to(circlePathRef.current, { morphSVG: "#circle-shape" })
    .to(circlePathRef.current, { morphSVG: "#circle-clicked-shape" })
    .to(circlePathRef.current, { morphSVG: "#circle-shape" });
}

function CircleSvg({ sheet, ...props }) {
  const circlePathRef = useRef(null);
  const prevPlayRef = useRef(false);
  const [opacity, setOpacity] = useState(1);
  const [position, setPosition] = useState([4, 0.7, 0]);

  const circleObj = useMemo(() => {
    if (!sheet) return null;
    return sheet.object("Circle", CIRCLE_OBJECT_CONFIG, { reconfigure: true });
  }, [sheet]);

  useEffect(() => {
    if (!circleObj) return;
    setOpacity(val(circleObj.props.opacity));
    return onChange(circleObj.props.opacity, () =>
      setOpacity(val(circleObj.props.opacity))
    );
  }, [circleObj]);

  useEffect(() => {
    if (!circleObj) return;
    const p = val(circleObj.props.position);
    setPosition([p.x, p.y, p.z]);
    return onChange(circleObj.props.position, () => {
      const p = val(circleObj.props.position);
      setPosition([p.x, p.y, p.z]);
    });
  }, [circleObj]);

  useEffect(() => {
    if (!circleObj) return;
    const unsub = onChange(circleObj.props.play, () => {
      const playing = val(circleObj.props.play);
      if (playing && !prevPlayRef.current) {
        runMorphSequence(circlePathRef);
      }
      prevPlayRef.current = playing;
    });
    return unsub;
  }, [circleObj]);

  return (
    <group
      {...props}
      position={position}
      onDoubleClick={(e) => {
        e.stopPropagation();
        runMorphSequence(circlePathRef);
      }}
    >
      <Html transform occlude="blending" style={{ opacity }}>
        <svg
          width="99"
          height="99"
          viewBox="0 0 99 99"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* starting circle (from circle.svg) */}
          <path
            id="circle-shape"
            ref={circlePathRef}
            d="M0 49.5C0 22.1619 22.1619 0 49.5 0C76.8381 0 99 22.1619 99 49.5C99 76.8381 76.8381 99 49.5 99C22.1619 99 0 76.8381 0 49.5Z"
            fill="#487CF7"
          />

          {/* target shape (from circle_clicked.svg) – kept hidden, just a morph target */}
          <path
            id="circle-clicked-shape"
            d="M39.2828 99C11.8247 99 0 92.8889 0 49.5C0 6.11111 11.8247 0 39.2828 0C66.7408 0 89 22.1619 89 49.5C89 76.8381 66.7408 99 39.2828 99Z"
            fill="none"
          />
        </svg>
      </Html>
    </group>
  );
}

export default CircleSvg;
