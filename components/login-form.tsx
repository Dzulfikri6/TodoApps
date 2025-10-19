"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/login", { email, password });
      return res.data;
    },
    onSuccess: (data) => {
      const { user, token } = data.content;
      setUser({ id: user.id, fullName: user.fullName, email: user.email, token });

      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("userEmail", user.email);
      } else {
        sessionStorage.setItem("token", token);
      }
      toast.success("Login berhasil!");
      router.push("/Main");
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast.error("Email atau password salah!");
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 w-full">
      <Card className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl shadow-lg border border-gray-200 p-6">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-semibold text-gray-800">
            Sign in 
            <p className="text-sm text-gray-500 mt-1">
            Welcome back! Please enter your email and password to continue.
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500"
                />
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Tombol Login */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
            >
              {loginMutation.isPending ? "Loading..." : "Sign In"}
            </Button>

            {/* Link ke Register */}
            <p className="text-center text-sm text-gray-500 mt-4">
              Belum punya akun?{" "}
              <Link href="/Register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>

      <Toaster richColors />
    </div>
  );
}
