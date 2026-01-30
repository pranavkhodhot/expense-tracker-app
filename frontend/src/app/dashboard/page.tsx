"use client";

import React, { use, useEffect, useState, FormEvent } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Modal from "../Modal/Modal";

interface UserData {
  user: {
    name: string;
    email: string;
    user_id: number;
  };
  budgets: {
    category_name: string;
    amount: number;
  }[];
  transactions: {
    transaction_id: number;
    transaction_name: string;
    amount: number;
    transaction_date: string;
    category_name: string;
  }[];
}

interface CategoryData {
  category_name: string;
  category_id: number;
}

const DashboardPage = () => {
  const [data, setData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryData[] | null>(null);

  const currentDay = new Date();

  const year = currentDay.getFullYear();
  const month = String(currentDay.getMonth() + 1).padStart(2, "0");
  const day = String(currentDay.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8000/categories");
        if (!res.ok) throw new Error("Failed to load categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/users/me", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load user data");
        const userData = await res.json();
        setData(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchCategories();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch("http://localhost:8000/users/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch user data");
      const userData = await res.json();
      setData(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p>Loading dashboard...</p>;
  console.log(data);
  const totalExpenses = data.transactions.reduce((acc, t) => acc + t.amount, 0);

  const addTransaction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const transactionValues = {
      category_id: categories?.find(
        (object) =>
          object.category_name === formData.get("transaction-category")
      )?.category_id,
      transaction_name: formData.get("transaction-name"),
      amount: formData.get("transaction-amount"),
      transaction_date: formData.get("transaction-date"),
      notes: formData.get("transaction-notes"),
    };
    console.log(transactionValues);
    try {
      const response = await fetch("http://localhost:8000/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(transactionValues),       
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
    await fetchUserData();
    setIsModalOpen(false);
  };

  return (
  <>
    <Sidebar />

    {/* Main Container */}
    <div className="flex-1 sm:ml-64 p-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen transition-all duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Welcome back,{" "}
            <span className="text-green-700">
              {data.user.name.split(" ")[0]} 👋
            </span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Here’s an overview of your spending and budgets.
          </p>
        </div>

        <button
          onClick={openModal}
          className="mt-5 sm:mt-0 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-transform transform hover:scale-[1.03] focus:ring-4 focus:ring-green-300"
        >
          + Add Transaction
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Total Expenses
          </h2>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">
            ${totalExpenses.toFixed(2)}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Active Budgets
          </h2>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">
            {data.budgets.length}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-all">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Categories Used
          </h2>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">
            {[...new Set(data.transactions.map((t) => t.category_name))].length}
          </p>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Recent Transactions</h2>
          <p className="text-sm text-gray-500">
            {data.transactions.length} total
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-600 text-sm uppercase">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.map((t) => (
                <tr
                  key={t.transaction_id}
                  className="border-b hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="py-3 px-4 font-medium text-gray-700">
                    {t.transaction_name}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                      {t.category_name}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    ${t.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {new Date(t.transaction_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={openModal}
                      className="bg-green-600 flex items-center justify-center hover:bg-green-600 rounded-lg px-3 py-2 transition-all"
                    >
                      <img src="/Delete.svg" alt="Delete" width={18} height={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Add New Transaction
        </h2>
        <form onSubmit={addTransaction} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Transaction Name
            </label>
            <input
              type="text"
              name="transaction-name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="e.g., Starbucks Coffee"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Amount
              </label>
              <input
                type="number"
                name="transaction-amount"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="e.g., 12.50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Date
              </label>
              <input
                type="date"
                name="transaction-date"
                max={formattedDate}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category
            </label>
            <select
              name="transaction-category"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            >
              <option value="" disabled selected>
                Select category
              </option>
              {categories?.map((c) => (
                <option key={c.category_id} value={c.category_name}>
                  {c.category_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Notes
            </label>
            <textarea
              name="transaction-notes"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Optional notes..."
            />
          </div>
        </form>
      </Modal>
    </div>
  </>
);
}


export default DashboardPage;
