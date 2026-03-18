import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

export default function WavyBackgroundBox({ children, sx = {} }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    const vert = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;

    const frag = `
      precision highp float;
      uniform vec2 u_res;
      uniform float u_time;

      vec3 palette(float t) {
        vec3 a = vec3(0.05, 0.10, 0.22);
        vec3 b = vec3(0.06, 0.10, 0.18);
        vec3 c = vec3(1.0,  1.0,  1.0);
        vec3 d = vec3(0.00, 0.05, 0.20);
        return a + b * cos(6.28318 * (c * t + d));
      }

      vec2 warp(vec2 uv, float t) {
        float freq = 0.6;
        float amp  = 0.7;
        for (int i = 0; i < 4; i++) {
          uv += amp * vec2(
            sin(freq * uv.y + t * 0.18 + float(i) * 1.1),
            cos(freq * uv.x + t * 0.14 + float(i) * 0.8)
          );
          freq *= 1.5;
          amp  *= 0.45;
        }
        return uv;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
        uv *= 1.8;
        vec2 warped  = warp(uv, u_time * 0.22);
        vec2 warped2 = warp(warped * 0.9, u_time * 0.16 + 2.1);
        float t = length(warped2) * 0.28 + u_time * 0.025;
        vec3 col = palette(t);
        float gloss = pow(max(0.0, sin(warped2.x * 1.2 + u_time * 0.1)), 6.0) * 0.12;
        col += vec3(gloss * 0.6, gloss * 0.8, gloss);
        float vign = 1.0 - smoothstep(0.3, 1.4, length(uv * 0.65));
        col *= vign * 1.15;
        float ripple = 1.0 + 0.012 * sin(uv.y * 8.0 + u_time * 0.3);
        col *= ripple;
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');

    let animId;
    const start = performance.now();

    function resize() {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    function frame(now) {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(frame);
    }
    animId = requestAnimationFrame(frame);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex' }}>
        {children}
      </Box>
    </Box>
  );
}