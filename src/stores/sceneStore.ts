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
  selectedId: string | null
  addObject: (type: PrimitiveType) => void
  selectObject: (id: string | null) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  objects: [],
  selectedId: null,
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
  selectObject: (id) => set({ selectedId: id }),
}))
