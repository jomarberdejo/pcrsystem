"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Loader } from "lucide-react";
import { GlowEffect } from "@/components/ui/glow-effect";
import { TextLoop } from "./ui/text-loop";
import momentPH from "@/lib/moment";
import { loginUser } from "@/lib/auth";

export const LoginForm = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = momentPH().hour();
    if (hour < 12) return "Maupay nga aga!";
    if (hour < 18) return "Maupay nga kulop!";
    return "Maupay nga gab-i";
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

      <div className="relative w-full rounded-xl">
        {loading && (
          <GlowEffect
            colors={["#0894FF", "#C959DD", "#FF2E54", "#FF9004"]}
            mode="static"
            blur="medium"
          />
        )}
        <Card className="relative z-10 transition-transform duration-300 hover:scale-[1.01] shadow-2xl ">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8 space-y-6" onSubmit={handleLogin}>
              <div className="flex flex-col items-center text-center space-y-1">
                <TextLoop
                  className="text-2xl font-semibold tracking-tight"
                  interval={10}
                >
                  <h1>{getGreeting()}</h1>
                  <h1>Welcome back!</h1>
                  <h1>Together, we save lives</h1>
                </TextLoop>
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
                  placeholder="your username..."
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
                  <span
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="text-sm text-muted-foreground absolute right-2 top-8 cursor-pointer"
                  >
                    {passwordVisible ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </span>
                </div>
                <Input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  autoComplete="current-password"
                  value={credentials.password}
                  placeholder="your password..."
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
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Logging In...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Login
                  </>
                )}
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
    </div>
  );
};
