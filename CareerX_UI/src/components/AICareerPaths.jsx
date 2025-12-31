import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { paymentAPI, roadmapAPI } from "../services/api";
import toast from "react-hot-toast";

export const AICareerPaths = () => {
  const navigate = useNavigate();
  const [hasPayment, setHasPayment] = useState(false);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPath, setSelectedPath] = useState(null);

  useEffect(() => {
    checkPaymentAndLoadRoadmaps();
  }, []);

  const checkPaymentAndLoadRoadmaps = async () => {
    try {
      // Check if user has completed payment
      const paymentResponse = await paymentAPI.getPaymentHistory();
      const hasCompletedPayment = paymentResponse.data?.some(p => p.status === "Completed");
      
      if (hasCompletedPayment) {
        setHasPayment(true);
        // Load roadmaps
        const roadmapResponse = await roadmapAPI.getMyRoadmaps();
        if (roadmapResponse.data && roadmapResponse.data.length > 0) {
          const latestRoadmap = roadmapResponse.data[0];
          const careerOptions = JSON.parse(latestRoadmap.careerOptions || "[]");
          setRoadmaps(careerOptions);
        }
      } else {
        setHasPayment(false);
      }
    } catch (error) {
      console.error("Failed to check payment status:", error);
      setHasPayment(false);
    } finally {
      setLoading(false);
    }
  };

  const aiGeneratedPaths = [
    {
      id: 1,
      title: "Software Development Engineer",
      matchPercentage: 92,
      description:
        "Based on your strong analytical skills, interest in technology, and problem-solving abilities, software engineering is an excellent fit for you.",
      whyRecommended: [
        "High score in logical reasoning assessment (85%)",
        "Strong interest in technology and programming",
        "Excellent problem-solving capabilities",
        "Preference for structured work environment",
      ],
      careerPath: {
        immediate: [
          "Complete B.Tech in Computer Science/IT",
          "Learn programming languages (Python, Java, JavaScript)",
          "Build 3-5 personal projects",
          "Practice data structures and algorithms",
        ],
        shortTerm: [
          "Secure internship at tech company",
          "Contribute to open-source projects",
          "Get cloud certifications (AWS/Azure)",
          "Develop full-stack development skills",
        ],
        longTerm: [
          "Join as Software Engineer (₹6-12 LPA)",
          "Specialize in AI/ML, Web Dev, or Mobile",
          "Progress to Senior Engineer (₹15-25 LPA)",
          "Consider leadership roles or entrepreneurship",
        ],
      },
      skills: ["Programming", "Problem Solving", "System Design", "Teamwork"],
      salary: "₹6-25 LPA",
      growth: "Very High",
      companies: ["Google", "Microsoft", "Amazon", "Flipkart", "Zomato"],
    },
  ];

  /* ===================== PAYMENT GATE ===================== */
  if (loading) {
    return (
      <div className="bg-[#F5EFE8] min-h-screen py-8 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!hasPayment) {
    return (
      <div className="bg-[#F5EFE8] min-h-screen py-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-xl">
          <h2 className="text-2xl font-bold text-[#2F4156] mb-4">
            Unlock Personalized Career Guidance
          </h2>
          <p className="text-[#2F4156] mb-6">
            Complete an assessment and make a payment to view your personalized AI-generated career roadmap.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/assessments")}
              className="px-6 py-3 border border-[#2F4156] text-[#2F4156] rounded-lg hover:bg-[#C8D9E6]"
            >
              Take Assessment
            </button>
            <button
              onClick={() => navigate("/payment")}
              className="px-6 py-3 bg-[#2F4156] text-white rounded-lg hover:bg-[#567C8D]"
            >
              Make Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ===================== SELECTED PATH VIEW ===================== */
  if (selectedPath) {
    const path = selectedPath;

    return (
      <div className="bg-[#F5EFE8] min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => setSelectedPath(null)}
            className="mb-6 text-[#567C8D]"
          >
            ← Back to Career Paths
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-[#2F4156] mb-4">
              {path.title}
            </h1>
            <p className="text-[#2F4156] mb-6">{path.description}</p>
          </div>
        </div>
      </div>
    );
  }

  /* ===================== LIST VIEW ===================== */
  return (
    <div className="bg-[#F5EFE8] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-[#2F4156] mb-12">
          AI-Generated Career Recommendations
        </h1>

        {roadmaps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#2F4156] mb-4">No career recommendations available yet.</p>
            <button
              onClick={() => navigate("/roadmap")}
              className="px-6 py-3 bg-[#2F4156] text-white rounded-lg hover:bg-[#567C8D]"
            >
              Generate Roadmap
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {roadmaps.map((path, index) => (
              <div
                key={index}
                onClick={() => setSelectedPath(path)}
                className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold text-[#2F4156] mb-3">
                  {path.careerName || `Career Option ${index + 1}`}
                </h3>
                <p className="text-sm text-[#2F4156] mb-4">
                  {path.whyFit || "Personalized career path based on your assessment"}
                </p>
                {path.fitScore && (
                  <div className="mb-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      Match: {path.fitScore}%
                    </span>
                  </div>
                )}
                <button className="w-full bg-[#2F4156] text-white py-2 rounded-lg hover:bg-[#567C8D]">
                  View Detailed Path
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
