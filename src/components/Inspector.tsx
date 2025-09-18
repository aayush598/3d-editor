'use client'

import { useSceneStore } from '@/stores/sceneStore'

export default function Inspector() {
  const objects = useSceneStore((s) => s.objects)

  return (
    <div className="p-2 text-sm">
      <h2 className="font-bold mb-2">Scene Objects</h2>
      <ul>
        {objects.map((obj) => (
          <li key={obj.id} className="mb-1">
            <div className="font-mono">
              {obj.type} at {obj.position.map((n) => n.toFixed(2)).join(', ')}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
