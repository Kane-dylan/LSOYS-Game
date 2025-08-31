// Animation utilities for game effects
export const animations = {
  // Screen shake effect
  screenShake: (duration = 300) => {
    const gameContainer = document.querySelector(".game-container");
    if (!gameContainer) return;

    gameContainer.style.animation = `shake ${duration}ms ease-in-out`;
    setTimeout(() => {
      gameContainer.style.animation = "";
    }, duration);
  },

  // Flash effect for flame power
  flashEffect: (element, duration = 200) => {
    if (!element) return;

    element.style.animation = `flash ${duration}ms ease-in-out`;
    setTimeout(() => {
      element.style.animation = "";
    }, duration);
  },

  // Particles for effects
  createParticle: (x, y, color = "#ff6b35", type = "flame") => {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 6px;
      height: 6px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
      animation: particle-${type} 500ms ease-out forwards;
    `;

    document.body.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 500);
  },

  // Number popup animation for score
  showScorePopup: (x, y, score) => {
    const popup = document.createElement("div");
    popup.className = "score-popup";
    popup.textContent = `+${score}`;
    popup.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      color: #10b981;
      font-weight: bold;
      font-size: 18px;
      pointer-events: none;
      z-index: 1000;
      animation: scorePopup 800ms ease-out forwards;
    `;

    document.body.appendChild(popup);

    setTimeout(() => {
      if (popup.parentNode) {
        popup.parentNode.removeChild(popup);
      }
    }, 800);
  },
};

// Add CSS animations to the page
export const injectAnimationStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-2px); }
      75% { transform: translateX(2px); }
    }

    @keyframes flash {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    @keyframes particle-flame {
      0% { 
        transform: scale(1) translateY(0); 
        opacity: 1; 
      }
      100% { 
        transform: scale(0.2) translateY(-30px); 
        opacity: 0; 
      }
    }

    @keyframes particle-explosion {
      0% { 
        transform: scale(1) translate(0, 0); 
        opacity: 1; 
      }
      100% { 
        transform: scale(0.1) translate(var(--random-x, 20px), var(--random-y, -20px)); 
        opacity: 0; 
      }
    }

    @keyframes scorePopup {
      0% { 
        transform: translateY(0) scale(1); 
        opacity: 1; 
      }
      100% { 
        transform: translateY(-40px) scale(1.2); 
        opacity: 0; 
      }
    }

    @keyframes glow {
      0%, 100% { box-shadow: 0 0 5px currentColor; }
      50% { box-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
    }

    .flame-glow {
      animation: glow 1s ease-in-out infinite;
    }

    .bounce-in {
      animation: bounceIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    @keyframes bounceIn {
      0% { transform: scale(0.8); opacity: 0; }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); opacity: 1; }
    }

    .slide-up {
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      0% { transform: translateY(20px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
  `;

  document.head.appendChild(style);
};
