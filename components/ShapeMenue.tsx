'use client'

import { ShapesMenuProps } from '@/types/type'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import Image from 'next/image'

const ShapeMenue = ({
  activeElement,
  handleActiveElement,
  handleImageUpload,
  imageInputRef,
  item,
}: ShapesMenuProps) => {
  const isDropDownElem = item.value.some(
    (elem) => elem?.value === activeElement?.value,
  )

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="no-ring">
          <Button
            className="relative h-5 w-5 object-contain"
            onClick={() => handleActiveElement(item)}
          >
            <Image
              src={isDropDownElem ? activeElement.icon : item.icon}
              alt={item.name}
              fill
              className={isDropDownElem ? 'invert' : ''}
            />
          </Button>
        </DropdownMenuTrigger>

        {/* ✅ Dropdown content must go here */}
        <DropdownMenuContent className="bg-primary-grey-100 border-none p-0 rounded-lg overflow-hidden">
          {item.value.map((elem) => (
            <DropdownMenuItem
              key={elem?.name}
              asChild
              className={`p-0 hover:bg-primary-grey-200 ${
                activeElement.value === elem?.value ? 'bg-primary-green' : ''
              }`}
            >
              <Button
                onClick={() => handleActiveElement(elem)}
                className="flex w-full justify-between gap-10 rounded-none px-5 py-3 focus:border-none bg-transparent hover:bg-primary-grey-200"
              >
                <div className="group flex items-center gap-2">
                  <Image
                    src={elem?.icon as string}
                    alt={elem?.name as string}
                    width={20}
                    height={20}
                    className={
                      activeElement.value === elem?.value ? 'invert' : ''
                    }
                  />
                  <p
                    className={`text-sm ${
                      activeElement.value === elem?.value
                        ? 'text-primary-black'
                        : 'text-white'
                    }`}
                  >
                    {elem?.name}
                  </p>
                </div>
              </Button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        type="file"
        className="hidden"
        ref={imageInputRef}
        accept="image/*"
        onChange={handleImageUpload}
      />
    </>
  )
}

export default ShapeMenue
