// components/MyBarChart.tsx
"use client"; // Use client directive for Next.js App Router

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  budgets: {
    budget_id: number;
    category_name: string;
    amount: number;
    amount_spent: number;
  }[];
}

const Barchart = ({budgets}: ChartProps) => {
  const labels = budgets.map((budget) => budget.category_name)
  console.log(labels)

  const data: ChartData<"bar"> = {
    labels,
    datasets: [
      {
        label: "Amount Spent",
        data: budgets.map((budget) => budget.amount_spent), 
        backgroundColor: "#01c621", 
        borderColor: "rgba(0, 0, 0, 1)",
        borderWidth: 1,
        borderRadius: 5

      },
      {
        label: "Budget Amount",
        data: budgets.map((budget) => budget.amount), 
        backgroundColor: "#348053", 
        borderColor: "rgba(0, 0, 0, 1)",
        borderWidth: 1,
        borderRadius: 5
      }
    ],
    
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const, 
      },
      title: {
        display: true,
        text: "Standard Bar Chart",
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        beginAtZero: true, 
      },
    },
  };

  return <Bar options={options} data={data} />;
};

export default Barchart;
