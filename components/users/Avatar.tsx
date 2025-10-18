import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '../ui/tooltip'
import { Button } from '../ui/button'
import Image from 'next/image'

type AvatarProps = {
  name: string
  otherStyles?: string
}

const Avatar = ({ name = 'Avatar', otherStyles }: AvatarProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`relative h-9 w-9 rounded-full border ${otherStyles}`}
          data-tooltip={name}
        >
          <Image
            src={`https://liveblocks.io/avatars/avatar-${Math.floor(
              Math.random() * 30,
            )}.png`}
            fill
            className="rounded-full"
            alt={name}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export default Avatar
