import { useState } from "react";

export const Blogs = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);
  
  // Mock login state - in real app, this would come from context/state management
  const isLoggedIn = true; // Change to false to test login requirement

  const blogs = [
    {
      id: 1,
      title: "How to Choose the Right Career Path After 12th",
      excerpt: "A comprehensive guide to making informed decisions about your future career based on your interests and market trends.",
      content: `Choosing the right career path after 12th grade is one of the most crucial decisions in a student's life. Here are some key factors to consider:

1. **Self-Assessment**: Understand your interests, strengths, and values. Take career assessments to get insights into suitable career options.

2. **Market Research**: Research current job market trends, growth prospects, and salary ranges for different careers.

3. **Education Requirements**: Understand the educational qualifications needed for your desired career path.

4. **Talk to Professionals**: Connect with people working in fields that interest you to get real-world insights.

5. **Consider Multiple Options**: Don't limit yourself to one career path. Keep backup options and be open to emerging fields.

Remember, career choices are not permanent. You can always pivot and explore new opportunities as you grow professionally.`,
      author: "Dr. Priya Sharma",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Career Guidance",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173"
    },
    {
      id: 2,
      title: "Top 10 In-Demand Skills for 2024",
      excerpt: "Discover the most sought-after skills in today's job market and how to develop them effectively.",
      content: `The job market is constantly evolving, and staying updated with in-demand skills is crucial for career success. Here are the top 10 skills for 2024:

1. **Artificial Intelligence & Machine Learning**: Understanding AI/ML concepts and tools
2. **Data Analysis**: Ability to interpret and analyze data for decision-making
3. **Digital Marketing**: Online marketing strategies and tools
4. **Cloud Computing**: Knowledge of cloud platforms like AWS, Azure, GCP
5. **Cybersecurity**: Protecting digital assets and understanding security protocols
6. **UX/UI Design**: Creating user-friendly digital experiences
7. **Project Management**: Leading teams and managing resources effectively
8. **Communication Skills**: Clear and effective communication across all mediums
9. **Critical Thinking**: Problem-solving and analytical thinking abilities
10. **Adaptability**: Flexibility to learn and adapt to new technologies

Focus on developing a combination of technical and soft skills to stay competitive in the job market.`,
      author: "Rahul Gupta",
      date: "2024-01-10",
      readTime: "7 min read",
      category: "Skills Development",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978"
    },
    {
      id: 3,
      title: "Engineering vs Medical: Making the Right Choice",
      excerpt: "A detailed comparison between engineering and medical careers to help students make informed decisions.",
      content: `Both engineering and medical fields offer excellent career opportunities, but they require different skill sets and commitments:

**Engineering:**
- Duration: 4 years for B.Tech
- Investment: Moderate (₹2-15 lakhs)
- Job Market: Diverse opportunities in tech, manufacturing, consulting
- Work-Life Balance: Generally better
- Entrepreneurship: High potential for startups

**Medical:**
- Duration: 5.5 years MBBS + 3 years specialization
- Investment: High (₹10-50 lakhs for private colleges)
- Job Market: Stable demand, respect in society
- Work-Life Balance: Challenging, especially during initial years
- Social Impact: Direct impact on people's lives

**How to Choose:**
1. Assess your interest in science subjects
2. Consider your patience level and dedication
3. Evaluate financial capacity
4. Think about long-term goals
5. Consider work-life balance preferences

Both fields have their merits. Choose based on your passion, not just market trends or family pressure.`,
      author: "Dr. Anjali Mehta",
      date: "2024-01-05",
      readTime: "6 min read",
      category: "Career Comparison",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f"
    },
    {
      id: 4,
      title: "The Rise of Remote Work: Preparing for the Future",
      excerpt: "How remote work is changing the job landscape and what skills you need to succeed in a remote environment.",
      content: `Remote work has become a permanent fixture in the modern workplace. Here's how to prepare:

**Benefits of Remote Work:**
- Flexibility in work location and hours
- Better work-life balance
- Reduced commuting costs and time
- Access to global job opportunities

**Essential Skills for Remote Work:**
1. **Self-Discipline**: Managing time and staying productive without supervision
2. **Communication**: Clear written and verbal communication
3. **Technology Proficiency**: Comfort with digital tools and platforms
4. **Problem-Solving**: Independent troubleshooting abilities
5. **Collaboration**: Working effectively with distributed teams

**Tools to Master:**
- Video conferencing (Zoom, Teams, Google Meet)
- Project management (Trello, Asana, Jira)
- Communication (Slack, Discord)
- File sharing (Google Drive, Dropbox)
- Time tracking (Toggl, RescueTime)

**Tips for Success:**
- Create a dedicated workspace
- Establish clear boundaries between work and personal time
- Stay connected with colleagues
- Continuously upgrade your digital skills

The future of work is hybrid. Prepare yourself for both remote and in-office environments.`,
      author: "Vikash Kumar",
      date: "2023-12-28",
      readTime: "8 min read",
      category: "Future of Work",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
    }
  ];

  if (!isLoggedIn) {
    return (
      <div className="bg-[#F5EFE8] min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="w-20 h-20 bg-[#C8D9E6] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#2F4156]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#2F4156] mb-4">
              Login Required
            </h2>
            <p className="text-[#2F4156] mb-8">
              Please log in to access our exclusive career blogs and insights.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/login'}
                className="px-8 py-3 bg-[#2F4156] text-white rounded-lg hover:bg-[#567C8D] transition"
              >
                Login
              </button>
              <button
                onClick={() => window.location.href = '/register'}
                className="px-8 py-3 border border-[#2F4156] text-[#2F4156] rounded-lg hover:bg-[#C8D9E6] transition"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedBlog) {
    return (
      <div className="bg-[#F5EFE8] min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => setSelectedBlog(null)}
            className="mb-6 flex items-center text-[#567C8D] hover:text-[#2F4156] transition"
          >
            ← Back to Blogs
          </button>
          
          <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img
              src={selectedBlog.image}
              alt={selectedBlog.title}
              className="w-full h-64 object-cover"
            />
            
            <div className="p-8">
              <div className="flex items-center gap-4 mb-4 text-sm text-[#567C8D]">
                <span className="bg-[#C8D9E6] px-3 py-1 rounded-full">
                  {selectedBlog.category}
                </span>
                <span>{selectedBlog.date}</span>
                <span>{selectedBlog.readTime}</span>
              </div>
              
              <h1 className="text-3xl font-bold text-[#2F4156] mb-4">
                {selectedBlog.title}
              </h1>
              
              <p className="text-[#567C8D] mb-6">
                By {selectedBlog.author}
              </p>
              
              <div className="prose prose-lg max-w-none">
                {selectedBlog.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-[#2F4156] mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5EFE8] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#2F4156] mb-4">
            Career Insights & Blogs
          </h1>
          <p className="text-[#2F4156] max-w-2xl mx-auto">
            Stay updated with the latest career trends, tips, and insights from industry experts.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:-translate-y-1 hover:shadow-xl transition cursor-pointer"
              onClick={() => setSelectedBlog(blog)}
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-[#C8D9E6] text-[#2F4156] px-3 py-1 rounded-full text-sm">
                    {blog.category}
                  </span>
                  <span className="text-sm text-[#567C8D]">
                    {blog.readTime}
                  </span>
                </div>
                
                <h2 className="text-xl font-semibold text-[#2F4156] mb-3 line-clamp-2">
                  {blog.title}
                </h2>
                
                <p className="text-[#2F4156] text-sm mb-4 line-clamp-3">
                  {blog.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#567C8D]">
                    By {blog.author}
                  </span>
                  <span className="text-sm text-[#567C8D]">
                    {blog.date}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};