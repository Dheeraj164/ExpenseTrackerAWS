import { Expense } from "@/model/expense";
import { useApp } from "@/utils/AppContextProvider";
import React, { useEffect, useState } from "react";
const categoryList = [
  "Category",
  "Housing",
  "Food",
  "Transportation",
  "Utilities",
  "Fun",
  "Miscellaneous",
];

type Category = (typeof categoryList)[number];

export default function ExpenseComp() {
  const { selectedExpenses, setSelectedExpenses, user, setExpenses } = useApp();

  function formatDateToInput(dateString: string) {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
      // If it's in MM/dd/yyyy format, manually split
      const [month, day, year] = dateString.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return d.toISOString().split("T")[0];
  }
  const [loading, setloading] = useState(false);
  const [amount, setAmount] = useState(
    selectedExpenses ? selectedExpenses.amount : "0"
  );
  const [date, setDate] = useState(
    selectedExpenses ? formatDateToInput(selectedExpenses.date) : ""
  );
  const [description, setDescription] = useState(
    selectedExpenses ? selectedExpenses.description : ""
  );
  const [category, setCategory] = useState<Category>(
    selectedExpenses ? selectedExpenses.type : "Category"
  );
  useEffect(() => {
    if (selectedExpenses) {
      setAmount(selectedExpenses.amount);
      setDate(formatDateToInput(selectedExpenses.date));
      setDescription(selectedExpenses.description);
      setCategory(selectedExpenses.type as Category);
    } else {
      // reset if nothing selected
      setAmount("0");
      setDate("");
      setDescription("");
      setCategory("Category");
    }
  }, [selectedExpenses]);

  function checkEmpty() {
    // normalize values
    const amt = String(amount).trim();
    const cat = String(category).trim();
    const desc = String(description).trim();
    const dt = String(date).trim();

    if (!amt || amt === "0" || Number(amt) <= 0) {
      alert("Please enter a valid Amount");
      return false;
    }
    if (!cat || cat.toLowerCase() === "category") {
      alert("Please select a valid Category");
      return false;
    }
    if (!dt) {
      alert("Please enter a valid Date");
      return false;
    }
    if (!desc) {
      alert("Please enter a valid Description");
      return false;
    }
    return true;
  }
  const handleAddNewExpense = async () => {
    try {
      if (!checkEmpty()) return;
      const response = await fetch(
        `https://wzb1ghliye.execute-api.us-east-2.amazonaws.com/expenses`,
        {
          method: "POST",
          body: JSON.stringify({
            username: user!.username,
            amount: amount,
            date: date,
            description: description,
            type: category,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (data) {
        const newExpense = new Expense({
          docId: data.docId,
          amount: amount,
          date: date,
          description: description,
          type: category,
        });

        setExpenses((value) => [...(value ?? []), newExpense]);
        setAmount("");
        setCategory("Category");
        setDate("");
        setDescription("");
      }
    } catch (e) {}
  };
  const handleUpdateExpense = async () => {
    if (!selectedExpenses) return;

    setloading(true);

    try {
      if (!checkEmpty()) return;
      const response = await fetch(
        `https://wzb1ghliye.execute-api.us-east-2.amazonaws.com/expenses`,
        {
          method: "PUT",
          body: JSON.stringify({
            docId: selectedExpenses.docId,
            username: user?.username,
            amount,
            date,
            description,
            type: category,
          }),
        }
      );
      const data = await response.json();
      console.log("Updated:", data);

      // update local state
      setExpenses(
        (prev) =>
          prev?.map((exp) =>
            exp.docId === selectedExpenses.docId
              ? {
                  ...exp,
                  amount,
                  date,
                  description,
                  type: category,
                }
              : exp
          ) ?? []
      );

      // clear selection
      setSelectedExpenses(null);
    } catch (e) {
      console.error("Update failed:", e);
    } finally {
      setloading(false);
    }
  };

  const handleDeleteExpense = async () => {
    if (!selectedExpenses) return;

    try {
      const response = await fetch(
        `https://wzb1ghliye.execute-api.us-east-2.amazonaws.com/expenses?docId=${selectedExpenses.docId}&username=${user?.username}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      console.log("Deleted:", data);

      // remove from local state
      setExpenses(
        (prev) =>
          prev?.filter((exp) => exp.docId !== selectedExpenses.docId) ?? []
      );

      // clear selection
      setSelectedExpenses(null);
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  return (
    <div
      className={`border border-gray-400 py-4 rounded-lg p-2 shadow shadow-black  sm:h-[85%] flex lg:w-[25vw] sm:w[100vw] justify-center items-center ${
        selectedExpenses ? "lg:h-[75%]" : "lg:h-[65%]"
      }`}>
      <div className="w-full ">
        <div>
          <p className="text-xl font-semibold text-center">
            {!selectedExpenses ? "New Expenses" : "Update Expenses"}
          </p>
        </div>
        <div className="flex border border-gray-400 rounded-lg m-2 ">
          <div className="border-r border-gray-400 p-1 font-bold px-2">$</div>
          <div className="w-full justify-center items-center flex pl-1">
            <input
              type="number"
              name="amount"
              min={0}
              className="focus:outline-none focus:ring-0 h-full w-full "
              value={amount}
              onChange={(e) =>
                e.target.value !== "Category" && setAmount(e.target.value)
              }
            />
          </div>
        </div>
        <div className="p-2 focus:outline-none focus:ring-0 w-full">
          <select
            className=" font-semibold border border-gray-400 rounded-lg py-1 focus:outline-none focus:ring-0 w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}>
            {categoryList.map((element) => (
              <option key={element} value={element}>
                {element}
              </option>
            ))}
          </select>
        </div>
        <div className="flex border border-gray-400 rounded-lg m-2 ">
          <label className="font-semibold px-2">Date</label>
          <input
            className="focus:outline-none focus:ring-0 h-full w-full "
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="border border-gray-400 rounded-lg m-2  p-2">
          <div>
            <textarea
              className="focus:outline-none focus:ring-0 h-full w-full "
              placeholder="Description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        {!selectedExpenses ? (
          <div onClick={handleAddNewExpense}>
            <button
              disabled={loading}
              className={
                "text-center p-1 mt-5 rounded-lg justify-center items-center flex w-full text-white bg-blue-600"
              }>
              {loading ? "Loading......" : "Add Expense"}
            </button>
          </div>
        ) : (
          <div>
            <div className="flex">
              <button
                disabled={loading}
                onClick={handleUpdateExpense}
                className={
                  "text-center m-0.5 p-1 rounded-lg justify-center items-center flex w-full text-white bg-purple-600"
                }>
                <p> {loading ? "Loading......" : "Update Expense"}</p>
              </button>
              <button
                disabled={loading}
                onClick={handleDeleteExpense}
                className={
                  "text-center m-0.5 p-1 rounded-lg justify-center items-center flex w-full text-white bg-red-600"
                }>
                <p>Delete Expense</p>
              </button>
            </div>
            <button
              disabled={loading}
              onClick={() => setSelectedExpenses(null)}
              className={
                "text-center m-0.5 p-1 rounded-lg justify-center items-center flex w-full text-white bg-orange-600"
              }>
              <p>Cancel Selection</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
