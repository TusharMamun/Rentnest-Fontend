// app/not-found.tsx
"use client";

import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
      redirect("/")
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30 p-4">
      <div className="w-full max-w-lg text-center">
        {/* 404 Number */}
        <h1 className="text-8xl md:text-9xl font-bold text-blue-600 mb-4">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-500 text-sm md:text-base mb-4">
          Oops! The page you're looking for doesn't exist.
        </p>

        {/* Redirect Info */}
        <p className="text-sm text-gray-400 mb-6">
          Redirecting to home in <span className="text-blue-600 font-semibold">{countdown}</span> seconds
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors"
          >
            🏠 Home
          </Link>
          <Link
            href="/properties"
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-full transition-colors"
          >
            🔍 Browse Properties
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-gray-400">
          © {new Date().getFullYear()} RentNest
        </p>
      </div>
    </div>
  );
}