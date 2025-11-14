"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";

interface UserData {
  user: {
    name: string;
    email: string;
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

const DashboardPage = () => {
  const [data, setData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const cachedUser = localStorage.getItem("user");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (cachedUser) {
      setData(JSON.parse(cachedUser));
      return;
    }

    fetch("http://localhost:8000/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load user data");
        return res.json();
      })
      .then((data) => {
        setData(data);
        localStorage.setItem("user", JSON.stringify(data));
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p>Loading dashboard...</p>;

  const totalExpenses = data.transactions.reduce((acc, t) => acc + t.amount, 0);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include", // send cookies
      });

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login"; 
    } catch (err) {
      console.error("Logout failed:", err);
    }
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
            <button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300 ease-in-out">
              Add Expense
            </button>
            <button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300 ease-in-out" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>

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
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Category</th>
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Amount</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {data.transactions.map((t) => (
                  <tr
                    key={t.transaction_id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-6">{t.transaction_date}</td>
                    <td className="py-3 px-6">{t.category_name}</td>
                    <td className="py-3 px-6">{t.transaction_name}</td>
                    <td className="py-3 px-6 font-semibold">${t.amount}</td>
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
