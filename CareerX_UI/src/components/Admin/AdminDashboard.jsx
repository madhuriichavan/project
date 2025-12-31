import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";
import toast from "react-hot-toast";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStudents, setShowStudents] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchStudents();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await adminAPI.getAllStudents();
      setStudents(response.data || []);
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate("/login", { replace: true });
    toast.success("Logged out successfully");
  };

  return (
    <div className="bg-[#F5EFE8] min-h-screen">

      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-8 lg:grid-cols-4">

     
        <div className="lg:col-span-4 space-y-10">

         
          <div
            className="flex items-center justify-between
                       bg-gradient-to-r from-[#C8D9E6] to-[#F5EFE8]
                       p-8 rounded-2xl shadow-sm"
          >
            <div>
              <h1 className="text-3xl font-bold text-[#2F4156]">
                Welcome Admin
              </h1>
              <p className="text-[#2F4156] mt-2">
                Manage platform content and guide students effectively.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-2 rounded-lg
                         hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>

          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            <div className="bg-white p-6 rounded-xl shadow-sm
                            hover:-translate-y-1 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-[#2F4156] mb-2">
                Student Management
              </h3>
              <p className="text-sm text-[#2F4156] mb-4">
                View and manage all student information, profiles, and assessments.
              </p>
              <Link
                to="/admin/students"
                className="text-[#567C8D] font-medium hover:underline"
              >
                Manage Students →
              </Link>
            </div>

          
            <div className="bg-white p-6 rounded-xl shadow-sm
                            hover:-translate-y-1 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-[#2F4156] mb-2">
                Career Blogs
              </h3>
              <p className="text-sm text-[#2F4156] mb-4">
                Add, edit and publish career guidance blogs.
              </p>
              <Link
                to="/admin/blogs"
                className="text-[#567C8D] font-medium hover:underline"
              >
                Manage Blogs →
              </Link>
            </div>

           
            <div className="bg-white p-6 rounded-xl shadow-sm
                            hover:-translate-y-1 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-[#2F4156] mb-2">
                Explore Careers
              </h3>
              <p className="text-sm text-[#2F4156] mb-4">
                Manage career roles, skills and opportunities.
              </p>
              <Link
                to="/admin/ExploreCareer"
                className="text-[#567C8D] font-medium hover:underline"
              >
                Manage Careers →
              </Link>
            </div>

          </div>

          {/* Statistics Section */}
          {stats && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-sm text-gray-600 mb-2">Total Students</h3>
                <p className="text-3xl font-bold text-[#2F4156]">{stats.totalStudents}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-sm text-gray-600 mb-2">Total Assessments</h3>
                <p className="text-3xl font-bold text-[#2F4156]">{stats.totalAssessments}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-sm text-gray-600 mb-2">Completed Tests</h3>
                <p className="text-3xl font-bold text-[#2F4156]">{stats.completedAssessments}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-sm text-gray-600 mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold text-[#2F4156]">₹{stats.totalRevenue?.toLocaleString() || 0}</p>
              </div>
            </div>
          )}

          {/* Student Management Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-[#2F4156]">
                Student Management
              </h2>
              <button
                onClick={() => setShowStudents(!showStudents)}
                className="px-4 py-2 bg-[#2F4156] text-white rounded-lg hover:bg-[#567C8D]"
              >
                {showStudents ? "Hide" : "View All Students"}
              </button>
            </div>

            {showStudents && (
              <div className="mt-4">
                {loading ? (
                  <p className="text-center py-4">Loading students...</p>
                ) : students.length === 0 ? (
                  <p className="text-center py-4 text-gray-600">No students registered yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#C8D9E6]">
                        <tr>
                          <th className="px-4 py-2 text-left text-[#2F4156]">Name</th>
                          <th className="px-4 py-2 text-left text-[#2F4156]">Email</th>
                          <th className="px-4 py-2 text-left text-[#2F4156]">Location</th>
                          <th className="px-4 py-2 text-left text-[#2F4156]">Profile Status</th>
                          <th className="px-4 py-2 text-left text-[#2F4156]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.userId} className="border-b">
                            <td className="px-4 py-2">{student.name}</td>
                            <td className="px-4 py-2">{student.email}</td>
                            <td className="px-4 py-2">{student.location || "N/A"}</td>
                            <td className="px-4 py-2">
                              {student.hasProfile ? (
                                <span className="text-green-600">✓ Complete</span>
                              ) : (
                                <span className="text-orange-600">Incomplete</span>
                              )}
                            </td>
                            <td className="px-4 py-2">
                              <button
                                onClick={() => {
                                  // View student details
                                  toast.info("Student details feature coming soon");
                                }}
                                className="text-[#567C8D] hover:underline"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

         
          <div className="bg-[#C8D9E6] p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold text-[#2F4156] mb-1">
              Admin Controls
            </h2>
            <p className="text-[#2F4156]">
              Keep assessments, blogs and career data up to date for students.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
