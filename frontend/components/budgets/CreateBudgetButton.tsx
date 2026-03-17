
const CreateBudgetButton = ({ onClick }: { onClick: () => void }) => {
  return (
    < button
      onClick={onClick}
      className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
    >
      + Create Budget
    </button >
  )
}

export default CreateBudgetButton
