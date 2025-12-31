import { Toaster } from "react-hot-toast";
import { Route, Routes, useLocation } from "react-router-dom";

import { About } from "./components/About.jsx";
import ForgotPassword from "./components/Auth/ForgotPassword.jsx";
import LoginPage from "./components/Auth/Login.jsx";
import Register from "./components/Auth/Register.jsx";
import ContactPage from "./components/ContactUs.jsx";
import { Footer } from "./components/Footer.jsx";
import { HomePage } from "./components/HomePage.jsx";
import { StudentDashboard } from "./components/StudentDashboard.jsx";

import { AICareerPaths } from "./components/AICareerPaths.jsx";
import { AIChatbot } from "./components/AIChatbot.jsx";
import { CareerRoadmap } from "./components/CareerRoadmap.jsx";
import { NavBar } from "./components/NavBar.jsx";
import { StudentProfile } from "./components/StudentProfile.jsx";
import { AssessmentWithWebcam } from "./components/AssessmentWithWebcam.jsx";

import { AdminDashboard } from "./components/Admin/AdminDashboard.jsx";
import { StudentAssessments } from "./components/Admin/Assesments.jsx";
import { Blogs as AdminBlogs } from "./components/Admin/Blog.jsx";
import { BlogAdmin } from "./components/Admin/BlogAdmin.jsx";
import { ExploreCareers as AdminExploreCareers } from "./components/Admin/ExploreCareer.jsx";
import { ExploreCareerAdmin } from "./components/Admin/ExploreCareerAdmin.jsx";
import { AdminStudents } from "./components/Admin/AdminStudents.jsx";
import { ExploreCareers } from "./components/ExploreCareers.jsx";
import { Blogs } from "./components/Blogs.jsx";

import { StudentAssessmentss } from "./components/CareerAssessment.jsx";
import { PaymentPage } from "./components/PaymentPage.jsx";

function App() {
  const location = useLocation();
  
  // Check if current page should have navbar padding
  const shouldHavePadding = ![
    '/login', 
    '/register', 
    '/forgot-password', 
    '/assessment'
  ].includes(location.pathname);
  
  return (
    <>
      <NavBar />
      <div className={shouldHavePadding ? "pt-16" : ""}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/studentdashboard" element={<StudentDashboard />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/roadmap" element={<CareerRoadmap />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/chatbot" element={<AIChatbot />} />
          <Route path="/ai-career-paths" element={<AICareerPaths />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/assessments" element={<StudentAssessmentss />} />
          <Route path="/assessment" element={<AssessmentWithWebcam />} />

          <Route path="/explore-careers" element={<ExploreCareers />} />
          <Route path="/blogs" element={<Blogs />} />

          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/assessments" element={<StudentAssessments />} />
          <Route path="/admin/ExploreCareer" element={<ExploreCareerAdmin />} />
          <Route path="/admin/blogs" element={<BlogAdmin />} />
        </Routes>
      </div>
      <Footer />
      <Toaster position="top-center" />
    </>
  );
}

export default App;
