'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import Live from '@/components/Live'
import NavBar from '@/components/NavBar'
import LeftSide from '@/components/LeftSide'
import RightSide from '@/components/RightSide'
import {
  handleCanvaseMouseMove,
  handleCanvasMouseDown,
  handleCanvasMouseUp,
  handleCanvasObjectModified,
  handleResize,
  initializeFabric,
  renderCanvas,
} from '@/lib/canvas'
import * as fabric from 'fabric'
import { ActiveElement } from '@/types/type'
import { defaultNavElement } from '@/constants'
import { useMutation, useStorage } from '@liveblocks/react'
import { handleDelete } from '@/lib/key-events'
import { LiveMap } from '@liveblocks/client'
import { handleImageUpload } from '@/lib/shapes'

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
  const selectedShapeRef = useRef<string | null>('rectangle')
  const shapeRef = useRef<fabric.Object | null>(null)
  const canvasObjects = useStorage((root) => root.canvasObjects)
  const [mouseEvent, setMouseEvent] = useState<string>('')

  /**
   *
   * imageInputRef is a reference to the input element that we use to upload
   * an image to the canvas.
   *
   * We want image upload to happen when clicked on the image item from the
   * dropdown menu. So wnave're using this ref to trigger the click event on the
   * input element when the user clicks on the image item from the dropdown.
   */

  const imageInputRef = useRef<HTMLInputElement>(null)

  const [activeElement, setActiveElements] = useState<ActiveElement>({
    icon: '',
    name: '',
    value: '',
  })

  /**
   * activeObjectRef is a reference to the active/selected object in the canvas
   *
   * We want to keep track of the active object so that we can keep it in
   * selected form when user is editing the width, height, color etc
   * properties/attributes of the object.
   *
   * Since we're using live storage to sync shapes across users in real-time,
   * we have to re-render the canvas when the shapes are updated.
   * Due to this re-render, the selected shape is lost. We want to keep track
   * of the selected shape so that we can keep it selected when the
   * canvas re-renders.
   */
  const activeObjectRef = useRef<fabric.Object | null>(null)

  /**
   *
   * deleteAllShapes is a mutation that deletes all the shapes from the
   * key-value store of liveblocks.
   *
   * delete: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap.delete
   * get: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap.get
   *
   * We're using this mutation to delete all the shapes from the key-value store when the user clicks on the reset button.
   */
  /**
   * Set the active element in the navbar and perform the action based
   * on the selected element.
   *
   * @param elem
   */
  // Error Here
  const deleteAllShapes = useMutation(({ storage }) => {
    // Explicitly tell TypeScript this is a LiveMap
    const canvasObjects = storage.get('canvasObjects') as LiveMap<string, any>

    // if the store doesn't exist or is empty, return
    if (!canvasObjects || canvasObjects.size === 0) return true

    // delete all the shapes from the store
    for (const [key] of canvasObjects.entries()) {
      canvasObjects.delete(key)
    }

    // return true if the store is empty
    return canvasObjects.size === 0
  }, [])

  const deleteShapeFromStorage = useMutation(({ storage }, shapeId) => {
    /**
     * canvasObjects is a Map that contains all the shapes in the key-value.
     * Like a store. We can create multiple stores in liveblocks.
     *
     * delete: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap.delete
     */
    const canvasObjects = storage.get('canvasObjects') as LiveMap<string, any>
    canvasObjects?.delete(shapeId)
  }, [])

  const syncShapeInStorage = useMutation(({ storage }, object) => {
    if (!object) return
    const { objectId } = object

    // console.log('Object', object)

    /**
     *
     * Turn Fabric object (kclass) into JSON format so that we can store it in the
     * key-value store.
     */
    const shapeData = object.json()
    // console.log('Shape Data', shapeData)

    shapeData.objectId = objectId

    const canvasObjects = storage.get('canvasObjects') as LiveMap<string, any>
    // console.log('Canvas Object', canvasObjects)

    /**
     * set is a method provided by Liveblocks that allows you to set a value
     *
     * set: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap.set
     */
    canvasObjects?.set(objectId, shapeData)
  }, [])

  const handleActiveElement = (elem: ActiveElement) => {
    setActiveElements(elem)
    switch (elem?.value) {
      // delete all the shapes from the canvas
      case 'reset':
        // clear the storage
        deleteAllShapes()
        // clear the canvas
        fabricRef.current?.clear()
        setActiveElements(defaultNavElement)
        break
      case 'delete':
        // delete it from the canvas
        handleDelete(fabricRef.current as any, deleteShapeFromStorage)
        // set "select" as the active element
        setActiveElements(defaultNavElement)
        break

      // upload an image to the canvas
      case 'image':
        // trigger the click event on the input element which opens the file dialog
        imageInputRef.current?.click()
        /**
         * set drawing mode to false
         * If the user is drawing on the canvas, we want to stop the
         * drawing mode when clicked on the image item from the dropdown.
         */

        isDrawing.current = false
        if (fabricRef.current) {
          // disable the drawing mode of canvas
          fabricRef.current.isDrawingMode = false
        }

        break
      // for comments, do nothing
      case 'comment':
        break

      default:
        // set the selected shape to the selected element

        selectedShapeRef.current = elem?.value as string

        break
    }
  }

  useEffect(() => {
    // => If a previous Fabric instance exists, dispose it before creating a new one
    // X  If We Remove this then shows an error  : fabric: Trying to initialize a canvas that has already been initialized. Did you forget to dispose the canvas?
    if (fabricRef.current) {
      fabricRef.current.dispose()
      fabricRef.current = null
    }
    // initialize the fabric canvas
    const canvas = initializeFabric({ canvasRef, fabricRef })

    setMouseEvent('Mouse:down')
    canvas.on('mouse:down', (options) => {
      console.log('MouseDown')

      handleCanvasMouseDown({
        options,
        isDrawing,
        selectedShapeRef,
        shapeRef,
        canvas,
      })
    })
    canvas.on('mouse:move', (options) => {
      setMouseEvent('Mouse:move')

      handleCanvaseMouseMove({
        options,
        isDrawing,
        selectedShapeRef,
        shapeRef,
        canvas,
        syncShapeInStorage,
      })
    })

    canvas.on('mouse:up', (options) => {
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        activeObjectRef,
        selectedShapeRef,
        syncShapeInStorage,
        setActiveElements,
      })
    })

    /**
     *
     * listen to the resize event on the window which is fired when the
     * user resizes the window.
     *
     * We're using this to resize the canvas when the user resizes the
     * window.
     */

    window.addEventListener('resize', () => {
      handleResize({ canvas: fabricRef.current })
    })

    /**
     *
     * listen to the object modified event on the canvas which is fired
     * when the user modifies an object on the canvas. Basically, when the
     * user changes the width, height, color etc properties/attributes of
     * the object or moves the object on the canvas.
     *
     * Event inspector: http://fabricjs.com/events
     * Event list: http://fabricjs.com/docs/fabric.Canvas.html#fire
     */
    canvas.on('object:modified', (options) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      })
    })
  }, [canvasRef]) // run this effect only once when the component mounts and the canvasRef changes

  // render the canvas when the canvasObjects from live storage changes
  useEffect(() => {
    renderCanvas({
      canvasObjects,
      fabricRef,
      activeObjectRef,
    })
  }, [canvasObjects])

  return (
    <div
      // style={{ border: '10px solid green' }}
      className="flex h-screen w-screen pt-[50px]"
    >
      <NavBar
        imageInputRef={imageInputRef}
        activeElement={activeElement}
        handleActiveElement={handleActiveElement}
        handleImageUpload={(e: any) => {
          // prevent the default behavior of the input element

          e.stopPropagation()
          handleImageUpload({
            file: e.target.files[0],
            canvas: fabricRef as any,
            shapeRef,
            syncShapeInStorage,
          })
        }}
      />

      <LeftSide />
      <h1 className="fixed left-4 top-1/2">{mouseEvent}</h1>

      <Live canvasRef={canvasRef} />
      <RightSide />
    </div>
  )
}
export default Home
