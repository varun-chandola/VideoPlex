import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from "react-hot-toast"
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from './App.jsx'
import Login from "./components/Login.jsx"
import Home from './components/Home.jsx'
import Context from './components/Context.jsx'
import History from './components/History.jsx'
import Profile from "./components/Profile.jsx"
import Subscriptions from './components/Subscriptions.jsx'
import Likes from './components/Likes.jsx'
import Video from "./components/Video.jsx"

createRoot(document.getElementById('root')).render(
  <Context>
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/history' element={<History />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/subscriptions' element={<Subscriptions />} />
        <Route path='/likes' element={<Likes />} />
        <Route path='/video/:videoId' element={<Video />} />
      </Routes>
    </BrowserRouter >
  </Context>
);

