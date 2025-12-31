import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import Img from "../../assets/loginimg.png";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  const passwordRegex = /^.{6,}$/;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await authAPI.login({ email, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        const user = response.data.user || {};
        localStorage.setItem('user', JSON.stringify({
          id: user.id || '',
          email: user.email || '',
          name: user.name || (user.email ? user.email.split('@')[0] : 'User'),
          role: user.role || 'Student'
        }));
      }

      toast.success("Login successful");
      const userRole = response.data.user?.role || 'Student';
      if (userRole === "Student") {
        setTimeout(() => navigate("/studentdashboard"), 1200);
      } else if (userRole === "Admin") {
        setTimeout(() => navigate("/admindashboard"), 1200);
      }

    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = "Login failed";

      if (error.response) {
        errorMessage = error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "Cannot connect to server. Please ensure your backend API is running on http://localhost:5086";
      } else {
        errorMessage = error.message || "An unexpected error occurred";
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5EFE8] px-4">
      <Toaster position="top-center" />

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden md:flex">
        <div className="hidden md:block md:w-1/2 bg-[#C8D9E6]">
          <img
            src={Img}
            alt="Student Login"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-[#2F4156]">CareerX</h2>
            <p className="text-sm text-[#567C8D] mt-2">
              Login using your registered Email ID
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#2F4156] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@email.com"
                className="w-full rounded-lg border border-[#C8D9E6] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#567C8D]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2F4156] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#C8D9E6] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#567C8D]"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#567C8D] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-[#2F4156]"
                />
                Remember me
              </label>

              <span
                onClick={() => navigate("/forgot-password")}
                className="text-[#2F4156] cursor-pointer hover:underline"
              >
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#2F4156] py-2.5 text-white font-medium hover:bg-[#567C8D] transition duration-200 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-[#567C8D] mt-6">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="font-medium text-[#2F4156] cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}