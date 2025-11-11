'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const RegisterPage = () => {
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
    
      }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Create An Account</h2>

        <form onSubmit={handleRegister} className="space-y-5">
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
              //value={email}
              //onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              //value={password}
              //onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Re-enter Password</label>
            <input
              type="password"
              placeholder="••••••••"
              //value={password}
              //onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 text-white font-semibold bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all"
          >
            Create Account
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage