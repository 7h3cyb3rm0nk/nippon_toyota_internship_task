"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Loader, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from 'three';

function CarModel() {
  const { scene } = useGLTF("/assets/car.glb");
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01; // Continuous one-way rotation
    }
  });

  return (
    <group ref={meshRef} dispose={null} scale={[1.5, 1.5, 1.5]} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

// ThreeCarLoader Component
export default function ThreeCarLoader({ isLoading }: { isLoading: boolean }) {
  const [isVisible, setIsVisible] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 1000); // Wait for transition duration (1000ms)
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-1000 ease-in-out"
      style={{
        opacity: isLoading ? 1 : 0,
        pointerEvents: isLoading ? 'auto' : 'none',
        visibility: isVisible ? 'visible' : 'hidden'
      }}
    >
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
        <ambientLight intensity={0.4} />

        <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />

        <directionalLight position={[-5, 3, -5]} intensity={0.5} />

        <Suspense fallback={<Html center>
          <div className="text-white text-xl font-bold tracking-widest uppercase">Loading...</div>
        </Html>}>
          <CarModel />
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  );
}

useGLTF.preload("/assets/car.glb");
