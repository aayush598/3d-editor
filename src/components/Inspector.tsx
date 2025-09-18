'use client'

import { useSceneStore } from '@/stores/sceneStore'

export default function Inspector() {
  const objects = useSceneStore((s) => s.objects)
  const selectedId = useSceneStore((s) => s.selectedId)

  const selected = objects.find((o) => o.id === selectedId)

  return (
    <div className="p-2 text-sm">
      <h2 className="font-bold mb-2">Scene Objects</h2>
      <ul>
        {objects.map((obj) => (
          <li
            key={obj.id}
            className={`mb-1 ${obj.id === selectedId ? 'bg-yellow-200' : ''}`}
          >
            {obj.type} at {obj.position.map((n) => n.toFixed(2)).join(', ')}
          </li>
        ))}
      </ul>

      {selected && (
        <div className="mt-4">
          <h3 className="font-bold">Selected:</h3>
          <div>ID: {selected.id}</div>
          <div>Type: {selected.type}</div>
          <div>
            Position: {selected.position.map((n) => n.toFixed(2)).join(', ')}
          </div>
        </div>
      )}
    </div>
  )
}
