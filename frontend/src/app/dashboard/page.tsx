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
      user_id: data.user.user_id,
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
      <div className="flex-1 sm:ml-64 p-6 bg-gray-100 min-h-screen transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {data.user.name.split(" ")[0]} 👋
          </h1>
          <div className="flex gap-5">
            <button
              onClick={openModal}
              className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300 ease-in-out cursor-pointer"
            >
              Add Transaction
            </button>
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Add Transaction
          </h2>
          <form onSubmit={addTransaction}>
            <label htmlFor="">
              Transaction Name <span className="required">*</span>
            </label>
            <br />
            <input
              type="text"
              name="transaction-name"
              id="transaction-name"
              className="w-full px-4 py-2 my-2 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <br />
            <label htmlFor="">
              Transaction Category <span className="required">*</span>
            </label>
            <br />
            <select
              name="transaction-category"
              id="transaction-category"
              className="w-full px-2 py-2 my-2 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              defaultValue="Select your option"
              required
            >
              <option value="Select your option" disabled>
                Select your option
              </option>
              {categories?.map((category) => (
                <option
                  key={category.category_id}
                  value={category.category_name}
                >
                  {category.category_name}
                </option>
              ))}
            </select>
            <br />
            <label htmlFor="">
              Transaction Amount <span className="required">*</span>
            </label>
            <br />
            <input
              type="number"
              name="transaction-amount"
              id="transaction-amount"
              min="0"
              step=".01"
              className="w-full px-4 py-2 my-2 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <br />
            <label htmlFor="">
              Transaction Date <span className="required">*</span>
            </label>
            <br />
            <input
              type="date"
              name="transaction-date"
              id="transaction-date"
              className="px-4 py-2 border border-gray-300 rounded-md my-2"
              max={formattedDate}
              required
            />
            <br />
            <label htmlFor="">Transaction Notes</label>
            <br />
            <input
              type="textarea"
              name="transaction-notes"
              id="transaction-notes"
              className="w-full pb-12 px-2 pt-2 my-2 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <br />
            <div className="justify-self-center my-2">
              <button className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300 ease-in-out cursor-pointer justify-center">
                Add Transaction
              </button>
            </div>
          </form>
        </Modal>
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Total Expenses
            </h2>
            <p className="text-2xl font-bold text-gray-900">
              ${totalExpenses.toFixed(2)}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Active Budgets
            </h2>
            <p className="text-2xl font-bold text-gray-900">
              {data.budgets.length}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Recent Categories
            </h2>
            <p className="text-2xl font-bold text-gray-900">
              {
                [...new Set(data.transactions.map((t) => t.category_name))]
                  .length
              }
            </p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Transactions
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Category</th>
                  <th className="py-3 px-6 text-left">Amount</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left"></th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {data.transactions.map((t) => (
                  <tr
                    key={t.transaction_id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-6">{t.transaction_name}</td>
                    <td className="py-3 px-6">{t.category_name}</td>
                    <td className="py-3 px-6 font-semibold">${t.amount}</td>
                    <td className="py-3 px-6">{t.transaction_date}</td>
                    <td className="py-3 pl-6">
                      <button
                        onClick={openModal}
                        className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300 ease-in-out cursor-pointer"
                      >
                        <img
                          src="Delete.svg"
                          alt="Delete"
                          width={20}
                          height={20}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
