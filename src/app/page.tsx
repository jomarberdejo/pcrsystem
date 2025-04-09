import { LoginForm } from "@/components/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | MDRRMO Carigara",
};
export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-6xl">
        <LoginForm />
      </div>
    </div>
  );
}
