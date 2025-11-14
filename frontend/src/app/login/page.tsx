'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      if (!response.ok) throw new Error('Invalid credentials')

      const data = await response.json()

      // Save token
      localStorage.setItem('token', data.access_token)
      console.log("Token: " + data.access_token)

      // Get user info immediately
      const userRes = await fetch('http://localhost:8000/users/me', {
        credentials: 'include',
      })
      console.log(userRes)
      if (!userRes.ok) throw new Error('Failed to fetch user info')

      const userData = await userRes.json()
      localStorage.setItem('user', JSON.stringify(userData))

      setTimeout(() => {
        router.push('/dashboard')
        //window.location.href = '/dashboard'
      }, 200) 
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Sign In</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 mt-2 text-white font-semibold rounded-md focus:ring-4 focus:ring-blue-300 transition-all ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          Don’t have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Create one
          </a>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
