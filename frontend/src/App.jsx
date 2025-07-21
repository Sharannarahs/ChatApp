import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import {Toaster} from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext'

const App = () => {

  // AUTH USER COMES FROM AUTHCONTEXT.JSX STATE WHICH IS SET UP BY CHECKAUTH FUNCTION
  const {authUser} = useContext(AuthContext);

  return (
    <div className='bg-gradient-to-r from-[#0a0813] to-[#160953]'>
      <Toaster />
      <Routes>
        <Route path ="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path ="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path ="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App