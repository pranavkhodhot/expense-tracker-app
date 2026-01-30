import { skip } from "node:test";
import { useState, FormEvent } from "react";
import Modal from "../Modal/Modal";

interface BudgetProps {
  id: number;
  category: string;
  amount: number;
  amount_spent: number;
  update: () => Promise<void>;
}

const BudgetCard = ({ id, category, amount, amount_spent, update }: BudgetProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const percentSpent = Math.min((amount_spent / amount) * 100, 100);
  const remaining = amount - amount_spent;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const getProgressColor = () => {
    if (percentSpent < 60) return "text-green-500";
    if (percentSpent < 90) return "text-yellow-500";
    return "text-red-500";
  };

  const editBudget = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      console.log("first")
      const formData = new FormData(event.currentTarget);
      const budgetValues = {
        amount: formData.get("new-budget-amount"),
      };
      console.log(budgetValues);
      try {
        const response = await fetch(`http://localhost:8000/budgets/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(budgetValues),
        });
        console.log(response);
      } catch (error) {
        console.error(error);
      }
      await update();
      setIsModalOpen(false);
    };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete your ${category} Budget`)){
      try {
        const response = await fetch(`http://localhost:8000/budgets/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        console.log(response);
      } catch (error) {
        console.error(error);
      }
      await update();
      setIsModalOpen(false);
    };
  }

  return (
    <>
      <div className="flex justify-between items-center bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6 w-full max-w-2xl mx-auto relative">
        <div className="flex flex-col justify-between">
          <div className="flex">
            <img src={`${category}.svg`} alt={category} className="w-10"/>
          <h2 className="text-xl font-semibold text-gray-800 my-2 ps-2 flex items-center gap-2">
            {category}
          </h2>
          </div>
          
          <div className="mb-3">
            <p className="text-sm text-gray-500">Spent</p>
            <h3 className="text-lg font-bold text-gray-800">
              ${amount_spent.toFixed(2)}{" "}
              <span className="text-sm text-gray-400">/ ${amount}</span>
            </h3>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                percentSpent < 60
                  ? "bg-green-500"
                  : percentSpent < 90
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${percentSpent}%` }}
            ></div>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            {remaining >= 0
              ? `${percentSpent.toFixed(0)}% used — $${remaining.toFixed(
                  2
                )} remaining`
              : `Over budget by $${Math.abs(remaining).toFixed(2)}`}
          </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg
              className="w-full h-full -rotate-90"
              viewBox="0 0 36 36"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-current text-gray-200"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className={`stroke-current ${getProgressColor()}`}
                strokeWidth="3"
                strokeDasharray="100"
                strokeDashoffset={100 - percentSpent}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-xs text-gray-400">Used</p>
              <p className="text-base font-semibold text-gray-800">
                {percentSpent.toFixed(0)}%
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Edit
          </button>
        </div>
      </div>
      <Modal onClose={closeModal} isOpen={isModalOpen}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Edit Budget — {category}
        </h3>

        <form onSubmit={editBudget} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Budget Amount
            </label>
            <input
              type="number"
              id="new-budget-amount"
              name="new-budget-amount"
              defaultValue={amount}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Delete
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default BudgetCard;
