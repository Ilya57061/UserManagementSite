import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import Layout from './components/Layout.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ConfirmEmailPage from './pages/ConfirmEmailPage.jsx'
import UsersPage from './pages/UsersPage.jsx'

import { isLoggedIn } from './lib/auth.js'

function Private({ children }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/confirm" element={<ConfirmEmailPage />} />

      <Route
        path="/"
        element={
          <Private>
            <Layout />
          </Private>
        }
      >
        <Route index element={<Navigate to="/users" replace />} />
        <Route path="users" element={<UsersPage />} />
      </Route>

      <Route path="*" element={<Navigate to={isLoggedIn() ? '/users' : '/login'} replace />} />
    </Routes>
  )
}