import { useState, useEffect } from "react";
import { careerAPI } from "../services/api";
import toast from "react-hot-toast";

export const ExploreCareers = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState(null);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const response = await careerAPI.getCareers();
      setCareers(response.data);
    } catch (error) {
      toast.error("Failed to load careers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading careers...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#2F4156] mb-8 text-center">
          Explore Careers
        </h1>

        {careers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No careers available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careers.map((career) => (
              <div
                key={career.careerId}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedCareer(career)}
              >
                {career.imageUrl && (
                  <img
                    src={career.imageUrl}
                    alt={career.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#2F4156] mb-2">
                    {career.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {career.description}
                  </p>
                  {career.averageSalary && (
                    <p className="text-[#567C8D] font-semibold">
                      Avg. Salary: ₹{career.averageSalary.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedCareer && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCareer(null)}
          >
            <div
              className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCareer(null)}
                className="float-right text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
              <h2 className="text-3xl font-bold text-[#2F4156] mb-4">
                {selectedCareer.title}
              </h2>
              {selectedCareer.imageUrl && (
                <img
                  src={selectedCareer.imageUrl}
                  alt={selectedCareer.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Description</h3>
                  <p className="text-gray-700">{selectedCareer.description}</p>
                </div>
                {selectedCareer.requiredEducation && (
                  <div>
                    <h3 className="font-semibold text-lg">Required Education</h3>
                    <p className="text-gray-700">{selectedCareer.requiredEducation}</p>
                  </div>
                )}
                {selectedCareer.skillsRequired && (
                  <div>
                    <h3 className="font-semibold text-lg">Skills Required</h3>
                    <p className="text-gray-700">{selectedCareer.skillsRequired}</p>
                  </div>
                )}
                {selectedCareer.jobSector && (
                  <div>
                    <h3 className="font-semibold text-lg">Job Sector</h3>
                    <p className="text-gray-700">{selectedCareer.jobSector}</p>
                  </div>
                )}
                {selectedCareer.averageSalary && (
                  <div>
                    <h3 className="font-semibold text-lg">Average Salary</h3>
                    <p className="text-gray-700">
                      ₹{selectedCareer.averageSalary.toLocaleString()}
                    </p>
                  </div>
                )}
                {selectedCareer.careerPath && (
                  <div>
                    <h3 className="font-semibold text-lg">Career Path</h3>
                    <p className="text-gray-700">{selectedCareer.careerPath}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

