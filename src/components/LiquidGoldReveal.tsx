import { useEffect, useRef } from 'react';

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_trail[10];
  uniform float u_hover;

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

  float fbm(vec2 st) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 5; i++) {
          value += amplitude * snoise(st);
          st *= 2.0;
          amplitude *= 0.5;
      }
      return value;
  }

  float sdLine( in vec2 p, in vec2 a, in vec2 b ) {
      vec2 pa = p-a, ba = b-a;
      float h = clamp( dot(pa,ba)/(dot(ba,ba)+0.0001), 0.0, 1.0 );
      return length( pa - ba*h );
  }

  void main() {
      vec2 st = gl_FragCoord.xy / u_resolution.xy;
      float aspect = u_resolution.x / u_resolution.y;
      st.x *= aspect;
      
      // Liquid gold plasma generation
      vec2 q = vec2(0.);
      q.x = fbm( st + 0.02 * u_time);
      q.y = fbm( st + vec2(1.0));

      vec2 r = vec2(0.);
      r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*u_time );
      r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time);

      float f = fbm(st+r);
      
      // High quality gold color palette
      vec3 color = mix(vec3(0.3, 0.15, 0.0),
                       vec3(0.9, 0.6, 0.15),
                       clamp((f*f)*4.0,0.0,1.0));
                       
      color = mix(color,
                  vec3(1.0, 0.85, 0.4),
                  clamp(length(q),0.0,1.0));
                  
      color = mix(color,
                  vec3(1.0, 0.95, 0.6),
                  clamp(length(r.x),0.0,1.0));
                  
      // Add some sparkle
      color += vec3(1.0, 0.9, 0.7) * pow(max(0.0, fbm(st * 15.0 + u_time * 1.5)), 5.0) * 0.8;

      // Calculate distance to the trail
      float dist = 100.0;
      for(int i=0; i<9; i++) {
          vec2 p1 = u_trail[i] / u_resolution.xy;
          p1.x *= aspect;
          p1.y = 1.0 - (u_trail[i].y / u_resolution.y);
          
          vec2 p2 = u_trail[i+1] / u_resolution.xy;
          p2.x *= aspect;
          p2.y = 1.0 - (u_trail[i+1].y / u_resolution.y);
          
          // Make the trail taper off at the end
          float thickness = mix(1.0, 0.1, float(i)/9.0);
          float d = sdLine(st, p1, p2) / thickness;
          dist = min(dist, d);
      }
      
      // Distort the distance field with noise for a liquid edge
      float noiseEdge = snoise(st * 8.0 - u_time * 1.2) * 0.15;
      
      // The radius of the plasma spotlight
      float revealRadius = 0.25 * u_hover;
      
      // alpha is 1.0 near the mouse (showing plasma), and 0.0 far away (hiding plasma)
      float alpha = 1.0 - smoothstep(revealRadius - 0.15, revealRadius + 0.1, dist + noiseEdge);
      
      // Ensure it completely fades out when not hovering
      alpha *= u_hover;
      
      // Max opacity of the gold plasma
      float maxAlpha = 0.95;
      alpha *= maxAlpha;
      
      gl_FragColor = vec4(color * alpha, alpha);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function LiquidGoldReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef(Array.from({ length: 10 }, () => ({ x: -1000, y: -1000 })));
  const targetMouseRef = useRef({ x: -1000, y: -1000 });
  const hoverRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true });
    if (!gl) return;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const trailLocation = gl.getUniformLocation(program, 'u_trail');
    const hoverLocation = gl.getUniformLocation(program, 'u_hover');

    let animationFrameId: number;
    const startTime = Date.now();

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // Render at higher resolution for better quality
        const pixelRatio = Math.min(window.devicePixelRatio, 2); 
        canvas.width = parent.clientWidth * pixelRatio;
        canvas.height = parent.clientHeight * pixelRatio;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };
    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      // Only render if hover is greater than 0 to save GPU cycles
      if (hoverRef.current > 0.001) {
        const currentTime = (Date.now() - startTime) * 0.001;
        
        // Update trail physics
        const trail = trailRef.current;
        const target = targetMouseRef.current;
        
        trail[0] = { x: target.x, y: target.y };
        for (let i = 1; i < 10; i++) {
            trail[i] = {
                x: trail[i].x + (trail[i-1].x - trail[i].x) * 0.45,
                y: trail[i].y + (trail[i-1].y - trail[i].y) * 0.45
            };
        }

        const trailData = new Float32Array(20);
        for (let i = 0; i < 10; i++) {
            trailData[i*2] = trail[i].x;
            trailData[i*2+1] = trail[i].y;
        }

        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform1f(timeLocation, currentTime);
        gl.uniform2fv(trailLocation, trailData);
        gl.uniform1f(hoverLocation, hoverRef.current);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } else {
        // Clear canvas when not hovering to ensure it's fully transparent
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio, 2);
      
      targetMouseRef.current = {
          x: (e.clientX - rect.left) * pixelRatio,
          y: (e.clientY - rect.top) * pixelRatio
      };

      // If hover is 0, instantly snap the trail to the mouse to prevent it flying in from off-screen
      if (hoverRef.current === 0) {
          trailRef.current = Array.from({ length: 10 }, () => ({ ...targetMouseRef.current }));
      }
    };

    const handleMouseEnter = () => {
      // Smoothly transition hover state
      let start = hoverRef.current;
      const animateHover = () => {
        start += (1.0 - start) * 0.1;
        hoverRef.current = start;
        if (Math.abs(1.0 - start) > 0.01) {
          requestAnimationFrame(animateHover);
        } else {
          hoverRef.current = 1.0;
        }
      };
      animateHover();
    };

    const handleMouseLeave = () => {
      let start = hoverRef.current;
      const animateHover = () => {
        start += (0.0 - start) * 0.1;
        hoverRef.current = start;
        if (Math.abs(0.0 - start) > 0.01) {
          requestAnimationFrame(animateHover);
        } else {
          hoverRef.current = 0.0;
        }
      };
      animateHover();
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseenter', handleMouseEnter);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseenter', handleMouseEnter);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: 'normal' }}
    />
  );
}
