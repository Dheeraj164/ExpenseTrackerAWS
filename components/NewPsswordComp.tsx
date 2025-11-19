"use client";
import { updatePassword } from "@/lib/cognito";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function NewPasswordComp() {
  const [newPassword, setNewPassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async () => {
    try {
      const response = await updatePassword({
        session: session!,
        username: username!,
        newPassword: newPassword,
      });

      console.log(response);

      const idToken = response?.AuthenticationResult?.IdToken;
      if (idToken) {
        document.cookie = `cognitoToken=${idToken}; path=/`;
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Error setting new password:", err);
    }
  };

  const username = searchParams.get("username");
  const session = searchParams.get("session");
  return (
    <>
      <div className="flex justify-center items-center h-[100vh] bg-[url('/images/authbg.jpeg')]">
        <div className="shadow-2xl px-10 py-8 rounded-lg w-[30%] h-[60%] border border-amber-50 justify-center flex flex-col items-center backdrop-blur-sm ">
          <div className="text-center text-white text-6xl my-5">
            Expense Tracker
          </div>
          <div className="text-center  font-extralight text-lg my-5">
            Update Password for {username}
          </div>
          <div className="flex bg-gray-300 p-2 m-1 h-[15%] w-full items-center my-2 border rounded-lg">
            <input
              value={newPassword}
              placeholder="Password"
              type={seePassword ? "text" : "password"} // toggle password visibility
              className="focus:outline-none focus:ring-0 h-full w-full bg-transparent "
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
            <button
              type="button"
              className="ml-2 flex items-center justify-center text-gray-600 hover:text-black"
              onClick={() => setSeePassword(!seePassword)}>
              {seePassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </button>
          </div>
          <div className="bg-green-500 text-center w-full rounded-xl p-3">
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </>
  );
}
