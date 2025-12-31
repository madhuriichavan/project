import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { roadmapAPI, paymentAPI } from "../services/api";
import toast from "react-hot-toast";
import { PaymentPage } from "./PaymentPage";

export const CareerRoadmap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [hasPayment, setHasPayment] = useState(false);

  useEffect(() => {
    fetchRoadmaps();
    checkPaymentStatus();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      const response = await roadmapAPI.getMyRoadmaps();
      if (response.data && response.data.length > 0) {
        const latestRoadmap = response.data[0];
        setRoadmaps(latestRoadmap.roadmap || []);
        setSelectedCareer(latestRoadmap.careerOptions?.[0] || 'software-engineer');
        setHasPayment(true);
      } else if (location.state?.roadmap) {
        setRoadmaps(location.state.roadmap.roadmap || []);
        setSelectedCareer(location.state.roadmap.careerOptions?.[0] || 'software-engineer');
        setHasPayment(true);
      } else {
        // Use default career when no API data
        setSelectedCareer('software-engineer');
        setHasPayment(true);
      }
    } catch (error) {
      console.error("API unavailable, using static data", error);
      // Fallback to static data when API is unavailable
      setSelectedCareer('software-engineer');
      setHasPayment(true);
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const response = await paymentAPI.getPaymentHistory();
      if (response.data && response.data.some(p => p.status === "Completed")) {
        setHasPayment(true);
      }
    } catch (error) {
      console.error("Payment API unavailable, allowing access");
      // Allow access when payment API is unavailable
      setHasPayment(true);
    }
  };

  if (showPayment && !hasPayment) {
    return <PaymentPage />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading roadmap...</div>
      </div>
    );
  }

  const careerRoadmaps = {
    'software-engineer': {
      title: 'Software Engineer',
      description: 'Build applications, websites, and software systems',
      timeline: [
        {
          phase: 'Foundation',
          duration: '1-2 years',
          title: 'Build Strong Fundamentals',
          items: [
            'Complete 12th with Mathematics/Computer Science',
            'Learn basic programming (Python/Java)',
            'Understand computer fundamentals',
            'Practice logical thinking and problem-solving'
          ],
          color: 'bg-blue-100 border-blue-300'
        },
        {
          phase: 'Education',
          duration: '3-4 years',
          title: 'Formal Education & Skills',
          items: [
            'Pursue B.Tech/B.E in Computer Science or related field',
            'Master programming languages (Java, Python, JavaScript)',
            'Learn data structures and algorithms',
            'Study database management and web technologies',
            'Work on personal projects and build portfolio'
          ],
          color: 'bg-green-100 border-green-300'
        },
        {
          phase: 'Skill Development',
          duration: '6 months - 1 year',
          title: 'Advanced Skills & Certifications',
          items: [
            'Learn frameworks (React, Angular, Spring Boot)',
            'Get cloud certifications (AWS, Azure)',
            'Practice system design concepts',
            'Contribute to open-source projects',
            'Build full-stack applications'
          ],
          color: 'bg-purple-100 border-purple-300'
        },
        {
          phase: 'Experience',
          duration: '6 months - 1 year',
          title: 'Gain Practical Experience',
          items: [
            'Apply for internships at tech companies',
            'Work on real-world projects',
            'Learn version control (Git) and collaboration',
            'Understand software development lifecycle',
            'Network with industry professionals'
          ],
          color: 'bg-orange-100 border-orange-300'
        },
        {
          phase: 'Job Readiness',
          duration: '2-3 months',
          title: 'Prepare for Career Launch',
          items: [
            'Create impressive resume and LinkedIn profile',
            'Practice coding interviews and technical questions',
            'Apply to entry-level software engineer positions',
            'Prepare for behavioral interviews',
            'Negotiate job offers and start career'
          ],
          color: 'bg-red-100 border-red-300'
        }
      ]
    },
    'data-scientist': {
      title: 'Data Scientist',
      description: 'Analyze data to extract insights and build predictive models',
      timeline: [
        {
          phase: 'Foundation',
          duration: '1-2 years',
          title: 'Mathematical & Statistical Foundation',
          items: [
            'Strong background in Mathematics and Statistics',
            'Learn basic programming (Python/R)',
            'Understand probability and statistical concepts',
            'Develop analytical thinking skills'
          ],
          color: 'bg-blue-100 border-blue-300'
        },
        {
          phase: 'Education',
          duration: '3-4 years',
          title: 'Formal Education',
          items: [
            'B.Tech/B.Sc in Computer Science, Statistics, or Mathematics',
            'Master Python/R for data analysis',
            'Learn SQL for database querying',
            'Study machine learning algorithms',
            'Work with data visualization tools'
          ],
          color: 'bg-green-100 border-green-300'
        },
        {
          phase: 'Skill Development',
          duration: '6 months - 1 year',
          title: 'Advanced Data Science Skills',
          items: [
            'Master machine learning libraries (scikit-learn, TensorFlow)',
            'Learn big data tools (Hadoop, Spark)',
            'Get certified in cloud platforms (AWS, GCP)',
            'Practice with real datasets from Kaggle',
            'Build end-to-end ML projects'
          ],
          color: 'bg-purple-100 border-purple-300'
        },
        {
          phase: 'Experience',
          duration: '6 months - 1 year',
          title: 'Practical Experience',
          items: [
            'Internships at data-driven companies',
            'Participate in data science competitions',
            'Work on business problem-solving projects',
            'Learn domain expertise (finance, healthcare, etc.)',
            'Build portfolio of data science projects'
          ],
          color: 'bg-orange-100 border-orange-300'
        },
        {
          phase: 'Job Readiness',
          duration: '2-3 months',
          title: 'Career Preparation',
          items: [
            'Create data science portfolio website',
            'Practice case study interviews',
            'Apply for junior data scientist roles',
            'Prepare for technical and behavioral interviews',
            'Network with data science professionals'
          ],
          color: 'bg-red-100 border-red-300'
        }
      ]
    },
    'digital-marketer': {
      title: 'Digital Marketing Specialist',
      description: 'Promote brands and products through digital channels',
      timeline: [
        {
          phase: 'Foundation',
          duration: '6 months - 1 year',
          title: 'Marketing Fundamentals',
          items: [
            'Understand basic marketing principles',
            'Learn about consumer behavior',
            'Get familiar with digital platforms',
            'Develop communication and creative skills'
          ],
          color: 'bg-blue-100 border-blue-300'
        },
        {
          phase: 'Education',
          duration: '2-3 years',
          title: 'Formal Education & Skills',
          items: [
            'BBA/B.Com in Marketing or related field',
            'Learn Google Ads and Facebook Ads',
            'Master social media marketing',
            'Study SEO and content marketing',
            'Understand analytics and data interpretation'
          ],
          color: 'bg-green-100 border-green-300'
        },
        {
          phase: 'Skill Development',
          duration: '3-6 months',
          title: 'Advanced Digital Skills',
          items: [
            'Get Google Ads and Analytics certifications',
            'Learn marketing automation tools',
            'Master email marketing platforms',
            'Study conversion optimization',
            'Practice with real marketing campaigns'
          ],
          color: 'bg-purple-100 border-purple-300'
        },
        {
          phase: 'Experience',
          duration: '6 months - 1 year',
          title: 'Hands-on Experience',
          items: [
            'Internships at marketing agencies or companies',
            'Manage social media for small businesses',
            'Run personal marketing projects',
            'Build portfolio of successful campaigns',
            'Network with marketing professionals'
          ],
          color: 'bg-orange-100 border-orange-300'
        },
        {
          phase: 'Job Readiness',
          duration: '1-2 months',
          title: 'Career Launch',
          items: [
            'Create marketing portfolio showcasing results',
            'Apply for digital marketing roles',
            'Prepare for marketing case study interviews',
            'Stay updated with latest marketing trends',
            'Start career as digital marketing specialist'
          ],
          color: 'bg-red-100 border-red-300'
        }
      ]
    }
  };

  const careers = [
    { id: 'software-engineer', name: 'Software Engineer', icon: '💻' },
    { id: 'data-scientist', name: 'Data Scientist', icon: '📊' },
    { id: 'digital-marketer', name: 'Digital Marketer', icon: '📱' }
  ];

  const currentRoadmap = selectedCareer ? careerRoadmaps[selectedCareer] : null;

  if (!currentRoadmap) {
    return (
      <div className="bg-[#F5EFE8] min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#2F4156] mb-4">
              Career Roadmap
            </h1>
            <p className="text-[#2F4156] max-w-2xl mx-auto">
              Please select a career path to view the roadmap.
            </p>
          </div>
          
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-[#2F4156] mb-6 text-center">
              Choose a Career Path
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {careers.map((career) => (
                <button
                  key={career.id}
                  onClick={() => setSelectedCareer(career.id)}
                  className="px-6 py-3 rounded-lg font-medium transition bg-white text-[#2F4156] border border-[#2F4156] hover:bg-[#C8D9E6]"
                >
                  <span className="mr-2">{career.icon}</span>
                  {career.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5EFE8] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#2F4156] mb-4">
            Career Roadmap
          </h1>
          <p className="text-[#2F4156] max-w-2xl mx-auto">
            Explore step-by-step career paths with clear milestones, 
            skills, and timelines to achieve your dream job.
          </p>
        </div>

        {/* Career Selection */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-[#2F4156] mb-6 text-center">
            Choose a Career Path
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {careers.map((career) => (
              <button
                key={career.id}
                onClick={() => setSelectedCareer(career.id)}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  selectedCareer === career.id
                    ? 'bg-[#2F4156] text-white'
                    : 'bg-white text-[#2F4156] border border-[#2F4156] hover:bg-[#C8D9E6]'
                }`}
              >
                <span className="mr-2">{career.icon}</span>
                {career.name}
              </button>
            ))}
          </div>
        </div>

        {/* Roadmap Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-[#2F4156] mb-2">
            {currentRoadmap.title} Roadmap
          </h2>
          <p className="text-[#2F4156]">
            {currentRoadmap.description}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-[#567C8D] hidden md:block"></div>
          
          <div className="space-y-12">
            {currentRoadmap.timeline.map((step, index) => (
              <div key={index} className="relative">
                {/* Timeline Dot */}
                <div className="absolute left-6 w-5 h-5 bg-[#567C8D] rounded-full border-4 border-white shadow-lg hidden md:block"></div>
                
                {/* Content Card */}
                <div className="md:ml-20">
                  <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${step.color}`}>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <span className="inline-block px-3 py-1 bg-[#C8D9E6] text-[#2F4156] text-sm font-medium rounded-full mb-2">
                          {step.phase}
                        </span>
                        <h3 className="text-xl font-bold text-[#2F4156]">
                          {step.title}
                        </h3>
                      </div>
                      <div className="text-sm text-[#567C8D] font-medium">
                        ⏱️ {step.duration}
                      </div>
                    </div>
                    
                    {/* Items */}
                    <ul className="space-y-3">
                      {step.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-[#567C8D] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-[#2F4156]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Tips */}
        <div className="mt-16 bg-gradient-to-r from-[#C8D9E6] to-[#F5EFE8] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-[#2F4156] mb-6 text-center">
            Success Tips for Your Journey
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#567C8D] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-[#2F4156] mb-2">Stay Focused</h3>
              <p className="text-sm text-[#2F4156]">
                Set clear goals and track your progress regularly
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#567C8D] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="font-semibold text-[#2F4156] mb-2">Keep Learning</h3>
              <p className="text-sm text-[#2F4156]">
                Technology and industries evolve rapidly
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#567C8D] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-semibold text-[#2F4156] mb-2">Network</h3>
              <p className="text-sm text-[#2F4156]">
                Build connections with professionals in your field
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#567C8D] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💪</span>
              </div>
              <h3 className="font-semibold text-[#2F4156] mb-2">Practice</h3>
              <p className="text-sm text-[#2F4156]">
                Apply your skills through projects and real work
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#2F4156] mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-[#2F4156] mb-6">
              Take our assessments to get a personalized roadmap based on your interests and skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.history.back()}
                className="px-8 py-3 bg-[#2F4156] text-white rounded-lg hover:bg-[#567C8D] transition font-medium"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};