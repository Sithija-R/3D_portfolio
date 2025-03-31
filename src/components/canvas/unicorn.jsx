import { Canvas } from "@react-three/fiber";
import React, { Suspense, useRef, useState, useEffect } from "react";
import CanvasLoader from "../Loader";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { profilephoto } from "../../assets";
import { motion } from "framer-motion";

const Unicorn = ({ shouldFall }) => {
  const unicorn = useGLTF("./unicorn/scene.gltf");
  const unicornRef = useRef();
  const [yPos, setYPos] = useState(0.8); // Initial unicorn position
  const [lightY, setLightY] = useState(20); // Initial light position
  const [showImage, setShowImage] = useState(false); // State to show the image
  const [modelReachedFinalPosition, setModelReachedFinalPosition] =
    useState(false); // To track model position
  const [lastShouldFall, setLastShouldFall] = useState(shouldFall); // Track the previous state of shouldFall

  useEffect(() => {
    if (lastShouldFall === shouldFall) return; // Prevent animation from running twice

    setLastShouldFall(shouldFall); // Update the last state of shouldFall

    let start = Date.now();
    let duration = 1500; // 1.5 seconds transition time

    const animateMovement = () => {
      let elapsed = Date.now() - start;
      let progress = Math.min(elapsed / duration, 1); // Ensure max = 1
      let newY = shouldFall ? 0.8 - progress * 4.6 : -3.8 + progress * 4.6; // Fall or rise
      let newLightY = shouldFall ? 20 - progress * 4.6 : 15 + progress * 4.6; // Adjust light position

      setYPos(newY);
      setLightY(newLightY);

      if (progress < 1) {
        requestAnimationFrame(animateMovement);
      } else {
        // When model reaches final position
        if (shouldFall && !modelReachedFinalPosition) {
          setModelReachedFinalPosition(true);
          setTimeout(() => {
            setShowImage(true); // Show image after 3 seconds
          }, 3000);
        }
      }
    };

    requestAnimationFrame(animateMovement);
  }, [shouldFall, modelReachedFinalPosition, lastShouldFall]); // Run only if `shouldFall` changes

  // Handle scroll event to show/hide model and image
  useEffect(() => {
    const handleScroll = () => {
      if (yPos > -3.8) {
        // Hide image and show model when scrolling up
        setShowImage(false);
        setModelReachedFinalPosition(false); // Reset the final position status
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
            <mesh ref={unicornRef}>
              <hemisphereLight
                intensity={3}
                color={"cyan"}
                groundColor="black"
                position={[0, lightY, 0]}
              />
              <spotLight
                position={[10, lightY, 20]} // Fixed light movement (not tied to model)
                angle={0.12}
                penumbra={1.8}
                intensity={6}
                castShadow
                shadow-mapSize={1024}
                decay={false}
              />
              <pointLight
                intensity={20}
                color={"cyan"}
                position={[10, lightY, 20]}
              />
              <primitive
                object={unicorn.scene}
                scale={0.012}
                rotation={[0, 1.1, 0]}
                position={[0, yPos, 0]}
              />
            </mesh>
          </Suspense>
        </Canvas>
      ) : (
        <motion.img
          src={profilephoto}
          alt="Image to show instead of model"
          style={{
            position: "relative",
            top: "55%",
            left: "10%",
            maxWidth: "70%",
            maxHeight: "70%",
            pointerEvents: "none",
          }}
          initial={{ opacity: 0, scale: 0.8 }} // Initial state: image is invisible and scaled down
          animate={{ opacity: 1, scale: 1 }} // Final state: fully visible and normal size
          transition={{ duration: 1.5, ease: "easeOut" }} // 1.5 seconds for the transition
        />
      )}
    </div>
  );
};

const UnicornCanvas = ({ shouldFall }) => {
  return <Unicorn shouldFall={shouldFall} />;
};

export default UnicornCanvas;
