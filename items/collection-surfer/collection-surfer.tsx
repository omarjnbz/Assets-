"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  MotionValue,
} from "framer-motion";

export interface CollectionItem {
  id: number;
  image: string;
  title: string;
}

export type CollectionSurferVariant = "magnetic" | "uplift" | "simple";

// Default items for the component in case none are provided
const ITEMS: CollectionItem[] = [
  { id: 1, image: "https://cdn.21st.dev/assets/mirror/c9/c990b7807031a954614dabff3897872daa7b20d080f951116cdd7f8713b543a8.jpg", title: "HERITAGE 01" },
  { id: 2, image: "https://cdn.21st.dev/assets/mirror/b8/b82da26c76593525a82a9d613e49e28bde2791786dcf9d332c1ef84923ff4d7c.jpg", title: "HERITAGE 02" },
  { id: 3, image: "https://cdn.21st.dev/assets/mirror/5e/5efec6032f888c32fc053d3a3919647449f077e140cdc1ebdd8caeb4487b935a.jpg", title: "HERITAGE 03" },
  { id: 4, image: "https://cdn.21st.dev/assets/mirror/7e/7ef0e090165479436a4a79f49404e5bf9a810261c6706ef8a86044861b69630e.jpg", title: "HERITAGE 04" },
  { id: 5, image: "https://cdn.21st.dev/assets/mirror/25/25a9810d6b0e32cfbb3df59b0ea7ef90a3fe40d5ec0a359d6add67eba9838ba6.jpg", title: "HERITAGE 05" },
  { id: 6, image: "https://cdn.21st.dev/assets/mirror/52/52694d62555561c8bb92f07456e7978637f3b010681bba2461b7e19bd352568a.jpg", title: "HERITAGE 06" },
  { id: 7, image: "https://cdn.21st.dev/assets/mirror/6d/6da167bca8d72533c86cbf2c9ce2bb871d4047b8221b1682e9b08d58d21fb776.jpg", title: "HERITAGE 07" },
  { id: 8, image: "https://cdn.21st.dev/assets/mirror/be/bed64a5231f0881163bda21f5a02964868c4be9e49eb37fa26b8add90db59ce1.jpg", title: "HERITAGE 08" },
  { id: 9, image: "https://cdn.21st.dev/assets/mirror/07/07e1e5d23c111cacdf5b94c62cde75aeafa20f7b0be302fd5d7cc95011ebcbea.jpg", title: "HERITAGE 09" },
  { id: 10, image: "https://cdn.21st.dev/assets/mirror/0a/0a7cf0c332ed7319e3f54a7ab3efd6df3d57cf10f899c993ff5486ebb9fba749.jpg", title: "HERITAGE 10" },
  { id: 11, image: "https://cdn.21st.dev/assets/mirror/34/34153efaacb40fceee7c65b5eb2075ef62885a69eecc27e82755abbf71088147.jpg", title: "HERITAGE 11" },
  { id: 12, image: "https://cdn.21st.dev/assets/mirror/ae/aea4667afe64fb41f11985b1f4fbb3cf93488043654a8da6c121c3581f7b13f9.jpg", title: "HERITAGE 12" },
  { id: 13, image: "https://cdn.21st.dev/assets/mirror/d9/d97d81608375dfd786ff889e19e719f12048bbdc7be9c904e57ef7a495d48701.jpg", title: "HERITAGE 13" },
  { id: 14, image: "https://cdn.21st.dev/assets/mirror/68/6887bb08fa8626fd16e7dd5c92f9b920586ae2f7020cdec728e643df621d990c.jpg", title: "HERITAGE 14" },
  { id: 15, image: "https://cdn.21st.dev/assets/mirror/5a/5a5496500b417c5682fa813fc43085752107f75c28e35b6d9acd6abf3dff5142.jpg", title: "HERITAGE 15" },
  { id: 16, image: "https://cdn.21st.dev/assets/mirror/e2/e2e75b34da100b2beae27db6a1b58a05984b69dfef5eda53599f50ed00e9b4fc.jpg", title: "HERITAGE 16" },
];

interface CollectionSurferProps {
  items?: CollectionItem[];
  variant?: CollectionSurferVariant;
}

