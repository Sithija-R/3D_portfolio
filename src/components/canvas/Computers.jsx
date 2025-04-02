import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";
import EarthCanvas from "./Planet";

const Computers = () => {
  const computer = useGLTF("/sithija-portfolio/desktop/scene.gltf");

  return (
    <mesh>
      <hemisphereLight intensity={0.8} color={"cyan"} groundColor="black" />
      <spotLight
        position={[20, 50, 10]}
        angle={0.12}
        penumbra={1.8}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
        decay={false}
      />
      <pointLight intensity={1} color={"cyan"} />
      <primitive
        object={computer.scene}
        scale={0.75}
        position={[0, -3.25, -1.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};




const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateSize = () => setIsMobile(window.innerWidth <= 500);
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // **Don't render on mobile**
  if (isMobile) return <EarthCanvas/>;

  return (
    <Canvas
      frameloop="demand"
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
        <Computers />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
