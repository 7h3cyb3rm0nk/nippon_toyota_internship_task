"use client";

import * as THREE from 'three';

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Loader, Html } from "@react-three/drei";

// Car Model Component (Now loading Box.glb)
function CarModel() {
  const { scene } = useGLTF("/assets/box.glb"); // Changed path to new Box model
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005; // Rotate the object
    }
  });

  return (
    <group ref={meshRef} dispose={null} scale={[1, 1, 1]} position={[0, 0, 0]}> {/* Adjusted scale and position for a box */}
      <primitive object={scene} />
    </group>
  );
}

// ThreeCarLoader Component
export default function ThreeCarLoader({ isLoading }: { isLoading: boolean }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500"
      style={{ opacity: isLoading ? 1 : 0, pointerEvents: isLoading ? 'auto' : 'none' }}
    >
      <Canvas camera={{ position: [2, 1, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
        <Suspense fallback={<Html center>
          <div className="text-primary text-lg font-bold">Loading 3D Object...</div>
        </Html>}>
          <CarModel />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Suspense>      </Canvas>
      <Loader />
    </div>
  );
}
