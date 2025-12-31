import { useState } from "react";


export const ExploreCareers = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCareer, setSelectedCareer] = useState(null);

  const categories = [
    { id: 'all', name: 'All Careers' },
    { id: 'technology', name: 'Technology' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'business', name: 'Business' },
    { id: 'creative', name: 'Creative' },
    { id: 'engineering', name: 'Engineering' }
  ];

  const careers = [
    {
      id: 1,
      title: 'Software Engineer',
      category: 'technology',
      salary: '₹6-15 LPA',
      growth: 'High',
      description: 'Design, develop, and maintain software applications and systems.',
      skills: ['Programming', 'Problem Solving', 'Algorithms', 'Teamwork'],
      education: 'B.Tech/B.E in Computer Science or related field',
      companies: ['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys']
    },
    {
      id: 2,
      title: 'Data Scientist',
      category: 'technology',
      salary: '₹8-20 LPA',
      growth: 'Very High',
      description: 'Analyze complex data to help organizations make informed decisions.',
      skills: ['Python/R', 'Statistics', 'Machine Learning', 'Data Visualization'],
      education: 'B.Tech/M.Tech in Computer Science, Statistics, or Mathematics',
      companies: ['Netflix', 'Uber', 'Flipkart', 'Zomato', 'PayTM']
    },
    {
      id: 3,
      title: 'Doctor (MBBS)',
      category: 'healthcare',
      salary: '₹5-25 LPA',
      growth: 'High',
      description: 'Diagnose and treat patients, promote health and prevent disease.',
      skills: ['Medical Knowledge', 'Communication', 'Empathy', 'Decision Making'],
      education: 'MBBS (5.5 years) + Specialization (3 years)',
      companies: ['AIIMS', 'Apollo', 'Fortis', 'Max Healthcare', 'Private Practice']
    },
    {
      id: 4,
      title: 'Digital Marketing Manager',
      category: 'business',
      salary: '₹4-12 LPA',
      growth: 'High',
      description: 'Plan and execute digital marketing campaigns across various platforms.',
      skills: ['SEO/SEM', 'Social Media', 'Analytics', 'Content Strategy'],
      education: 'BBA/MBA in Marketing or related field',
      companies: ['Unilever', 'P&G', 'Ogilvy', 'WPP', 'Digital Agencies']
    },
    {
      id: 5,
      title: 'UI/UX Designer',
      category: 'creative',
      salary: '₹4-15 LPA',
      growth: 'High',
      description: 'Design user interfaces and experiences for digital products.',
      skills: ['Design Tools', 'User Research', 'Prototyping', 'Visual Design'],
      education: 'B.Des/BFA in Design or related field',
      companies: ['Adobe', 'Figma', 'Zomato', 'Swiggy', 'Design Studios']
    },
    {
      id: 6,
      title: 'Mechanical Engineer',
      category: 'engineering',
      salary: '₹3-10 LPA',
      growth: 'Moderate',
      description: 'Design, develop, and test mechanical devices and systems.',
      skills: ['CAD Software', 'Problem Solving', 'Mathematics', 'Project Management'],
      education: 'B.Tech/B.E in Mechanical Engineering',
      companies: ['Tata Motors', 'Mahindra', 'L&T', 'BHEL', 'Bosch']
    }
  ];

  const filteredCareers = selectedCategory === 'all' 
    ? careers 
    : careers.filter(career => career.category === selectedCategory);

  if (selectedCareer) {
    return (
      <div className="bg-[#F5EFE8] min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => setSelectedCareer(null)}
            className="mb-6 flex items-center text-[#567C8D] hover:text-[#2F4156] transition"
          >
            ← Back to Careers
          </button>
          
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#2F4156] mb-2">
                {selectedCareer.title}
              </h1>
              <div className="flex justify-center gap-4 text-sm">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  {selectedCareer.salary}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  Growth: {selectedCareer.growth}
                </span>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold text-[#2F4156] mb-4">About This Role</h3>
                <p className="text-[#2F4156] mb-6">{selectedCareer.description}</p>
                
                <h3 className="text-xl font-semibold text-[#2F4156] mb-4">Education Required</h3>
                <p className="text-[#2F4156]">{selectedCareer.education}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-[#2F4156] mb-4">Key Skills</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedCareer.skills.map((skill, index) => (
                    <span key={index} className="bg-[#C8D9E6] text-[#2F4156] px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-xl font-semibold text-[#2F4156] mb-4">Top Companies</h3>
                <div className="space-y-2">
                  {selectedCareer.companies.map((company, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-[#567C8D] rounded-full mr-3"></div>
                      <span className="text-[#2F4156]">{company}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5EFE8] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#2F4156] mb-4">
            Explore Careers
          </h1>
          <p className="text-[#2F4156] max-w-2xl mx-auto">
            Discover various career paths, their requirements, growth prospects, and opportunities.
          </p>
        </div>

        
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  selectedCategory === category.id
                    ? 'bg-[#2F4156] text-white'
                    : 'bg-white text-[#2F4156] border border-[#2F4156] hover:bg-[#C8D9E6]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

      
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCareers.map((career) => (
            <div
              key={career.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:-translate-y-1 hover:shadow-xl transition cursor-pointer"
              onClick={() => setSelectedCareer(career)}
            >
              <h3 className="text-xl font-semibold text-[#2F4156] mb-2">
                {career.title}
              </h3>
              
              <p className="text-[#2F4156] text-sm mb-4 line-clamp-2">
                {career.description}
              </p>
              
              <div className="flex justify-between items-center mb-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {career.salary}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {career.growth} Growth
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {career.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="bg-[#C8D9E6] text-[#2F4156] px-2 py-1 rounded text-xs">
                    {skill}
                  </span>
                ))}
                {career.skills.length > 3 && (
                  <span className="text-[#567C8D] text-xs">+{career.skills.length - 3} more</span>
                )}
              </div>
              
              <button className="w-full bg-[#2F4156] text-white py-2 rounded-lg hover:bg-[#567C8D] transition">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};