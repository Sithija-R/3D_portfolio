import { Canvas, useFrame } from "@react-three/fiber";
import React, { Suspense, useRef } from "react";
import CanvasLoader from "../Loader";
import {
  Decal,
  Float,
  OrbitControls,
  Preload,
  useTexture,
} from "@react-three/drei";

const Ball = (props) => {
  const [decal] = useTexture([props.imgUrl]);
  const ballRef = useRef();
  let rotationSpeed = useRef(Math.random() * 0.0000001 + 0.00000005); // Even slower random rotation speed
  let movementSpeed = useRef(Math.random() * 0.0000001 + 0.00000005); // Even slower random movement speed
  let movementDirection = useRef(1);
  let rotationDirection = useRef(1);

  useFrame(() => {
    if (ballRef.current) {
      ballRef.current.rotation.y += rotationSpeed.current * rotationDirection.current;
      ballRef.current.position.y += movementSpeed.current * movementDirection.current;
      
      if (ballRef.current.position.y > 0.05 || ballRef.current.position.y < -0.05) {
        movementDirection.current *= -1; // Reverse movement direction
        movementSpeed.current = Math.random() * 0.0000001 + 0.00000005; // Change speed randomly (very slow)
      }
      
      if (ballRef.current.rotation.y > 0.05 || ballRef.current.rotation.y < -0.05) {
        rotationDirection.current *= -1; // Reverse rotation direction slightly for natural movement
        rotationSpeed.current = Math.random() * 0.0000001 + 0.00000005; // Change speed randomly (very slow)
      }
    }
  });

  return (
    <Float speed={0.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.9} color={'#6ed8ff'} />
      <spotLight
        position={[10, 10, 10]}
        intensity={1.5}
        castShadow
        decay={false}
      />
     
      <mesh ref={ballRef} castShadow receiveShadow scale={2.75}>
        <dodecahedronGeometry args={[1, 1]} />

        <meshStandardMaterial
          color="#fff8eb" 
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
          roughness={0.9}
          metalness={0.9}
          transparent={true}
          opacity={1}
          clearcoat={1}
          clearcoatRoughness={1}
          envMapIntensity={1}
          reflectivity={1}
        />

        <Decal
          position={[0, 0, 1.1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          scale={1.2}
          map={decal}
          flatShading
        />
      </mesh>
    </Float>
  );
};

const BallCanvas = ({ icon }) => {
  return (
    <Canvas
      frameloop='always'
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enableZoom={false} />
        <Ball imgUrl={icon} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default BallCanvas;
