import { type Dispatch, type SetStateAction } from "react"

const DeleteBudgetButton = ({ setIsOpen }: { setIsOpen: Dispatch<SetStateAction<boolean>> }) => {
  return (
    <button
      onClick={() => setIsOpen(true)}
      className="bg-red-500 hover:bg-red-400 active:bg-red-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
    >
      Delete Budget
    </button>
  )
}

export default DeleteBudgetButton
