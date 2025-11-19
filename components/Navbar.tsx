import { globalSignOut } from "@/lib/cognito";
import { useApp } from "@/utils/AppContextProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function Navbar() {
  const { user } = useApp();
  const router = useRouter();

  const signout = async () => {
    try {
      await globalSignOut();
      document.cookie = "cognitoToken=; path=/; max-age=0;";
      router.replace("/login");
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-[8%] z-10 flex items-center justify-between px-4 bg-black text-white">
      {/* Left */}
      <Link href={"/profile"} className="p-2 rounded-lg">
        <p>Welcome {user?.username}</p>
      </Link>

      {/* Center (absolute to parent) */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Link href={"/dashboard"} className="text-lg font-bold tracking-wide">
          Expense Tracker
        </Link>
      </div>

      {/* Right */}
      <div
        onClick={signout}
        className="bg-red-700 px-5 py-2 rounded-lg cursor-pointer">
        <button type="submit">Logout</button>
      </div>
    </div>
  );
}
