import { Link } from 'react-router-dom'
import { useSpendingBudgetStructure } from '../../hooks/budgets'

const BudgetBreadcrumbs = ({ budgetId }: { budgetId: string }) => {
  const { structure } = useSpendingBudgetStructure()

  const path = structure?.budgetIdToPath.get(budgetId) ?? ''
  const segments = path.split('/').filter(Boolean)

  return (
    <p className="text-gray-500 text-sm uppercase tracking-widest mb-1">
      {segments.map((name, i) => {
        const segPath = '/' + segments.slice(0, i + 1).join('/')
        const segId = structure?.pathToBudgetId.get(segPath)
        const isLast = i === segments.length - 1
        return (
          <span key={segPath}>
            {i > 0 && <span className="mx-1.5">/</span>}
            {isLast || !segId
              ? name
              : <Link to={`/budget/${segId}`} className="hover:text-gray-300 transition-colors">{name}</Link>
            }
          </span>
        )
      })}
    </p>
  )
}

export default BudgetBreadcrumbs
