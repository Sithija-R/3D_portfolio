import { Canvas } from "@react-three/fiber";
import React, { Suspense, useRef, useState, useEffect } from "react";
import CanvasLoader from "../Loader";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { profilephoto } from "../../assets";
import { motion } from "framer-motion";

const Unicorn = ({ shouldFall, setShowImage, yPos, lightY }) => {
  const unicorn = useGLTF("/sithija-portfolio/unicorn/scene.gltf");
  const unicornRef = useRef();

  return (
    <mesh ref={unicornRef}>
      <hemisphereLight intensity={3} color={"cyan"} groundColor="black" position={[0, lightY, 0]} />
      <spotLight
        position={[10, lightY, 20]}
        angle={0.12}
        penumbra={1.8}
        intensity={6}
        castShadow
        shadow-mapSize={1024}
        decay={false}
      />
      <pointLight intensity={20} color={"cyan"} position={[10, lightY, 20]} />
      <primitive object={unicorn.scene} scale={0.012} rotation={[0, 1.1, 0]} position={[0, yPos, 0]} />
    </mesh>
  );
};

const UnicornCanvas = ({ shouldFall }) => {
  const [showImage, setShowImage] = useState(false);
  const [yPos, setYPos] = useState(0.8);
  const [lightY, setLightY] = useState(20);
  const [modelReachedFinalPosition, setModelReachedFinalPosition] = useState(false);
  const [lastShouldFall, setLastShouldFall] = useState(shouldFall);

  useEffect(() => {
    if (lastShouldFall === shouldFall) return;
    setLastShouldFall(shouldFall);
    let start = Date.now();
    let duration = 1500;

    const animateMovement = () => {
      let elapsed = Date.now() - start;
      let progress = Math.min(elapsed / duration, 1);
      let newY = shouldFall ? 0.8 - progress * 4.6 : -3.8 + progress * 4.6;
      let newLightY = shouldFall ? 20 - progress * 4.6 : 15 + progress * 4.6;

      setYPos(newY);
      setLightY(newLightY);

      if (progress < 1) {
        requestAnimationFrame(animateMovement);
      } else {
        if (shouldFall && !modelReachedFinalPosition) {
          setModelReachedFinalPosition(true);
          setTimeout(() => {
            setShowImage(true);
          }, 3000);
        }
      }
    };
    requestAnimationFrame(animateMovement);
  }, [shouldFall, modelReachedFinalPosition, lastShouldFall]);

  useEffect(() => {
    const handleScroll = () => {
      if (yPos > -3.8) {
        setShowImage(false);
        setModelReachedFinalPosition(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [yPos]);

  return (
    <div className="w-full h-full relative">
      {!showImage ? (
        <Canvas
          frameloop="demand"
          shadows
          dpr={[1, 2]}
          camera={{ position: [20, 3, 5], fov: 25 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <Suspense fallback={<CanvasLoader />}>
            <OrbitControls
              autoRotate
              autoRotateSpeed={1}
              enableZoom={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
            <Unicorn shouldFall={shouldFall} setShowImage={setShowImage} yPos={yPos} lightY={lightY} />
          </Suspense>
          <Preload all />
        </Canvas>
      ) : (
        <motion.img
          src={profilephoto}
          alt="Profile"
          style={{
            position: "relative",
            top: "60%",
            left: "10%",
            maxWidth: "70%",
            maxHeight: "70%",
            pointerEvents: "none",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      )}
    </div>
  );
};

export default UnicornCanvas;
