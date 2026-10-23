import React, { useState, useEffect, useRef } from 'react';

const StopMotionCard = ({ theme, title, date, location, baseImageIndex }) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  // Trigger stop-motion loop on hover
  useEffect(() => {
    if (isHovered) {
      intervalRef.current = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % 5);
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setFrameIndex(0);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered]);

  // Dynamic Stylized SVGs to serve as gorgeous, self-contained visual graphics for the rave portals.
  // This avoids requiring external images to run, making the website fully production-ready immediately.
  const renderFrameSvg = (idx) => {
    // We adjust SVG shapes and positions based on idx to create the "stop-motion loop"
    const shiftX = (idx * 15) % 40;
    const shiftY = (idx * 20) % 50;
    const scale = 1 + (idx * 0.05);
    const rotation = idx * 6;
    
    if (theme === 'gruvmind') {
      // Gruvmind: Deep tech, floating records, audio waves, neon circles
      return (
        <svg viewBox="0 0 400 500" className="stop-motion-svg">
          <defs>
            <radialGradient id={`circleGrad-${baseImageIndex}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#120924" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="#120924" />
          
          {/* Pulsing mesh grid */}
          <g opacity="0.15" stroke="#a78bfa" strokeWidth="0.5">
            <line x1="0" y1={100 + shiftY} x2="400" y2={100 + shiftY} />
            <line x1="0" y1={250 - shiftY} x2="400" y2={250 - shiftY} />
            <line x1="0" y1={400 + shiftY} x2="400" y2={400 + shiftY} />
            <line x1={100 + shiftX} y1="0" x2={100 + shiftX} y2="500" />
            <line x1={200 - shiftX} y1="0" x2={200 - shiftX} y2="500" />
            <line x1={300 + shiftX} y1="0" x2={300 + shiftX} y2="500" />
          </g>

          {/* Neon Sphere */}
          <circle 
            cx={200 + (idx === 1 ? -15 : idx === 3 ? 20 : 0)} 
            cy={250 + (idx === 2 ? 10 : idx === 4 ? -25 : 0)} 
            r={100 * scale} 
            fill={`url(#circleGrad-${baseImageIndex})`} 
          />

          {/* Abstract Soundwave trails */}
          <path
            d={`M 50 ${300 + shiftY} Q 150 ${200 - shiftX} 200 ${300 + shiftY} T 350 ${300 - shiftY}`}
            fill="none"
            stroke="#39ff14"
            strokeWidth="3"
            strokeDasharray={idx % 2 === 0 ? "10, 5" : "none"}
            opacity="0.8"
            style={{ transformOrigin: 'center', transform: `rotate(${rotation}deg)` }}
          />

          {/* Floating Vinyl Record */}
          <circle 
            cx={200 + shiftX} 
            cy={220 - shiftY} 
            r={60} 
            fill="#080312" 
            stroke="#c084fc" 
            strokeWidth="1.5"
          />
          <circle 
            cx={200 + shiftX} 
            cy={220 - shiftY} 
            r={50} 
            fill="none" 
            stroke="#a78bfa" 
            strokeWidth="0.5" 
            strokeDasharray="5,3" 
          />
          <circle 
            cx={200 + shiftX} 
            cy={220 - shiftY} 
            r={15} 
            fill="#39ff14" 
          />

          {/* Holographic Text */}
          <text 
            x="20" 
            y="460" 
            fill="#a78bfa" 
            fontFamily="Space Grotesk" 
            fontSize="12" 
            letterSpacing="2"
          >
            SYS_STAGE_{baseImageIndex} // FREQ: {90 + idx * 5}HZ
          </text>
        </svg>
      );
    } else {
      // Garage Sale: Raw UKG, chainlinks, halftone print pattern, neon orange warning tape
      const hue = baseImageIndex * 50;
      return (
        <svg viewBox="0 0 400 500" className="stop-motion-svg">
          <rect width="100%" height="100%" fill="#0a0a0a" />
          
          {/* Heavy metal sheet textures / Grids */}
          <g opacity="0.3" stroke="#ff5500" strokeWidth="1">
            {Array.from({ length: 15 }).map((_, i) => (
              <line 
                key={i} 
                x1="-100" 
                y1={i * 40 - shiftY} 
                x2="500" 
                y2={i * 40 - shiftY + 200} 
              />
            ))}
          </g>

          {/* High-contrast halftone circle */}
          <circle 
            cx={200 - shiftX} 
            cy={230 + shiftY} 
            r={90} 
            fill="none" 
            stroke="#ff5500" 
            strokeWidth={idx % 2 === 0 ? 8 : 4} 
            strokeDasharray="15, 10"
          />

          {/* Strobe Warning Overlay Block */}
          {idx === 2 && (
            <rect x="30" y="30" width="340" height="440" fill="rgba(255, 85, 0, 0.15)" stroke="#fff100" strokeWidth="2" />
          )}

          {/* Industrial Arrow details */}
          <path
            d={`M ${150 + shiftX} ${200 + shiftY} L ${250 + shiftX} ${200 + shiftY} L ${200 + shiftX} ${300 + shiftY} Z`}
            fill={idx % 2 === 0 ? "#ff5500" : "#fff100"}
            opacity="0.75"
          />

          {/* Camera brackets viewport overlay */}
          <g stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.7">
            <path d="M 60 80 L 40 80 L 40 100" />
            <path d="M 340 80 L 360 80 L 360 100" />
            <path d="M 60 420 L 40 420 L 40 400" />
            <path d="M 340 420 L 360 420 L 360 400" />
          </g>

          {/* Hardcore flyer stamps */}
          <rect x="50" y="380" width="100" height="24" fill="#ff5500" />
          <text x="60" y="396" fill="#000000" fontFamily="Share Tech Mono" fontSize="11" fontWeight="bold">
            GARAGE_SALE
          </text>
          
          <text x="50" y="140" fill="#fff100" fontFamily="Share Tech Mono" fontSize="24" fontWeight="900" opacity="0.6">
            138 BPM
          </text>
        </svg>
      );
    }
  };

  return (
    <div 
      className={`motion-card ${theme === 'gruvmind' ? 'card-gruv' : 'card-garage'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="motion-portal">
        {renderFrameSvg(frameIndex)}
        <div className="motion-glitch-overlay" />
      </div>

      <div className="motion-meta">
        <span className="motion-date font-mono">{date}</span>
        <h3 className="motion-title font-heading">{title}</h3>
        <span className="motion-location font-mono">{location}</span>
      </div>

      <style>{`
        .motion-card {
          display: flex;
          flex-direction: column;
          background: transparent;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .motion-card:hover {
          transform: translateY(-8px);
        }

        .motion-portal {
          width: 100%;
          position: relative;
          aspect-ratio: 4/5;
          overflow: hidden;
          background-color: #000;
          border: 1px solid var(--border-color);
          transition: border-color 0.4s ease;
        }

        .stop-motion-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .motion-meta {
          padding: 16px 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: left;
        }

        .motion-date {
          font-size: 0.75rem;
          color: var(--accent);
          font-weight: 700;
        }

        .motion-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .motion-location {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        /* Gruvmind theme specific portal card styles */
        .card-gruv .motion-portal {
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }
        .card-gruv:hover .motion-portal {
          border-color: #39ff14;
          box-shadow: 0 10px 30px rgba(57, 255, 20, 0.15);
        }

        /* Garage sale specific portal card styles */
        .card-garage .motion-portal {
          border-radius: 0px;
          border: 2px solid var(--border-color);
          box-shadow: 6px 6px 0px #000;
        }
        .card-garage:hover .motion-portal {
          border-color: #ff5500;
          box-shadow: 10px 10px 0px #ff5500;
        }
        .card-garage .motion-title {
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
};

export default StopMotionCard;
