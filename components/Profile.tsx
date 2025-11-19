"use client";
import { useApp } from "@/utils/AppContextProvider";
import React from "react";
import PersonIcon from "@mui/icons-material/Person";

export default function Profile() {
  const { user } = useApp();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="h-40 w-40 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
            <PersonIcon sx={{ fontSize: "7rem", color: "white" }} />
          </div>
        </div>

        {/* Username */}
        <h2 className="mt-6 text-2xl font-bold text-gray-800">
          {user?.username?.toUpperCase() || "USERNAME"}
        </h2>

        {/* Email */}
        <p className="mt-2 text-gray-600">
          {user?.email || "email@example.com"}
        </p>

        {/* Extra Info */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex justify-between border-b pb-2 text-gray-700">
            <span className="font-semibold pr-6">Full Name:</span>
            <span>{user?.name || "N/A"}</span>
          </div>
          <div className="flex justify-between border-b pb-2 text-gray-700">
            <span className="font-semibold">Phone:</span>
            <span>{user?.phone_number || "N/A"}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4 justify-center">
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">
            Edit Profile
          </button>
          <button className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
