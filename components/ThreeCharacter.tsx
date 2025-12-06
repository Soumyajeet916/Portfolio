// @ts-nocheck
/* @jsxImportSource @react-three/fiber */
import React, { useRef, useEffect, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ThreeCharacterProps {
  scrollProgress: number;
}

export const ThreeCharacter: React.FC<ThreeCharacterProps> = ({ scrollProgress }) => {
  const group = useRef<THREE.Group | null>(null);
  const headGroup = useRef<THREE.Group | null>(null);
  const neckRef = useRef<THREE.Mesh | null>(null);
  const leftEyeRef = useRef<THREE.Group | null>(null);
  const rightEyeRef = useRef<THREE.Group | null>(null);
  const bodyRef = useRef<THREE.Group | null>(null);

  const { viewport } = useThree();

  // Blink state
  const [blink, setBlink] = useState(false);

  // Smooth animation helpers
  const targetPos = useRef(new THREE.Vector3(0, -1, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 5));

  // --- Blink Logic ---
  useEffect(() => {
    let timeoutId: number | undefined;
    const blinkLoop = () => {
      setBlink(true);
      window.setTimeout(() => setBlink(false), 150);
      const nextBlink = Math.random() * 3000 + 2000;
      timeoutId = window.setTimeout(blinkLoop, nextBlink);
    };
    timeoutId = window.setTimeout(blinkLoop, 3000);
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  // --- Animation Loop ---
  useFrame((state) => {
    if (!group.current || !headGroup.current) return;

    // 1. SCROLL BASED POSITIONING & ROTATION
    let tX = 0;
    let tY = -2; // Base height
    let tZ = 0;
    let tRotY = 0;

    if (scrollProgress < 0.2) {
      // Hero
      tX = 0;
      tY = -1.5;
      tZ = 0;
      tRotY = 0;
    } else if (scrollProgress < 0.45) {
      // About - Move Left
      const p = (scrollProgress - 0.2) / 0.25; // normalized 0-1
      tX = -2 * p;
      tRotY = 0.5 * p;
    } else if (scrollProgress < 0.65) {
      // Skills - Center & Zoom
      const p = (scrollProgress - 0.45) / 0.2;
      tX = 0;
      tZ = 2 * p; // Zoom effect by moving character closer
      tY = -1.2 + 0.3 * p;
    } else if (scrollProgress < 0.85) {
      // Projects - Move Right
      const p = (scrollProgress - 0.65) / 0.2;
      tX = 2.5 * p;
      tRotY = -0.6 * p;
      tZ = 0;
    } else {
      // Contact
      tX = 0;
      tRotY = 0;
      tY = -1.5;
    }

    // Apply smooth interpolation
    targetPos.current.set(tX, tY, tZ);
    group.current.position.lerp(targetPos.current, 0.05);

    const targetBaseRot = tRotY;

    // 2. MOUSE TRACKING
    const mouseX = state.mouse.x * (viewport.width / 2);
    const mouseY = state.mouse.y * (viewport.height / 2);

    const lookTarget = new THREE.Vector3(mouseX, mouseY, 5);
    currentLookAt.current.lerp(lookTarget, 0.1);

    // Head Rotation toward look target, clamped for natural motion
    headGroup.current.lookAt(currentLookAt.current);
    headGroup.current.rotation.x = THREE.MathUtils.clamp(headGroup.current.rotation.x, -0.5, 0.5);
    headGroup.current.rotation.y = THREE.MathUtils.clamp(
      headGroup.current.rotation.y,
      -0.8 + targetBaseRot,
      0.8 + targetBaseRot
    );
    headGroup.current.rotation.z = THREE.MathUtils.clamp(headGroup.current.rotation.z, -0.2, 0.2);

    // Body subtle rotation toward mouse
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetBaseRot + state.mouse.x * 0.1, 0.05);

    // 3. IDLE BREATHING
    const breathe = Math.sin(state.clock.elapsedTime * 2) * 0.02;
    if (bodyRef.current) bodyRef.current.scale.y = 1 + breathe; // Chest expansion
    group.current.position.y += breathe * 0.1; // Vertical bob

    // 4. EYELIDS (Blinking)
    if (leftEyeRef.current && rightEyeRef.current) {
      const scaleY = blink ? 0.1 : 1;
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, scaleY, 0.3);
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, scaleY, 0.3);
    }
  });

  // --- Component JSX ---
  return (
    <group ref={group} dispose={null}>
      {/* --- BODY --- */}
      <group ref={bodyRef}>
        <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.9, 1.5, 4, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.6} />
        </mesh>

        {/* shoulders / rounded forms */}
        <mesh position={[-1.1, 0.6, 0]} castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.6} />
        </mesh>
        <mesh position={[1.1, 0.6, 0]} castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.6} />
        </mesh>

        <mesh ref={neckRef} position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.45, 0.6, 32]} />
          <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.1} />
        </mesh>
      </group>

      {/* --- HEAD GROUP --- */}
      <group ref={headGroup} position={[0, 1.3, 0.1]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.1, 1.4, 1.2]} />
          <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.1} />
        </mesh>

        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.85, 64, 64]} />
          <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.1} />
        </mesh>

        <mesh position={[0, -0.6, 0.1]}>
          <cylinderGeometry args={[0.5, 0.3, 0.6, 4]} />
          <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.1} />
        </mesh>

        <mesh position={[0, 0.5, 0]} castShadow>
          <sphereGeometry args={[0.9, 32, 32, 0, 6.3, 0, 1.5]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.6} />
        </mesh>

        <mesh position={[0, 0.7, -0.2]}>
          <boxGeometry args={[1.2, 0.5, 1.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.6} />
        </mesh>

        {/* --- EYES --- */}
        <group position={[0, 0.1, 0.75]}>
          {/* Left Eye */}
          <group position={[-0.3, 0, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.15, 32, 32]} />
              <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0} />
            </mesh>

            <group position={[0, 0, 0.12]}>
              <mesh>
                <circleGeometry args={[0.07, 32]} />
                <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.5} emissive="#1d4ed8" emissiveIntensity={0.2} />
              </mesh>
              <mesh position={[0, 0, 0.01]}>
                <circleGeometry args={[0.03, 32]} />
                <meshBasicMaterial color="#000000" />
              </mesh>
              <mesh position={[0.02, 0.02, 0.02]}>
                <circleGeometry args={[0.015, 16]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>

            {/* eyelid group for blinking */}
            <group ref={leftEyeRef}>
              <mesh position={[0, 0.1, 0]}>
                {/* Half-sphere used as eyelid */}
                <sphereGeometry args={[0.16, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.1} />
              </mesh>
            </group>
          </group>

          {/* Right Eye */}
          <group position={[0.3, 0, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.15, 32, 32]} />
              <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0} />
            </mesh>

            <group position={[0, 0, 0.12]}>
              <mesh>
                <circleGeometry args={[0.07, 32]} />
                <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.5} emissive="#1d4ed8" emissiveIntensity={0.2} />
              </mesh>
              <mesh position={[0, 0, 0.01]}>
                <circleGeometry args={[0.03, 32]} />
                <meshBasicMaterial color="#000000" />
              </mesh>
              <mesh position={[0.02, 0.02, 0.02]}>
                <circleGeometry args={[0.015, 16]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>

            <group ref={rightEyeRef}>
              <mesh position={[0, 0.1, 0]}>
                <sphereGeometry args={[0.16, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.1} />
              </mesh>
            </group>
          </group>
        </group>

        {/* Nose */}
        <mesh position={[0, -0.15, 0.8]} castShadow>
          <coneGeometry args={[0.08, 0.4, 32]} />
          <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.1} />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.9, 0, 0]} rotation={[0, 0, 1.5]}>
          <cylinderGeometry args={[0.1, 0.05, 0.3, 32]} />
          <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.1} />
        </mesh>
        <mesh position={[0.9, 0, 0]} rotation={[0, 0, -1.5]}>
          <cylinderGeometry args={[0.1, 0.05, 0.3, 32]} />
          <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.1} />
        </mesh>
      </group>
    </group>
  );
};

export default ThreeCharacter;
