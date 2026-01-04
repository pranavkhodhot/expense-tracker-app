"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  transactions: {
    transaction_id: number;
    transaction_name: string;
    amount: number;
    transaction_date: Date | string;
    category_name: string;
  }[];
}

const Linechart = ({ transactions }: ChartProps) => {
  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
  };

  transactions.sort((transactionA, transactionB) => {
    const dateA = new Date(transactionA.transaction_date).getTime();
    const dateB = new Date(transactionB.transaction_date).getTime();
    return dateA - dateB;
  });

  const labels = transactions.map((transaction) => transaction.transaction_date);
  const points = transactions.map((transaction) => transaction.amount);

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: points,
        borderColor: "#01c621",
        backgroundColor: "#348053",
      },
    ],
  };
  return <Line options={options} data={data} />;
};

export default Linechart;
