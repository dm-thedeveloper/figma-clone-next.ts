import React from 'react'
import Avatar from './users/Avatar'
import ActiveUser from './users/ActiveUser'

function NavBar() {
  return (
    <header className="fixed top-0 w-full h-[40px] bg-gray-500  px-[20px]">
      <div className="w-full h-full flex items-center ">
        {/* <Avatar name="DM" /> */}
        <ActiveUser />
      </div>
    </header>
  )
}
export default NavBar
