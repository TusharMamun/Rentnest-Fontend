// app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Home,
  Lock,
  Loader2,
  Mail,
  Shield,
  Star,
} from "lucide-react";
import { loginAction } from "../_actions/example_authactions";

type FormValues = {
  email: string;
  password: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
  errorDetails?: {
    stack?: string;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

const onSubmit: SubmitHandler<FormValues> = async (data) => {
  setGeneralError(null);

  try {
    const result = await loginAction(data);

    if (!result) return;

    if (!result.success) {
      const errorMsg = result.message 
      const lowerError = errorMsg.toLowerCase();

      // Handle "User not found" specific scenario
      if (lowerError.includes("not found") || lowerError.includes("does not exist")) {
        const notFoundMsg = "Account not found. Please register to continue.";

        toast.error("User Not Found", {
          description: notFoundMsg,
          action: {
            label: "Register",
            onClick: () => router.push("/register"),
          },
        });

        setError("email", {
          type: "server",
          message: notFoundMsg,
        });
        
        return;
      }

      // Display generic toast alert for failed authentication
      toast.error("Login Failed", {
        description: errorMsg,
      });

      // Check if error is related to email and attach it directly to field
      if (lowerError.includes("email")) {
        setError("email", {
          type: "server",
          message: errorMsg,
        });
      } else {
        setGeneralError(errorMsg);
      }
    } else {
      // Display toast alert for successful authentication
      toast.success("Welcome back!", {
        description: "Logged in successfully.",
      });

      // Redirect user on success
      router.push("/");
      router.refresh();
    }
  } catch (err) {
    const fallbackMsg ="Account not found. Please register to continue.";
    toast.error("Error", { description: fallbackMsg });
    setGeneralError(fallbackMsg);
  }
};

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md border shadow-2xl">
        <CardHeader className="space-y-0 pb-1.5 pt-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg blur-md opacity-60"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/30">
                  <Home className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-1">
                  RentNest
                </CardTitle>
                <CardDescription className="text-gray-500 text-[10px] flex items-center gap-0.5 leading-none">
                  <Building2 className="h-2.5 w-2.5" />
                  Welcome back to your account
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border border-blue-100 bg-blue-50/50">
                <Shield className="h-2 w-2 text-emerald-500" />
                <span className="text-[7px] font-medium text-emerald-600">
                  Secure
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative pt-2 pb-4">
          {/* General Server Error Message Banner */}
          {generalError && (
            <div className="mb-2 p-1.5 rounded bg-red-50 border border-red-200 text-red-600 text-[10px]">
              {generalError}
            </div>
          )}

          <form className="space-y-2.5" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="space-y-0.5">
              <Label
                htmlFor="email"
                className="text-[10px] font-medium text-gray-700 flex items-center gap-1"
              >
                <Mail className="h-2.5 w-2.5 text-gray-400" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`pl-2 h-7 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 placeholder:text-[10px] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 rounded-lg text-xs ${
                  errors.email ? "border-red-500 focus:ring-red-500/20" : ""
                }`}
              />
              {/* Field-level error message */}
              {errors.email && (
                <p className="text-[8px] text-red-500 mt-0.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-[10px] font-medium text-gray-700 flex items-center gap-1"
                >
                  <Lock className="h-2.5 w-2.5 text-gray-400" />
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-[9px] text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`pl-2 h-7 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 placeholder:text-[10px] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 rounded-lg text-xs ${
                  errors.password ? "border-red-500 focus:ring-red-500/20" : ""
                }`}
              />
              {errors.password && (
                <p className="text-[8px] text-red-500 mt-0.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="relative py-0.5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-1.5 text-[7px] text-gray-400 flex items-center gap-1">
                  <Shield className="h-2 w-2" />
                  Secure & Encrypted
                </span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold py-1.5 rounded-lg transition-all duration-500 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 flex items-center justify-center gap-1.5 group relative overflow-hidden text-xs h-8 disabled:opacity-70"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {isSubmitting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-3 w-3" />
                </>
              )}
            </Button>

            <div className="text-center space-y-0.5 pt-1">
              <p className="text-[10px] text-gray-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors text-[10px]"
                >
                  Create one
                </Link>
              </p>
              <div className="flex items-center justify-center gap-1.5 text-[7px] text-gray-400">
                <span className="flex items-center gap-0.5">
                  <CheckCircle2 className="h-2 w-2" />
                  Privacy
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <Star className="h-2 w-2 fill-amber-400 text-amber-400" />
                  4.9/5
                </span>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}