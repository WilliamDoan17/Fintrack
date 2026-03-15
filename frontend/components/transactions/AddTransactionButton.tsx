import { type Dispatch, type SetStateAction } from 'react'

const AddTransactionButton = ({ setOpenModal }: { setOpenModal: Dispatch<SetStateAction<boolean>> }) => {
  return (
    <button
      onClick={() => setOpenModal(true)}
      className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
    >
      + Add Transaction
    </button>
  )
}

export default AddTransactionButton
