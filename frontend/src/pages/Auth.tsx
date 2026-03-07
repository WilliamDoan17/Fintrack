import { useState } from 'react'

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

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
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
        className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium py-2 rounded mt-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        Sign Up
      </button>
    </form>
  )
}

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
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
        className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium py-2 rounded mt-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        Log In
      </button>
    </form>
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
