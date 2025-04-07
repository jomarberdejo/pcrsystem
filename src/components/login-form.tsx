"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { loginUser } from "@/actions/userService";
import { toast } from "sonner";
import { Eye, EyeOff, Lock } from "lucide-react";

export const LoginForm = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [credentials, setCredentials] = useState<{
    username: string;
    password: string;
  }>({
    username: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const result = await loginUser(credentials);
      console.log(result);

      if (result) {
        toast.success("Success!", {
          description: "Logged in as Administrator.",
          position: "top-right",
        });
        router.push("/admin/dashboard");
      } else {
        toast.error("Failed!", {
          description: "Invalid Credentials, try again.",
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="mb-4 space-y-1">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          PCR System
        </h2>
        <p className="text-left sm:text-center text-muted-foreground leading-relaxed">
          Please log in to access the PCR System. If you do not have an account,
          kindly contact the system administrator for help with gaining access.
        </p>
      </div>

      <Card className="overflow-hidden shadow-2xl rounded-xl transition-transform duration-300 hover:scale-[1.01]">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8 space-y-6" onSubmit={handleLogin}>
            <div className="flex flex-col items-center text-center space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome back
              </h1>
              <p className="text-balance text-muted-foreground text-sm">
                Login to your MDRRMO PCR System account
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="username" className="font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Your Username..."
                autoComplete="current-username"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    username: e.target.value,
                  })
                }
                className="border-border outline-ring/50"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between relative">
                <Label htmlFor="password" className="font-medium">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="text-sm text-muted-foreground absolute right-2 top-8"
                >
                  {passwordVisible ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <Input
                id="password"
                type={passwordVisible ? "text" : "password"} // Toggle input type based on password visibility
                autoComplete="current-password"
                value={credentials.password}
                placeholder="Your password..."
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    password: e.target.value,
                  })
                }
                className="border-border outline-ring/50"
              />
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer font-semibold shadow-md transition-transform hover:scale-[1.02]"
            >
              <Lock className="mr-2 h-4 w-4" />
              Login
            </Button>
          </form>

          <div className="relative hidden border-l md:block">
            <Image
              src="/images/MDRRMO_LOGO.jpg"
              alt="Image"
              width={300}
              height={300}
              className={cn(
                "absolute inset-0 mx-auto h-full w-full max-h-[350px] max-w-[350px] object-cover transition-transform duration-300 hover:scale-105 rounded-full"
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
