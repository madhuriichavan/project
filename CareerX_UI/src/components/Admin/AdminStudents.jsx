import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";
import toast from "react-hot-toast";

export const AdminStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllStudents();
      setStudents(response.data || []);
    } catch (error) {
      toast.error("Failed to load students");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (userId) => {
    try {
      const response = await adminAPI.getStudentDetails(userId);
      setSelectedStudent(response.data);
    } catch (error) {
      toast.error("Failed to load student details");
      console.error(error);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedStudent) {
    return (
      <div className="bg-[#F5EFE8] min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-4">
          <button
            onClick={() => setSelectedStudent(null)}
            className="mb-4 text-[#567C8D] hover:text-[#2F4156] font-medium"
          >
            ← Back to Students List
          </button>

          <div className="bg-white p-8 rounded-2xl shadow">
            <h1 className="text-3xl font-bold text-[#2F4156] mb-6">
              Student Details
            </h1>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-[#2F4156] mb-4">
                  Basic Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-700">Name:</span>
                    <span className="ml-2 text-[#2F4156]">
                      {selectedStudent.name}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Email:</span>
                    <span className="ml-2 text-[#2F4156]">
                      {selectedStudent.email}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Age:</span>
                    <span className="ml-2 text-[#2F4156]">
                      {selectedStudent.age}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Location:</span>
                    <span className="ml-2 text-[#2F4156]">
                      {selectedStudent.location || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>

              {selectedStudent.studentProfile && (
                <div>
                  <h2 className="text-xl font-semibold text-[#2F4156] mb-4">
                    Profile Information
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <span className="font-semibold text-gray-700">
                        Education Level:
                      </span>
                      <span className="ml-2 text-[#2F4156]">
                        {selectedStudent.studentProfile.currentEducationLevel}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Stream:</span>
                      <span className="ml-2 text-[#2F4156]">
                        {selectedStudent.studentProfile.stream || "Not specified"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">
                        Career Interest:
                      </span>
                      <span className="ml-2 text-[#2F4156]">
                        {selectedStudent.studentProfile.areasOfInterest ||
                          "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedStudent.assessments &&
              selectedStudent.assessments.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-[#2F4156] mb-4">
                    Assessment History
                  </h2>
                  <div className="space-y-4">
                    {selectedStudent.assessments.map((assessment) => (
                      <div
                        key={assessment.studentAssessmentId}
                        className="border border-[#C8D9E6] rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-[#2F4156]">
                              {assessment.title || "Career Assessment"}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Score: {assessment.score?.toFixed(2) || "N/A"}%
                            </p>
                            <p className="text-sm text-gray-600">
                              Completed:{" "}
                              {new Date(
                                assessment.completedAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              assessment.isCompleted
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {assessment.isCompleted ? "Completed" : "In Progress"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {selectedStudent.payments && selectedStudent.payments.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-[#2F4156] mb-4">
                  Payment History
                </h2>
                <div className="space-y-4">
                  {selectedStudent.payments.map((payment) => (
                    <div
                      key={payment.paymentId}
                      className="border border-[#C8D9E6] rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-[#2F4156]">
                            ₹{payment.amount}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            payment.paymentStatus === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {payment.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5EFE8] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#2F4156] mb-8">
          Student Management
        </h1>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#567C8D]"
          />
        </div>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-[#2F4156]">Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center">
            <p className="text-[#2F4156]">
              {searchTerm
                ? "No students found matching your search."
                : "No students registered yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((student) => (
              <div
                key={student.userId}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-[#C8D9E6] rounded-full flex items-center justify-center">
                    <span className="text-[#2F4156] font-semibold text-lg">
                      {student.name?.charAt(0).toUpperCase() || "S"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2F4156]">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Age:</span>
                    <span className="text-[#2F4156]">{student.age}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Location:</span>
                    <span className="text-[#2F4156]">
                      {student.location || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Profile:</span>
                    <span
                      className={
                        student.hasProfile
                          ? "text-green-600 font-semibold"
                          : "text-orange-600 font-semibold"
                      }
                    >
                      {student.hasProfile ? "Complete" : "Incomplete"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewDetails(student.userId)}
                  className="w-full bg-[#2F4156] text-white py-2 rounded-lg hover:bg-[#567C8D] transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

