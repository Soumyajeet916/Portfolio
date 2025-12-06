import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Loader, ContactShadows } from "@react-three/drei";
import { Overlay } from "./components/Overlay";
import ThreeCharacter from "./components/ThreeCharacter";

const App: React.FC = () => {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDark, setIsDark] = useState(true);

  // Toggle Theme Function
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleScroll = () => {
    if (!scrollContainer.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer.current;

    // Calculate normalized scroll (0 to 1)
    const maxScroll = scrollHeight - clientHeight;
    const progress = Math.max(0, Math.min(1, scrollTop / maxScroll));
    setScrollProgress(progress);
  };

  useEffect(() => {
    const el = scrollContainer.current;
    if (el) {
      el.addEventListener("scroll", handleScroll, { passive: true });
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    // Apply 'dark' class conditionally to the root wrapper for Tailwind class strategy
    <div className={isDark ? "dark" : ""}>
      <div className="relative w-full h-screen overflow-hidden transition-colors duration-500 bg-[#f0f4f8] dark:bg-[#050505]">
        {/* 3D SCENE BACKGROUND */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Canvas shadows camera={{ position: [0, 0, 6], fov: 45 }}>
            <Suspense fallback={null}>
              {/* Ambient + key lights */}
              <ambientLight intensity={isDark ? 0.5 : 0.9} />
              <directionalLight position={[5, 10, 5]} intensity={0.9} castShadow />
              <spotLight position={[-5, 8, 5]} angle={Math.PI / 6} penumbra={0.3} intensity={0.6} />
              <pointLight position={[0, -5, -5]} intensity={0.3} />

              {/* Environment (HDRI preset) */}
              <Environment preset="city" />

              {/* The character - receives scrollProgress to adjust pose/position */}
              <ThreeCharacter scrollProgress={scrollProgress} />

              {/* Soft contact shadow beneath the character */}
              <ContactShadows
                position={[0, -1.9, 0]}
                resolution={1024}
                scale={8}
                blur={2}
                opacity={isDark ? 0.6 : 0.4}
                far={10}
                color={isDark ? "#000000" : "#94a3b8"}
              />
            </Suspense>
          </Canvas>

          {/* Drei Loader (optional) - will display during GL resource loading */}
          <Loader
            containerStyles={{ backgroundColor: isDark ? "#050505" : "#f0f4f8" }}
            innerStyles={{ width: "40vw" }}
            barStyles={{ backgroundColor: "#3b82f6" }}
            dataInterpolation={(p) => `Loading 3D Experience ${p.toFixed(0)}%`}
          />
        </div>

        {/* SCROLLABLE HTML CONTENT */}
        <div
          ref={scrollContainer}
          className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden no-scrollbar scroll-smooth"
        >
          <Overlay toggleTheme={toggleTheme} isDark={isDark} />
        </div>
      </div>
    </div>
  );
};

export default App;
