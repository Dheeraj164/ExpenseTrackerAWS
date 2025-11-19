"use client";

import { Expense } from "@/model/expense";
import { UserModal } from "@/model/userModel";
import React, { createContext, useContext, useState } from "react";
interface AppContextType {
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  expenses: Expense[] | null;
  setExpenses: React.Dispatch<React.SetStateAction<Expense[] | null>>;
  user: UserModal | null;
  setUser: React.Dispatch<React.SetStateAction<UserModal | null>>;
  selectedExpenses: Expense | null;
  setSelectedExpenses: React.Dispatch<React.SetStateAction<Expense | null>>;
}
const AppContext = createContext<AppContextType>({
  userName: "",
  setUserName: () => {},
  expenses: null,
  setExpenses: () => {},
  user: null,
  setUser: () => {},
  selectedExpenses: null,
  setSelectedExpenses: () => {},
});

export default function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] = useState("");
  const [expenses, setExpenses] = useState<Expense[] | null>(null);
  const [selectedExpenses, setSelectedExpenses] = useState<Expense | null>(
    null
  );
  const [user, setUser] = useState<UserModal | null>(null);
  return (
    <AppContext.Provider
      value={{
        userName,
        setUserName,
        expenses,
        setExpenses,
        user,
        setUser,
        selectedExpenses,
        setSelectedExpenses,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
