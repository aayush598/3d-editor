'use client'

import { Canvas, ThreeEvent } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { Grid, Text } from '@react-three/drei'
import { useSceneStore } from '@/stores/sceneStore'
import { memo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

// Create XR store
const xrStore = createXRStore()

function VRPrimitiveMesh({
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
  const meshRef = useRef<THREE.Mesh>(null)

  let geometry
  switch (type) {
    case 'sphere':
      geometry = <sphereGeometry args={[0.3, 16, 16]} />
      break
    case 'plane':
      geometry = <planeGeometry args={[0.8, 0.8]} />
      break
    default:
      geometry = <boxGeometry args={[0.6, 0.6, 0.6]} />
      break
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      castShadow
      receiveShadow
      onClick={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        onSelect(id)
      }}
      pointerEventsType={{ deny: 'grab' }}
    >
      {geometry}
      <meshStandardMaterial
        color={isSelected ? 'yellow' : type === 'sphere' ? 'skyblue' : type === 'plane' ? 'lightgreen' : 'orange'}
        wireframe={isSelected}
      />
    </mesh>
  )
}

const MemoVRPrimitiveMesh = memo(VRPrimitiveMesh)

function VRInterface() {
  const addObject = useSceneStore((s) => s.addObject)
  const undo = useSceneStore((s) => s.undo)
  const redo = useSceneStore((s) => s.redo)
  
  return (
    <group position={[-2, 1.6, -1]} rotation={[0, Math.PI / 4, 0]}>
      {/* Add Cube Button */}
      <mesh 
        position={[0, 0.5, 0]}
        onClick={() => addObject('cube')}
        pointerEventsType={{ deny: 'grab' }}
      >
        <boxGeometry args={[0.3, 0.1, 0.3]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.08}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Add Cube
      </Text>

      {/* Add Sphere Button */}
      <mesh 
        position={[0.5, 0.5, 0]}
        onClick={() => addObject('sphere')}
        pointerEventsType={{ deny: 'grab' }}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="skyblue" />
      </mesh>
      <Text
        position={[0.5, 0.6, 0]}
        fontSize={0.08}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Add Sphere
      </Text>

      {/* Add Plane Button */}
      <mesh 
        position={[1, 0.5, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => addObject('plane')}
        pointerEventsType={{ deny: 'grab' }}
      >
        <planeGeometry args={[0.3, 0.3]} />
        <meshStandardMaterial color="lightgreen" />
      </mesh>
      <Text
        position={[1, 0.6, 0]}
        fontSize={0.08}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Add Plane
      </Text>

      {/* Undo Button */}
      <mesh 
        position={[0, 0.2, 0]}
        onClick={undo}
        pointerEventsType={{ deny: 'grab' }}
      >
        <boxGeometry args={[0.2, 0.08, 0.2]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <Text
        position={[0, 0.28, 0]}
        fontSize={0.06}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Undo
      </Text>

      {/* Redo Button */}
      <mesh 
        position={[0.3, 0.2, 0]}
        onClick={redo}
        pointerEventsType={{ deny: 'grab' }}
      >
        <boxGeometry args={[0.2, 0.08, 0.2]} />
        <meshStandardMaterial color="green" />
      </mesh>
      <Text
        position={[0.3, 0.28, 0]}
        fontSize={0.06}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Redo
      </Text>
    </group>
  )
}

function DraggableObject({ 
  id, 
  children, 
  position 
}: { 
  id: string
  children: React.ReactNode
  position: [number, number, number]
}) {
  const updateObjectPosition = useSceneStore((s) => s.updateObjectPosition)
  const groupRef = useRef<THREE.Group>(null)
  const [isDragging, setIsDragging] = useState(false)

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerDown={(e) => {
        e.stopPropagation()
        setIsDragging(true)
      }}
      onPointerUp={() => {
        setIsDragging(false)
        if (groupRef.current) {
          const pos = groupRef.current.position
          updateObjectPosition(id, [pos.x, pos.y, pos.z])
        }
      }}
      onPointerMove={(e) => {
        if (isDragging && groupRef.current) {
          groupRef.current.position.copy(e.point)
        }
      }}
    >
      {children}
    </group>
  )
}

function VRSceneObjects() {
  const objects = useSceneStore((s) => s.objects)
  const selectedId = useSceneStore((s) => s.selectedId)
  const selectObject = useSceneStore((s) => s.selectObject)

  const renderVRObjects = (parentId: string | null) => {
    return objects
      .filter((o) => (o.parentId ?? null) === parentId)
      .map((obj) => (
        <DraggableObject key={obj.id} id={obj.id} position={obj.position}>
          <MemoVRPrimitiveMesh
            id={obj.id}
            type={obj.type}
            position={[0, 0, 0]} // Position handled by DraggableObject
            isSelected={obj.id === selectedId}
            onSelect={selectObject}
          />
          {renderVRObjects(obj.id)}
        </DraggableObject>
      ))
  }

  return <>{renderVRObjects(null)}</>
}

function VRScene() {
  const selectObject = useSceneStore((s) => s.selectObject)

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 5]}
        castShadow
        intensity={0.8}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      <Grid 
        args={[20, 20]} 
        cellColor="gray" 
        sectionColor="lightgray" 
        position={[0, -0.01, 0]}
      />

      {/* Background click handler */}
      <mesh
        position={[0, 0, 0]}
        onClick={() => selectObject(null)}
        visible={false}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <VRInterface />
      <VRSceneObjects />
    </>
  )
}

export default function VREditorCanvas() {
  const [vrSupported, setVrSupported] = useState(false)
  const [arSupported, setArSupported] = useState(false)

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      navigator.xr?.isSessionSupported('immersive-vr').then(setVrSupported)
      navigator.xr?.isSessionSupported('immersive-ar').then(setArSupported)
    }
  }, [])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* VR/AR Entry Buttons */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        gap: '10px'
      }}>
        {vrSupported ? (
          <button
            onClick={() => xrStore.enterVR()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007BFF',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
            }}
          >
            Enter VR
          </button>
        ) : null}

        {arSupported ? (
          <button
            onClick={() => xrStore.enterAR()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
            }}
          >
            Enter AR
          </button>
        ) : null}

        {!vrSupported && !arSupported && (
          <div style={{
            padding: '12px 24px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px'
          }}>
            XR Not Supported
          </div>
        )}
      </div>
      
      <Canvas style={{ width: '100%', height: '100%' }}>
        <XR store={xrStore}>
          <VRScene />
        </XR>
      </Canvas>
    </div>
  )
}