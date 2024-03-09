import{BrowserRouter,Routes,Route} from "react-router-dom"
import React from 'react'
import Home from "./Pages/Home"
import About from "./Pages/About"
import SignUp from "./Pages/SignUp"
import SignIn from "./Pages/SignIn"
import Profile from "./Pages/Profile"
import Header from "./components/Header"

export default function App() {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/SignUp' element={<SignUp/>}/>
      <Route path='/SignIn' element={<SignIn/>}/>
      <Route path='/Profile' element={<Profile/>}/>
    </Routes>
    </BrowserRouter>
  )
}

