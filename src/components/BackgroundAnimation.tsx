import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function BackgroundAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Setup Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Setup Scene & Camera (Orthographic for 2D shader)
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Full screen plane
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Custom Shader Material matching the Unicorn Studio effect
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uResolution;

        varying vec2 vUv;

        // Pseudo-random function
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        // Base wave function
        float getWave(vec2 p, vec2 mouse) {
            float y = 0.0;
            
            // Multiple sine waves for organic movement
            y += sin(p.x * 2.5 + uTime * 1.0) * 0.15;
            y += sin(p.x * 1.5 - uTime * 0.5) * 0.1;
            y += sin(p.x * 4.0 + uTime * 1.5) * 0.05;
            
            // Interactive mouse pull
            float distToMouse = abs(p.x - mouse.x);
            float pull = smoothstep(0.6, 0.0, distToMouse);
            y = mix(y, mouse.y, pull * 0.8);
            
            return y;
        }

        // Layered ribbon effect
        float getRibbon(vec2 p, vec2 mouse) {
            float total = 0.0;
            // Sample the wave multiple times to create a thick, folded ribbon look
            for(float i = 0.0; i < 4.0; i++) {
                float offset = (i - 1.5) * 0.04;
                float y = getWave(p + vec2(offset, 0.0), mouse);
                float dist = abs(p.y - y + offset * 0.5);
                
                float core = 0.0015 / (dist + 0.001);
                float glow = exp(-dist * 12.0) * 0.3;
                
                total += (core + glow) * (1.0 - abs(i - 1.5) * 0.2);
            }
            return total;
        }

        void main() {
            // Normalize coordinates and fix aspect ratio
            vec2 p = vUv * 2.0 - 1.0;
            p.x *= uResolution.x / uResolution.y;
            
            // Shift the entire coordinate system down to move the visual wave UP
            p.y -= 0.25;
            
            vec2 mouse = uMouse * 2.0 - 1.0;
            mouse.x *= uResolution.x / uResolution.y;
            mouse.y -= 0.25;

            // Grid setup for the glass blocks
            float gridScale = 12.0;
            vec2 gridUv = p * gridScale;
            vec2 gridId = floor(gridUv);
            vec2 gridFract = fract(gridUv);
            vec2 cellCenter = (gridId + 0.5) / gridScale;

            // Determine if current cell should be a glass block
            float cellY = getWave(cellCenter, mouse);
            float distToWave = abs(cellCenter.y - cellY);
            
            // Randomly activate blocks near the wave
            float blockNoise = random(gridId + floor(uTime * 2.0));
            bool isBlock = distToWave < 0.35 && blockNoise > 0.4;

            vec2 sampleP = p;
            float border = 0.0;
            float blockFill = 0.0;

            if (isBlock) {
                // Refraction: scale UVs towards the center of the block (magnification)
                sampleP = cellCenter + (p - cellCenter) * 0.8;
                
                // Add a slight random vertical shift
                sampleP.y += (random(gridId) - 0.5) * 0.05;

                // Draw thin borders around the block
                float b = 0.03;
                if (gridFract.x < b || gridFract.x > 1.0 - b || gridFract.y < b || gridFract.y > 1.0 - b) {
                    border = 0.3;
                }
                
                // Slight background fill for the glass
                blockFill = 0.05;
            }

            // Calculate final ribbon intensity
            float intensity = getRibbon(sampleP, mouse);
            float finalIntensity = intensity + border + blockFill;

            // Theme colors matching the website's accent (Gold)
            vec3 color = vec3(0.898, 0.757, 0.345); // #e5c158
            
            // Add a bit of brightness variation based on intensity
            color = mix(color, vec3(1.0, 0.95, 0.8), intensity * 0.4);

            float alpha = finalIntensity;
            
            gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse Interaction
    let targetMouse = new THREE.Vector2(0.5, 0.5);
    let currentMouse = new THREE.Vector2(0.5, 0.5);

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX / window.innerWidth;
      targetMouse.y = 1.0 - (e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Handle Resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      material.uniforms.uResolution.value.set(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      const elapsed = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsed;

      // Smooth mouse follow (damping)
      currentMouse.lerp(targetMouse, 0.05);
      material.uniforms.uMouse.value.copy(currentMouse);

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto z-0">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      <div 
        className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none"
        style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
        }}
      />
    </div>
  );
}
