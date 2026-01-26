import { useState, useEffect, useContext } from 'react'
import { DataContext } from '../../supabase/database/useDatabase'
import { AuthContext } from '../../supabase/auth/useAuth'
import styles from "./Dashboard.module.css"
import { useNavigate } from 'react-router-dom'


const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const BudgetsContainer = () => {
    const [budgets, setBudgets] = useState([]);
    const { getBudgets } = useContext(DataContext);

    useEffect(() => {
      if (!user) return;

      const loadBudgets = async () => {
        const budgets = await getBudgets(user);
        if (budgets) {
          setBudgets(budgets);
        }
      }

      loadBudgets();
    }, [user]);

    const BudgetCard = ({ budget }) => {
      const navigate = useNavigate();

      const handleCardClicked = (e) => {
        navigate(`/budget/${budget.id}`, {
          state: {
            budget: budget,
          }
        })
      }

      return (
        <>
          <div
            className={styles.budgetCard}
            onClick={handleCardClicked}
          >
            <h3>
              {budget.name}
            </h3>
          </div>
        </>
      )
    }

    const AddBudgetButton = () => {
      return (
        <>
          <div
            onClick={(e) => handleOpenModal(e, setDisplayAddBudgetModal)}
            className={`${styles.budgetCard} ${styles.AddBudgetButton}`}
          >
            <h3>+</h3>
          </div>
        </>
      )
    }

    const [displayAddBudgetModal, setDisplayAddBudgetModal] = useState(false);

    const handleCloseModal = (e, setModalDisplay) => {
      e.preventDefault();
      setModalDisplay(false);
    }

    const handleOpenModal = (e, setModalDisplay) => {
      e.preventDefault();
      setModalDisplay(true);
    }

    const handleChangeInput = (setter, value) => {
      setter(value);
    }

    const AddBudgetModal = () => {
      const { addBudget } = useContext(DataContext);

      const handleAddBudget = async (e) => {
        e.preventDefault();


        if (name === "") {
          console.error("Cannot add budget with blank name");
          return;
        }

        const newBudget = {
          name: name,
        };

        const data = await addBudget(user, newBudget);

        if (data) {
          setBudgets(prevBudgets => [
            ...prevBudgets,
            newBudget,
          ]);
          handleCloseModal(e, setDisplayAddBudgetModal);
        }
      }

      const [name, setName] = useState("");

      return (
        <>
          <article
            className={styles.modalContainer}
            onClick={(e) => handleCloseModal(e, setDisplayAddBudgetModal)}
          >
            <div
              className={`${styles.modal} ${styles.addBudgetModal}`}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>
                Add Budget
              </h2>
              <form
                className={styles.modalForm}
                onSubmit={handleAddBudget}
              >
                <p
                  className={styles.budgetNameSection}
                >
                  <label
                    htmlFor="budgetName"
                  >
                    Name:
                  </label>
                  <input
                    type="text"
                    id="budgetName"
                    name="budgetName"
                    placeholder="Food & Drinks, Shopping etc."
                    value={name}
                    onChange={(e) => handleChangeInput(setName, e.target.value)}
                  ></input>
                </p>
                <div
                  className={styles.modalButtonContainer}
                >
                  <button
                    type="button"
                    onClick={(e) => handleCloseModal(e, setDisplayAddBudgetModal)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                  >
                    Add Budget
                  </button>
                </div>
              </form>
            </div>
          </article>
        </>
      )
    }

    return (
      <div
        className={styles.budgetsContainer}
      >
        <h2>
          Budgets
        </h2>
        <div
          className={styles.budgetsGrid}
        >
          <AddBudgetButton>
          </AddBudgetButton>
          {
            budgets.map(budget =>
              <BudgetCard
                key={budget.id}
                budget={budget}
              >
              </BudgetCard>
            )
          }
          {
            displayAddBudgetModal &&
            <AddBudgetModal>
            </AddBudgetModal>
          }
        </div>
      </div>
    )
  }

  const TransactionHistory = () => {
    const { getTransactions } = useContext(DataContext);

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
      if (!user) return;

      const loadTransactions = async () => {
        const data = await getTransactions(user);
        if (data) {
          setTransactions(data);
        }
      }

      loadTransactions();
    }, [user])

    const TransactionCard = ({ transaction }) => {
      return (
        <>
          <div
            className={styles.transactionCard}
          >
            <span>{transaction.purpose}</span>
            <span>{transaction.value}</span>
          </div>
        </>
      )
    }

    return (
      <>
        <div
          className={styles.transactionHistory}
        >
          <h2>
            Transactions
          </h2>
          <div
            className={styles.transactionTable}
          >
            {
              transactions.map(transaction =>
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                >
                </TransactionCard>
              )
            }
          </div>
        </div>
      </>
    )
  }

  const Stats = () => {
    const [transactions, setTransactions] = useState([]);
    const { getAllTransactionsFromBudget } = useContext(DataContext);

    useEffect(() => {
      if (!user) return;

      const loadTransactions = async () => {
        const data = await getAllTransactionsFromBudget();
        if (data) {
          setTransactions(data);
        }
        else return;
      }

      loadTransactions();
    }, [user]);

    const [balance, setBalance] = useState(0);
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);

    return (
      <>
        <div
          className={styles.stats}
        >
          <h2>
            Stats
          </h2>
          <div
            className={styles.balanceStat}
          >
            <h3>
              Balance
            </h3>
            <span>
              {balance}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              gap: '.5rem'
            }}
          >
            <div
              className={styles.incomeStat}
            >
              <h3>
                Income
              </h3>
              <span>
                {income}
              </span>
            </div>
            <div
              className={styles.expenseStat}
            >
              <h3>
                Expense
              </h3>
              <span>
                {expense}
              </span>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <header
        className={styles.header}
      >
        <h1>
          Dashboard
        </h1>
      </header>
      <main
        className={styles.main}
      >
        <div
          style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: '2fr 1fr',
            overflowY: 'hidden',
          }}
        >
          <TransactionHistory></TransactionHistory>
          <Stats></Stats>
        </div>
        <BudgetsContainer></BudgetsContainer>
      </main >
    </>
  )
}

export default Dashboard;
