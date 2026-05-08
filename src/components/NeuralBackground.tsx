import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, Cpu, Database, Binary, Component, GitBranch, Code2, Globe2, Layers, Cpu as Microchip } from 'lucide-react';

const CS_CONCEPTS = [
  { title: "Big O Notation", desc: "Measures computational efficiency formulas.", icon: <Binary className="w-4 h-4"/> },
  { title: "Recursion", desc: "A method where the solution depends on smaller instances of the same problem.", icon: <GitBranch className="w-4 h-4"/> },
  { title: "Hash Table", desc: "Data structure for fast key-value lookups.", icon: <Database className="w-4 h-4"/> },
  { title: "Polymorphism", desc: "Single interface representing varying underlying data types.", icon: <Layers className="w-4 h-4"/> },
  { title: "Concurrency", desc: "Simultaneous processing of multiple execution threads.", icon: <Cpu className="w-4 h-4"/> },
  { title: "Neural Graph", desc: "Interconnected nodes passing weighted signals.", icon: <Network className="w-4 h-4"/> },
  { title: "Binary Trees", desc: "Hierarchical data bounded by two children per node.", icon: <GitBranch className="w-4 h-4"/> },
  { title: "REST API", desc: "Stateless architecture mapping endpoints to resources.", icon: <Globe2 className="w-4 h-4"/> },
  { title: "Garbage Collection", desc: "Automated engine for dynamic memory release.", icon: <Microchip className="w-4 h-4"/> },
  { title: "Encapsulation", desc: "Bundling data and methods into isolated objects.", icon: <Component className="w-4 h-4"/> }
];

const CONFIG = {
  NODE_COUNT: 45,
  MAX_DISTANCE: 250,
  MOUSE_RADIUS: 150,
};

class Node {
  id: number;
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  radius: number;
  timeOffset: number;
  hovered: boolean;
  concept: typeof CS_CONCEPTS[0];

  constructor(id: number, bx: number, by: number) {
    this.id = id;
    this.baseX = bx;
    this.baseY = by;
    this.x = bx;
    this.y = by;
    this.radius = Math.random() * 1.5 + 1.5;
    this.timeOffset = Math.random() * Math.PI * 2;
    this.hovered = false;
    this.concept = CS_CONCEPTS[Math.floor(Math.random() * CS_CONCEPTS.length)];
  }

  update(time: number, mouse: { x: number; y: number; active: boolean }) {
    // Gentle orbit around its own place
    this.x = this.baseX + Math.sin(time * 0.0005 + this.timeOffset) * 15;
    this.y = this.baseY + Math.cos(time * 0.0007 + this.timeOffset) * 15;

    // Hover detection
    this.hovered = false;
    if (mouse.active) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      if (Math.sqrt(dx * dx + dy * dy) < 40) {
        this.hovered = true;
        // Minor pull
        this.x += dx * 0.1;
        this.y += dy * 0.1;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.hovered ? this.radius * 2 : this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.hovered ? 'rgba(229, 193, 88, 1)' : 'rgba(255, 255, 255, 0.5)';
    ctx.fill();
    
    if (this.hovered) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(229, 193, 88, 0.8)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
}

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeBox, setActiveBox] = useState<{ id: number; x: number; y: number; concept: typeof CS_CONCEPTS[0] } | null>(null);
  const nodesRef = useRef<Node[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const mouse = {
      x: width / 2,
      y: height / 2,
      active: false
    };

    const initNodes = () => {
      nodesRef.current = [];
      const cols = Math.ceil(width / 110); // Decreased grid size to increase density
      const rows = Math.ceil(height / 110);
      const cellW = width / cols;
      const cellH = height / rows;

      let idCounter = 0;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (Math.random() > 0.4) { // 60% chance to place a node in the cell
            let bx = i * cellW + Math.random() * cellW;
            let by = j * cellH + Math.random() * cellH;
            nodesRef.current.push(new Node(idCounter++, bx, by));
          }
        }
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initNodes();
      setActiveBox(null);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
    };

    const onClick = (e: MouseEvent) => {
      // Do not show node popups if the user has scrolled past the landing page
      if (window.scrollY > window.innerHeight * 0.3) {
        setActiveBox(null);
        return;
      }

      let clickedNode: Node | null = null;
      let minDistance = 40; // Click hit radius

      for (let node of nodesRef.current) {
        let dx = e.clientX - node.x;
        let dy = e.clientY - node.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDistance) {
          minDistance = dist;
          clickedNode = node;
        }
      }

      if (clickedNode) {
        setActiveBox({
          id: clickedNode.id,
          x: clickedNode.x,
          y: clickedNode.y,
          concept: clickedNode.concept
        });
      } else {
        setActiveBox(null);
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mousedown', onClick);
    
    resize();

    const drawNetwork = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      let nodes = nodesRef.current;

      // Update nodes
      for (let node of nodes) {
        node.update(time, mouse);
      }

      // Draw Lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          let dx = nodes[i].x - nodes[j].x;
          let dy = nodes[i].y - nodes[j].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONFIG.MAX_DISTANCE) {
            let baseAlpha = 1 - (distance / CONFIG.MAX_DISTANCE);
            let finalAlpha = baseAlpha * 0.4;

            // Brighten if near mouse
            if (mouse.active) {
               let midX = (nodes[i].x + nodes[j].x) / 2;
               let midY = (nodes[i].y + nodes[j].y) / 2;
               let mouseDist = Math.sqrt(Math.pow(midX - mouse.x, 2) + Math.pow(midY - mouse.y, 2));
               if (mouseDist < CONFIG.MOUSE_RADIUS) {
                 finalAlpha = Math.min(1, finalAlpha + 0.3);
               }
            }

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(168, 162, 158, ${finalAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw Nodes
      for (let node of nodes) {
        node.draw(ctx);
      }

      animationFrameId = requestAnimationFrame(drawNetwork);
    };

    animationFrameId = requestAnimationFrame(drawNetwork);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mousedown', onClick);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-[1]"
        style={{ opacity: 0.8 }}
      />
      <AnimatePresence>
        {activeBox && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed z-[100] bg-surface/90 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-xl pointer-events-auto"
            style={{ 
              left: activeBox.x + 20, 
              top: activeBox.y - 20,
              maxWidth: '220px'
            }}
          >
            <div className="flex justify-between items-start mb-2 gap-4">
              <div className="flex items-center gap-2 text-accent pb-1">
                <div className="flex-shrink-0">{activeBox.concept.icon}</div>
                <h4 className="text-[0.65rem] font-semibold tracking-widest uppercase">{activeBox.concept.title}</h4>
              </div>
              <button 
                onClick={() => setActiveBox(null)}
                className="text-secondary hover:text-white transition-colors pl-2 -mt-1 -mr-2"
              >
                ×
              </button>
            </div>
            <p className="text-[0.7rem] leading-relaxed text-secondary border-t border-white/5 pt-2">
              {activeBox.concept.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
