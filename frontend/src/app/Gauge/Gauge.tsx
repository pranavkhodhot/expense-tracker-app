"use client";

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { ChartData, ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

interface ChartProps {
  budgets: {
    budget_id: number;
    category_name: string;
    amount: number;
    amount_spent: number;
  }[];
}

const Gauge = ({ budgets }: ChartProps) => {
  const totalSpent = budgets.reduce((sum, b) => sum + b.amount_spent, 0);
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const spentPercent = Math.min((totalSpent / totalBudget) * 100, 100);

  const data: ChartData<"doughnut"> = {
    labels: ["Spent", "Remaining"],
    datasets: [
      {
        data: [totalSpent, Math.max(totalBudget - totalSpent, 0)],
        backgroundColor: ["#22c55e", "#d1d5db"], // Tailwind green-500 / gray-300
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    cutout: "80%",


  };

  return (
    <div className="relative w-full mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-3 text-center">
        Total Spending Overview
      </h2>
      <div className="relative flex justify-center items-center">
        {/* Doughnut chart */}
        <div className="">
          <Doughnut data={data} options={options} />
        </div>

        {/* Center text */}
        <div className="absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-[10%] text-center">
          <p className="text-sm text-gray-500">Spent</p>
          <p className="text-2xl font-bold text-gray-800">
            ${totalSpent.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400 mt-1">{spentPercent.toFixed(0)}% of total</p>
        </div>
      </div>

      {/* Subtext summary */}
      <div className="text-center mt-4">
        <p className="text-gray-600 text-sm">
          Budget Limit:{" "}
          <span className="font-semibold text-gray-800">
            ${totalBudget.toFixed(2)}
          </span>
        </p>
        <p
          className={`text-sm font-semibold mt-1 ${
            totalSpent > totalBudget ? "text-red-600" : "text-green-600"
          }`}
        >
          {totalSpent > totalBudget
            ? `Over budget by $${(totalSpent - totalBudget).toFixed(2)}`
            : `$${(totalBudget - totalSpent).toFixed(2)} remaining`}
        </p>
      </div>
    </div>
  );
};

export default Gauge;
