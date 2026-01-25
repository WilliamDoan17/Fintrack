import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../../supabase/database/useDatabase'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './BudgetPage.module.css'
import { AuthContext } from '../../supabase/auth/useAuth'

const BudgetPage = () => {
  const { state } = useLocation();
  const { user } = useContext(AuthContext);
  const [budget, setBudget] = useState(state?.budget || null);
  const { getBudgets } = useContext(DataContext);
  const [subBudgets, setSubBudgets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setSubBudgets([]);
    if (state?.budget) {
      setBudget(state.budget);
    }
  }, [state]);

  useEffect(() => {
    if (!user || !budget) return;

    const loadSubBudgets = async () => {
      const subBudgets = await getBudgets(user, budget);
      setSubBudgets(subBudgets);
    };

    loadSubBudgets();
  }, [user]);

  const BudgetCard = ({ budget }) => {
    const handleClick = (e) => {
      navigate(`/budget/${budget.id}`,
        {
          state: {
            budget: budget,
          },
        }
      )
    };

    const { deleteBudget } = useContext(DataContext);

    const handleDelete = async (e) => {
      e.preventDefault();
      const data = await deleteBudget(budget);
      if (data) {
        setSubBudgets(oldSubBudgets => oldSubBudgets.filter(({ id }) => id !== data.id))
      }
    }

    const handleUpdate = async (e) => {
      e.preventDefault();
      setTargetUpdateBudget(budget);
      setDisplayUpdateBudgetModal(true);
    }

    return (
      <>
        <div
          className={styles.budgetCard}
          onClick={handleClick}
        >
          <div
            className={styles.budgetCardButtonContainer}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpdate(e);
              }}
            >
              Update
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(e);
              }}
            >
              Delete
            </button>
          </div>
          <h2>
            {budget.name}
          </h2>
        </div>
      </>
    )
  }

  const [displayAddBudgetModal, setDisplayAddBudgetModal] = useState(false);

  const AddBudgetModal = () => {
    const containerStyle = {};

    if (displayAddBudgetModal === false) containerStyle.display = "none";

    const handleCloseModal = (e) => {
      e.preventDefault();
      clearInputs();
      setDisplayAddBudgetModal(false);
    }

    const [name, setName] = useState("");

    const handleChangeInput = (value, setter) => {
      setter(value);
    }

    const clearInputs = () => {
      setName("");
    }

    const { addBudget } = useContext(DataContext);

    const handleAddBudget = async (e) => {
      e.preventDefault();
      if (name === "") {
        console.error("Cannot add new blank budget with no name");
        return;
      }
      const newBudget = {
        name: name,
      }
      const data = await addBudget(user, newBudget, budget);
      if (data) {
        setSubBudgets(oldSubBudgets => [
          ...oldSubBudgets,
          data
        ]);
        handleCloseModal(e);
      }
    }

    return (
      <>
        <div
          className={styles.addBudgetModalContainer}
          style={containerStyle}
          onClick={handleCloseModal}
        >
          <div
            className={styles.addBudgetModal}
            onClick={(e) => e.stopPropagation()}
          >
            <form
              className={styles.addBudgetForm}
              onSubmit={handleAddBudget}
            >
              <p
                className={styles.addBudgetName}
              >
                <label
                  htmlFor="budgetName"
                >
                  Name of your budget:
                </label>
                <input
                  type="text"
                  id="budgetName"
                  name="budgetName"
                  placeholder="Your budget name"
                  onChange={(e) => handleChangeInput(e.target.value, setName)}
                >
                </input>
              </p>
              <p
                className={styles.addBudgetSubmit}
              >
                <button
                  type="button"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                >
                  Add Budget
                </button>
              </p>
            </form>
          </div>
        </div>
      </>
    )
  }

  const [displayUpdateBudgetModal, setDisplayUpdateBudgetModal] = useState(false);
  const [targetupdateBudget, setTargetUpdateBudget] = useState(null);

  const UpdateBudgetModal = () => {
    const containerStyle = {};

    if (displayUpdateBudgetModal === false) containerStyle.display = "none";

    const handleCloseModal = (e) => {
      e.preventDefault();
      clearInputs();
      setDisplayUpdateBudgetModal(false);
    }

    const [name, setName] = useState("");

    const handleChangeInput = (value, setter) => {
      setter(value);
    }

    const clearInputs = () => {
      setName("");
      setTargetUpdateBudget(null);
    }

    const { updateBudget } = useContext(DataContext);

    const handleUpdateBudget = async (e) => {
      e.preventDefault();
      if (name === "") {
        console.error('Cannot update to blank name!');
      } else {
        const newBudget = {
          name: name,
        }
        const data = await updateBudget(targetupdateBudget, newBudget);
        if (data) {
          setSubBudgets(oldSubBudgets => oldSubBudgets.map((budget) => {
            if (budget.id === data.id) {
              return data;
            } else {
              return budget;
            }
          }))
          handleCloseModal(e);
        }
      }
    }



    return (
      <>
        <div
          className={styles.updateBudgetModalContainer}
          style={containerStyle}
          onClick={handleCloseModal}
        >
          <div
            className={styles.updateBudgetModal}
            onClick={(e) => e.stopPropagation()}
          >
            <form
              className={styles.updateBudgetForm}
              onSubmit={handleUpdateBudget}
            >
              <p
                className={styles.updateBudgetName}
              >
                <label
                  htmlFor="budgetName"
                >
                  Name of your budget:
                </label>
                <input
                  type="text"
                  id="budgetName"
                  name="budgetName"
                  placeholder="Your budget name"
                  onChange={(e) => handleChangeInput(e.target.value, setName)}
                >
                </input>
              </p>
              <p
                className={styles.updateBudgetSubmit}
              >
                <button
                  type="button"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                >
                  Update Budget
                </button>
              </p>
            </form>
          </div>
        </div>
      </>
    )
  }

  const handleAddBudget = (e) => {
    e.preventDefault();
    setDisplayAddBudgetModal(true);
  }

  const TransactionHistory = () => {
    const { getAllTransactions } = useContext(DataContext);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
      if (!user || !budget) return;

      const loadAllTransactions = async () => {
        const data = await getAllTransactions(user, budget);
        setTransactions(data);
      }

      loadAllTransactions();
    }, [user]);


    const TransactionCard = ({ transaction }) => {
      const { deleteTransaction } = useContext(DataContext);

      const handleDeleteTransaction = async (e) => {
        e.preventDefault();
        const data = await deleteTransaction(transaction);
        if (data) {
          setTransactions(transactions => transactions.filter(transaction => transaction.id !== data.id));
        }
      }

      const handleUpdateTransaction = (e) => {
        e.preventDefault();
        setDisplayUpdateTransactionModal(true);
        setTargetUpdatingTransaction(transaction);
      }

      return (
        <>
          <div
            className={styles.transactionCard}
          >
            <div
              className={styles.transactionCardInfoContainer}
            >
              <span>{transaction.purpose}</span>
              <span>{transaction.value}</span>
            </div>
            <div
              className={styles.transactionCardButtonContainer}
            >
              <button
                onClick={handleUpdateTransaction}
              >
                Update
              </button>
              <button
                onClick={handleDeleteTransaction}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )
    }

    const [displayAddTransactionModal, setDisplayAddTransactionModal] = useState(false);

    const AddTransactionModal = () => {
      const { user } = useContext(AuthContext);
      const { addTransaction } = useContext(DataContext);

      const [purpose, setPurpose] = useState("");
      const [value, setValue] = useState(0);

      const handleCloseModal = (e) => {
        setDisplayAddTransactionModal(false);
      }

      const handleChangeInput = (value, setter) => {
        setter(value);
      }

      const clearInput = () => {
        setValue(0);
        setPurpose("");
      }

      const handleAddTransaction = async (e) => {
        e.preventDefault();
        if (!value) {
          console.error('Cannot add transaction with value as 0!')
        } else {
          const newTransactionInput = {
            purpose: purpose,
            value: value,
          }
          const newTransaction = await addTransaction(user, newTransactionInput, budget);

          if (newTransaction) setTransactions(transactions => [
            newTransaction,
            ...transactions
          ]);
          clearInput();
          handleCloseModal(e);
        }
      }

      const ContainerStyles = {
      };

      if (displayAddTransactionModal === false) ContainerStyles.display = 'none';

      return (
        <>
          <div
            className={styles.addTransactionModalContainer}
            onClick={handleCloseModal}
            style={ContainerStyles}
          >
            <div
              className={styles.addTransactionModal}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>
                Add Transaction
              </h2>
              <form
                className={styles.addTransactionForm}
                onSubmit={handleAddTransaction}
              >
                <p>
                  <label
                    htmlFor="transactionPurpose"
                  >
                    Purpose
                  </label>
                  <input
                    type="text"
                    name="transactionPurpose"
                    id="transactionPurpose"
                    value={purpose}
                    onChange={(e) => handleChangeInput(e.target.value, setPurpose)}
                  ></input>
                </p>
                <p
                  className={styles.addTransactionValueField}
                >
                  <label
                    htmlFor="transactionValue"
                  >
                    Value
                  </label>
                  <input
                    type="number"
                    name="transactionValue"
                    id="transactionValue"
                    value={value}
                    onChange={(e) => handleChangeInput(e.target.value, setValue)}
                  >
                  </input>
                </p>
                <p
                  className={styles.addTransactionFormButtonRow}
                >
                  <button
                    type="button"
                    className={styles.addTransactionCancelButton}
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.addTransactionSubmitButton}
                    type="submit"
                  >
                    Add Transaction
                  </button>
                </p>
              </form>
            </div>
          </div>
        </>
      )
    }

    const handleAddTransactionButtonClicked = (e) => {
      e.preventDefault();
      setDisplayAddTransactionModal(true);
    }

    const [targetUpdatingTransaction, setTargetUpdatingTransaction] = useState(null);
    const [displayUpdateTransactionModal, setDisplayUpdateTransactionModal] = useState(false);

    const UpdateTransactionModal = () => {
      const { updateTransaction } = useContext(DataContext);

      const [purpose, setPurpose] = useState("");
      const [value, setValue] = useState(0);

      useEffect(() => {
        if (targetUpdatingTransaction !== null) {
          setPurpose(targetUpdatingTransaction.purpose);
          setValue(targetUpdatingTransaction.value);
        }
      }, [targetUpdatingTransaction]);

      const handleCloseModal = () => {
        setDisplayUpdateTransactionModal(false);
        setTargetUpdatingTransaction(null);
      }

      const handleChangeInput = (value, setter) => {
        setter(value);
      }

      const handleUpdateTransaction = async (e) => {
        e.preventDefault();
        const transactionInput = {
          purpose: purpose,
          value: value,
        }
        const newTransaction = await updateTransaction(targetUpdatingTransaction, transactionInput);
        if (newTransaction) {
          setTransactions(transactions => transactions.map(
            transaction => {
              if (transaction.id === targetUpdatingTransaction.id) {
                return newTransaction;
              }
              return transaction;
            }
          ))
        }
        handleCloseModal();
      }

      const containerStyles = {};

      if (displayUpdateTransactionModal === false) containerStyles.display = 'none';

      return (
        <>
          <div
            className={styles.updateTransactionModalContainer}
            style={containerStyles}
            onClick={handleCloseModal}
          >
            <div
              className={styles.updateTransactionModal}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>
                Update Transaction
              </h2>
              <form
                className={styles.updateTransactionForm}
                onSubmit={handleUpdateTransaction}
              >
                <p>
                  <label
                    htmlFor="transactionPurpose"
                  >
                    Purpose
                  </label>
                  <input
                    type="text"
                    name="transactionPurpose"
                    id="transactionPurpose"
                    value={purpose}
                    onChange={(e) => handleChangeInput(e.target.value, setPurpose)}
                  ></input>
                </p>
                <p
                  className={styles.updateTransactionValueField}
                >
                  <label
                    htmlFor="transactionValue"
                  >
                    Value
                  </label>
                  <input
                    type="number"
                    name="transactionValue"
                    id="transactionValue"
                    value={value}
                    onChange={(e) => handleChangeInput(e.target.value, setValue)}
                  >
                  </input>
                </p>
                <p
                  className={styles.updateTransactionFormButtonRow}
                >
                  <button
                    type="button"
                    className={styles.updateTransactionCancelButton}
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.updateTransactionSubmitButton}
                    type="submit"
                  >
                    Update Transaction
                  </button>
                </p>
              </form>
            </div>
          </div>
        </>
      )
    }

    return (
      <>
        <h2>
        </h2>
        <div
          className={styles.transactionHistoryContainer}
        >
          <div>
            <button
              className={styles.addTransactionButton}
              onClick={handleAddTransactionButtonClicked}
            >
              + Add Transaction
            </button>
          </div>
          {
            transactions.length === 0 ?
              <p>You have no transactions</p> :
              transactions.map(transaction => {
                return (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                  ></TransactionCard>
                )
              })
          }
        </div>
        <AddTransactionModal></AddTransactionModal>
        <UpdateTransactionModal></UpdateTransactionModal>
      </>
    )
  }

  return (
    <>
      <header
        className={styles.header}
      >
        <h1>
          {budget.name}
        </h1>
      </header>
      <main
        className={styles.main}
      >
        <TransactionHistory></TransactionHistory>
        <h2>
          SubBudgetss
        </h2>
        <div
          className={styles.subbudgetsContainer}
        >
          <button
            className={`${styles.budgetCard} ${styles.addBudgetButton}`}
            onClick={handleAddBudget}
          >
            +
          </button>
          {subBudgets.map(subBudget => {
            return (
              <BudgetCard
                key={subBudget.id}
                budget={subBudget}
              >
              </BudgetCard>
            )
          })}
        </div>
      </main>
      <AddBudgetModal></AddBudgetModal>
      <UpdateBudgetModal></UpdateBudgetModal>
    </>
  )
}

export default BudgetPage;
