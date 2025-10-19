"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export default function UserAvatar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="relative" ref={dropdownRef}>

      <button onClick={() => setOpen((prev) => !prev)} className="focus:outline-none">
        <Avatar className="border-2 border-green-500 cursor-pointer hover:ring-2 hover:ring-green-300 transition">
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="Profile Picture"
          />
          <AvatarFallback>
            {user?.fullName?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-100 animate-in fade-in slide-in-from-top-2">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-800">
              {user?.fullName || "User"}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>

          <a
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Edit Profile
          </a>

          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
