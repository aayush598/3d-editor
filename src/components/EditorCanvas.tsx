'use client'

import { Canvas, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { useSceneStore } from '@/stores/sceneStore'
import { memo } from 'react'
import * as THREE from 'three'

function PrimitiveMesh({
  id,
  type,
  position,
  isSelected,
  onSelect,
}: {
  id: string;
  type: string;
  position: [number, number, number];
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const commonProps = {
    position,
    castShadow: true,
    receiveShadow: true,
    onClick: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation(); // prevent clicking through to canvas background
      onSelect(id);
    },
  };

  let geometry;
  switch (type) {
    case 'sphere':
      geometry = <sphereGeometry args={[0.5, 32, 32]} />;
      break;
    case 'plane':
      geometry = <planeGeometry args={[1, 1]} />;
      break;
    default:
      geometry = <boxGeometry args={[1, 1, 1]} />;
      break;
  }

  return (
    <mesh {...commonProps}>
      {geometry}
      <meshStandardMaterial
        color={isSelected ? 'yellow' : type === 'sphere' ? 'skyblue' : type === 'plane' ? 'lightgreen' : 'orange'}
        wireframe={isSelected}
      />
    </mesh>
  );
}
const MemoPrimitiveMesh = memo(PrimitiveMesh)

export default function EditorCanvas() {
  const objects = useSceneStore((s) => s.objects)
  const selectedId = useSceneStore((s) => s.selectedId)
  const selectObject = useSceneStore((s) => s.selectObject)

  // Click empty space to deselect
  const handleBackgroundClick = () => selectObject(null)

  return (
    <Canvas
      shadows
      camera={{ position: [5, 5, 5], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
      onPointerMissed={handleBackgroundClick}
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
        <MemoPrimitiveMesh
          key={obj.id}
          id={obj.id}
          type={obj.type}
          position={obj.position}
          isSelected={obj.id === selectedId}
          onSelect={selectObject}
        />
      ))}
      <OrbitControls makeDefault />
    </Canvas>
  )
}
