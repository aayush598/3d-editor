'use client'

import VREditorCanvas from "./../../components/EditorCanvas"
import Inspector from './../../components/Inspector'
import { useSceneStore } from '@/stores/sceneStore'
import { useState } from 'react'

export default function VREditorPage() {
  const addObject = useSceneStore((s) => s.addObject)
  const [showInspector, setShowInspector] = useState(true)

  return (
    <main className="w-screen h-screen flex relative">
      {/* Desktop Inspector Panel */}
      {showInspector && (
        <div className="w-64 bg-gray-900 border-r border-gray-700 p-3 text-white z-10">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-bold text-lg">VR 3D Editor</h1>
            <button 
              onClick={() => setShowInspector(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          
          <div className="mb-4">
            <h2 className="font-semibold mb-2 text-blue-300">Desktop Controls</h2>
            <div className="flex flex-col gap-2 mb-4">
              <button 
                onClick={() => addObject('cube')} 
                className="bg-orange-600 hover:bg-orange-700 p-2 rounded text-sm transition-colors"
              >
                Add Cube
              </button>
              <button 
                onClick={() => addObject('sphere')} 
                className="bg-blue-500 hover:bg-blue-600 p-2 rounded text-sm transition-colors"
              >
                Add Sphere
              </button>
              <button 
                onClick={() => addObject('plane')} 
                className="bg-green-500 hover:bg-green-600 p-2 rounded text-sm transition-colors"
              >
                Add Plane
              </button>
            </div>
          </div>

          <div className="text-xs mb-4 p-2 bg-gray-800 rounded">
            <div className="font-semibold mb-1 text-yellow-300">VR Instructions:</div>
            <ul className="space-y-1 text-gray-300">
              <li>• Point and select objects with controllers</li>
              <li>• Hold trigger to drag selected objects</li>
              <li>• Use floating VR menu to add objects</li>
              <li>• Undo/Redo buttons available in VR</li>
            </ul>
          </div>
          
          <Inspector />
        </div>
      )}

      {/* Toggle Inspector Button */}
      {!showInspector && (
        <button
          onClick={() => setShowInspector(true)}
          className="absolute top-4 left-4 bg-gray-800 text-white p-2 rounded z-20 hover:bg-gray-700"
        >
          Show Panel
        </button>
      )}

      {/* VR Canvas */}
      <div className="flex-1 relative">
        <VREditorCanvas />
        
        {/* VR Instructions Overlay */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded max-w-xs z-10">
          <h3 className="font-bold mb-2">VR Editor</h3>
          <p className="text-sm mb-2">
            Click `&#34;`Enter VR`&#34;` to start editing in virtual reality.
          </p>
          <div className="text-xs space-y-1">
            <div><strong>Requirements:</strong></div>
            <div>• VR headset (Quest, Vive, etc.)</div>
            <div>• WebXR compatible browser</div>
            <div>• HTTPS connection</div>
          </div>
        </div>
      </div>
    </main>
  )
}