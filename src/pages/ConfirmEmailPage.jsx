import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api.js'

export default function ConfirmEmailPage() {
  const [params] = useSearchParams()
  const [status, setStatus] = useState('loading')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const email = params.get('email') || ''
    const token = params.get('token') || ''

    async function run() {
      try {
        await api(`/api/auth/confirm?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`, {
          method: 'GET',
          auth: false
        })
        setStatus('ok')
        setMsg('Email confirmed. You can login now.')
      } catch (err) {
        setStatus('err')
        setMsg(err.message || 'Confirm error')
      }
    }

    if (!email || !token) {
      setStatus('err')
      setMsg('No email/token in link')
      return
    }

    run()
  }, [params])

  return (
    <div className="container" style={{ maxWidth: 650, marginTop: 40 }}>
      <div className="card">
        <div className="card-body">
          <h3>Confirm email</h3>

          {status === 'loading' ? <div className="alert alert-info">Loading...</div> : null}
          {status === 'ok' ? <div className="alert alert-success">{msg}</div> : null}
          {status === 'err' ? <div className="alert alert-danger">{msg}</div> : null}

          <Link to="/login">Go to login</Link>
        </div>
      </div>
    </div>
  )
}
