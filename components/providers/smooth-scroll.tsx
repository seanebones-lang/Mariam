"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const lenis = new Lenis({ duration: 1.1 });
    let raf = 0;
    function rafLoop(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(rafLoop);
    }
    raf = requestAnimationFrame(rafLoop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return <>{children}</>;
}
