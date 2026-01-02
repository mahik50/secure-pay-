// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from "./Layout.tsx"
import Signup from "./components/Signup.tsx"
import Login from "./components/Login.tsx"
import SearchUser from "./components/SearchUser.tsx"
import SendMoneyTo from "./components/SendMoneyTo.tsx"
import UserHistory from "./components/UserHistory.tsx"


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Routes (No Layout) */}
      <Route path='/' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      
      {/* Protected Routes (Uses the Layout) */}
      <Route path='/' element={<Layout />}>
        <Route path='search-user' element={<SearchUser />} />
        <Route path='send-money-to/:to' element={<SendMoneyTo />} />
        <Route path='show-history' element={<UserHistory />} />
      </Route>
    </>
  )
)

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <RouterProvider router={router} />
  // </StrictMode>,
)
