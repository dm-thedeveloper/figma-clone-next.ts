'use client'
import React, { useEffect, useRef } from 'react'
import * as fabric from 'fabric'

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Initialize Fabric canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 500,
      backgroundColor: '#f3f4f6',
    })

    fabricRef.current = canvas

    // Handle Mouse Down Event
    const handleMouseDown = (event: fabric.TEvent<MouseEvent>) => {
      const pointer = canvas.getPointer(event.e)
      const rect = new fabric.Rect({
        left: pointer.x - 50,
        top: pointer.y - 25,
        width: 100,
        height: 50,
        fill: 'rgba(59, 130, 246, 0.6)', // Tailwind blue-500 (transparent)
        stroke: '#2563eb',
        strokeWidth: 2,
      })
      canvas.add(rect)
    }

    canvas.on('mouse:down', handleMouseDown)

    // Cleanup on unmount
    return () => {
      canvas.off('mouse:down', handleMouseDown)
      canvas.dispose()
    }
  }, [])

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <canvas
        ref={canvasRef}
        className="border   border-gray-300 rounded-md shadow-md"
      />
    </div>
  )
}

export default App
