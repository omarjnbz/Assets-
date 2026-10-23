import React from 'react';

const ThemeHud = ({ theme, setTheme }) => {
  // Mechanical synthesizer click sound effect using Web Audio API
  const playClickSound = (targetTheme) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      if (targetTheme === 'garagesale') {
        // Raw Industrial mechanical double-click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
        
        // Second mechanical relay tick
        setTimeout(() => {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(110, ctx.currentTime);
          osc2.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.08);
          gain2.gain.setValueAtTime(0.2, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start();
          osc2.stop(ctx.currentTime + 0.09);
        }, 50);
      } else {
        // Deep tech sub-frequency organic thud + cyber beep
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();
        
        // Organic sub thud
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(80, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.2);
        gain1.gain.setValueAtTime(0.4, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.21);

        // Cyber chime
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1200, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
        gain2.gain.setValueAtTime(0.05, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.16);
      }
    } catch (e) {
      console.warn("Audio Context blocked or unsupported:", e);
    }
  };

  const handleToggle = (targetTheme) => {
    if (theme === targetTheme) return;
    playClickSound(targetTheme);
    setTheme(targetTheme);

    // Apply flash effect to document body for high-impact transition
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100vw';
    flash.style.height = '100vh';
    flash.style.zIndex = '99999';
    flash.style.pointerEvents = 'none';
    flash.style.transition = 'opacity 0.3s ease';
    
    if (targetTheme === 'garagesale') {
      flash.style.backgroundColor = '#ff5500';
    } else {
      flash.style.backgroundColor = '#a78bfa';
    }
    
    document.body.appendChild(flash);
    
    // Quick frame flash
    requestAnimationFrame(() => {
      flash.style.opacity = '0';
      setTimeout(() => {
        flash.remove();
      }, 300);
    });
  };

  return (
    <div className="theme-hud">
      <button
        onClick={() => handleToggle('garagesale')}
        className={`theme-hud-btn ${theme === 'garagesale' ? 'active' : ''}`}
      >
        ▲ KAS5H
      </button>
      <button
        onClick={() => handleToggle('gruvmind')}
        className={`theme-hud-btn ${theme === 'gruvmind' ? 'active' : ''}`}
      >
        ● ARTIST 02
      </button>
    </div>
  );
};

export default ThemeHud;
