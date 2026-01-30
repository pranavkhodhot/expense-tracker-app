"use client";
import React, { useState, FormEvent } from "react";
import Modal from "../Modal/Modal";

interface Transaction {
  transaction_id: number;
  transaction_name: string;
  category_name: string;
  amount: number;
  transaction_date: string;
}

interface CategoryData {
  category_name: string;
  category_id: number;
}

interface TransactionRowProps {
  transaction: Transaction;
  categories: CategoryData[];
  update: () => Promise<void>;
}

const categoryColors: Record<string, string> = {
  Food: "bg-green-100 text-green-800",
  Shopping: "bg-blue-100 text-blue-800",
  Transportation: "bg-yellow-100 text-yellow-800",
  Entertainment: "bg-purple-100 text-purple-800",
  Utilities: "bg-red-100 text-red-800",
  Other: "bg-gray-100 text-gray-800",
};

const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
  categories,
  update,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const categoryClass =
    categoryColors[transaction.category_name] || categoryColors["Other"];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const currentDay = new Date();

  const year = currentDay.getFullYear();
  const month = String(currentDay.getMonth() + 1).padStart(2, "0");
  const day = String(currentDay.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  const editTransaction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const transactionValues = {
      transaction_name: formData.get("new-transaction-name"),
      transaction_category: formData.get("new-transaction-category"),
      amount: formData.get("new-transaction-amount"),
      transaction_date: formData.get("new-transaction-date"),
    };
    console.log(transactionValues);
    console.log(transaction.transaction_id)
    try {
      const response = await fetch(
        `http://localhost:8000/transactions/${transaction.transaction_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(transactionValues),
        }
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
    await update();
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (
      confirm(
        `Are you sure you want to delete your ${transaction.transaction_name} Transaction`
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:8000/transactions/${transaction.transaction_id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        console.log(response);
      } catch (error) {
        console.error(error);
      }
      await update();
      setIsModalOpen(false);
    }
  };

  return (
    <>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Edit Transaction
          </h2>
          <form onSubmit={editTransaction}>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Transaction Name
            </label>
            <input
              type="text"
              name="new-transaction-name"
              id="new-transaction-name"
              defaultValue={transaction.transaction_name}
              className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            />

            <label className="block mb-1 text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="new-transaction-category"
              id="new-transaction-category"
              defaultValue={transaction.category_name}
              className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            >
              {categories.map((cat) => (
                <option key={cat.category_id}>{cat.category_name}</option>
              ))}
            </select>

            <label className="block mb-1 text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              name="new-transaction-amount"
              id="new-transaction-amount"
              defaultValue={transaction.amount}
              className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            />
            <label>
              Transaction Date <span className="required">*</span>
            </label>
            <br />
            <input
              type="date"
              name="new-transaction-date"
              id="new-transaction-date"
              className="px-4 py-2 border border-gray-300 rounded-md my-2"
              max={formattedDate}
              defaultValue={transaction.transaction_date}
            />
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
      )}

      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-150">
        <td className="py-3 px-6 font-medium text-gray-800">
          {transaction.transaction_name}
        </td>
        <td className="py-3 px-6">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${categoryClass}`}
          >
            {transaction.category_name}
          </span>
        </td>
        <td className="py-3 px-6 font-semibold text-gray-700">
          ${transaction.amount.toFixed(2)}
        </td>
        <td className="py-3 px-6 text-gray-500">
          {new Date(transaction.transaction_date).toLocaleDateString()}
        </td>
        <td className="py-3 pl-6">
          <button
            onClick={openModal}
            className="flex cursor-pointer items-center justify-center bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg px-3 py-2 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-150"
          >
            <img src="/Edit.svg" alt="Edit" width={18} height={18} />
          </button>
        </td>
      </tr>
    </>
  );
};

export default TransactionRow;
