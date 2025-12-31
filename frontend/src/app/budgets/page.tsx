"use client";

import React, { use, useEffect, useState, FormEvent } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Modal from "../Modal/Modal";
import BudgetCard from "../BudgetCard/BudgetCard";
import Linechart from "../Linechart/Linechart";


interface UserData {
  user: {
    name: string;
    email: string;
    user_id: number;
  };
  budgets: {
    budget_id: number;
    category_name: string;
    amount: number;
    amount_spent: number;
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

const BudgetPage = () => {
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

  const addBudget = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const budgetValues = {
      user_id: data.user.user_id,
      category_id: categories?.find(
        (object) =>
          object.category_name === formData.get("budget-category")
      )?.category_id,
      amount: formData.get("budget-amount"),
    };
    console.log(budgetValues);
    try {
      const response = await fetch("http://localhost:8000/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budgetValues),
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
    await fetchUserData();
    setIsModalOpen(false);
  };

  const budgetCategories = new Set<String>();
  if (data.budgets){
    for(let i=0;i<data.budgets.length;i++){
      budgetCategories.add(data.budgets[i].category_name)
    }
  }
  console.log(budgetCategories)
  const filteredCategories = categories?.filter((category) => !budgetCategories.has(category.category_name))
  console.log(filteredCategories)

  
  return (
    <>
      <Sidebar />
      <div className="flex-1 sm:ml-64 p-6 bg-gray-100 min-h-screen transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Budgets</h1>
          <div className="flex gap-5">
            <button
              onClick={openModal}
              className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300 ease-in-out cursor-pointer"
            >
              Add Budget
            </button>
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Add Budget
          </h2>
          <form onSubmit={addBudget}>
            <label htmlFor="">
              Budget Category <span className="required">*</span>
            </label>
            <br />
            <select
              name="budget-category"
              id="budget-category"
              className="w-full px-2 py-2 my-2 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              defaultValue="Select your option"
              required
            >
              <option value="Select your option" disabled>
                Select your option
              </option>
              {filteredCategories?.map((category) => (
                
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
              Budget Amount <span className="required">*</span>
            </label>
            <br />
            <input
              type="number"
              name="budget-amount"
              id="budget-amount"
              min="0"
              step=".01"
              className="w-full px-4 py-2 my-2 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <div className="justify-self-center my-2">
              <button className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300 ease-in-out cursor-pointer justify-center">
                Add Budget
              </button>
            </div>
          </form>
        </Modal>
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Comparison Chart
            </h2>
            <Linechart budgets={data.budgets}/>
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
              Active Budgets
            </h2>
            <p className="text-2xl font-bold text-gray-900">
              {data.budgets.length}
            </p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Current Budgets
          </h2>
          <div className="overflow-x-auto grid grid-cols-4 md:grid-cols-3 sm:grid gap-4">
            {data.budgets.map((b) => (
              <div className="" key={b.category_name}>
                <BudgetCard id={b.budget_id} category={b.category_name} amount={b.amount} amount_spent={b.amount_spent} update={fetchUserData}></BudgetCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BudgetPage;
