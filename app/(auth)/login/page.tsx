"use client";
import React, { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { signIn } from "@/lib/cognito";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/utils/AppContextProvider";

export default function LoginPage() {
  const { setUserName } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [error, setError] = useState(""); // track error
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const response = await signIn(username, password);
      console.log(response.AuthenticationResult?.IdToken);

      if (response.ChallengeName === "NEW_PASSWORD_REQUIRED") {
        router.push(
          `/newpassword?username=${username}&session=${response.Session}`
        );
      } else {
        const idToken = response.AuthenticationResult?.IdToken;
        if (idToken) {
          document.cookie = `cognitoToken=${idToken}; path=/; secure; samesite=strict`;
          setUserName(username);
          router.push("/dashboard");
        }
      }
    } catch (e) {
      console.log(e);
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-[100vh] bg-[url('/images/authbg.jpeg')]">
        <div className="shadow-2xl px-10 py-8 rounded-lg w-[30%] h-[60%] border border-amber-50 justify-center flex flex-col items-center backdrop-blur-sm">
          <div className="text-center text-white text-6xl my-5">
            Expense Tracker
          </div>

          {/* Username */}
          <div className="flex bg-gray-300 p-2 m-1 my-2 w-full h-[15%] items-center border rounded-lg">
            <input
              value={username}
              placeholder="Username"
              type="text"
              className="focus:outline-none focus:ring-0 h-full w-full bg-transparent"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="flex bg-gray-300 p-2 m-1 h-[15%] w-full items-center my-2 border rounded-lg">
            <input
              value={password}
              placeholder="Password"
              type={seePassword ? "text" : "password"}
              className="focus:outline-none focus:ring-0 h-full w-full bg-transparent"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="ml-2 flex items-center justify-center text-gray-600 hover:text-black"
              onClick={() => setSeePassword(!seePassword)}>
              {seePassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm mb-2 text-center">{error}</div>
          )}

          {/* Submit */}
          <div
            className="bg-green-500 text-center w-full rounded-xl p-3"
            onClick={handleSubmit}>
            <button>Submit</button>
          </div>

          {/* Signup link */}
          <div className="text-center pt-3 flex">
            <p className="text-white">Don&apos;t Have Account</p>
            <Link href={"/signup"} className="px-2 underline text-blue-800">
              Click Here
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
