"use client"

import type React from "react"
import { useState } from "react"
import { Button } from '@/app/ui/components/Button';
import { registerContributor } from "@/app/lib/data/platform-api";

interface RegisterFormProps {
    countries: any[];
  }
  
  export default function RegisterForm({ countries }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    organization: "",
    role: "",
    country: "",
    position: "", 
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [newsletter, setNewsletter] = useState(true)
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [countryError, setCountryError] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCountries = countries.filter((country) =>
    country.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    if (password.length < minLength) {
      return "Password must be at least 8 characters long.";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!hasNumber) {
      return "Password must contain at least one number.";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character.";
    }
    return null;
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, password: value }));
    const error = validatePassword(value);
    setPasswordError(error);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, confirmPassword: value }));
    if (formData.password !== value) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.country) {
      setCountryError("Please select a country.");
      return;
    } else {
      setCountryError(null);
    }

    if (passwordError || confirmPasswordError) {
        setFormMessage("Please fix the errors before submitting.");
        return;
    }
    setFormMessage(null);
    setIsSubmitting(true);

    try {
        const data = { 
            ...formData, 
            new_name: `${formData.firstName} ${formData.lastName}`, 
            iso3: formData.country, 
            new_email: formData.email, 
            new_position: formData.position, 
            new_password: formData.password,
         };

        const response = await registerContributor({ ...data });
        if (response?.status === 200) {
            setFormMessage(`${response.message}`);
            window.location.href = "/login"; // Redirect to login after successful registration
        } else {
            setFormMessage(`Error: ${response?.message || "Unknown error occurred"}`);
        }
    } catch (error) {
        if (error instanceof Error) {
            setFormMessage(`Error: ${error.message || "An error occurred during registration"}`);
        } else {
            setFormMessage("Error: An unknown error occurred during registration");
        }
    } finally {
      setIsSubmitting(false);
    }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-bold font-space-mono">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="John"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="w-full border border-black p-2"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-bold font-space-mono">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            className="w-full border border-black p-2"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-bold font-space-mono">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="john.doe@example.com"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full border border-black p-2"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="organization" className="text-sm font-bold font-space-mono">
          Organization
        </label>
        <input
          id="organization"
          name="organization"
          type="text"
          placeholder="Your organization"
          value={formData.organization}
          onChange={handleInputChange}
          className="w-full border border-black p-2"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="role" className="text-sm font-bold font-space-mono">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          required
          className="w-full border border-black p-2 bg-white"
        >
          <option value="">Select your role</option>
          <option value="development-practitioner">Development Practitioner</option>
          <option value="researcher">Researcher</option>
          <option value="solution-mapper">Solution Mapper</option>
          <option value="policy-maker">Policy Maker</option>
          <option value="academic">Academic</option>
          <option value="consultant">Consultant</option>
          <option value="student">Student</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="space-y-2 relative">
        <label htmlFor="country" className="text-sm font-bold font-space-mono">
          Country
        </label>
        <input
          type="text"
          id="country"
          name="country"
          placeholder="Search for country"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Delay to allow selection
          required 
          className="w-full border border-black p-2"
        />
        {showDropdown && (
          <ul className="absolute z-10 bg-white border border-black w-full max-h-40 overflow-y-auto list-none p-0">
            {filteredCountries.map((country) => (
              <li
                key={country.iso3}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, country: country.iso3 }));
                  setSearchTerm(country.country);
                  setShowDropdown(false);
                }}
                className="p-2 hover:bg-[#d2f960] cursor-pointer"
              >
                {country.country} 
              </li>
            ))}
          </ul>
        )}
        {countryError && <p className="text-red-500 text-sm">{countryError}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="position" className="text-sm font-bold font-space-mono">
          Job Title
        </label>
        <input
          id="position"
          name="position"
          type="text"
          placeholder="Your job title"
          value={formData.position}
          onChange={handleInputChange}
          className="w-full border border-black p-2"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-bold font-space-mono">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handlePasswordChange}
          required
          className="w-full border border-black p-2"
        />
        {passwordError && (
          <p className="text-red-500 text-sm">{passwordError}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-bold font-space-mono">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
          className="w-full border border-black p-2"
        />
        {confirmPasswordError && (
          <p className="text-red-500 text-sm">{confirmPasswordError}</p>
        )}
      </div>

      {formMessage && (
        <p className={`text-sm ${formMessage.includes("Success") ? "text-green-500" : "text-red-500"}`}>
          {formMessage}
        </p>
      )}

      <div className="my-4" />
      <Button
        type="submit"
        className={`detach w-full py-2 px-4 relative z-10 text-black font-bold ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isSubmitting}
      >
        <span className="relative z-10">{isSubmitting ? "Submitting..." : "Create Account"}</span>
      </Button>
    </form>
  )
}
