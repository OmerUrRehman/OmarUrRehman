import { useEffect, useRef } from 'react';

// Configuration
const CONFIG = {
  NODE_COUNT: 85,
  MAX_DISTANCE: 220, // Max distance for lines between nodes
  MOUSE_RADIUS: 220, // Distance mouse influences nodes
  MOUSE_ATTRACT_FORCE: 0.02,
  SIGNAL_CHANCE: 0.05, // Probability per frame of spawning a signal
  SIGNAL_SPEED: 0.015,
  RIPPLE_SPEED: 5,
  RIPPLE_MAX_RADIUS: 120, // Keep the click radius smaller and tighter
  RIPPLE_PUSH_FORCE: 2, // Gentler push
};

class Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  originalVx: number;
  originalVy: number;
  radius: number;

  constructor(width: number, height: number) {
    this.baseX = Math.random() * width;
    this.baseY = Math.random() * height;
    this.x = this.baseX;
    this.y = this.baseY;
    
    // Slow drift velocity
    this.originalVx = (Math.random() - 0.5) * 0.4;
    this.originalVy = (Math.random() - 0.5) * 0.4;
    this.vx = this.originalVx;
    this.vy = this.originalVy;
    this.radius = Math.random() * 1.5 + 0.5;
  }

  update(width: number, height: number, mouse: { x: number; y: number; active: boolean }, mouseRadius: number) {
    // Basic drift
    this.baseX += this.originalVx;
    this.baseY += this.originalVy;

    // Bounce off walls (wrap around or bounce)
    if (this.baseX < 0 || this.baseX > width) this.originalVx *= -1;
    if (this.baseY < 0 || this.baseY > height) this.originalVy *= -1;

    // Mouse Interaction (Attraction)
    let dx = mouse.x - this.baseX;
    let dy = mouse.y - this.baseY;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (mouse.active && distance < mouseRadius) {
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      // Closer it is, stronger the pull, but capped
      let force = (mouseRadius - distance) / mouseRadius;
      
      this.vx = this.originalVx + forceDirectionX * force * CONFIG.MOUSE_ATTRACT_FORCE * 100;
      this.vy = this.originalVy + forceDirectionY * force * CONFIG.MOUSE_ATTRACT_FORCE * 100;
      
      // Move towards mouse
      this.x += (mouse.x - this.x) * 0.05 * force;
      this.y += (mouse.y - this.y) * 0.05 * force;
    } else {
      // Spring back to base position
      this.x += (this.baseX - this.x) * 0.05;
      this.y += (this.baseY - this.y) * 0.05;
      this.vx = this.originalVx;
      this.vy = this.originalVy;
    }
  }

  draw(ctx: CanvasRenderingContext2D, alphaBase: number) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${0.4 * alphaBase})`;
    ctx.fill();
  }
}

class Signal {
  startNode: Node;
  endNode: Node;
  progress: number;
  speed: number;
  active: boolean;

  constructor(start: Node, end: Node) {
    this.startNode = start;
    this.endNode = end;
    this.progress = 0;
    this.speed = CONFIG.SIGNAL_SPEED * (Math.random() * 0.5 + 0.8);
    this.active = true;
  }

  update() {
    this.progress += this.speed;
    if (this.progress >= 1) {
      this.active = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D, alphaBase: number) {
    if (!this.active) return;
    
    // Interpolate position
    let currentX = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
    let currentY = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;

    ctx.beginPath();
    ctx.arc(currentX, currentY, 2, 0, Math.PI * 2);
    // Gold accent color #e5c158
    ctx.fillStyle = `rgba(229, 193, 88, ${0.9 * alphaBase})`; 
    ctx.fill();

    // Glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = `rgba(229, 193, 88, ${1 * alphaBase})`;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

class Ripple {
  x: number;
  y: number;
  radius: number;
  active: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.active = true;
  }

  update(nodes: Node[]) {
    this.radius += CONFIG.RIPPLE_SPEED;
    if (this.radius > CONFIG.RIPPLE_MAX_RADIUS) {
      this.active = false;
    }

    // Push nodes outwards as the wave passes them
    for (let node of nodes) {
      let dx = node.x - this.x;
      let dy = node.y - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      // If node is right on the expanding ring edge
      if (Math.abs(dist - this.radius) < 20) {
        let force = (CONFIG.RIPPLE_MAX_RADIUS - this.radius) / CONFIG.RIPPLE_MAX_RADIUS; // Weakens over time
        node.x += (dx / dist) * force * CONFIG.RIPPLE_PUSH_FORCE;
        node.y += (dy / dist) * force * CONFIG.RIPPLE_PUSH_FORCE;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.active) return;
    let alpha = 1 - (this.radius / CONFIG.RIPPLE_MAX_RADIUS);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // Gold accent color ring
    ctx.strokeStyle = `rgba(229, 193, 88, ${alpha * 0.5})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let nodes: Node[] = [];
    let signals: Signal[] = [];
    let ripples: Ripple[] = [];
    
    let width = window.innerWidth;
    let height = window.innerHeight;

    const mouse = {
      x: width / 2,
      y: height / 2,
      active: false
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      // Reinitialize nodes on wide resize to fill screen
      initNodes();
    };

    const initNodes = () => {
      nodes = [];
      // Adjust count based on screen size (decreased divisor for massively fuller canvas)
      const count = Math.floor((width * height) / 9500); 
      const actualCount = Math.min(Math.max(count, 80), 280); // Higher cap for performance rendering
      for (let i = 0; i < actualCount; i++) {
        nodes.push(new Node(width, height));
      }
    };

    // Events
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
    };

    const onClick = (e: MouseEvent) => {
      ripples.push(new Ripple(e.clientX, e.clientY));
      
      // Force spawn a burst of signals in the local area
      for (let i = 0; i < nodes.length; i++) {
        let dx = nodes[i].x - e.clientX;
        let dy = nodes[i].y - e.clientY;
        if (Math.sqrt(dx * dx + dy * dy) < 120) { // Limit tight burst to exactly where you click
          // Find a connected node to send to
          for (let j = 0; j < nodes.length; j++) {
            if (i !== j) {
              let ddx = nodes[i].x - nodes[j].x;
              let ddy = nodes[i].y - nodes[j].y;
              if (Math.sqrt(ddx * ddx + ddy * ddy) < CONFIG.MAX_DISTANCE) {
                if (Math.random() > 0.75) { // Lower local density so it's not overwhelming
                  signals.push(new Signal(nodes[i], nodes[j]));
                }
              }
            }
          }
        }
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mousedown', onClick);
    
    resize();
    initNodes();

    const drawNetwork = () => {
      ctx.clearRect(0, 0, width, height);

      // Scroll factor: 0 at top, 1 when scrolled 600px down
      let scrollY = window.scrollY || document.documentElement.scrollTop;
      let scrollFactor = Math.min(scrollY / 600, 1);
      
      // Dynamically interpolate settings to reduce mesh quantity and interactions when scrolled
      let dynamicMaxDistance = CONFIG.MAX_DISTANCE - (80 * scrollFactor); // Drops to ~140 distances
      let dynamicMouseRadius = CONFIG.MOUSE_RADIUS - (100 * scrollFactor); // Drops to tight interactions
      let dynamicSignalChance = CONFIG.SIGNAL_CHANCE - (0.035 * scrollFactor); // Very few signals past landing

      // Connection Array to easily spawn signals on valid edges
      let edges: [Node, Node][] = [];

      // Determine active count to limit nodes when scrolled
      let targetActiveRatio = 1 - (0.55 * scrollFactor); // Leaves 45% of nodes
      let activeNodeCount = Math.floor(nodes.length * targetActiveRatio);

      // Update & Draw Lines First
      for (let i = 0; i < nodes.length; i++) {
        // Evaluate node alpha to fade nodes gently out instead of snapping
        let nodeAlpha = 1;
        if (i > nodes.length * 0.45) {
           let fadeStart = activeNodeCount;
           if (i > fadeStart) {
              nodeAlpha = Math.max(0, 1 - (i - fadeStart) / (nodes.length * 0.15));
           }
        }
        
        if (nodeAlpha <= 0) continue; // Skip completely faded nodes

        nodes[i].update(width, height, mouse, dynamicMouseRadius);
        
        for (let j = i + 1; j < nodes.length; j++) {
            let jNodeAlpha = 1;
            if (j > nodes.length * 0.45) {
                let fadeStart = activeNodeCount;
                if (j > fadeStart) jNodeAlpha = Math.max(0, 1 - (j - fadeStart) / (nodes.length * 0.15));
            }
            if (jNodeAlpha <= 0) continue;

            let minAlpha = Math.min(nodeAlpha, jNodeAlpha);

            let dx = nodes[i].x - nodes[j].x;
            let dy = nodes[i].y - nodes[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < dynamicMaxDistance) {
              edges.push([nodes[i], nodes[j]]);
              let baseAlpha = 1 - (distance / dynamicMaxDistance);
              
              // Highlight connections near mouse locally
              let mouseDistA = Math.sqrt(Math.pow(nodes[i].x - mouse.x, 2) + Math.pow(nodes[i].y - mouse.y, 2));
              if (mouse.active && mouseDistA < dynamicMouseRadius) {
                 baseAlpha = Math.min(1, baseAlpha + 0.3); // Brighten
              }
              
              let finalAlpha = baseAlpha * minAlpha;

              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.strokeStyle = `rgba(168, 162, 158, ${finalAlpha * 0.3})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
        }
        
        // Draw Nodes with matched alpha
        nodes[i].draw(ctx, nodeAlpha);
      }

      // Spawn Signals Randomly
      if (edges.length > 0 && Math.random() < dynamicSignalChance) {
        let edge = edges[Math.floor(Math.random() * edges.length)];
        // Random direction
        if (Math.random() > 0.5) {
          signals.push(new Signal(edge[0], edge[1]));
        } else {
          signals.push(new Signal(edge[1], edge[0]));
        }
      }

      // Update & Draw Signals
      signals = signals.filter(s => s.active);
      let signalAlpha = 1 - (0.8 * scrollFactor); // Dim signals as you scroll
      for (let signal of signals) {
        signal.update();
        signal.draw(ctx, signalAlpha);
      }

      // Update & Draw Ripples
      ripples = ripples.filter(r => r.active);
      for (let ripple of ripples) {
        ripple.update(nodes);
        ripple.draw(ctx);
      }

      animationFrameId = requestAnimationFrame(drawNetwork);
    };

    drawNetwork();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mousedown', onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]" // Needs to be underneath text but visible
      style={{ opacity: 0.8 }}
    />
  );
}
