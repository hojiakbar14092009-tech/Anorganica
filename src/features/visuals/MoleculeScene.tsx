// Lazy chunk: Three.js + R3F are only downloaded when a student opens a 3D model.
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';
import { Quaternion, Vector3 } from 'three';
import { COVALENT_RADIUS, ELEMENT_COLOR, type Bond, type Molecule } from './molecules';

const UP = new Vector3(0, 1, 0);

function Stick({ from, to, r, color }: { from: Vector3; to: Vector3; r: number; color: string }) {
  const { mid, quat, len } = useMemo(() => {
    const dir = to.clone().sub(from);
    return { mid: from.clone().add(to).multiplyScalar(0.5), quat: new Quaternion().setFromUnitVectors(UP, dir.clone().normalize()), len: dir.length() };
  }, [from, to]);
  return (
    <mesh position={mid} quaternion={quat}>
      <cylinderGeometry args={[r, r, len, 12]} />
      <meshStandardMaterial color={color} roughness={0.55} />
    </mesh>
  );
}

/** Multiple bonds are drawn as parallel sticks; order 1.5 (delocalised) as one full + one thin stick. */
function BondSticks({ m, b }: { m: Molecule; b: Bond }) {
  const p = new Vector3(...m.atoms[b.a]!.p), q = new Vector3(...m.atoms[b.b]!.p);
  const dir = q.clone().sub(p).normalize();
  const side = new Vector3().crossVectors(dir, Math.abs(dir.y) > 0.9 ? new Vector3(1, 0, 0) : UP).normalize().multiplyScalar(0.11);
  const n = Math.ceil(b.order);
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const off = side.clone().multiplyScalar(i - (n - 1) / 2);
        const thin = b.order === 1.5 && i === 1;
        return <Stick key={i} from={p.clone().add(off)} to={q.clone().add(off)} r={thin ? 0.035 : n > 1 ? 0.06 : 0.09} color={thin ? '#9aa4ad' : '#b8c0c8'} />;
      })}
    </>
  );
}

export default function MoleculeScene({ m, interactive }: { m: Molecule; interactive: boolean }) {
  const radius = Math.max(...m.atoms.map((a) => Math.hypot(...a.p))) + 1.2;
  return (
    <Canvas
      frameloop="demand" // render only on interaction — no idle GPU/battery use
      dpr={[1, Math.min(2, window.devicePixelRatio || 1)]}
      camera={{ position: [0, 0, radius * 1.7], fov: 40 }}
      style={{ pointerEvents: interactive ? 'auto' : 'none', touchAction: interactive ? 'none' : 'pan-y' }}
      aria-hidden
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 8]} intensity={1.6} />
      {m.atoms.map((a, i) => (
        <mesh key={i} position={a.p}>
          <sphereGeometry args={[(COVALENT_RADIUS[a.el] ?? 0.8) * 0.45, 32, 20]} />
          <meshStandardMaterial color={ELEMENT_COLOR[a.el] ?? '#ff1493'} roughness={0.35} metalness={0.05} />
        </mesh>
      ))}
      {m.bonds.map((b, i) => <BondSticks key={i} m={m} b={b} />)}
      <OrbitControls enablePan={false} enabled={interactive} minDistance={radius} maxDistance={radius * 4} />
    </Canvas>
  );
}
