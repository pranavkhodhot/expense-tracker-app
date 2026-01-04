import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartProps {
  budgets: {
    budget_id: number;
    category_name: string;
    amount: number;
    amount_spent: number;
  }[];
}

const Piechart = ({ budgets }: ChartProps) => {
  const categoryNames = budgets.map((budget) => budget.category_name);
  const values = budgets.map((budget) => budget.amount_spent);
  console.log(categoryNames);
  console.log(values);

  const data = {
    labels: categoryNames,
    datasets: [
      {
        label: "Amount Spent this Month",
        data: values,
        backgroundColor: [
  "#004700", // Deep Forest
  "#39FF14", // Neon Mint
  "#50C878", // Classic Emerald
  "#4A5D23", // Dark Sage/Olive
  "#AFE1AF", // Pale Celadon
  "#008080", // Vibrant Teal
  "#76BA1B"  // Electric Lime
],
        borderColor: [
          "#FFFFFF", // Use white borders for clear separation
          "#FFFFFF",
          "#FFFFFF",
          "#FFFFFF",
          "#FFFFFF",
          "#FFFFFF",
          "#FFFFFF",
        ],
        borderWidth: 1,
      },
    ],
  };
  return <Pie data={data} />;
};

export default Piechart;
