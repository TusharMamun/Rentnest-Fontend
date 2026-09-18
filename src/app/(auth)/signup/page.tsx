// app/register/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Building2,
  Camera,
  CheckCircle2,
  FileText,
  Home,
  Loader2,
  Lock,
  Mail,
  Shield,
  Star,
  User,
} from "lucide-react";

import { RegisterFormValues } from "@/lib/type";

import { registrationAction } from "../_actions/example_authactions";
import { imageUpload } from "@/lib/api";
import { useRouter } from "next/navigation";


export default function RegisterPage() {
  const [generalError, setGeneralError] = useState<string | null>(null);
const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>();

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    setGeneralError(null);
    const { image } = data;
    const file = image?.[0];

    // 1. Validate image selection
    if (!file) {
      const msg = "Profile photo is required.";
      setGeneralError(msg);
      toast.error("Image Required", { description: msg });
      return;
    }

    try {
      // 2. Upload image and handle potential failure
      let imageURL = "";
      try {
        imageURL = await imageUpload(file as File);
      } catch (uploadErr) {
        const msg = "Failed to upload profile photo. Please try again.";
        setGeneralError(msg);
        toast.error("Image Upload Failed", { description: msg });
        return;
      }

      if (!imageURL) {
        const msg = "Image upload failed to return a valid URL.";
        setGeneralError(msg);
        toast.error("Image Upload Error", { description: msg });
        return;
      }

      // 3. Construct Payload
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        bio: data.bio || "",
        profilePhoto: imageURL,
      };

      // 4. Trigger Next.js Server Action
      const result = await registrationAction(payload);

      if (result && !result.success) {
        const errorMsg = result.error || "User already exists. Please login.";
        setGeneralError(errorMsg);
        toast.error("Registration Failed", {
          description: errorMsg,
        });
        return;
      }

      toast.success("Account created successfully!");
      router.push("/");
     
    } catch (err: unknown) {
      const fallbackMsg =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setGeneralError(fallbackMsg);
      toast.error("Error", { description: fallbackMsg });
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="relative z-10 w-full max-w-md bg-white border shadow-2xl shadow-gray-200/50 backdrop-blur-sm">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-lg"></div>

        {/* Card Header */}
        <CardHeader className="space-y-0 pb-1.5 pt-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg blur-md opacity-60"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/30">
                  <Home className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="flex items-center gap-1 text-lg font-bold text-gray-800">
                  RentNest
                </CardTitle>
                <CardDescription className="text-gray-500 text-[10px] flex items-center gap-0.5 leading-none">
                  <Building2 className="h-2.5 w-2.5" />
                  Find your dream home
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border border-blue-100 bg-blue-50/50">
                <Shield className="w-2 h-2 text-emerald-500" />
                <span className="text-[7px] font-medium text-emerald-600">
                  Secure
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Card Content & Form Fields */}
        <CardContent className="relative pt-0 pb-4">
          {/* General Error Banner */}
          {generalError && (
            <div className="p-1.5 mb-2 rounded bg-red-50 border border-red-200 text-red-600 text-[10px]">
              {generalError}
            </div>
          )}

          <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div className="space-y-0.5">
              <Label
                htmlFor="name"
                className="text-[10px] font-medium text-gray-700 flex items-center gap-1"
              >
                <User className="h-2.5 w-2.5 text-gray-400" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register("name", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className={`pl-2 h-7 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 placeholder:text-[10px] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 rounded-lg text-xs ${
                  errors.name ? "border-red-500 focus:ring-red-500/20" : ""
                }`}
              />
              {errors.name && (
                <p className="text-[8px] text-red-500 mt-0.5">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-0.5">
              <Label
                htmlFor="email"
                className="text-[10px] font-medium text-gray-700 flex items-center gap-1"
              >
                <Mail className="h-2.5 w-2.5 text-gray-400" />
                Email
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
              {errors.email && (
                <p className="text-[8px] text-red-500 mt-0.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-0.5">
              <Label
                htmlFor="password"
                className="text-[10px] font-medium text-gray-700 flex items-center gap-1"
              >
                <Lock className="h-2.5 w-2.5 text-gray-400" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Min 6 characters"
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
              {errors.password ? (
                <p className="text-[8px] text-red-500 mt-0.5">
                  {errors.password.message}
                </p>
              ) : (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="flex-1 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full w-2/3"></div>
                  </div>
                  <span className="text-[7px] text-gray-400">Strong</span>
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-0.5">
              <Label
                htmlFor="bio"
                className="text-[10px] font-medium text-gray-700 flex items-center gap-1"
              >
                <FileText className="h-2.5 w-2.5 text-gray-400" />
                About
              </Label>
              <Textarea
                id="bio"
                placeholder="Looking for a quiet and clean apartment..."
                rows={1}
                {...register("bio")}
                className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 placeholder:text-[10px] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none rounded-lg text-xs h-10"
              />
            </div>

            {/* Profile Photo Upload */}
            <div className="space-y-0.5">
              <Label
                htmlFor="image"
                className="text-[10px] font-medium text-gray-700 flex items-center gap-1"
              >
                <Camera className="h-2.5 w-2.5 text-gray-400" />
                Photo <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="relative">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      {...register("image", {
                        required: "Profile photo is required",
                      })}
                      className={`cursor-pointer bg-gray-50 border-gray-200 text-gray-700 text-[10px] file:mr-1.5 file:py-0.5 file:px-2 file:rounded-full file:border-0 file:text-[8px] file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all duration-300 rounded-lg h-7 ${
                        errors.image ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.image ? (
                    <p className="text-[8px] text-red-500 mt-0.5">
                      {errors.image.message}
                    </p>
                  ) : (
                    <p className="text-[7px] text-gray-400 mt-0.5 flex items-center gap-0.5">
                      <CheckCircle2 className="w-2 h-2 text-emerald-500" />
                      JPEG, PNG, WebP · 5MB
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative py-0.5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-1.5 text-[7px] text-gray-400 flex items-center gap-1">
                  <Shield className="w-2 h-2" />
                  Secure & Encrypted
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold py-1.5 rounded-lg transition-all duration-500 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 flex items-center justify-center gap-1.5 group relative overflow-hidden text-xs h-8 disabled:opacity-70"
            >
              <div className="absolute inset-0 transition-transform duration-1000 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full"></div>
              {isSubmitting ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-3 h-3" />
                </>
              )}
            </Button>

            {/* Footer */}
            <div className="pt-1 text-center space-y-0.5">
              <p className="text-[10px] text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors text-[10px]"
                >
                  Sign in
                </Link>
              </p>
              <div className="flex items-center justify-center gap-1.5 text-[7px] text-gray-400">
                <span className="flex items-center gap-0.5">
                  <CheckCircle2 className="w-2 h-2" />
                  Privacy
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <Star className="w-2 h-2 text-amber-400 fill-amber-400" />
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