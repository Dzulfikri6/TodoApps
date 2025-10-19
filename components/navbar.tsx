"use client";

import { Input } from "@/components/ui/input";
import UserAvatar from "@/components/user-avatar";
import { useState } from "react";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const { user } = useAuthStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", search);
    // Lakukan navigasi atau filtering di sini
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between">
      {/* Brand / Logo */}
      <div className="text-xl font-semibold text-gray-800">
        Todo<span className="text-green-600">App</span>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md mx-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Cari sesuatu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
            />
          </svg>
        </div>
      </form>

      <div className="flex items-center space-x-4">
        <span className="hidden sm:block text-sm font-medium text-gray-700">
          {user?.fullName || user?.email || "User"}
        </span>
        <UserAvatar/>
      </div>
    </nav>
  );
}
