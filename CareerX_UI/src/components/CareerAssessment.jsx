import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assessmentAPI } from "../services/api";
import { AssessmentWithWebcam } from "./AssessmentWithWebcam";
import toast from "react-hot-toast";

export const StudentAssessmentss = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startedAssessmentId, setStartedAssessmentId] = useState(null);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const response = await assessmentAPI.getAvailableAssessments();
      // Response will have canTakeAssessment, hasInProgress, etc.
      setAssessments(response.data);
    } catch (error) {
      toast.error("Failed to load assessments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = async () => {
    try {
      setLoading(true);
      // Navigate to dedicated assessment page
      navigate('/assessment');
    } catch (error) {
      toast.error("Failed to start assessment. Please complete your profile first.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !assessments) {
    return (
      <div className="bg-[#F5EFE8] min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-4 text-center text-[#2F4156]">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5EFE8] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#2F4156] mb-10 text-center">
          Career Assessment
        </h1>

        {loading ? (
          <div className="text-center text-[#2F4156]">
            <p>Loading...</p>
          </div>
        ) : assessments?.hasCompleted ? (
          <div className="bg-white p-8 rounded-2xl shadow text-center">
            <h2 className="text-2xl font-bold text-[#2F4156] mb-4">
              Assessment Completed
            </h2>
            <p className="text-[#2F4156] mb-6">
              You have already completed the assessment. Check your dashboard for results.
            </p>
            <button
              onClick={() => navigate('/studentdashboard')}
              className="bg-[#2F4156] text-white px-6 py-3 rounded-lg hover:bg-[#567C8D]"
            >
              Go to Dashboard
            </button>
          </div>
        ) : !assessments?.canTakeAssessment ? (
          <div className="bg-white p-8 rounded-2xl shadow text-center">
            <h2 className="text-2xl font-bold text-[#2F4156] mb-4">
              Profile Required
            </h2>
            <p className="text-[#2F4156] mb-6">
              {assessments?.message || "Please complete your student profile before taking the assessment."}
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="bg-[#2F4156] text-white px-6 py-3 rounded-lg hover:bg-[#567C8D]"
            >
              Complete Profile
            </button>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-bold text-[#2F4156] mb-4">
              AI-Generated Career Assessment
            </h2>

            <p className="text-[#2F4156] mb-6">
              Take our comprehensive 60-question assessment to receive personalized career recommendations based on your profile, skills, and interests.
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <span className="text-[#567C8D] text-xl">📝</span>
                <div>
                  <p className="font-semibold text-[#2F4156]">60 Questions</p>
                  <p className="text-sm text-gray-600">Covers logical reasoning, technical skills, and career interests</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#567C8D] text-xl">⏱️</span>
                <div>
                  <p className="font-semibold text-[#2F4156]">60 Minutes Duration</p>
                  <p className="text-sm text-gray-600">Complete at your own pace within the time limit</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#567C8D] text-xl">📹</span>
                <div>
                  <p className="font-semibold text-[#2F4156]">Webcam Required</p>
                  <p className="text-sm text-gray-600">For assessment monitoring and integrity</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#567C8D] text-xl">🎯</span>
                <div>
                  <p className="font-semibold text-[#2F4156]">Personalized Results</p>
                  <p className="text-sm text-gray-600">Receive AI-powered career recommendations and detailed PDF report</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartAssessment}
              disabled={loading}
              className="w-full bg-[#2F4156] text-white py-3 rounded-lg hover:bg-[#567C8D] transition font-medium disabled:opacity-50"
            >
              {loading ? "Starting Assessment..." : "Start Assessment"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
