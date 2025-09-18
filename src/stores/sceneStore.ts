import { create } from 'zustand'
import { nanoid } from 'nanoid'

type PrimitiveType = 'cube' | 'sphere' | 'plane'

export interface SceneObject {
  id: string
  type: PrimitiveType
  position: [number, number, number]
  parentId?: string | null // new
}

interface SceneState {
  objects: SceneObject[]
  selectedId: string | null
  addObject: (type: PrimitiveType, parentId?: string | null) => void
  selectObject: (id: string | null) => void
  updateObjectPosition: (id: string, position: [number, number, number]) => void
  setParent: (id: string, parentId: string | null) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  objects: [],
  selectedId: null,
  addObject: (type, parentId = null) =>
    set((state) => ({
      objects: [
        ...state.objects,
        {
          id: nanoid(),
          type,
          position: [Math.random() * 2 - 1, 1, Math.random() * 2 - 1],
          parentId,
        },
      ],
    })),
  selectObject: (id) => set({ selectedId: id }),
  updateObjectPosition: (id, position) =>
    set((state) => ({
      objects: state.objects.map((o) =>
        o.id === id ? { ...o, position } : o
      ),
    })),
  setParent: (id, parentId) =>
    set((state) => ({
      objects: state.objects.map((o) =>
        o.id === id ? { ...o, parentId } : o
      ),
    })),
}))
