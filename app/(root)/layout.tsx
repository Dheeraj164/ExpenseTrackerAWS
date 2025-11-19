"use client";

import Navbar from "@/components/Navbar";
import { getUserData } from "@/lib/cognito";
import { Expense } from "@/model/expense";
import { UserModal } from "@/model/userModel";
import { useApp } from "@/utils/AppContextProvider";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { setUser, setExpenses, user } = useApp();
  const hasFetched = useRef(false);
  const router = useRouter();
  const [checking, setChecking] = useState(true); // 👈 track auth check

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    (async () => {
      try {
        const response = await getUserData();

        if (response && response.UserAttributes) {
          const userName = response.Username;
          const email = response.UserAttributes.find(
            (a) => a.Name === "email"
          )?.Value;
          const phone_number = response.UserAttributes.find(
            (a) => a.Name === "phone_number"
          )?.Value;
          const name = response.UserAttributes.find(
            (a) => a.Name === "name"
          )?.Value;

          setUser(
            new UserModal({
              email,
              phone_number,
              name,
              username: userName,
            })
          );

          // Fetch expenses
          const expensesRes = await fetch(
            `https://wzb1ghliye.execute-api.us-east-2.amazonaws.com/expenses?username=${userName}`
          );
          const data = await expensesRes.json();

          setExpenses(
            data.map(
              (expense: Expense) =>
                new Expense({
                  docId: expense.docId,
                  type: expense.type,
                  amount: expense.amount,
                  date: expense.date,
                  description: expense.description,
                })
            )
          );
        }
      } catch (e) {
        console.error("Auth check failed:", e);
      } finally {
        setChecking(false); // 👈 finished checking
      }
    })();
  }, [setUser, setExpenses]);

  useEffect(() => {
    if (!checking && !user) {
      router.replace("/login/");
    }
  }, [user, checking, router]);

  if (checking) {
    return <div className="p-8 text-center">Checking authentication...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="pt-[20vh]">{children}</div>
    </>
  );
}
