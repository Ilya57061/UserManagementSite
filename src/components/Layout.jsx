import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { clearToken } from '../lib/auth.js'

export default function Layout() {
  const navigate = useNavigate()

  function logout() {
    clearToken()
    navigate('/login')
  }

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand">Task4</span>
          <div className="navbar-nav">
            <Link className="nav-link" to="/users">Users</Link>
          </div>
          <button className="btn btn-outline-light btn-sm" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container mt-3">
        <Outlet />
      </div>
    </div>
  )
}
