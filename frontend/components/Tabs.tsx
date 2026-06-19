import { useState } from 'react'

export type TabDef = {
  label: string
  content: React.ReactNode
  action?: React.ReactNode
}

const Tabs = ({ tabs }: { tabs: TabDef[] }) => {
  const [active, setActive] = useState(0)

  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray-800 mb-6">
        <div className="flex">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActive(i)}
              className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer border-b-2 -mb-px ${
                active === i
                  ? 'text-white border-emerald-400'
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {tabs[active].action && (
          <div className="pb-2">{tabs[active].action}</div>
        )}
      </div>
      {tabs[active].content}
    </div>
  )
}

export default Tabs
