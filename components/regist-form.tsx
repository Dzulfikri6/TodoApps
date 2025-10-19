"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

const countries = [
  { name: "Indonesia", code: "+62" },
  { name: "Malaysia", code: "+60" },
  { name: "Singapura", code: "+65" },
  { name: "Thailand", code: "+66" },
  { name: "Vietnam", code: "+84" },
  { name: "Filipina", code: "+63" },
  { name: "Brunei Darussalam", code: "+673" },
  { name: "Kamboja", code: "+855" },
  { name: "Laos", code: "+856" },
  { name: "Timor Leste", code: "+670" },
];

const registerSchema = z
  .object({
    firstName: z.string().min(2, "Nama depan minimal 2 karakter"),
    lastName: z.string().min(2, "Nama belakang minimal 2 karakter"),
    fullName: z.string().optional(),
    email: z.string().email("Email tidak valid"),
    country: z.string().min(2, "Pilih negara asal"),
    phoneNumber: z
      .string()
      .min(8, "Nomor telepon minimal 8 digit")
      .regex(/^[0-9]+$/, "Nomor telepon hanya boleh angka"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak cocok",
  });

type RegisterInput = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState("+62"); // default Indonesia
  const form = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = countries.find((c) => c.name === e.target.value);
    setCountryCode(selected ? selected.code : "");
    form.setValue("country", e.target.value);
  };

  const mutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const payload = {
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        phoneNumber: `${countryCode}${data.phoneNumber}`, // kirim nomor lengkap
        country: data.country,
      };
      const res = await api.post("/register", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Registrasi berhasil! Silakan login.");
      router.push("/n");
    },
    onError: () => {
      toast.error("Registrasi gagal, coba lagi!");
    },
  });

  const onSubmit = (values: RegisterInput) => mutation.mutate(values);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 w-full">
      <Card className="w-full max-w-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8">
        <CardHeader>
        <CardTitle className="text-center text-2xl font-semibold text-gray-800">
            Create Your Account
            <p className="text-sm text-gray-500 mt-1">
              Join us for an amazing experience! Please fill in the form to
              create your account.
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nama Depan</label>
                <Input
                  type="text"
                  placeholder="Masukkan nama depan"
                  {...form.register("firstName")}
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Nama Belakang</label>
                <Input
                  type="text"
                  placeholder="Masukkan nama belakang"
                  {...form.register("lastName")}
                />
                {form.formState.errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Negara Asal</label>
                <select
                  {...form.register("country")}
                  onChange={handleCountryChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  defaultValue="Indonesia"
                >
                  {countries.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {form.formState.errors.country && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.country.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Nomor Telepon</label>
                <div className="flex">
                  <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-l-md text-gray-700 text-sm flex items-center">
                    {countryCode}
                  </span>
                  <input
                    type="tel"
                    placeholder="8123456789"
                    {...form.register("phoneNumber")}
                    className="w-full p-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                {form.formState.errors.phoneNumber && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Input
                  type="password"
                  placeholder="********"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Konfirmasi Password
                </label>
                <Input
                  type="password"
                  placeholder="Ulangi password"
                  {...form.register("confirmPassword")}
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium pointer"
            >
              {mutation.isPending ? "Mendaftar..." : "Register"}
            </Button>
            <p className="text-center text-sm text-gray-500 mt-3">
              Sudah punya akun?{" "}
              <Link href="/Login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>

      <Toaster richColors />
    </div>
  );
}
