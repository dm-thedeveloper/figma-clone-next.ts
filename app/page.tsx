'use client'
import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'
import Live from '@/components/Live'
import NavBar from '@/components/NavBar'
import LeftSide from '@/components/LeftSide'
import RightSide from '@/components/RightSide'

function Home() {
  /**
   * canvasRef is a reference to the canvas element that we'll use to initialize
   * the fabric canvas.
   *
   * fabricRef is a reference to the fabric canvas that we use to perform
   * operations on the canvas. It's a copy of the created canvas so we can use
   * it outside the canvas event listeners.
   */

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<any>(null)

  /**
   * isDrawing is a boolean that tells us if the user is drawing on the canvas.
   * We use this to determine if the user is drawing or not
   * i.e., if the freeform drawing mode is on or not.
   */

  const isDrawing = useRef<boolean>(false)
  return (
    <div
      // style={{ border: '10px solid green' }}
      className="flex h-screen w-screen pt-[50px]"
    >
      <NavBar />
      <LeftSide />
      <Live />
      <RightSide />
    </div>
  )
}
export default Home
