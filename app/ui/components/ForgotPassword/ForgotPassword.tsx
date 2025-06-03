"use client";

import { useState } from "react";
import { Button } from "@/app/ui/components/Button";
import { resetPassword } from "@/app/lib/data/platform-api";

export default function ForgotPassword() {
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    try {
      const response = await resetPassword(email);
      if (response.status === 200) {
        setMessage(response.message);
        setIsError(false);
      } else {
        setMessage(response.message || "An error occurred. Please try again.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("An error occurred. Please try again.");
      setIsError(true);
    }
  };

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
        <div className="mb-8">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="my-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0072bc] focus:border-[#0072bc] sm:text-sm"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
}
