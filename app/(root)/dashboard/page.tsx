"use client";
import ExpenseComp from "@/components/Expense";
import ExpenseLineChart from "@/components/ExpenseLineChart";
import ExpensePieChart from "@/components/ExpensePieChart";
import ShowExpenses from "@/components/ShowExpenses";
import React from "react";

export default function Dashboard() {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen">
      {/* Left Panel (Expense form) */}
      <div className="w-screen lg:w-1/3 p-4 flex justify-center items-center lg:items-start lg:justify-center">
        <ExpenseComp />
      </div>

      {/* Right Panel (Charts + Table) */}
      <div className="w-full lg:w-2/3 h-full flex flex-col p-4">
        {/* Charts Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1  p-2 rounded-lg">
            <ExpensePieChart />
          </div>
          <div className="flex-1  p-2 rounded-lg">
            <ExpenseLineChart />
          </div>
        </div>

        {/* Expenses Table */}
        <div className="flex-1  p-2 rounded-lg overflow-y-auto">
          <ShowExpenses />
        </div>
      </div>
    </div>
  );
}
