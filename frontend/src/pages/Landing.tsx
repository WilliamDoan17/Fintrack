import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <div className="max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
        <p className="text-white font-bold text-lg">Fintrack</p>
        <button
          onClick={() => navigate('/auth')}
          className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          Log in
        </button>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-8 py-32 flex flex-col items-center text-center">
        <p className="text-emerald-400 text-sm uppercase tracking-widest mb-4">Personal Finance, Simplified</p>
        <h1 className="text-5xl font-bold text-white leading-tight mb-6 max-w-2xl">
          Give every dollar a purpose
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mb-10">
          Fintrack helps you split your money into purpose-driven budgets so you always know where it's going. Track income, expenses, and nested budgets in one place.
        </p>
        <button
          onClick={() => navigate('/auth')}
          className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium px-8 py-3 rounded-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          Get Started
        </button>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-8 pb-32">
        <p className="text-center text-gray-500 text-sm uppercase tracking-widest mb-12">Features</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-3 hover:border-gray-700 transition-all">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
            </div>
            <h3 className="text-white font-semibold">Budget Management</h3>
            <p className="text-gray-500 text-sm">Create budgets and sub-budgets to organize your money by purpose. Nest them as deep as you need.</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-3 hover:border-gray-700 transition-all">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3 className="text-white font-semibold">Transaction Tracking</h3>
            <p className="text-gray-500 text-sm">Log income and withdrawals per budget. Every transaction is tracked and reflected in your balance instantly.</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-3 hover:border-gray-700 transition-all">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <h3 className="text-white font-semibold">Recursive Balance</h3>
            <p className="text-gray-500 text-sm">Balances roll up through sub-budgets automatically. See the full picture at any level of your budget tree.</p>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Landing
