// @ts-nocheck
/* @jsxImportSource @react-three/fiber */
import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Loader, ContactShadows } from '@react-three/drei';
import { Overlay } from './components/Overlay';
import ThreeCharacter from './components/ThreeCharacter';
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
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    // Apply 'dark' class conditionally to the root wrapper for Tailwind class strategy
    <div className={isDark ? 'dark' : ''}>
        <div className="relative w-full h-screen overflow-hidden transition-colors duration-500 bg-[#f0f4f8] dark:bg-[#050505]">
        
        {/* 3D SCENE BACKGROUND */}
        <div className="absolute inset-0 z-0">
            <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
            <Suspense fallback={null}>
              {/* Adjust lighting intensity based on theme */}
              <ambientLight intensity={isDark ? 0.5 : 0.8} />
              <spotLight position={[10, 10, 10]} angle={Math.PI / 6} penumbra={1} intensity={1} castShadow />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color={isDark ? "blue" : "#3b82f6"} />

              <Environment preset="city" />

              <ThreeCharacter scrollProgress={scrollProgress} />

              <ContactShadows 
                resolution={1024} 
                scale={10} 
                blur={2} 
                opacity={0.5} 
                far={10} 
                color={isDark ? "#000000" : "#94a3b8"} 
              />
            </Suspense>
            </Canvas>
        </div>

        {/* SCROLLABLE HTML CONTENT */}
        <div 
            ref={scrollContainer} 
            className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden no-scrollbar scroll-smooth"
        >
            <Overlay toggleTheme={toggleTheme} isDark={isDark} />
        </div>

        <Loader 
            containerStyles={{ backgroundColor: isDark ? '#050505' : '#f0f4f8' }}
            innerStyles={{ width: '50vw' }} 
            barStyles={{ backgroundColor: '#3b82f6' }}
            //dataInterpolation={(p) => `Loading 3D Experience ${p.toFixed(0)}%`}
        />
        </div>
    </div>
  );
};

export default App;