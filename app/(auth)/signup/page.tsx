"use client";

import React, { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { signIn, signUp } from "@/lib/cognito";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [seeRePassword, setSeeRePassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const response = await signUp(
        userName,
        password,
        name,
        email,
        phoneNumber
      );

      console.log("Signup response:", response);

      if (response.UserConfirmed) {
        try {
          const response = await signIn(userName, password);
          console.log(response.AuthenticationResult?.IdToken);

          if (response.ChallengeName === "NEW_PASSWORD_REQUIRED") {
            router.push(
              `/newpassword?username=${userName}&session=${response.Session}`
            );
          } else {
            const idToken = response.AuthenticationResult?.IdToken;
            if (idToken) {
              document.cookie = `cognitoToken=${idToken}; path=/; secure; samesite=strict`;
              setUserName(userName);
              router.push("/dashboard");
            }
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        // Usually, user must confirm with code sent to email/phone
        alert("A confirmation code was sent. Please verify your account.");
        router.push(`/verifyaccount?email=${email}&username=${userName}`); // or show a confirmation input page
      }
    } catch (e) {
      console.error("Signup error:", e);
    }
  };

  return (
    <div className="flex justify-center items-center h-[100vh] bg-[url('/images/authbg.jpeg')]">
      <div className="shadow-2xl px-10 py-8 rounded-lg w-[30%] h-[auto] border border-amber-50 justify-center flex flex-col items-center backdrop-blur-sm">
        <div className="text-center text-white text-6xl my-5">
          Expense Tracker
        </div>

        <div className="flex w-full">
          <div className="flex bg-gray-300 p-2 m-1 my-2 w-full h-[12%] items-center border rounded-lg">
            <input
              value={name}
              placeholder="Full Name"
              type="text"
              className="focus:outline-none focus:ring-0 h-full w-full bg-transparent"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Phone Number */}
          <div className="flex bg-gray-300 p-2 m-1 my-2 w-full h-[12%] items-center border rounded-lg">
            <input
              value={phoneNumber}
              placeholder="Phone Number"
              type="tel"
              className="focus:outline-none focus:ring-0 h-full w-full bg-transparent"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>

        {/* Username */}
        <div className="flex bg-gray-300 p-2 m-1 my-2 w-full h-[12%] items-center border rounded-lg">
          <input
            value={userName}
            placeholder="Username"
            type="text"
            className="focus:outline-none focus:ring-0 h-full w-full bg-transparent"
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        {/* Name */}

        {/* Email */}
        <div className="flex bg-gray-300 p-2 m-1 my-2 w-full h-[12%] items-center border rounded-lg">
          <input
            value={email}
            placeholder="Email"
            type="email"
            className="focus:outline-none focus:ring-0 h-full w-full bg-transparent"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="flex bg-gray-300 p-2 m-1 h-[12%] w-full items-center my-2 border rounded-lg">
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

        {/* Re-enter Password */}
        <div className="flex bg-gray-300 p-2 m-1 h-[12%] w-full items-center my-2 border rounded-lg">
          <input
            value={repassword}
            placeholder="Re-enter Password"
            type={seeRePassword ? "text" : "password"}
            className="focus:outline-none focus:ring-0 h-full w-full bg-transparent"
            onChange={(e) => setRePassword(e.target.value)}
          />
          <button
            type="button"
            className="ml-2 flex items-center justify-center text-gray-600 hover:text-black"
            onClick={() => setSeeRePassword(!seeRePassword)}>
            {seeRePassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </button>
        </div>

        {/* Submit Button */}
        <div className="bg-green-500 text-center w-full rounded-xl p-3 mt-4">
          <button onClick={handleSubmit}>Submit</button>
        </div>

        {/* Redirect to Login */}
        <div className="text-center pt-3 flex">
          <p className="text-white">Already Have Account</p>
          <Link href={"/login"} className="px-2 underline text-blue-800">
            Click Here
          </Link>
        </div>
      </div>
    </div>
  );
}
