import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'

const Sidebar = () => {

    const {getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages} = useContext(ChatContext);

    const { logout, onlineUsers } = useContext(AuthContext);

    const [input, setInput] = useState(false);
    const navigate = useNavigate();

    const filteredUsers = input ? users.filter((user)=> user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

    useEffect(() => {
        getUsers();
    },[onlineUsers])

  return (
    <div className={`bg-black/30 h-full p-5 overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ''}`}>
        <div className='pb-5'>

            {/* TOP FIELD */}
            <div className='flex justify-between items-center'> 
                <img src={assets.logo1} alt="logo" className='w-9 h-9'/>
                <p className='text-[#868686] font-bold text-xl'>Connekt</p>
                
                <div className='relative py-2 group'>
                    <img src={assets.menu_icon} alt="menu" className='max-h-5 cursor-pointer'/>
                    <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-slate-800 border border-gray-600 text-gray-100 hidden group-hover:block'>
                        <p onClick={()=>navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
                        <hr className='my-2 border-t border-gray-600'/>
                        <p
                            onClick={()=> logout()}
                            className='cursor-pointer text-sm'>Logout</p>
                    </div>
                </div>
            </div>

            {/* INPUT BOX */}

            <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
                <img src={assets.search_icon} alt="search" className='w-3' />
                <input 
                    onChange={(e)=> setInput(e.target.value)}
                    type='text' placeholder='Search User' className='bg-transparent border-none outline-none text-white text-xs placeholder:text-[#c8c8c8] flex-1' /> 
            </div>

        </div>
        
        {/* USERS */}
        <div className='flex flex-col'>
            {filteredUsers.map((user, index) => (
                <React.Fragment key={index}>
                <div 
                onClick={() => {setSelectedUser(user), setUnseenMessages(prev => ({...prev, [user._id]: 0}))}}
                className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm
                 ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}>
                    <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-[35px] aspect-[1/1] rounded-full'/>

                    {/* USER NAME AND STATUS */}
                    <div className='flex flex-col leading-5'>
                        <p>{user.fullName}</p>
                        {
                            onlineUsers.includes(user._id)
                            ? <span className='text-green-400 text-xs'>online</span>
                            :<span className='text-neutral-400 text-xs'>offline</span>
                        }

                    </div>
                    
                    {unseenMessages[user._id] > 0 && <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-purple-500/60'>{unseenMessages[user._id]}</p>}
                </div>
            
                <hr className='border-t border-white/10 my-2 ml-14' />
             </React.Fragment>
                
            ))}            
        </div>
    </div>
  )
}

export default Sidebar