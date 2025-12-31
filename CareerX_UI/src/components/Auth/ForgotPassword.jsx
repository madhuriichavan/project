import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "#",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success("Password reset link sent to your email");
      setTimeout(() => navigate("/login"), 1500);

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

       
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-[#2F4156]">
            Forgot Password
          </h2>
          <p className="text-sm text-[#567C8D] mt-2">
            Enter your registered email to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-[#2F4156] mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@email.com"
              className="w-full rounded-lg border border-[#C8D9E6] 
              px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#567C8D]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#2F4156] py-2.5
            text-white font-medium hover:bg-[#567C8D]
            transition duration-200 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

       
        <p className="text-center text-sm text-[#567C8D] mt-6">
          Remember your password?{" "}
          <span
            onClick={() => navigate("/login")}
            className="font-medium text-[#2F4156] cursor-pointer hover:underline"
          >
            Back to Sign in
          </span>
        </p>

      </div>
    </div>
  );
}
