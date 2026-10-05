// UI Interactions, Motion Design, Magnetic Buttons, Subject Orbit & Canvas Effects

export class UIEngine {
  constructor() {
    this.initCursor();
    this.initMagneticButtons();
    this.initHeroCanvas();
  }

  // Custom Subtle Cursor (Desktop only, fine pointer)
  initCursor() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.body.classList.add("has-custom-cursor");
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    const ring = document.createElement("div");
    ring.className = "cursor-ring";

    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }, { passive: true });

    // Smooth ring interpolation loop
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(animateRing);
    };
    animateRing();

    window.addEventListener("mousedown", () => ring.classList.add("cursor-click"));
    window.addEventListener("mouseup", () => ring.classList.remove("cursor-click"));

    // Delegation for interactive element hover states
    document.addEventListener("mouseover", (e) => {
      const target = e.target.closest("button, a, .orbit-node, .mcq-option-item, .specimen-card, .chem-compound-card, select, input");
      if (target) {
        ring.classList.add("hover-active");
      }
    });

    document.addEventListener("mouseout", (e) => {
      const target = e.target.closest("button, a, .orbit-node, .mcq-option-item, .specimen-card, .chem-compound-card, select, input");
      if (target) {
        ring.classList.remove("hover-active");
      }
    });
  }

  // Magnetic Button Effect
  initMagneticButtons() {
    document.addEventListener("mousemove", (e) => {
      const magneticBtn = e.target.closest(".btn-magnetic");
      if (!magneticBtn) return;

      const rect = magneticBtn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * 0.28;
      const deltaY = (e.clientY - centerY) * 0.28;

      magneticBtn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }, { passive: true });

    document.addEventListener("mouseleave", (e) => {
      const magneticBtn = e.target.closest(".btn-magnetic");
      if (magneticBtn) {
        magneticBtn.style.transform = "translate(0px, 0px)";
      }
    }, true);
  }

  // Floating Laboratory Particles in Hero Scene
  initHeroCanvas() {
    const canvas = document.getElementById("hero-lab-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth || 400;
      canvas.height = canvas.parentElement.offsetHeight || 400;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 32 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw faint interconnecting molecular bonds
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 85) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 * (1 - dist / 85)})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw molecular nodes
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
  }

  // Toast Notification System
  showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.style.cssText = "position: fixed; bottom: 80px; right: 24px; z-index: 10000; display: flex; flex-direction: column; gap: 10px; pointer-events: none;";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast-pill toast-${type}`;
    toast.style.cssText = `
      background: rgba(18, 22, 32, 0.95);
      border: 1px solid var(--border-medium);
      border-left: 3px solid ${type === "success" ? "var(--state-success)" : "var(--accent-cyan)"};
      padding: 12px 20px;
      border-radius: var(--radius-md);
      font-size: 0.88rem;
      font-weight: 500;
      color: var(--text-primary);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(12px);
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = "translateY(0)";
      toast.style.opacity = "1";
    });

    setTimeout(() => {
      toast.style.transform = "translateY(-10px)";
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

export const ui = new UIEngine();
