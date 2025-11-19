import { useApp } from "@/utils/AppContextProvider";
import React from "react";

export default function ShowExpenses() {
  const { expenses, setSelectedExpenses, selectedExpenses } = useApp();

  return (
    <div>
      <div>Expense History</div>
      <div>
        <table className="min-w-full border-collapse rounded-lg shadow-md  sm:mb-5 lg:mb-0">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left"></th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-left">Description</th>
            </tr>
          </thead>
          {expenses && (
            <tbody className="text-gray-600 text-sm font-light">
              {expenses?.map((expense) => (
                <tr
                  key={expense.docId}
                  className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="py-3 px-6">
                    <input
                      type="radio"
                      name="selectedExpense"
                      checked={expense.docId === selectedExpenses?.docId}
                      onChange={() => {
                        console.log(expense.docId);
                        setSelectedExpenses(expense);
                      }}
                    />
                  </td>
                  <td className="py-3 px-6">{expense.date}</td>
                  <td className="py-3 px-6 font-semibold text-green-600">
                    ${expense.amount}
                  </td>
                  <td className="py-3 px-6">{expense.type}</td>
                  <td className="py-3 px-6">{expense.description}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {!expenses && (
          <div className="text-center w-full pt-2">
            No value to Display please enter new values to diplay here{" "}
          </div>
        )}
      </div>
    </div>
  );
}
