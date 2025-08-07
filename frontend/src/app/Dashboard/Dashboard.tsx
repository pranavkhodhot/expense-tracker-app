'use client';
import React from 'react';

const Dashboard = () => {
  return (
    <div className="flex-1 sm:ml-64 p-6 bg-gray-100 min-h-screen transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Total Expenses</h1>
        <button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300 ease-in-out">
          Add Expense
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Expenses Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Expenses</h2>
          <p className="text-2xl font-bold text-gray-900">$2,300.00</p>
        </div>

        {/* Pie Chart Placeholder */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Expenses by Category</h2>
          <div className="h-40 flex items-center justify-center text-gray-400">
            (Pie Chart Placeholder)
          </div>
        </div>

        {/* Line Chart Placeholder */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Expenses Over Time</h2>
          <div className="h-40 flex items-center justify-center text-gray-400">
            (Line Chart Placeholder)
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Category</th>
                <th className="py-3 px-6 text-left">Amount</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6">04/15/2024</td>
                <td className="py-3 px-6">Food</td>
                <td className="py-3 px-6">$50.00</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6">04/13/2024</td>
                <td className="py-3 px-6">Transportation</td>
                <td className="py-3 px-6">$25.00</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6">04/10/2024</td>
                <td className="py-3 px-6">Food</td>
                <td className="py-3 px-6">$100.00</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6">04/05/2024</td>
                <td className="py-3 px-6">Entertainment</td>
                <td className="py-3 px-6">$60.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
