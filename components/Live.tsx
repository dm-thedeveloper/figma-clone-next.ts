'use client'

import React, { useCallback, useEffect, useState } from 'react'

import LiveCursor from './curors/LiveCursor'
import {
  useMyPresence,
  useOthers,
  useBroadcastEvent,
} from '@/liveblocks.config'
import { CursorMode, CursorState, Reaction, ReactionEvent } from '@/types/type'
import CursorChat from './curors/CursorChat'
import { ReactionSelector } from './reaction/ReactionButton'
import FlyingReaction from './reaction/FlyingReaction'
import useInterval from '@/hooks/useInterval'
import { useEventListener } from '@liveblocks/react'

type Props = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
}

const Live = ({ canvasRef }: Props) => {
  const others = useOthers()
  // console.log('Others : ', others)

  const [{ cursor }, updateMyPresence] = useMyPresence() as any

  // track the state of the cursor (hidden, chat, reaction, reaction selector)

  const [cursorState, setCursorState] = useState<CursorState>({
    // mode: CursorMode.Hidden,
    mode: CursorMode.Hidden,
  })
  // store the reactions created on mouse click
  const [reactions, setReactions] = useState<Reaction[]>([])

  const broadcast = useBroadcastEvent()

  // Remove reactions that are not visible anymore (every 1 sec)
  useInterval(() => {
    setReactions((reaction) =>
      reaction.filter((reaction) => reaction.timestamp > Date.now() - 4000),
    )
  }, 1000)

  // Broadcast the reaction to other users (every 100ms)

  useInterval(() => {
    if (
      cursorState.mode === CursorMode.Reaction &&
      cursorState.isPressed &&
      cursor
    ) {
      // concat all the reactions created on mouse click
      setReactions((reactions) =>
        reactions.concat([
          {
            point: { x: cursor.x, y: cursor.y },
            value: cursorState.reaction,
            timestamp: Date.now(),
          },
        ]),
      )
      // Broadcast the reaction to other users
      // broadcast({
      //   x: cursor.x,
      //   y: cursor.y,
      //   value: cursorState.reaction,
      // })
    }
  }, 1000)

  // Listen to mouse events to change the cursor state
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    e.preventDefault()

    // if cursor is not in reaction selector mode, update  cursor the position
    // if (cursor == null || cursorState.mode !== CursorMode.ReactionSelector) {
    //   // get the cursor position in the canvas
    //   const x = e.clientX - e.currentTarget.getBoundingClientRect().x
    //   const y = e.clientY - e.currentTarget.getBoundingClientRect().y

    //   // broadcast the cursor position to other users
    //   updateMyPresence({
    //     curor: {
    //       x,
    //       y,
    //     },
    //   })
    // }
    updateMyPresence({
      cursor: {
        x: e.clientX,
        y: e.clientY,
      },
    })
  }, [])

  // Show the cursor when the mouse enters the canvas
  const handlPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // get the cursor position in the canvas
      const x = e.clientX - e.currentTarget.getBoundingClientRect().x
      const y = e.clientY - e.currentTarget.getBoundingClientRect().y
      updateMyPresence({
        cursor: {
          x,
          y,
        },
      })

      // if cursor is in reaction mode, set isPressed to true
      setCursorState((state: CursorState) =>
        cursorState.mode === CursorMode.Reaction
          ? { ...state, isPressed: true }
          : state,
      )
    },
    [cursorState.mode, setCursorState],
  )

  // hide the cursor when the mouse is up
  const handlePointerUp = useCallback(
    () =>
      setCursorState((state: CursorState) =>
        cursorState.mode === CursorMode.Reaction
          ? { ...state, isPressed: false }
          : state,
      ),
    [],
  )
  // Hide the cursor when the mouse leaves the canvas

  const handlePointerLeave = useCallback(() => {
    setCursorState({ mode: CursorMode.Hidden })
    updateMyPresence({
      cursor: null,
      message: null,
    })
  }, [])

  // Listen to keyboard events to change the cursor state
  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === '/') {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: '',
        })
      } else if (e.key === 'Escape') {
        updateMyPresence({ message: '' })
        setCursorState({ mode: CursorMode.Hidden })
      } else if (e.key === 'e') {
        setCursorState({ mode: CursorMode.ReactionSelector })
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault()
      }
    }

    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [updateMyPresence])
  // set the reaction of the cursor

  const setReaction = useCallback((reaction: string) => {
    setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: false })
  }, [])

  /**
   * useEventListener is used to listen to events broadcasted by other
   * users.
   *
   * useEventListener: https://liveblocks.io/docs/api-reference/liveblocks-react#useEventListener
   */
  useEventListener((eventData) => {
    const event = eventData.event as ReactionEvent
    setReactions((reactions) =>
      reactions.concat([
        {
          point: { x: event.x, y: event.y },
          value: event.value,
          timestamp: Date.now(),
        },
      ]),
    )
  })

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlPointerDown}
      onPointerUp={handlePointerUp}
      className="border-2 h-[500px] w-full relative overflow-hidden select-none"
      id="canvas"
      style={{ border: '5px solid red' }}
    >
      <h1 className="text-5xl ">Hello World</h1>
      <canvas ref={canvasRef} className="border-2 border-red-700" />
      <LiveCursor others={others} />

      {/* Render the reactions */}

      {reactions.map((reaction) => (
        <FlyingReaction
          key={reaction.timestamp.toString()}
          value={reaction.value}
          x={reaction.point.x}
          y={reaction.point.y}
          timestamp={reaction.timestamp}
        />
      ))}

      {/* If cursor is in chat mode, show the chat cursor */}
      {cursor && (
        // {cursorState.mode === CursorMode.Chat && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}

      {/* If cursor is in reaction selector mode, show the reaction selector */}
      {cursorState.mode === CursorMode.ReactionSelector && (
        <ReactionSelector
          setReaction={(reaction) => {
            setReaction(reaction)
          }}
        />
      )}
    </div>
  )
}

export default Live
