import { useState } from 'react'
import { loginWithEmailAndPassword, signupWithEmailAndPassword } from '../backend/services/auth.ts'

type Tab = 'login' | 'signup'

const TabBar = ({ tab, setTab }: { tab: Tab, setTab: (tab: Tab) => void }) => {
  const handleTabClicked = (newTab: Tab) => {
    if (newTab !== tab) setTab(newTab)
  }
  return (
    <div className="flex border-b border-gray-700 mb-6">
      <div
        onClick={() => handleTabClicked('login')}
        className={`flex-1 text-center py-2 cursor-pointer transition-all ${tab === 'login'
          ? 'text-emerald-400 border-b-2 border-emerald-400'
          : 'text-gray-400 hover:text-gray-200'
          }`}
      >
        Log In
      </div>
      <div
        onClick={() => handleTabClicked('signup')}
        className={`flex-1 text-center py-2 cursor-pointer transition-all ${tab === 'signup'
          ? 'text-emerald-400 border-b-2 border-emerald-400'
          : 'text-gray-400 hover:text-gray-200'
          }`}
      >
        Sign Up
      </div>
    </div>
  )
}

const SignupForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError(new Error("Passwords do not match"))
      return
    } else {
      setLoading(true)
      signupWithEmailAndPassword(email, password)
        .then(() => setError(null))
        .catch(error => setError(error))
        .finally(() => setLoading(false))
    }
  }

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-white">Sign Up</h1>
      <div className="flex flex-col gap-1">
        <label htmlFor='signup-email' className="text-sm text-gray-400">Email</label>
        <input
          type="email"
          id="signup-email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-emerald-400 transition-all"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor='signup-password' className="text-sm text-gray-400">Password</label>
        <input
          type="password"
          id="signup-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-emerald-400 transition-all"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor='signup-confirm-password' className="text-sm text-gray-400">Confirm Password</label>
        <input
          type="password"
          id='signup-confirm-password'
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-emerald-400 transition-all"
        />
      </div>
      <button
        type='submit'
        className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium py-2 rounded mt-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        Sign Up
      </button>
      {error && <p className="text-red-400 text-sm mt-2">{error.message}</p>}
    </form>
  )
}

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    loginWithEmailAndPassword(email, password)
      .then(() => setError(null))
      .catch((error) => setError(error))
      .finally(() => setLoading(false))
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-white">Log In</h1>
      <div className="flex flex-col gap-1">
        <label htmlFor='login-email' className="text-sm text-gray-400">Email</label>
        <input
          type="email"
          id="login-email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-emerald-400 transition-all"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor='login-password' className="text-sm text-gray-400">Password</label>
        <input
          type="password"
          id="login-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-emerald-400 transition-all"
        />
      </div>
      <button
        type='submit'
        className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium py-2 rounded mt-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        Log In
      </button>
      {error && <p className="text-red-400 text-sm mt-2">{error.message}</p>}
    </form >
  )
}

const Auth = () => {
  const [tab, setTab] = useState<Tab>('login')

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 rounded-xl p-8 w-full max-w-md shadow-lg hover:shadow-emerald-900/20 hover:shadow-xl transition-all">
        <TabBar tab={tab} setTab={setTab} />
        {tab === 'login' ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  )
}

export default Auth
