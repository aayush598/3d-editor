'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { useSceneStore } from '@/stores/sceneStore'
import { memo } from 'react'

function PrimitiveMesh({ type, position }: { type: string; position: [number, number, number] }) {
  switch (type) {
    case 'sphere':
      return (
        <mesh position={position} castShadow receiveShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="skyblue" />
        </mesh>
      )
    case 'plane':
      return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} receiveShadow>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color="lightgreen" />
        </mesh>
      )
    default:
      return (
        <mesh position={position} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      )
  }
}
const MemoPrimitiveMesh = memo(PrimitiveMesh)

export default function EditorCanvas() {
  const objects = useSceneStore((s) => s.objects)

  return (
    <Canvas
      shadows
      camera={{ position: [5, 5, 5], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 10, 5]}
        castShadow
        intensity={1}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Grid args={[50, 50]} cellColor="gray" sectionColor="lightgray" infiniteGrid />
      {objects.map((obj) => (
        <MemoPrimitiveMesh key={obj.id} type={obj.type} position={obj.position} />
      ))}
      <OrbitControls makeDefault />
    </Canvas>
  )
}
