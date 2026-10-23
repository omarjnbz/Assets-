import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const TextDistort = ({ text, theme }) => {
  const [displayText, setDisplayText] = useState(text);
  const containerRef = useRef(null);
  const filterRef = useRef(null);
  const animationRef = useRef(null);
  const isHovered = useRef(false);

  // Split words or characters
  const words = text.split(' ');

  // SVG displacement filter scaling for Gruvmind
  const triggerLiquify = () => {
    if (theme !== 'gruvmind' || !filterRef.current) return;
    
    // Animate displacement map scale using GSAP
    gsap.killTweensOf(filterRef.current);
    gsap.timeline()
      .to(filterRef.current, {
        attr: { scale: 30 },
        duration: 0.2,
        ease: 'power2.out'
      })
      .to(filterRef.current, {
        attr: { scale: 0 },
        duration: 0.6,
        ease: 'power3.out'
      });
  };

  // Matrix character scrambler for Garage Sale
  const triggerGlitch = () => {
    if (theme !== 'garagesale') return;
    
    isHovered.current = true;
    let iterations = 0;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789%@$#&!';
    
    if (animationRef.current) clearInterval(animationRef.current);

    animationRef.current = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iterations) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iterations >= text.length) {
        clearInterval(animationRef.current);
        setDisplayText(text);
        isHovered.current = false;
      }
      
      iterations += 1/3;
    }, 25);
  };

  const handleMouseEnter = () => {
    if (theme === 'gruvmind') {
      triggerLiquify();
    } else {
      triggerGlitch();
    }
  };

  const handleMouseLeave = () => {
    if (theme === 'gruvmind' && filterRef.current) {
      gsap.to(filterRef.current, {
        attr: { scale: 0 },
        duration: 0.4,
        ease: 'power2.inOut'
      });
    } else {
      if (animationRef.current) clearInterval(animationRef.current);
      setDisplayText(text);
      isHovered.current = false;
    }
  };

  useEffect(() => {
    setDisplayText(text);
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [text, theme]);

  // Generate unique filter ID to prevent conflicts when multiple elements are on the same page
  const filterId = useRef(`liquify-filter-${Math.random().toString(36).substr(2, 9)}`);

  return (
    <span 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`distort-text-wrapper ${theme === 'gruvmind' ? 'liquify-text' : 'glitch-text'}`}
      style={{
        filter: theme === 'gruvmind' ? `url(#${filterId.current})` : 'none',
        display: 'inline-block',
        position: 'relative'
      }}
    >
      {/* SVG filter definition (renders inline) */}
      {theme === 'gruvmind' && (
        <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
          <defs>
            <filter id={filterId.current} x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence 
                type="fractalNoise" 
                baseFrequency="0.04" 
                numOctaves="2" 
                result="noise" 
              />
              <feDisplacementMap 
                ref={filterRef}
                in="SourceGraphic" 
                in2="noise" 
                scale="0" 
                xChannelSelector="R" 
                yChannelSelector="G" 
              />
            </filter>
          </defs>
        </svg>
      )}

      <span className="distort-content font-heading">{displayText}</span>

      <style>{`
        .distort-text-wrapper {
          transition: color 0.3s ease;
        }
        .liquify-text:hover {
          color: #39ff14;
          text-shadow: 0 0 10px rgba(57, 255, 20, 0.4);
        }
        .glitch-text:hover {
          color: #ff5500;
          text-shadow: 2px 2px 0px #000;
        }
        .distort-content {
          display: inline-block;
          font-weight: 800;
        }
      `}</style>
    </span>
  );
};

export default TextDistort;
