// app/editor/EditorCanvas.tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'

export default function EditorCanvas() {
  return (
    <Canvas
      shadows
      camera={{ position: [5, 
        5, 5], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Lights */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 10, 5]}
        castShadow
        intensity={1}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Grid helper */}
      <Grid
        args={[50, 50]} // size, divisions
        cellColor="gray"
        sectionColor="lightgray"
        infiniteGrid
      />

      {/* Example object */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      {/* Camera controls */}
      <OrbitControls makeDefault />
    </Canvas>
  )
}
