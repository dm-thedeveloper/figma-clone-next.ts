'use client'
import { LiveCursorProps } from '@/types/type'
import React from 'react'
import Cursor from './Cursor'
import { COLORS } from '@/constants'

function LiveCursor({ others }: LiveCursorProps) {
  return others.map(({ presence, connectionId }) => {
    if (!presence?.cursor || connectionId == null) {
      return null
    }
    // console.log('Presence:  ', presence.message)

    return (
      <Cursor
        key={connectionId}
        color={COLORS[Number(connectionId) % COLORS.length]}
        x={presence.cursor.x}
        y={presence.cursor.y}
        message={presence.message}
        // message={'Hello'}
      />
    )
  })
}

export default LiveCursor
