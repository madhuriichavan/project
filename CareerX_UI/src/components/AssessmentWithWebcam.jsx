import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { assessmentAPI } from "../services/api";
import toast from "react-hot-toast";
import "../assessment.css";

export const AssessmentWithWebcam = ({ studentAssessmentId: initialStudentAssessmentId }) => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [studentAssessmentId, setStudentAssessmentId] = useState(initialStudentAssessmentId);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  useEffect(() => {
    if (initialStudentAssessmentId) {
      // If we already have a studentAssessmentId from a previous session, 
      // we need to restart the assessment - the API doesn't support resuming
      // So we start a new one
      startAssessment();
    } else {
      // Start a new assessment
      startAssessment();
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !timeUp && !loading) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !timeUp && !loading) {
      setTimeUp(true);
      toast.error("Time's up! Submitting your assessment...");
      handleSubmit();
    }
  }, [timeLeft, timeUp, loading]);

  const startAssessment = async () => {
    try {
      setLoading(true);
      const response = await assessmentAPI.startAssessment();
      setQuestions(response.data.questions || []);
      setStudentAssessmentId(response.data.studentAssessmentId);
      setTimeLeft((response.data.durationMinutes || 60) * 60);
      
      if (response.data.webcamRequired) {
        requestWebcamPermission();
      }
    } catch (error) {
      toast.error("Failed to start assessment");
      navigate("/assessments");
    } finally {
      setLoading(false);
    }
  };

  const requestWebcamPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setWebcamEnabled(true);
      stream.getTracks().forEach(track => track.stop()); // Stop to restart with Webcam component
    } catch (error) {
      toast.error("Webcam access denied. Assessment will continue without webcam.");
    }
  };

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.length !== questions.length) {
      if (!confirm("You haven't answered all questions. Submit anyway?")) {
        return;
      }
    }

    try {
      setSubmitting(true);
      
      // Capture webcam image if enabled
      let webcamUrl = null;
      if (webcamRef.current && webcamEnabled) {
        webcamUrl = webcamRef.current.getScreenshot();
      }

      await assessmentAPI.submitAssessment(studentAssessmentId, {
        answers: answers,
        webcamRecordingUrl: webcamUrl
      });

      toast.success("Assessment submitted successfully! Check your email for the detailed report.");
      navigate("/studentdashboard");
    } catch (error) {
      toast.error("Failed to submit assessment");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading assessment...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">No questions available</div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-[#F5EFE8] flex">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-16 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-40">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-[#2F4156] mb-4">Questions</h3>
          <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition ${
                  answers[index] !== undefined
                    ? "bg-green-500 text-white border-green-500"
                    : index === currentQuestion
                    ? "bg-[#2F4156] text-white border-[#2F4156]"
                    : "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
                }`}
              >
                <span className="font-medium">Q{index + 1}</span>
                <div className={`w-3 h-3 rounded-full ${
                  answers[index] !== undefined ? "bg-white" : "bg-red-500"
                }`}></div>
              </button>
            ))}
          </div>
          
          {/* Timer in Sidebar */}
          <div className="mt-6 p-3 bg-[#F5EFE8] rounded-lg">
            <p className="text-sm font-medium text-[#2F4156]">Time Remaining</p>
            <p className="text-xl font-bold text-[#2F4156]">{formatTime(timeLeft)}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-[#2F4156]">
                Question {currentQuestion + 1} of {questions.length}
              </h2>
              <p className="text-sm text-gray-600">
                {answers.filter(a => a !== undefined).length} of {questions.length} answered
              </p>
            </div>
            {webcamEnabled && (
              <div className="w-32 h-24">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={128}
                  height={96}
                  videoConstraints={{
                    width: 128,
                    height: 96,
                    facingMode: "user"
                  }}
                />
              </div>
            )}
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h3 className="text-2xl font-semibold text-[#2F4156] mb-6">
              {question.questionText || question.question}
            </h3>

            <div className="space-y-3">
              {(question.options || []).map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    answers[currentQuestion] === index
                      ? "border-[#2F4156] bg-[#C8D9E6]"
                      : "border-gray-300 hover:border-[#567C8D]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-white rounded-lg shadow-md p-4 flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400"
            >
              Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-[#2F4156] text-white rounded-lg hover:bg-[#567C8D] disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Assessment"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-[#2F4156] text-white rounded-lg hover:bg-[#567C8D]"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

