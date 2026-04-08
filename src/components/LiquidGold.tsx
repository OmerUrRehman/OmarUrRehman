import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export default function LiquidGold() {
  const mountRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    
    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(mountRef.current.clientWidth, mountRef.current.clientHeight) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_hover: { value: 0.0 }
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        uniform float u_hover;
        varying vec2 vUv;

        // Simplex 2D noise
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec2 v){
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                   -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod(i, 289.0);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
          + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
            dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          vec2 st_aspect = st;
          st_aspect.x *= u_resolution.x / u_resolution.y;

          vec2 mouse_aspect = u_mouse;
          mouse_aspect.x *= u_resolution.x / u_resolution.y;

          float dist = distance(st_aspect, mouse_aspect);
          
          float edgeNoise = snoise(st * 8.0 + u_time * 0.5) * 0.15;
          // The hover effect creates a hole
          float hoverEffect = smoothstep(0.35 + edgeNoise, 0.15 + edgeNoise, dist) * u_hover;

          vec2 pos = st_aspect * 2.0;
          float n = snoise(pos + u_time * 0.2);
          float n2 = snoise(pos * 2.0 - u_time * 0.3);
          float n3 = snoise(pos * 4.0 + u_time * 0.1);
          
          float noiseVal = n * 0.5 + n2 * 0.25 + n3 * 0.125;
          
          vec3 color1 = vec3(0.9, 0.76, 0.35); // Gold
          vec3 color2 = vec3(0.4, 0.2, 0.02);  // Dark gold
          vec3 color3 = vec3(1.0, 0.95, 0.7);  // Highlight
          
          vec3 finalColor = mix(color2, color1, smoothstep(-0.5, 0.5, noiseVal));
          finalColor = mix(finalColor, color3, smoothstep(0.3, 0.7, noiseVal));
          
          finalColor += vec3(0.3, 0.15, 0.0) * (sin(u_time * 2.0 + noiseVal * 10.0) * 0.5 + 0.5);

          // Alpha determines the hole
          float alpha = 1.0 - hoverEffect;
          alpha = clamp(alpha, 0.0, 1.0);
          
          // Glowing rim around the hole
          float rim = smoothstep(0.0, 0.2, alpha) * smoothstep(1.0, 0.8, alpha);
          finalColor += color3 * rim * 2.0;

          // Overall opacity of the gold layer
          gl_FragColor = vec4(finalColor, alpha * 0.85);
        }
      `,
      transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      uniforms.u_time.value = clock.getElapsedTime();
      
      const targetHover = isHovered ? 1.0 : 0.0;
      uniforms.u_hover.value += (targetHover - uniforms.u_hover.value) * 0.08;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      uniforms.u_resolution.value.set(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      uniforms.u_mouse.value.set(x, y);
    };

    const section = mountRef.current.parentElement;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      section.addEventListener('mouseenter', () => setIsHovered(true));
      section.addEventListener('mouseleave', () => setIsHovered(false));
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (section) {
        section.removeEventListener('mousemove', handleMouseMove);
        section.removeEventListener('mouseenter', () => setIsHovered(true));
        section.removeEventListener('mouseleave', () => setIsHovered(false));
      }
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}
