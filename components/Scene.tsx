 "use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles, useTexture } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function BrandCore() {
  const group = useRef<THREE.Group>(null);
  const texture = useTexture("/logo.png");

  useFrame((state: any) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * .22;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * .35) * .08;
  });

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  return (
    <group ref={group}>
      <mesh>
        <planeGeometry args={[3.55, 3.55]} />
        <meshBasicMaterial map={texture} transparent={false} toneMapped={false} />
      </mesh>
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[1.9, .045, 20, 160]} />
        <meshStandardMaterial color="#29e7ff" emissive="#087fff" emissiveIntensity={5} />
      </mesh>
    </group>
  );
}

export function Scene() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, .25, 6.2], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={.35} />
        <pointLight position={[3, 3, 4]} intensity={80} color="#1b8fff" />
        <pointLight position={[-4, -2, 2]} intensity={50} color="#2ce7ff" />
        <Float speed={1.1} rotationIntensity={.22} floatIntensity={.55}>
          <BrandCore />
        </Float>
        <Sparkles count={180} scale={10} size={1.8} speed={.35} color="#51d9ff" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={.25} />
      </Canvas>
    </div>
  );
}
