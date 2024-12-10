import { useState } from 'react'
import { useAtom } from 'jotai'
import { userIdAtom, userPasswordAtom, isLoggedInAtom } from '../../store/atom'
import { getLoginStatus } from '../../components/join'
import { login, signup } from '../../lib/api'
import { setStorage, getStorage } from '../../lib/storage'

export default function Login() {
  const [userId, setUserId] = useAtom(userIdAtom)
  const [password, setPassword] = useAtom(userPasswordAtom)
  const [, setIsLoggedIn] = useAtom(isLoggedInAtom)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    if (userId === '' || password === '') {
      setError('User ID and password cannot be empty')
      return
    }
    try {
      const response = await login(userId, password)
      if (response.success) {
        setError(null)
        setIsLoggedIn(true)
        const user = getStorage()
        user.userId = userId
        setStorage(user)
        await getLoginStatus()
      } else {
        setError(response.message || 'Login failed')
      }
    } catch {
      setError('Network error or server unavailable')
    }
  }

  const handleSignup = async () => {
    if (userId === '' || password === '') {
      setError('User ID and password cannot be empty')
      return
    }
    try {
      const response = await signup(userId, password)
      if (response.success) {
        setError('Registration successful! You can now login.')
      } else {
        setError(response.message || 'Registration failed')
      }
    } catch {
      setError('Network error or server unavailable')
    }
  }

  return (
    <div className="flex flex-col justify-around bg-gray-800/80 p-6 my-4 rounded-lg">
      <center className="flex flex-col items-center space-y-4">
        <input
          className="text-center text-lg border border-gray-300 rounded p-2"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <input
          type="password"
          className="text-center text-lg border border-gray-300 rounded p-2"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        <div className="flex space-x-4">
          <button
            className="btn-primary"
            onClick={handleLogin}
          >
            Login In
          </button>
          <button
            className="btn-primary"
            onClick={handleSignup}
          >
            Sign Up
          </button>
        </div>
      </center>
    </div>
  )
}