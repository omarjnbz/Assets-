import React, { useEffect, useRef } from 'react';

const BackgroundCanvas = ({ theme, isPlaying }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Initialize mouse in center
    mouseRef.current.x = width / 2;
    mouseRef.current.y = height / 2;
    mouseRef.current.targetX = width / 2;
    mouseRef.current.targetY = height / 2;

    // Animation Variables
    let time = 0;
    let glitchTimer = 0;
    let glitches = [];

    const drawGruvmind = (t) => {
      // Deep tech background
      ctx.fillStyle = '#080312';
      ctx.fillRect(0, 0, width, height);

      // Radial neon gradient behind mouse
      const mouseGrad = ctx.createRadialGradient(
        mouseRef.current.x,
        mouseRef.current.y,
        0,
        mouseRef.current.x,
        mouseRef.current.y,
        width * 0.4
      );
      mouseGrad.addColorStop(0, 'rgba(57, 255, 20, 0.08)'); // Green neon
      mouseGrad.addColorStop(0.5, 'rgba(167, 139, 250, 0.04)'); // Purple neon
      mouseGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = mouseGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw fluid liquid wave patterns (Bezier waves)
      const waveCount = 5;
      const points = 12;
      const speedMultiplier = isPlaying ? 2.5 : 1.0;

      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const offset = w * (height / waveCount);
        const amplitude = 30 + w * 15 + (isPlaying ? 20 : 0);
        const waveSpeed = 0.002 * (w + 1) * speedMultiplier;
        
        ctx.moveTo(0, offset);

        for (let i = 0; i <= points; i++) {
          const x = (width / points) * i;
          
          // Calculate wave height with multiple sine waves and mouse interaction
          const mouseDist = Math.abs(x - mouseRef.current.x);
          const mouseInfluence = mouseDist < 300 ? (1 - mouseDist / 300) * 80 : 0;
          
          const y = offset + 
            Math.sin(i * 0.5 + t * waveSpeed + w) * amplitude + 
            Math.cos(i * 0.3 - t * waveSpeed * 1.5) * (amplitude / 2) +
            (mouseRef.current.y - height / 2) * 0.1 * (1 - mouseDist / width) +
            (Math.sin(t * 0.01) * mouseInfluence * (mouseRef.current.y > offset ? 1 : -1));

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            const prevX = (width / points) * (i - 1);
            const prevY = offset + 
              Math.sin((i - 1) * 0.5 + t * waveSpeed + w) * amplitude + 
              Math.cos((i - 1) * 0.3 - t * waveSpeed * 1.5) * (amplitude / 2) +
              (mouseRef.current.y - height / 2) * 0.1 * (1 - Math.abs(prevX - mouseRef.current.x) / width);

            // Control points for smooth Bezier curve
            const cpX = (prevX + x) / 2;
            ctx.quadraticCurveTo(prevX, prevY, cpX, (prevY + y) / 2);
          }
        }

        ctx.strokeStyle = w % 2 === 0 ? 'rgba(57, 255, 20, 0.12)' : 'rgba(167, 139, 250, 0.15)';
        ctx.lineWidth = w === waveCount - 1 ? 2.5 : 1.2;
        
        // Glow effect for the thickest line
        if (w === waveCount - 1) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#39ff14';
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    };

    const drawGarageSale = (t) => {
      // Industrial rave background
      ctx.fillStyle = '#0f0f0f';
      ctx.fillRect(0, 0, width, height);

      const speedMultiplier = isPlaying ? 2.0 : 1.0;

      // Draw mechanical Grid
      ctx.strokeStyle = 'rgba(255, 85, 0, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      
      // Horizontal grid lines
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      // Vertical grid lines
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Parallax center crosshair details (mechanical feel)
      const centerX = width / 2;
      const centerY = height / 2;
      const mxOffsetX = (mouseRef.current.x - centerX) * 0.03;
      const myOffsetY = (mouseRef.current.y - centerY) * 0.03;

      ctx.strokeStyle = 'rgba(255, 85, 0, 0.2)';
      ctx.beginPath();
      // Center ticks
      ctx.moveTo(centerX + mxOffsetX - 20, centerY + myOffsetY);
      ctx.lineTo(centerX + mxOffsetX + 20, centerY + myOffsetY);
      ctx.moveTo(centerX + mxOffsetX, centerY + myOffsetY - 20);
      ctx.lineTo(centerX + mxOffsetX, centerY + myOffsetY + 20);
      ctx.stroke();

      // Draw camera viewport boundaries in corners
      const pad = 40;
      const size = 30;
      ctx.strokeStyle = 'rgba(255, 85, 0, 0.25)';
      ctx.lineWidth = 2;

      // Top Left
      ctx.beginPath();
      ctx.moveTo(pad + size, pad); ctx.lineTo(pad, pad); ctx.lineTo(pad, pad + size);
      ctx.stroke();
      // Top Right
      ctx.beginPath();
      ctx.moveTo(width - pad - size, pad); ctx.lineTo(width - pad, pad); ctx.lineTo(width - pad, pad + size);
      ctx.stroke();
      // Bottom Left
      ctx.beginPath();
      ctx.moveTo(pad + size, height - pad); ctx.lineTo(pad, height - pad); ctx.lineTo(pad, height - pad + size);
      ctx.stroke();
      // Bottom Right
      ctx.beginPath();
      ctx.moveTo(width - pad - size, height - pad); ctx.lineTo(width - pad, height - pad); ctx.lineTo(width - pad, height - pad + size);
      ctx.stroke();

      // Coordinates text
      ctx.fillStyle = 'rgba(255, 85, 0, 0.3)';
      ctx.font = '10px "Share Tech Mono", monospace';
      ctx.fillText(`REC [●] ${isPlaying ? 'LIVE' : 'STBY'}`, pad + 10, pad + 50);
      ctx.fillText(`LOC: DELHI NCR / 28.6139 N 77.2090 E`, pad + 10, pad + 70);
      ctx.fillText(`SYS: UKG_RAVE_ENGINE_V1.9`, width - pad - 180, pad + 50);
      ctx.fillText(`BPM_SYNC: ${isPlaying ? '138.4' : '000.0'}`, width - pad - 180, pad + 70);

      // Strobe glitches (random orange/black horizontal bars)
      glitchTimer += speedMultiplier;
      if (glitchTimer > 60) {
        glitchTimer = 0;
        if (Math.random() < 0.4) {
          glitches = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
            y: Math.random() * height,
            h: Math.random() * 80 + 10,
            opacity: Math.random() * 0.15,
            xOffset: (Math.random() - 0.5) * 40
          }));
        } else {
          glitches = [];
        }
      }

      glitches.forEach((glitch) => {
        ctx.fillStyle = `rgba(255, 85, 0, ${glitch.opacity})`;
        ctx.fillRect(0, glitch.y, width, glitch.h);
        
        ctx.strokeStyle = `rgba(255, 241, 0, ${glitch.opacity * 2})`;
        ctx.beginPath();
        ctx.moveTo(0, glitch.y);
        ctx.lineTo(width, glitch.y);
        ctx.stroke();
      });

      // Digital scanning line
      const scanY = (t * 0.15 * speedMultiplier) % height;
      ctx.strokeStyle = 'rgba(255, 85, 0, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();
    };

    const loop = () => {
      time++;
      
      // Lerp mouse coordinates smoothly
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      if (theme === 'gruvmind') {
        drawGruvmind(time);
      } else {
        drawGarageSale(time);
      }

      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [theme, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default BackgroundCanvas;