export function CollectionSurfer({
  items = ITEMS,
  variant = "magnetic",
}: CollectionSurferProps) {
  // 1. Loop Setup: Duplicate items to create a buffer
  // We render the list twice: [Original Set, Duplicate Set]
  // When we scroll past the Original Set, we snap back to the start.
  const duplicatedItems = [...items, ...items];

  // Scroll sensitivity
  const scrollPerItem = 600;

  // The exact scroll distance to complete one full loop of the ORIGINAL items
  const loopDistance = items.length * scrollPerItem;

  const { scrollY } = useScroll();

  const smoothScroll = useSpring(scrollY, {
    mass: 0.1,
    stiffness: 100,
    damping: 20,
  });

  // 2. Modulo Logic:
  // Instead of mapping 0 -> totalScroll, we map to a looped value.
  // loops 0 -> loopDistance -> 0 -> loopDistance...
  const loopedProgress = useTransform(
    smoothScroll,
    (value) => value % loopDistance,
  );

  // Step vector
  const stepX = 240;
  const stepY = -84;
  const stepZ = -288;

  // We only move the scene backwards by the length of ONE set of items
  const x = useTransform(
    loopedProgress,
    [0, loopDistance],
    [0, -items.length * stepX],
  );
  const y = useTransform(
    loopedProgress,
    [0, loopDistance],
    [0, -items.length * stepY],
  );
  const z = useTransform(
    loopedProgress,
    [0, loopDistance],
    [0, -items.length * stepZ],
  );

  // Mouse position for magnetic effect
  // Initialize off-screen so no card is scaled by default
  const mouseX = useMotionValue(-10000);
  const mouseY = useMotionValue(-10000);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (variant === "simple") return;
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const handleMouseLeave = () => {
    if (variant === "simple") return;
    mouseX.set(-10000);
    mouseY.set(-10000);
  };

  return (
    <div className="relative bg-black min-h-screen text-white w-full">
      {/* 3. Infinite Spacer:
                We make this huge so the user can scroll for a very long time.
                (e.g., 50,000px) */}
      <div style={{ height: "50000px" }} className="w-full" />

      {/* Fixed viewport */}
      <div
        className="fixed inset-0 w-full h-screen overflow-hidden flex items-center justify-center perspective-container"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* UI Overlays */}
        <div className="absolute top-[3vw] left-[3vw] z-50 pointer-events-none mix-blend-difference">
          <h1 className="font-heading font-bold text-[clamp(2rem,6vw,5rem)] leading-[0.9] tracking-tighter ml-[4vw]">
            HERITAGE FW25/26
          </h1>
          <h1 className="font-heading font-bold text-[clamp(2rem,6vw,5rem)] leading-[0.9] tracking-tighter">
            COLLECTION
            <span className="text-[0.4em] align-top relative top-[0.6em] ml-2 font-mono tabular-nums">
              ({items.length})
            </span>
          </h1>
        </div>

        <div className="absolute bottom-[3vw] right-[3vw] z-50 font-mono text-xs tracking-wider uppercase opacity-70">
          scroll to surf
        </div>

        {/* 3D Scene */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            perspective: "2000px",
            perspectiveOrigin: "10% 10%",
          }}
        >
          {/* Animated Track */}
          <motion.div
            className="relative w-0 h-0"
            style={{
              x,
              y,
              z,
              transformStyle: "preserve-3d",
            }}
          >
            {duplicatedItems.map((item, i) => (
              <Card
                key={`${item.id}-${i}`}
                item={item}
                i={i}
                stepX={stepX}
                stepY={stepY}
                stepZ={stepZ}
                mouseX={mouseX}
                mouseY={mouseY}
                scrollSpring={smoothScroll}
                variant={variant}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Card({
  item,
  i,
  stepX,
  stepY,
  stepZ,
  mouseX,
  mouseY,
  scrollSpring,
  variant,
}: {
  item: CollectionItem;
  i: number;
  stepX: number;
  stepY: number;
  stepZ: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  scrollSpring: MotionValue<number>;
  variant: CollectionSurferVariant;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Calculate distance from mouse to center of card
  const distance = useTransform([mouseX, mouseY, scrollSpring], ([x, y]) => {
    if (!ref.current || variant === "simple") return 200; // Default large distance
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    return dist;
  });

  // --- Magnetic Variant ---
  // Map distance to scale: Closer = larger
  const targetScale = useTransform(distance, [0, 400], [1.5, 1]);
  const springScale = useSpring(targetScale, {
    mass: 0.5,
    stiffness: 300,
    damping: 20,
  });

  // --- Uplift Variant ---
  // Map distance to Y uplift: Closer = move up (negative Y)
  const targetUplift = useTransform(distance, [0, 400], [-100, 0]);
  const springUplift = useSpring(targetUplift, {
    mass: 0.5,
    stiffness: 300,
    damping: 20,
  });

  // Combine transforms based on variant
  const transform = useTransform([springScale, springUplift], ([s, u]) => {
    let scaleValue = 1;
    let upliftValue = 0;

    if (variant === "magnetic") {
      scaleValue = Number(s);
    } else if (variant === "uplift") {
      upliftValue = Number(u);
    }

    const baseX = i * stepX;
    const baseY = i * stepY;
    const baseZ = i * stepZ;

    return `translate3d(${baseX}px, ${baseY + upliftValue}px, ${baseZ}px) rotateY(-50deg) scale(${scaleValue})`;
  });

  return (
    <motion.div
      ref={ref}
      className="absolute w-[300px] h-[400px] bg-neutral-900 overflow-hidden shadow-2xl transition-colors duration-500 ease-out group"
      style={{
        transform,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Index number: Using i % 16 + 1 so the duplicate cards show correct numbers (01-16) */}
      <div className="absolute -top-6 -left-4 text-white font-mono text-xs opacity-50 transition-opacity group-hover:opacity-100">
        {String((i % 16) + 1).padStart(2, "0")}
      </div>

      {/* Image */}
      <div className="relative w-full h-full brightness-75 group-hover:brightness-100 transition-all duration-300">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
    </motion.div>
  );
}

export default CollectionSurfer;
