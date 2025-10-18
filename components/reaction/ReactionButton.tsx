import React from 'react'

type Props = {
  setReaction: (reaction: string) => void
}
export function ReactionSelector({ setReaction }: Props) {
  return (
    <div
      className="absolute bottom-20 left-0 right-0 mx-auto w-fit transform rounded-full bg-red-400 px-2"
      onPointerMove={(e) => e.stopPropagation()}
    >
      <ReactionButton reaction="👍" onSelect={setReaction} />
      <ReactionButton reaction="🔥" onSelect={setReaction} />
      <ReactionButton reaction="😍" onSelect={setReaction} />
      <ReactionButton reaction="👀" onSelect={setReaction} />
      <ReactionButton reaction="😱" onSelect={setReaction} />
      <ReactionButton reaction="🙁" onSelect={setReaction} />
    </div>
  )
}

type ReactionButtonProps = {
  reaction: string
  onSelect: (reaction: string) => void
}

export function ReactionButton({ reaction, onSelect }: ReactionButtonProps) {
  return (
    <button
      className="transform select-none p-2 text-xl transition-transform hover:scale-150 focus:scale-150 focus:outline-none"
      onPointerDown={() => onSelect(reaction)}
      // onMouseOver={() => onSelect(reaction)}
    >
      {reaction}
    </button>
  )
}
