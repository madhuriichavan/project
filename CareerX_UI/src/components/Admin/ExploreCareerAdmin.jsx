import { useState, useEffect } from "react";
import { careerAPI } from "../../services/api";
import toast from "react-hot-toast";

export const ExploreCareerAdmin = () => {
  const [careers, setCareers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCareer, setEditingCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    requiredEducation: "",
    skillsRequired: "",
    jobSector: "",
    averageSalary: "",
    careerPath: ""
  });

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const response = await careerAPI.getCareers();
      setCareers(response.data || []);
    } catch (error) {
      toast.error("Failed to load careers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setEditingCareer(null);
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      requiredEducation: "",
      skillsRequired: "",
      jobSector: "",
      averageSalary: "",
      careerPath: ""
    });
    setShowForm(true);
  };

  const openEditForm = (career) => {
    setEditingCareer(career);
    setFormData({
      title: career.title || "",
      description: career.description || "",
      imageUrl: career.imageUrl || "",
      requiredEducation: career.requiredEducation || "",
      skillsRequired: career.skillsRequired || "",
      jobSector: career.jobSector || "",
      averageSalary: career.averageSalary?.toString() || "",
      careerPath: career.careerPath || ""
    });
    setShowForm(true);
  };

  const saveCareer = async () => {
    try {
      const dataToSave = {
        ...formData,
        averageSalary: formData.averageSalary ? parseFloat(formData.averageSalary) : null
      };
      
      if (editingCareer) {
        await careerAPI.updateCareer(editingCareer.careerId, dataToSave);
        toast.success("Career updated successfully!");
      } else {
        await careerAPI.createCareer(dataToSave);
        toast.success("Career created successfully!");
      }
      setShowForm(false);
      fetchCareers();
    } catch (error) {
      toast.error("Failed to save career");
      console.error(error);
    }
  };

  const deleteCareer = async (career) => {
    if (!confirm("Are you sure you want to delete this career?")) {
      return;
    }
    try {
      await careerAPI.deleteCareer(career.careerId);
      toast.success("Career deleted successfully!");
      fetchCareers();
    } catch (error) {
      toast.error("Failed to delete career");
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-[#F5EFE8] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#2F4156]">Career Management</h1>
        <button
          onClick={openAddForm}
          className="px-4 py-2 bg-[#2F4156] text-white rounded-lg hover:bg-[#567C8D]"
        >
          Add Career
        </button>
      </div>

      {loading ? (
        <p className="text-center py-8">Loading careers...</p>
      ) : careers.length === 0 ? (
        <p className="text-center py-8 text-gray-600">No careers found. Create your first career!</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((career) => (
            <div key={career.careerId} className="bg-white p-4 rounded-2xl shadow-lg">
              {career.imageUrl && (
                <img src={career.imageUrl} alt={career.title} className="w-full h-32 object-cover rounded-lg mb-3" />
              )}
              <h3 className="font-semibold text-lg mb-2">{career.title}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{career.description}</p>
              {career.averageSalary && (
                <p className="text-sm text-green-600 font-semibold mb-2">
                  Avg. Salary: ₹{career.averageSalary.toLocaleString()}
                </p>
              )}
              <p className="text-xs text-gray-500 mb-3">{new Date(career.createdAt).toLocaleDateString()}</p>
              <div className="flex gap-2">
                <button onClick={() => openEditForm(career)} className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Edit</button>
                <button onClick={() => deleteCareer(career)} className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingCareer ? "Edit" : "Add"} Career</h2>
            
            <input
              type="text"
              placeholder="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg mb-4"
            />
            
            <textarea
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg mb-4"
              rows="3"
            />
            
            <input
              type="text"
              placeholder="Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg mb-4"
            />
            
            <input
              type="text"
              placeholder="Required Education"
              name="requiredEducation"
              value={formData.requiredEducation}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg mb-4"
            />
            
            <input
              type="text"
              placeholder="Skills Required (comma-separated)"
              name="skillsRequired"
              value={formData.skillsRequired}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg mb-4"
            />
            
            <input
              type="text"
              placeholder="Job Sector"
              name="jobSector"
              value={formData.jobSector}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg mb-4"
            />
            
            <input
              type="number"
              placeholder="Average Salary"
              name="averageSalary"
              value={formData.averageSalary}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg mb-4"
            />
            
            <textarea
              placeholder="Career Path"
              name="careerPath"
              value={formData.careerPath}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg mb-4"
              rows="3"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={saveCareer} className="px-4 py-2 bg-[#2F4156] text-white rounded-lg hover:bg-[#567C8D]">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

