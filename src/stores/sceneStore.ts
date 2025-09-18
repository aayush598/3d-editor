// src/stores/sceneStore.ts
import { create } from 'zustand'
import { nanoid } from 'nanoid'

type PrimitiveType = 'cube' | 'sphere' | 'plane'

export interface SceneObject {
  id: string
  type: PrimitiveType
  position: [number, number, number]
}

interface SceneState {
  objects: SceneObject[]
  addObject: (type: PrimitiveType) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  objects: [],
  addObject: (type) =>
    set((state) => ({
      objects: [
        ...state.objects,
        {
          id: nanoid(),
          type,
          position: [Math.random() * 2 - 1, 1, Math.random() * 2 - 1],
        },
      ],
    })),
}))
