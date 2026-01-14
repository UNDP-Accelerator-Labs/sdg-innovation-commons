"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/ui/components/Button";
import { updatePassword } from "@/app/lib/data/platform-api";
import { signOut } from "next-auth/react";

interface UpdatePasswordProps {
  token: string;
  isValidToken: boolean;
}

export default function UpdatePassword({ token, isValidToken }: UpdatePasswordProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Updated password requirements: at least 8 characters, one uppercase, one lowercase, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;

    if (!passwordRegex.test(password)) {
      setMessage(
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
      );
      setIsError(true);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setIsError(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await updatePassword(password, confirmPassword, token); // Pass the token to the API function
      if (response.status === 200) {
        setMessage("Password updated successfully. Redirecting to login...");
        setIsError(false);
        await signOut({ callbackUrl: '/login', redirect: true });
        // Redirect after a delay to show the success message
          setTimeout(() => {
            router.push('/login');
          }, 5000);
      } else {
        setMessage(response.message || "An error occurred. Please try again.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage("An error occurred. Please try again.");
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="text-red-600 text-center">
        Invalid or expired token. Please request a new password reset link.
      </div>
    );
  }

  return (
    <div>
      {message && (
        <div
          className={`mb-4 text-center text-sm ${
            isError ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0072bc] focus:border-[#0072bc] sm:text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0072bc] focus:border-[#0072bc] sm:text-sm"
            required
          />
        </div>
        <div className="py-2" />
        <Button
          type="submit"
          className="w-full py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}
