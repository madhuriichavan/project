import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { profileAPI, assessmentAPI } from "../services/api";
import toast from "react-hot-toast";

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("Student");
  const [profilePicture, setProfilePicture] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setUserName(parsedUser.userName || parsedUser.name || "Student");
    }

    fetchProfile();
    fetchAssessments();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileAPI.getProfile();
      if (response.data) {
        setUserName(response.data.generalInformation.name || userName);
        // Profile picture would come from user profile
      }
    } catch (error) {
      // Profile might not exist yet
      console.log("Profile not found");
    }
  };

  const fetchAssessments = async () => {
    try {
      const response = await assessmentAPI.getMyAssessments();
      setAssessments(response.data || []);
    } catch (error) {
      console.error("Failed to fetch assessments");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    toast.success("Logged out successfully");
  };

  return (
    <div className="bg-[#F5EFE8] min-h-screen">

      {/* DASHBOARD CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-8 lg:grid-cols-4">

        {/* MAIN SECTION */}
        <div className="lg:col-span-3 space-y-10">

          {/* Welcome Header */}
          <div className="bg-gradient-to-r from-[#C8D9E6] to-[#F5EFE8] 
                          p-8 rounded-2xl shadow-sm">
            <h1 className="text-3xl font-bold text-[#2F4156]">
              Welcome to CareerX 👋
            </h1>
            <p className="text-[#2F4156] mt-2">
              Hello <span className="font-semibold">{userName}</span>, let's
              shape your future together.
            </p>
          </div>

          {/* DASHBOARD CARDS */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {/* Assessments */}
            <div className="bg-white p-6 rounded-xl shadow-sm 
                            hover:-translate-y-1 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-[#2F4156] mb-2">
                Career Assessments
              </h3>
              <p className="text-sm text-[#2F4156] mb-4">
                Discover your strengths through aptitude and interest tests.
              </p>
              <Link
                to="/assessments"
                className="text-[#567C8D] font-medium hover:underline"
              >
                Take Test →
              </Link>
            </div>

            {/* Explore */}
            <div className="bg-white p-6 rounded-xl shadow-sm 
                            hover:-translate-y-1 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-[#2F4156] mb-2">
                Explore Careers
              </h3>
              <p className="text-sm text-[#2F4156] mb-4">
                Learn about career roles, skills, and opportunities.
              </p>
              <Link
                to="/explore-careers"
                className="text-[#567C8D] font-medium hover:underline"
              >
                Explore →
              </Link>
            </div>

            {/* Roadmap */}
            <div className="bg-white p-6 rounded-xl shadow-sm 
                            hover:-translate-y-1 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-[#2F4156] mb-2">
                Career Roadmap
              </h3>
              <p className="text-sm text-[#2F4156] mb-4">
                View your personalized step-by-step career plan.
              </p>
              <Link
                to="/roadmap"
                className="text-[#567C8D] font-medium hover:underline"
              >
                View Roadmap →
              </Link>
            </div>

            {/* AI Career Paths */}
            <div className="bg-white p-6 rounded-xl shadow-sm 
                            hover:-translate-y-1 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-[#2F4156] mb-2">
                AI Career Recommendations
              </h3>
              <p className="text-sm text-[#2F4156] mb-4">
                Get personalized career paths based on your profile.
              </p>
              <Link
                to="/ai-career-paths"
                className="text-[#567C8D] font-medium hover:underline"
              >
                View Paths →
              </Link>
            </div>

            {/* Chatbot */}
            <div className="bg-white p-6 rounded-xl shadow-sm 
                            hover:-translate-y-1 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-[#2F4156] mb-2">
                AI Career Advisor
              </h3>
              <p className="text-sm text-[#2F4156] mb-4">
                Chat with AI for instant career guidance and tips.
              </p>
              <Link
                to="/chatbot"
                className="text-[#567C8D] font-medium hover:underline"
              >
                Start Chat →
              </Link>
            </div>

            {/* Blogs */}
            <div className="bg-white p-6 rounded-xl shadow-sm 
                            hover:-translate-y-1 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-[#2F4156] mb-2">
                Career Blogs
              </h3>
              <p className="text-sm text-[#2F4156] mb-4">
                Read latest insights and tips from career experts.
              </p>
              <Link
                to="/blogs"
                className="text-[#567C8D] font-medium hover:underline"
              >
                Read Blogs →
              </Link>
            </div>
          </div>

          {/* Assessment History */}
          {assessments.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-2xl font-semibold text-[#2F4156] mb-4">
                Your Assessment History
              </h2>
              <div className="space-y-3">
                {assessments.slice(0, 3).map((assessment) => (
                  <div
                    key={assessment.studentAssessmentId}
                    className="border border-[#C8D9E6] rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-[#2F4156]">
                          {assessment.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {assessment.score !== null
                            ? `Score: ${assessment.score.toFixed(1)}%`
                            : "In Progress"}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(assessment.completedAt || assessment.startedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation Banner */}
          <div className="bg-[#C8D9E6] p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold text-[#2F4156] mb-1">
              Personalized Guidance
            </h2>
            <p className="text-[#2F4156]">
              Complete your profile and assessments to unlock AI-based career
              recommendations.
            </p>
          </div>
        </div>

        {/* RIGHT PROFILE PANEL */}
        <div className="bg-white p-6 rounded-2xl shadow-md 
                        h-fit sticky top-24">

          {/* Profile Photo Placeholder */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto rounded-full 
                            bg-[#C8D9E6] overflow-hidden 
                            flex items-center justify-center">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm text-[#2F4156]">
                  {userName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <h3 className="mt-4 font-semibold text-[#2F4156]">
              {userName}
            </h3>
            <p className="text-sm text-[#2F4156]">
              Student
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="space-y-4">
            <Link
              to="/profile"
              className="block w-full text-center bg-[#2F4156] 
                         text-white py-2 rounded-lg 
                         hover:bg-[#567C8D] transition"
            >
              Edit Profile
            </Link>

            <button
              onClick={handleLogout}
              className="block w-full text-center bg-red-500 
                         text-white py-2 rounded-lg 
                         hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

