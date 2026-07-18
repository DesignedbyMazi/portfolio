/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

interface AntigravityProps {
  count?: number;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  particleSize?: number;
  lerpSpeed?: number;
  color?: string;
  autoAnimate?: boolean;
  particleVariance?: number;
  rotationSpeed?: number;
  depthFactor?: number;
  pulseSpeed?: number;
  particleShape?: 'capsule' | 'sphere' | 'box' | 'tetrahedron';
  fieldStrength?: number;
}

interface Particle {
  t: number; factor: number; speed: number;
  xFactor: number; yFactor: number; zFactor: number;
  mx: number; my: number; mz: number;
  cx: number; cy: number; cz: number;
  vx: number; vy: number; vz: number;
  randomRadiusOffset: number;
}

function AntigravityInner({
  count = 300, magnetRadius = 10, ringRadius = 10,
  waveSpeed = 0.4, waveAmplitude = 1, particleSize = 2,
  lerpSpeed = 0.1, color = '#FF9FFC', autoAnimate = false,
  particleVariance = 1, rotationSpeed = 0, depthFactor = 1,
  pulseSpeed = 3, particleShape = 'capsule', fieldStrength = 10,
}: AntigravityProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const lastMousePos      = useRef({ x: 0, y: 0 });
  const lastMouseMoveTime = useRef(0);
  const virtualMouse      = useRef({ x: 0, y: 0 });

  const particles = useMemo<Particle[]>(() => {
    const temp: Particle[] = [];
    const w = viewport.width  || 100;
    const h = viewport.height || 100;
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * w;
      const y = (Math.random() - 0.5) * h;
      const z = (Math.random() - 0.5) * 20;
      temp.push({
        t: Math.random() * 100,
        factor: 20 + Math.random() * 100,
        speed: 0.01 + Math.random() / 200,
        xFactor: -50 + Math.random() * 100,
        yFactor: -50 + Math.random() * 100,
        zFactor: -50 + Math.random() * 100,
        mx: x, my: y, mz: z, cx: x, cy: y, cz: z,
        vx: 0, vy: 0, vz: 0,
        randomRadiusOffset: (Math.random() - 0.5) * 2,
      });
    }
    return temp;
  }, [count, viewport.width, viewport.height]);

  useFrame(state => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const { viewport: v, pointer: m } = state;

    const mouseDist = Math.hypot(m.x - lastMousePos.current.x, m.y - lastMousePos.current.y);
    if (mouseDist > 0.001) {
      lastMouseMoveTime.current = Date.now();
      lastMousePos.current = { x: m.x, y: m.y };
    }

    let destX = (m.x * v.width)  / 2;
    let destY = (m.y * v.height) / 2;

    if (autoAnimate && Date.now() - lastMouseMoveTime.current > 2000) {
      const t = state.clock.getElapsedTime();
      destX = Math.sin(t * 0.5) * (v.width  / 4);
      destY = Math.cos(t * 1.0) * (v.height / 4);
    }

    virtualMouse.current.x += (destX - virtualMouse.current.x) * 0.05;
    virtualMouse.current.y += (destY - virtualMouse.current.y) * 0.05;

    const tx = virtualMouse.current.x;
    const ty = virtualMouse.current.y;
    const globalRot = state.clock.getElapsedTime() * rotationSpeed;

    particles.forEach((p, i) => {
      p.t += p.speed / 2;

      const pf = 1 - p.cz / 50;
      const ptx = tx * pf;
      const pty = ty * pf;
      const dx = p.mx - ptx;
      const dy = p.my - pty;
      const dist = Math.hypot(dx, dy);

      let tPos = { x: p.mx, y: p.my, z: p.mz * depthFactor };

      if (dist < magnetRadius) {
        const angle = Math.atan2(dy, dx) + globalRot;
        const wave  = Math.sin(p.t * waveSpeed + angle) * 0.5 * waveAmplitude;
        const dev   = p.randomRadiusOffset * (5 / (fieldStrength + 0.1));
        const r     = ringRadius + wave + dev;
        tPos = {
          x: ptx + r * Math.cos(angle),
          y: pty + r * Math.sin(angle),
          z: p.mz * depthFactor + Math.sin(p.t) * waveAmplitude * depthFactor,
        };
      }

      p.cx += (tPos.x - p.cx) * lerpSpeed;
      p.cy += (tPos.y - p.cy) * lerpSpeed;
      p.cz += (tPos.z - p.cz) * lerpSpeed;

      dummy.position.set(p.cx, p.cy, p.cz);
      dummy.lookAt(ptx, pty, p.cz);
      dummy.rotateX(Math.PI / 2);

      const d2ring = Math.abs(Math.hypot(p.cx - ptx, p.cy - pty) - ringRadius);
      const scale = Math.max(0, Math.min(1, 1 - d2ring / 10)) *
                    (0.8 + Math.sin(p.t * pulseSpeed) * 0.2 * particleVariance) * particleSize;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {particleShape === 'capsule'     && <capsuleGeometry args={[0.1, 0.4, 4, 8]} />}
      {particleShape === 'sphere'      && <sphereGeometry args={[0.2, 16, 16]} />}
      {particleShape === 'box'         && <boxGeometry args={[0.3, 0.3, 0.3]} />}
      {particleShape === 'tetrahedron' && <tetrahedronGeometry args={[0.3]} />}
      <meshBasicMaterial color={color} />
    </instancedMesh>
  );
}

export default function Antigravity(props: AntigravityProps) {
  return (
    <Canvas camera={{ position: [0, 0, 50], fov: 35 }}>
      <AntigravityInner {...props} />
    </Canvas>
  );
}
