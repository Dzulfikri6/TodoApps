import LoginForm from "@/components/login-form";
import { Toaster } from "sonner";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <LoginForm />
      <Toaster richColors />
    </div>
  );
}