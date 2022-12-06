import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Profile from './pages/Profile'

import Register from './pages/Register'
import { Snackbar, Alert } from '@mui/material'
import { useStateContext } from './context/ContextProvider'

import Login from './pages/Login'
import ChatRoom from './pages/ChatRoom'

const App = () => {
  const { snackMessage, isSnackOpen, handleCloseSnack, profileInfo } = useStateContext()
  return (
    <>
      <Snackbar open={isSnackOpen} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={6000} onClose={handleCloseSnack}>
        <Alert onClose={handleCloseSnack} severity={snackMessage.severity} sx={{ width: '100%' }}>
          {snackMessage.message}
        </Alert>
      </Snackbar>
      <div className='h-screen w-screen overflow-x-hidden'>
        <div className=''>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/profile/:profile_id' element={<Profile />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/chat/:id' element={<ChatRoom />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App