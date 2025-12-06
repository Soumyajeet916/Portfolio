// @ts-nocheck
import React, { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ThreeCharacterProps {
  scrollProgress?: number; // normalized 0..1
}

const clamp = THREE.MathUtils.clamp;

const ThreeCharacter: React.FC<ThreeCharacterProps> = ({ scrollProgress = 0 }) => {
  const root = useRef<THREE.Group | null>(null);
  const head = useRef<THREE.Group | null>(null);
  const body = useRef<THREE.Group | null>(null);

  // Arms: hierarchical joints for natural articulation
  const leftUpperArm = useRef<THREE.Group | null>(null);
  const leftLowerArm = useRef<THREE.Group | null>(null);
  const leftHand = useRef<THREE.Group | null>(null);

  const rightUpperArm = useRef<THREE.Group | null>(null);
  const rightLowerArm = useRef<THREE.Group | null>(null);
  const rightHand = useRef<THREE.Group | null>(null);

  // Eyes / lids / irises
  const leftEyeLid = useRef<THREE.Group | null>(null);
  const rightEyeLid = useRef<THREE.Group | null>(null);
  const leftIris = useRef<THREE.Mesh | null>(null);
  const rightIris = useRef<THREE.Mesh | null>(null);

  const leftLeg = useRef<THREE.Group | null>(null);
  const rightLeg = useRef<THREE.Group | null>(null);

  const { viewport } = useThree();

  // blinking
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    let t: any;
    const loop = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 120);
      t = setTimeout(loop, Math.random() * 3000 + 2000);
    };
    t = setTimeout(loop, 2000);
    return () => clearTimeout(t);
  }, []);

  // Look target smoothing
  const lookTarget = useRef(new THREE.Vector3(0, 0, 5));
  const desiredTarget = useRef(new THREE.Vector3(0, 0, 5));

  // For moving-eyes behavior: track last mouse and compute velocity
  const lastMouse = useRef(new THREE.Vector2(0, 0));
  const mouseVelocity = useRef(0);
  const lastMoveAt = useRef<number>(Date.now());
  // Eye activity: when pointer moves, eyes follow more strongly
  const eyeActive = useRef(false);

  // Rest pose
  const rest = { x: 0, y: -1.4, z: 0 };

  useFrame((state) => {
    if (!root.current || !head.current || !body.current) return;

    // ---- scroll-positioning (kept simple) ----
    let tx = rest.x,
      ty = rest.y,
      tz = rest.z,
      trotY = 0;

    if (scrollProgress < 0.2) {
      tx = 0;
      ty = -1.35;
      tz = 0;
      trotY = 0;
    } else if (scrollProgress < 0.45) {
      const p = (scrollProgress - 0.2) / 0.25;
      tx = -1.6 * p;
      trotY = 0.35 * p;
    } else if (scrollProgress < 0.65) {
      const p = (scrollProgress - 0.45) / 0.2;
      tx = 0;
      tz = 1.6 * p;
      ty = -1.1 + 0.2 * p;
    } else if (scrollProgress < 0.85) {
      const p = (scrollProgress - 0.65) / 0.2;
      tx = 1.6 * p;
      trotY = -0.4 * p;
    } else {
      tx = 0;
      ty = -1.35;
      trotY = 0;
    }

    // smooth root pos/rot
    const tgt = new THREE.Vector3(tx, ty, tz);
    root.current.position.lerp(tgt, 0.06);
    // body rotation influenced by mouse
    root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, trotY + state.mouse.x * 0.12, 0.06);

    // ---- head / look target ----
    const mx = state.mouse.x * (viewport.width / 2);
    const my = state.mouse.y * (viewport.height / 2);
    desiredTarget.current.set(mx, my + 0.7, 4.8);
    lookTarget.current.lerp(desiredTarget.current, 0.12);

    head.current.lookAt(lookTarget.current);
    head.current.rotation.x = clamp(head.current.rotation.x, -0.45, 0.45);
    head.current.rotation.y = clamp(head.current.rotation.y, -0.8, 0.8);
    head.current.rotation.z = clamp(head.current.rotation.z, -0.15, 0.15);

    // subtle breathing / idle
    const t = state.clock.elapsedTime;
    const breathe = Math.sin(t * 1.8) * 0.02;
    if (body.current) body.current.scale.y = 1 + breathe;
    root.current.position.y = THREE.MathUtils.lerp(root.current.position.y, ty + breathe * 0.18, 0.12);

    // legs simple sway
    if (leftLeg.current && rightLeg.current) {
      leftLeg.current.rotation.x = Math.sin(t * 1.2) * 0.08;
      rightLeg.current.rotation.x = -Math.sin(t * 1.2) * 0.08;
    }

    // ---- eyes / blinking / iris microtracking with "moving pointer" detection ----
    if (leftEyeLid.current && rightEyeLid.current) {
      const lidScale = blink ? 0.08 : 1;
      leftEyeLid.current.scale.y = THREE.MathUtils.lerp(leftEyeLid.current.scale.y, lidScale, 0.28);
      rightEyeLid.current.scale.y = THREE.MathUtils.lerp(rightEyeLid.current.scale.y, lidScale, 0.28);
    }

    // compute mouse velocity (simple)
    const curMouse = new THREE.Vector2(state.mouse.x, state.mouse.y);
    const dx = curMouse.x - lastMouse.current.x;
    const dy = curMouse.y - lastMouse.current.y;
    // delta per frame scaled by delta time to get approximate speed
    const dt = Math.max(1e-3, state.clock.getDelta());
    const speed = Math.sqrt(dx * dx + dy * dy) / dt;
    // smooth velocity
    mouseVelocity.current = THREE.MathUtils.lerp(mouseVelocity.current, speed, 0.25);
    lastMouse.current.copy(curMouse);

    // Set active if recent movement occurred
    if (mouseVelocity.current > 0.002) {
      eyeActive.current = true;
      lastMoveAt.current = Date.now();
    } else {
      // if no movement for 300ms, deactivate
      if (Date.now() - lastMoveAt.current > 300) eyeActive.current = false;
    }

    // If active — eyes follow strongly; if not active — they relax to center slowly
    const activeFactor = eyeActive.current ? clamp(Math.min(mouseVelocity.current * 100, 1.0), 0, 1) : 0;
    // micro-tracking offsets (smaller than head movement)
    const eyeX = clamp(state.mouse.x * 0.28 * (0.5 + activeFactor * 0.9), -0.36, 0.36);
    const eyeY = clamp(state.mouse.y * 0.28 * (0.5 + activeFactor * 0.9), -0.28, 0.28);

    if (leftIris.current) {
      leftIris.current.position.x = THREE.MathUtils.lerp(leftIris.current.position.x, eyeX * 0.12, eyeActive.current ? 0.3 : 0.06);
      leftIris.current.position.y = THREE.MathUtils.lerp(leftIris.current.position.y, eyeY * 0.12, eyeActive.current ? 0.3 : 0.06);
    }
    if (rightIris.current) {
      rightIris.current.position.x = THREE.MathUtils.lerp(rightIris.current.position.x, eyeX * 0.12, eyeActive.current ? 0.3 : 0.06);
      rightIris.current.position.y = THREE.MathUtils.lerp(rightIris.current.position.y, eyeY * 0.12, eyeActive.current ? 0.3 : 0.06);
    }

    // ---- ARMS: articulated, reactive, and idle motion (kept from previous) ----
    const idleSwing = Math.sin(t * 1.3) * 0.12;
    const idleElbow = Math.cos(t * 1.5) * 0.15;
    const reachX = clamp(state.mouse.x * 0.8, -0.6, 0.6);
    const reachY = clamp(-state.mouse.y * 0.5, -0.4, 0.4);

    if (leftUpperArm.current && leftLowerArm.current && leftHand.current) {
      leftUpperArm.current.rotation.z = 0.35 + idleSwing + reachX * 0.15;
      leftUpperArm.current.rotation.x = -0.15 + reachY * 0.12;
      leftLowerArm.current.rotation.x = 0.25 + idleElbow - Math.abs(reachX) * 0.25;
      leftLowerArm.current.rotation.z = 0.05 + reachX * 0.05;
      leftHand.current.rotation.x = -0.2 + Math.sin(t * 1.6) * 0.06;
      leftHand.current.rotation.y = reachX * -0.08;
      leftHand.current.position.z = THREE.MathUtils.lerp(leftHand.current.position.z, 0.05 + reachX * 0.06, 0.12);
    }

    if (rightUpperArm.current && rightLowerArm.current && rightHand.current) {
      rightUpperArm.current.rotation.z = -0.35 - idleSwing + reachX * 0.15;
      rightUpperArm.current.rotation.x = -0.15 + reachY * 0.12;
      rightLowerArm.current.rotation.x = 0.25 - idleElbow - Math.abs(reachX) * 0.25;
      rightLowerArm.current.rotation.z = -0.05 + reachX * 0.05;
      rightHand.current.rotation.x = -0.18 + Math.cos(t * 1.6) * 0.06;
      rightHand.current.rotation.y = reachX * 0.08;
      rightHand.current.position.z = THREE.MathUtils.lerp(rightHand.current.position.z, 0.05 - reachX * 0.06, 0.12);
    }
  });

  // ---------- JSX: geometry with articulated arms (upper -> lower -> hand) ----------
  return (
    <group ref={root} dispose={null}>
      {/* ground shadow */}
      <group position={[0, -1.95, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
          <planeGeometry args={[6, 6]} />
          <shadowMaterial opacity={0.14} />
        </mesh>
      </group>

      {/* legs / hips */}
      <group position={[0, -1.4, 0]}>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[1.2, 0.4, 0.8]} />
          <meshStandardMaterial color="#111827" roughness={0.5} metalness={0.4} />
        </mesh>

        <group ref={leftLeg} position={[-0.36, -0.8, 0]}>
          <mesh>
            <capsuleGeometry args={[0.22, 1.0, 6, 12]} />
            <meshStandardMaterial color="#111827" roughness={0.6} metalness={0.3} />
          </mesh>
          <mesh position={[0, -0.95, 0.16]}>
            <boxGeometry args={[0.46, 0.18, 0.7]} />
            <meshStandardMaterial color="#020617" roughness={0.3} metalness={0.5} />
          </mesh>
        </group>

        <group ref={rightLeg} position={[0.36, -0.8, 0]}>
          <mesh>
            <capsuleGeometry args={[0.22, 1.0, 6, 12]} />
            <meshStandardMaterial color="#111827" roughness={0.6} metalness={0.3} />
          </mesh>
          <mesh position={[0, -0.95, 0.16]}>
            <boxGeometry args={[0.46, 0.18, 0.7]} />
            <meshStandardMaterial color="#020617" roughness={0.3} metalness={0.5} />
          </mesh>
        </group>
      </group>

      {/* torso */}
      <group ref={body} position={[0, -0.15, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.85, 1.4, 6, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.6} />
        </mesh>

        <mesh position={[-1.05, 0.45, 0]}>
          <sphereGeometry args={[0.44, 24, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.6} />
        </mesh>
        <mesh position={[1.05, 0.45, 0]}>
          <sphereGeometry args={[0.44, 24, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.6} />
        </mesh>

        {/* LEFT ARM (hierarchy: leftUpperArm -> leftLowerArm -> leftHand) */}
        <group ref={leftUpperArm} position={[-1.28, 0.25, 0]}>
          <mesh position={[0, -0.52, 0]} rotation={[0, 0, 0]}>
            <capsuleGeometry args={[0.18, 1.05, 6, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.6} />
          </mesh>

          <group ref={leftLowerArm} position={[0, -1.05, 0]}>
            <mesh position={[0, -0.45, 0]}>
              <capsuleGeometry args={[0.16, 0.9, 6, 12]} />
              <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.6} />
            </mesh>

            <group ref={leftHand} position={[0, -0.95, 0]}>
              <mesh position={[0, -0.06, 0.12]}>
                <boxGeometry args={[0.34, 0.18, 0.36]} />
                <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.05} />
              </mesh>

              <mesh position={[0.18, -0.02, 0.08]} rotation={[0.3, 0.2, 0]}>
                <boxGeometry args={[0.09, 0.06, 0.12]} />
                <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.05} />
              </mesh>

              <mesh position={[-0.05, 0.02, 0.28]}>
                <boxGeometry args={[0.22, 0.06, 0.06]} />
                <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.05} />
              </mesh>
              <mesh position={[0.05, 0.02, 0.28]}>
                <boxGeometry args={[0.22, 0.06, 0.06]} />
                <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.05} />
              </mesh>
            </group>
          </group>
        </group>

        {/* RIGHT ARM */}
        <group ref={rightUpperArm} position={[1.28, 0.25, 0]}>
          <mesh position={[0, -0.52, 0]}>
            <capsuleGeometry args={[0.18, 1.05, 6, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.6} />
          </mesh>

          <group ref={rightLowerArm} position={[0, -1.05, 0]}>
            <mesh position={[0, -0.45, 0]}>
              <capsuleGeometry args={[0.16, 0.9, 6, 12]} />
              <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.6} />
            </mesh>

            <group ref={rightHand} position={[0, -0.95, 0]}>
              <mesh position={[0, -0.06, 0.12]}>
                <boxGeometry args={[0.34, 0.18, 0.36]} />
                <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.05} />
              </mesh>

              <mesh position={[-0.18, -0.02, 0.08]} rotation={[0.3, -0.2, 0]}>
                <boxGeometry args={[0.09, 0.06, 0.12]} />
                <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.05} />
              </mesh>

              <mesh position={[-0.05, 0.02, 0.28]}>
                <boxGeometry args={[0.22, 0.06, 0.06]} />
                <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.05} />
              </mesh>
              <mesh position={[0.05, 0.02, 0.28]}>
                <boxGeometry args={[0.22, 0.06, 0.06]} />
                <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.05} />
              </mesh>
            </group>
          </group>
        </group>

        {/* neck */}
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.32, 0.38, 0.5, 20]} />
          <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.05} />
        </mesh>
      </group>

      {/* HEAD */}
      <group ref={head} position={[0, 1.35, 0.08]}>
        <mesh>
          <sphereGeometry args={[0.86, 48, 48]} />
          <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.05} />
        </mesh>

        <mesh position={[0, -0.48, 0.06]}>
          <cylinderGeometry args={[0.45, 0.32, 0.65, 12]} />
          <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.05} />
        </mesh>

        <mesh position={[0, 0.48, 0]}>
          <sphereGeometry args={[0.9, 32, 32, 0, Math.PI * 2, 0, 1.45]} />
          <meshStandardMaterial color="#020617" roughness={0.65} metalness={0.35} />
        </mesh>

        {/* EYES */}
        <group position={[0, 0.06, 0.72]}>
          <group position={[-0.32, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.15, 20, 20]} />
              <meshStandardMaterial color="#fff" roughness={0.1} metalness={0} />
            </mesh>
            <group ref={leftIris} position={[0, 0, 0.12]}>
              <mesh>
                <circleGeometry args={[0.07, 32]} />
                <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.5} emissive="#1d4ed8" emissiveIntensity={0.18} />
              </mesh>
              <mesh position={[0, 0, 0.01]}>
                <circleGeometry args={[0.03, 32]} />
                <meshBasicMaterial color="#000" />
              </mesh>
            </group>
            <group ref={leftEyeLid}>
              <mesh position={[0, 0.09, 0]}>
                <sphereGeometry args={[0.16, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.05} />
              </mesh>
            </group>
          </group>

          <group position={[0.32, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.15, 20, 20]} />
              <meshStandardMaterial color="#fff" roughness={0.1} metalness={0} />
            </mesh>
            <group ref={rightIris} position={[0, 0, 0.12]}>
              <mesh>
                <circleGeometry args={[0.07, 32]} />
                <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.5} emissive="#1d4ed8" emissiveIntensity={0.18} />
              </mesh>
              <mesh position={[0, 0, 0.01]}>
                <circleGeometry args={[0.03, 32]} />
                <meshBasicMaterial color="#000" />
              </mesh>
            </group>
            <group ref={rightEyeLid}>
              <mesh position={[0, 0.09, 0]}>
                <sphereGeometry args={[0.16, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.05} />
              </mesh>
            </group>
          </group>
        </group>

        <mesh position={[0, -0.08, 0.78]}>
          <coneGeometry args={[0.07, 0.36, 28]} />
          <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.05} />
        </mesh>

        <mesh position={[-0.92, 0.02, 0]} rotation={[0, 0, 1.45]}>
          <cylinderGeometry args={[0.085, 0.05, 0.32, 16]} />
          <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.05} />
        </mesh>
        <mesh position={[0.92, 0.02, 0]} rotation={[0, 0, -1.45]}>
          <cylinderGeometry args={[0.085, 0.05, 0.32, 16]} />
          <meshStandardMaterial color="#d1a68d" roughness={0.4} metalness={0.05} />
        </mesh>
      </group>
    </group>
  );
};

export default ThreeCharacter;
