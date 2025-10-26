import React from 'react'
import Image from 'next/image'
import { navElements } from '@/constants'
import { NavbarProps } from '@/types/type'
import ShapeMenue from './ShapeMenue'

function NavBar({
  activeElement,
  handleActiveElement,
  handleImageUpload,
  imageInputRef,
}: NavbarProps) {
  const isActive = (value: string | string[]) => {
    ;(activeElement && activeElement?.value === value) ||
      (Array.isArray(value) &&
        value.some((val) => val?.value === activeElement?.value))
  }
  return (
    <nav className="fixed top-0 select-none items-center justify-between gap-4 bg-primary-black px-5 text-black ">
      <header className="flex">
        <Image
          src="/assets/logo.svg"
          alt="FigPro Logo"
          width={58}
          height={20}
        />

        <ul className="flex flex-row">
          {navElements.map((item) => (
            <li
              key={item.name}
              onClick={() => {
                if (Array.isArray(item.value)) return
                //
                // console.log('handleActiveElement')
                handleActiveElement(item)
              }}
              className={`group flex items-center justify-center px-2.5 py-5
            ${
              isActive(item.value)
                ? 'bg-primary-green'
                : 'hover:bg-primary-grey-200'
            }
            `}
            >
              {/* If value is an array means it's a nav element with sub options i.e., dropdown */}
              {Array.isArray(item.value) ? (
                // Shape Menue
                <ShapeMenue
                  item={item}
                  activeElement={activeElement}
                  imageInputRef={imageInputRef}
                  handleActiveElement={handleActiveElement}
                  handleImageUpload={handleImageUpload}
                />
              ) : item?.value === 'commets' ? (
                // If value is comments, trigger the NewThread component
                // <NewThread />
                <h1>NewThread</h1>
              ) : (
                // Button
                <h1>Button</h1>
              )}
            </li>
          ))}
        </ul>
      </header>
    </nav>
  )
}
export default NavBar
