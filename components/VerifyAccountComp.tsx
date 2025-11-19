import { confirmSignUp } from "@/lib/cognito";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function VerifyAccountComp() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const username = searchParams.get("username");

  const handleVerify = async () => {
    try {
      if (username) {
        const response = await confirmSignUp(username, code);
        console.log("Confirm response:", response);
        alert("Account verified! You can now log in.");
        router.push("/login");
      }
    } catch (e) {
      console.error("Verification failed:", e);
      alert("Verification failed: " + e);
    }
  };

  return (
    <div className="flex justify-center items-center h-[100vh] bg-[url('/images/authbg.jpeg')]">
      <div className="shadow-2xl px-10 py-8 rounded-lg w-[30%] h-[60%] border border-amber-50 justify-center flex flex-col items-center backdrop-blur-sm ">
        <div className="text-center text-white text-6xl my-5">
          Expense Tracker
        </div>
        <div className="text-center  font-extralight text-lg my-5">
          Verify Your email:{email}
        </div>
        <div className="flex bg-gray-300 p-2 m-1 my-2 w-full h-[12%] items-center border rounded-lg">
          <input
            value={code}
            placeholder="Enter the Code here"
            type="text"
            className="focus:outline-none focus:ring-0 h-full w-full bg-transparent"
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <div
          onClick={handleVerify}
          className="bg-green-500 text-center w-full rounded-xl p-3">
          <button>Submit</button>
        </div>
      </div>
    </div>
  );
}
