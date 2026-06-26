import { useState, useEffect } from 'react'
import Tabs from '../../components/Tabs'
import { useNavigation } from '../../contexts/NavigationContext'
import IncomeContainer from '../../components/incomes/IncomeContainer'
import CreateIncomeModal from '../../components/incomes/CreateIncomeModal'
import AllocationContainer from '../../components/allocations/AllocationContainer'
import CreateAllocationModal from '../../components/allocations/CreateAllocationModal'
import { useIncomes } from '../../hooks/incomes'
import { useAllocations } from '../../hooks/allocations'

const IncomeBalanceSummary = () => {
  const { incomes, isLoading: incLoading, error: incError } = useIncomes()
  const { allocations, isLoading: alLoading, error: alError } = useAllocations()

  const isLoading = incLoading || alLoading
  const error = incError || alError

  if (isLoading) return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center justify-center">
      <p className="text-gray-500 text-sm">Loading balance...</p>
    </div>
  )
  if (error) return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center justify-center">
      <p className="text-red-400 text-sm">Error loading balance</p>
    </div>
  )

  const totalIncome = incomes.reduce((sum, { amount }) => sum + amount, 0)
  const totalAllocated = allocations.reduce((sum, { amount }) => sum + amount, 0)
  const unallocated = totalIncome - totalAllocated

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 md:p-6 flex flex-col gap-4">
      <div className="flex flex-col items-center">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Unallocated</p>
        <p className={`font-bold text-2xl md:text-3xl ${unallocated >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {unallocated >= 0 ? '+' : '-'}${Math.abs(unallocated).toFixed(2)}
        </p>
      </div>
      <div className="border-t border-gray-800" />
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Income</p>
          <p className="text-emerald-400 font-semibold text-base md:text-lg">+${totalIncome.toFixed(2)}</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Allocated</p>
          <p className="text-red-400 font-semibold text-base md:text-lg">-${totalAllocated.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

const IncomeDetail = () => {
  const { setBackTo } = useNavigation()
  const [showCreateIncome, setShowCreateIncome] = useState(false)
  const [showCreateAllocation, setShowCreateAllocation] = useState(false)

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
          <IncomeBalanceSummary />
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
              content: (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowCreateAllocation(true)}
                      className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                      + Allocate
                    </button>
                  </div>
                  <AllocationContainer />
                </div>
              ),
            },
          ]} />
        </div>
      </div>

      {showCreateIncome && <CreateIncomeModal onClose={() => setShowCreateIncome(false)} />}
      {showCreateAllocation && <CreateAllocationModal onClose={() => setShowCreateAllocation(false)} />}
    </div>
  )
}

export default IncomeDetail
