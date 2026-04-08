import { useEffect, useState } from 'react';

export default function Cursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    let animationFrame: number;
    const updateRing = () => {
      setRingPos(prev => ({
        x: prev.x + (pos.x - prev.x) * 0.12,
        y: prev.y + (pos.y - prev.y) * 0.12
      }));
      animationFrame = requestAnimationFrame(updateRing);
    };
    animationFrame = requestAnimationFrame(updateRing);
    return () => cancelAnimationFrame(animationFrame);
  }, [pos]);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button') || target.closest('.hover-target')) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };
    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, []);

  return (
    <div className="hidden md:block">
      <div 
        className="cursor-dot"
        style={{ left: pos.x - 4, top: pos.y - 4 }}
      />
      <div 
        className={`cursor-ring ${hovering ? 'hovering' : ''}`}
        style={{ left: ringPos.x - 20, top: ringPos.y - 20 }}
      />
    </div>
  );
}
