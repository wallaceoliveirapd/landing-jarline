"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    // Hide real cursor globally
    document.documentElement.style.cursor = "none";
    
    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      // Snappy inner dot
      gsap.to(cursor, {
        x: clientX,
        y: clientY,
        duration: 0.05,
        ease: "power2.out"
      });
      
      // Slightly lagged outer ring for personality
      gsap.to(ring, {
        x: clientX,
        y: clientY,
        duration: 0.25,
        ease: "power3.out"
      });
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [role="button"], input, select, textarea, .cursor-pointer, [data-sidebar="trigger"], .sidebar-trigger');
      
      if (isInteractive) {
        cursor.classList.add("hover");
        ring.classList.add("hover");
      } else {
        cursor.classList.remove("hover");
        ring.classList.remove("hover");
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", handleMouseEnter);
      document.documentElement.style.cursor = "auto";
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="cursor fixed top-0 left-0 w-2 h-2 bg-zinc-900 rounded-full pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2"
      />
      <div
        ref={ringRef}
        className="cursor-ring fixed top-0 left-0 w-10 h-10 border border-zinc-900/10 rounded-full pointer-events-none z-[99998] -translate-x-1/2 -translate-y-1/2"
      />
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        
        .cursor {
          transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), background-color 0.3s ease;
        }
        
        .cursor.hover {
          transform: translate(-50%, -50%) scale(0.4);
          background-color: #000;
        }
        
        .cursor-ring {
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), background-color 0.3s ease, border-color 0.3s ease, width 0.3s ease, height 0.3s ease;
        }
        
        .cursor-ring.hover {
          width: 60px;
          height: 60px;
          background-color: rgba(88, 89, 71, 0.08); /* Using Brand primary with low opacity */
          border-color: #585947;
          transform: translate(-50%, -50%) scale(1.1);
        }

        /* Re-enable system cursor for critical browser elements if somehow trapped */
        iframe, .no-custom-cursor {
          cursor: auto !important;
        }
      `}</style>
    </>
  );
}
