import React from "react";

type BudgetProps = {
  category: string;
  amount: number;
  amount_spent: number;
};

const BudgetCard = ({ category, amount, amount_spent }: BudgetProps) => {
  const percentSpent = Math.min((amount_spent / amount) * 100, 100);
  const remaining = amount - amount_spent;

  const getProgressColor = () => {
    if (percentSpent < 60) return "text-green-500";
    if (percentSpent < 90) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="flex justify-between items-center bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6 w-full max-w-2xl mx-auto">
      {/* Left side: Info */}
      <div className="flex flex-col justify-between">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{category}</h2>

        <div className="mb-3">
          <p className="text-sm text-gray-500">Spent</p>
          <h3 className="text-lg font-bold text-gray-800">
            ${amount_spent.toFixed(2)}{" "}
            <span className="text-sm text-gray-400">/ ${amount}</span>
          </h3>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              percentSpent < 60
                ? "bg-green-500"
                : percentSpent < 90
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${percentSpent}%` }}
          ></div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          {remaining >= 0
            ? `${percentSpent.toFixed(0)}% used — $${remaining.toFixed(
                2
              )} remaining`
            : `Over budget by $${Math.abs(remaining).toFixed(2)}`}
        </p>
      </div>

      {/* Right side: Circular progress */}
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 36 36"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-current text-gray-200"
            strokeWidth="3"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className={`stroke-current ${getProgressColor()}`}
            strokeWidth="3"
            strokeDasharray="100"
            strokeDashoffset={100 - percentSpent}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-xs text-gray-400">Used</p>
          <p className="text-base font-semibold text-gray-800">
            {percentSpent.toFixed(0)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;