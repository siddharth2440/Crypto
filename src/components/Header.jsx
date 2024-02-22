import React from 'react'
import {Link} from 'react-router-dom'
const Header = () => {
  return (
    <div className='h-[9vh] bg-black text-[#ffffff] flex items-center justify-between px-4'>
        <h1 className='font-[700] text-[1.8rem]'>Crypto</h1>
        <ul className='flex items-center justify-between gap-3'>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/exchanges'>Exchanges</Link></li>
            <li><Link to='/coins'>Coins</Link></li>
        </ul>
    </div>
  )
}
export default Header;