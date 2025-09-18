'use client'

import { Canvas, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Grid, TransformControls } from '@react-three/drei'
import { useSceneStore } from '@/stores/sceneStore'
import { memo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

/** Primitive mesh component */
function PrimitiveMesh({
  id,
  type,
  position,
  isSelected,
  onSelect,
  meshRef,
}: {
  id: string
  type: string
  position: [number, number, number]
  isSelected: boolean
  onSelect: (id: string) => void
  meshRef: React.Ref<THREE.Mesh>
}) {
  const commonProps = {
    position,
    castShadow: true,
    receiveShadow: true,
    ref: meshRef,
    onClick: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      onSelect(id)
    },
  }

  let geometry
  switch (type) {
    case 'sphere':
      geometry = <sphereGeometry args={[0.5, 32, 32]} />
      break
    case 'plane':
      geometry = <planeGeometry args={[1, 1]} />
      break
    default:
      geometry = <boxGeometry args={[1, 1, 1]} />
      break
  }

  return (
    <mesh {...commonProps}>
      {geometry}
      <meshStandardMaterial
        color={
          isSelected
            ? 'yellow'
            : type === 'sphere'
            ? 'skyblue'
            : type === 'plane'
            ? 'lightgreen'
            : 'orange'
        }
        wireframe={isSelected}
      />
    </mesh>
  )
}

const MemoPrimitiveMesh = memo(PrimitiveMesh)

/** Editor Canvas with move/rotate/scale, undo/redo, hierarchy support */
export default function EditorCanvas() {
  const objects = useSceneStore((s) => s.objects)
  const selectedId = useSceneStore((s) => s.selectedId)
  const selectObject = useSceneStore((s) => s.selectObject)
  const updateObjectPosition = useSceneStore((s) => s.updateObjectPosition)
  const undo = useSceneStore((s) => s.undo)
  const redo = useSceneStore((s) => s.redo)

  const [mode, setMode] = useState<'translate' | 'rotate' | 'scale'>('translate')

  /** Keyboard shortcuts */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'z') undo()
      else if (e.ctrlKey && e.key.toLowerCase() === 'y') redo()
      if (e.key === 't') setMode('translate')
      if (e.key === 'r') setMode('rotate')
      if (e.key === 's') setMode('scale')
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [undo, redo])

  /** Deselect when clicking empty space */
  const handleBackgroundClick = () => selectObject(null)

  /** Refs for meshes and groups */
  const meshRefs = useRef<Record<string, THREE.Mesh>>({})
  const groupRefs = useRef<Record<string, THREE.Group>>({})

  /** Recursive render for hierarchy */
  const renderObjects = (parentId: string | null) =>
    objects
      .filter((o) => (o.parentId ?? null) === parentId)
      .map((obj) => (
        <group
          key={obj.id}
          ref={(el) => {
            if (el) groupRefs.current[obj.id] = el
          }}
        >
          <MemoPrimitiveMesh
            id={obj.id}
            type={obj.type}
            position={obj.position}
            isSelected={obj.id === selectedId}
            onSelect={selectObject}
            meshRef={(el) => {
              if (el) meshRefs.current[obj.id] = el
            }}
          />
          {renderObjects(obj.id)}
        </group>
      ))

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

      {/* Render hierarchical objects */}
      {renderObjects(null)}

      {/* TransformControls for selected object */}
      {selectedId && meshRefs.current[selectedId] && (
        <TransformControls
          object={meshRefs.current[selectedId]}
          mode={mode}
          onObjectChange={() => {
            const mesh = meshRefs.current[selectedId]
            if (mesh) {
              const pos = mesh.position
              updateObjectPosition(selectedId, [pos.x, pos.y, pos.z])
            }
          }}
        />
      )}

      <OrbitControls makeDefault />
    </Canvas>
  )
}
