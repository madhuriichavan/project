import { useState, useRef, useEffect } from "react";

export const AIChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Career Advisor. I can help you with career guidance, course recommendations, skill development tips, and answer any questions about your career path. How can I assist you today?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock AI responses based on keywords
  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('software') || message.includes('programming') || message.includes('coding')) {
      return "Great choice! Software engineering is a high-demand field. To become a software engineer, I recommend: 1) Learn programming languages like Python, Java, or JavaScript 2) Build projects and create a portfolio 3) Practice data structures and algorithms 4) Consider a B.Tech in Computer Science 5) Gain experience through internships. Would you like specific guidance on any of these areas?";
    }
    
    if (message.includes('data science') || message.includes('machine learning') || message.includes('ai')) {
      return "Data Science is an exciting field! Here's your roadmap: 1) Strong foundation in Mathematics and Statistics 2) Learn Python/R programming 3) Master SQL for databases 4) Study machine learning algorithms 5) Work with tools like Pandas, NumPy, Scikit-learn 6) Build projects with real datasets. The average salary ranges from ₹8-20 LPA. Want me to suggest some beginner-friendly projects?";
    }
    
    if (message.includes('doctor') || message.includes('medical') || message.includes('mbbs')) {
      return "Medical career is noble and rewarding! Path to becoming a doctor: 1) Complete 12th with PCB (Physics, Chemistry, Biology) 2) Clear NEET exam 3) Complete MBBS (5.5 years) 4) Choose specialization (3 years) 5) Practice and continuous learning. It requires dedication and patience, but offers job security and social respect. Are you prepared for the long study duration?";
    }
    
    if (message.includes('engineering') || message.includes('btech')) {
      return "Engineering offers diverse opportunities! Popular branches: 1) Computer Science - Software, AI, Data Science 2) Mechanical - Manufacturing, Automotive 3) Electrical - Power, Electronics 4) Civil - Construction, Infrastructure. Consider your interests in Math, Physics, and problem-solving. Average salary: ₹3-15 LPA depending on branch and company. Which engineering field interests you most?";
    }
    
    if (message.includes('business') || message.includes('mba') || message.includes('management')) {
      return "Business and management careers are versatile! Options include: 1) Digital Marketing - Growing field with ₹4-12 LPA 2) Business Analysis - ₹5-15 LPA 3) Consulting - ₹6-20 LPA 4) Entrepreneurship - Unlimited potential. Skills needed: Communication, Leadership, Analytics, Strategic thinking. An MBA can boost your career significantly. What aspect of business interests you?";
    }
    
    if (message.includes('salary') || message.includes('pay') || message.includes('money')) {
      return "Salary varies by field and experience: 1) Software Engineer: ₹6-15 LPA 2) Data Scientist: ₹8-20 LPA 3) Doctor: ₹5-25 LPA 4) Digital Marketer: ₹4-12 LPA 5) Mechanical Engineer: ₹3-10 LPA. Remember, salary grows with experience, skills, and performance. Focus on building valuable skills first, money will follow!";
    }
    
    if (message.includes('skill') || message.includes('learn')) {
      return "Essential skills for 2024: 1) Technical: Programming, Data Analysis, Digital Marketing 2) Soft Skills: Communication, Leadership, Problem-solving 3) Digital Literacy: AI tools, Cloud platforms 4) Adaptability and Continuous Learning. I recommend focusing on both technical and soft skills. Which specific skill would you like to develop?";
    }
    
    if (message.includes('college') || message.includes('course') || message.includes('degree')) {
      return "Choosing the right course is crucial! Consider: 1) Your interests and strengths 2) Market demand and growth 3) Your career goals 4) College reputation and placement records 5) Course curriculum and practical exposure. Popular courses: B.Tech (Engineering), MBBS (Medical), BBA/B.Com (Business), B.Des (Design). What field interests you most?";
    }
    
    if (message.includes('confused') || message.includes('help') || message.includes('don\'t know')) {
      return "It's completely normal to feel confused about career choices! Here's what I suggest: 1) Take our career assessment tests 2) Explore different career options 3) Talk to professionals in fields that interest you 4) Consider your strengths and interests 5) Don't rush - take time to research. I'm here to guide you through this process. What specific area would you like to explore first?";
    }
    
    // Default response
    return "That's an interesting question! I'd be happy to help you with career guidance. Could you be more specific about what you'd like to know? I can assist with career paths, skill development, course selection, salary information, or any other career-related queries. Feel free to ask about specific fields like technology, healthcare, business, or engineering!";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: getAIResponse(inputMessage),
        sender: "ai",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "What career is best for me?",
    "How to become a software engineer?",
    "What skills should I learn?",
    "Tell me about data science career",
    "Engineering vs Medical - which is better?"
  ];

  return (
    <div className="bg-[#F5EFE8] min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2F4156] mb-4">
            AI Career Advisor
          </h1>
          <p className="text-[#2F4156]">
            Get personalized career guidance powered by AI
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Chat Header */}
          <div className="bg-[#2F4156] text-white p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#567C8D] rounded-full flex items-center justify-center mr-3">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold">AI Career Advisor</h3>
                <p className="text-sm opacity-90">Online • Ready to help</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-[#2F4156] text-white'
                      : 'bg-[#C8D9E6] text-[#2F4156]'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#C8D9E6] text-[#2F4156] px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#567C8D] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#567C8D] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-[#567C8D] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-sm text-[#567C8D] mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="text-xs bg-[#C8D9E6] text-[#2F4156] px-3 py-1 rounded-full hover:bg-[#567C8D] hover:text-white transition"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about careers..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#567C8D] focus:border-transparent resize-none"
                rows="2"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-6 py-3 bg-[#2F4156] text-white rounded-lg hover:bg-[#567C8D] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#567C8D]">
            💡 This is an AI assistant for general career guidance. For personalized advice, consider consulting with career counselors.
          </p>
        </div>
      </div>
    </div>
  );
};