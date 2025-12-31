import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const images = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f", // students studying
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d", // teamwork
  "https://images.unsplash.com/photo-1556761175-4b46a572b786", // planning future
];

export const HomePage = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      x: 80, // start from right
    },
    visible: {
      opacity: 1,
      x: 0, // move to normal position
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="bg-[#F5EFE8] min-h-screen">
      <div className="w-full h-[250px] md:h-[500px] overflow-hidden">
        <img
          src={images[current]}
          alt="Career guidance"
          className="w-full h-full object-cover transition-all duration-700"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-10 text-center">
          Turn your idea into a practical career path
        </h1>

        <div className="grid gap-16">
          {/* ROW 1: Image | Text */}
          <div className="grid md:grid-cols-2 gap-10 items-center bg-white p-4 rounded-xl shadow-sm">
            {/* Image */}
            <div className="flex justify-center">
              <img
                src="https://i.postimg.cc/cLstL7mj/1.jpg"
                alt="Discover your path"
                className="w-72 h-72 rounded-2xl 
                   transition-transform duration-300 
                   hover:scale-105"
              />
            </div>

            {/* Text */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-[#2F4156] mb-3">
                Not sure where you fit?
              </h3>
              <p className="text-[#2F4156]">
                Let’s discover your interests and strengths through guided
                assessments and personalized insights.
              </p>
            </div>
          </div>

          {/* ROW 2: Text | Image */}
          <div className="grid md:grid-cols-2 gap-10 items-center bg-white p-4 rounded-xl shadow-sm">
            {/* Text */}
            <div className="text-center md:text-left order-2 md:order-1">
              <h3 className="text-2xl font-bold text-[#2F4156] mb-3">
                You have a goal
              </h3>
              <p className="text-[#2F4156]">
                We help you reach it with a clear career roadmap, skill
                guidance, and job readiness support.
              </p>
            </div>

            {/* Image */}
            <div className="flex justify-center order-1 md:order-2">
              <img
                src="https://i.postimg.cc/kXCBTNkB/2.jpg"
                alt="Build your roadmap"
                className="w-72 h-72 rounded-2xl 
                   transition-transform duration-300 
                   hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* 3rd dive */}
        <div className="mt-14 text-center">
          <h2 className="text-2xl font-semibold text-[#2F4156] mb-4">
            Need some guidance?
          </h2>
          <Link
            to="/signup"
            className="inline-block bg-[#2F4156] text-white px-8 py-3 rounded-lg hover:bg-[#567C8D] transition"
          >
            Start Your Journey
          </Link>
        </div>
      </div>
      <div>
        <motion.div
          className="max-w-7xl mx-auto px-4 py-14 bg-[#FFFFFF] min-h-screen"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center text-[#2F4156] mb-12"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            What We Offer
          </motion.h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Aptitude & Interest Assessments",
                desc: "Short, easy-to-understand tests to evaluate your interests, strengths, and abilities for better career alignment.",
              },
              {
                title: "AI-Based Career Guidance",
                desc: "Personalized career suggestions powered by AI based on your assessment results and preferences.",
              },
              {
                title: "Complete Career Roadmap",
                desc: "Step-by-step guidance showing courses, skills, certifications, and milestones needed to achieve your career goals.",
              },
              {
                title: "Guidance from Class 10/12 to Job",
                desc: "Clear guidance for stream selection after 10th, course choices after 12th, graduation paths, and job opportunities.",
              },
              {
                title: "Course & College Information",
                desc: "Explore available degree programs, skill-based courses, and colleges with eligibility and future prospects.",
              },
              {
                title: "Skill Development & Job Readiness",
                desc: "Recommended skills, online resources, and career preparation tips to improve employability.",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                className="bg-[#C8D9E6] p-6 rounded-xl shadow-sm"
                variants={cardVariants}
              >
                <h3 className="text-xl font-semibold text-[#2F4156] mb-3">
                  {service.title}
                </h3>
                <p className="text-[#2F4156]">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
