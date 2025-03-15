import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from "react-hot-toast"
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Context from './components/Context.jsx'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Explore from './pages/Explore.jsx'
import Channel from "./pages/Channel.jsx"
import History from './components/History.jsx'
import Profile from "./components/Profile.jsx"
import Likes from './components/Likes.jsx'
import Playlist from "./pages/Playlist.jsx"
import CreatorChannel from "./pages/CreatorChannel.jsx"
import Video from "./components/Video.jsx"
import Settings from './pages/Settings.jsx'
import Layout from './components/Layout.jsx'
import UpdateVideoInfo from './pages/UpdateVideoInfo.jsx'
import Publish from "./pages/Publish.jsx"

createRoot(document.getElementById('root')).render(
  <Context>
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<App />} />

        <Route element={<Layout />}>
          <Route path='/home' element={<Home />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/:videoId/update' element={<UpdateVideoInfo />} />
          <Route path='/you/channel' element={<Channel />} />
          <Route path='/history' element={<History />} />
          <Route path='/likes' element={<Likes />} />
          <Route path='/playlist' element={<Playlist />} />
          <Route path='/channel/:channelId' element={<CreatorChannel />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/watch/:videoId' element={<Video />} />
          <Route path='/publish' element={<Publish />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Context>
);
