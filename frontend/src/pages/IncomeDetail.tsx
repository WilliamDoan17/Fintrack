import { useState, useEffect } from 'react'
import Tabs from '../../components/Tabs'
import { useNavigation } from '../../contexts/NavigationContext'
import IncomeContainer from '../../components/incomes/IncomeContainer'
import CreateIncomeModal from '../../components/incomes/CreateIncomeModal'

const IncomeDetail = () => {
  const { setBackTo } = useNavigation()
  const [showCreateIncome, setShowCreateIncome] = useState(false)

  useEffect(() => {
    setBackTo('/dashboard')
    return () => setBackTo(null)
  }, [setBackTo])

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-12">
        <div className="mb-8 md:mb-10">
          <p className="text-xs text-emerald-600 uppercase tracking-widest mb-1">Income</p>
          <h1 className="text-white text-2xl md:text-3xl font-bold">Income</h1>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-end">
            <button
              onClick={() => setShowCreateIncome(true)}
              className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              + Add Income
            </button>
          </div>
          <Tabs tabs={[
            {
              label: 'Income',
              content: <IncomeContainer />,
            },
            {
              label: 'Allocations',
              content: <p className="text-gray-500 text-sm">Allocations coming soon.</p>,
            },
          ]} />
        </div>
      </div>

      {showCreateIncome && <CreateIncomeModal onClose={() => setShowCreateIncome(false)} />}
    </div>
  )
}

export default IncomeDetail
