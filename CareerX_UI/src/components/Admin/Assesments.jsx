import { useState, useEffect } from "react";
import { assessmentAPI } from "../../services/api";
import toast from "react-hot-toast";

export const StudentAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questionsJson: "[]",
    durationMinutes: 60,
    isActive: true,
    webcamRequired: true
  });

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const response = await assessmentAPI.getAllAssessments();
      setAssessments(response.data || []);
    } catch (error) {
      toast.error("Failed to load assessments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index].question = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { question: "", options: ["", "", "", ""] }]
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const openAddForm = () => {
    setEditingAssessment(null);
    setFormData({ title: "", description: "", questions: [{ question: "", options: ["", "", "", ""] }] });
    setShowForm(true);
  };

  const openEditForm = (assessment) => {
    setEditingAssessment(assessment);
    setFormData({
      title: assessment.title || "",
      description: assessment.description || "",
      questionsJson: assessment.questionsJson || "[]",
      durationMinutes: assessment.durationMinutes || 60,
      isActive: assessment.isActive !== undefined ? assessment.isActive : true,
      webcamRequired: assessment.webcamRequired !== undefined ? assessment.webcamRequired : true
    });
    setShowForm(true);
  };

  const saveAssessment = async () => {
    try {
      if (editingAssessment) {
        await assessmentAPI.updateAssessment(editingAssessment.assessmentId, formData);
        toast.success("Assessment updated successfully!");
      } else {
        await assessmentAPI.createAssessment(formData);
        toast.success("Assessment created successfully!");
      }
      setShowForm(false);
      fetchAssessments();
    } catch (error) {
      toast.error("Failed to save assessment");
      console.error(error);
    }
  };

  const deleteAssessment = async (assessment) => {
    if (!confirm("Are you sure you want to delete this assessment?")) {
      return;
    }
    try {
      await assessmentAPI.deleteAssessment(assessment.assessmentId);
      toast.success("Assessment deleted successfully!");
      fetchAssessments();
    } catch (error) {
      toast.error("Failed to delete assessment");
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-[#F5EFE8] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center">Assessments</h1>
        <button
          onClick={openAddForm}
          className="px-4 py-2 bg-[#2F4156] text-white rounded-lg hover:bg-[#567C8D]"
        >
          Add Assessment
        </button>
      </div>

      {loading ? (
        <p className="text-center py-8">Loading assessments...</p>
      ) : assessments.length === 0 ? (
        <p className="text-center py-8 text-gray-600">No assessments found. Create your first assessment!</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((a) => (
            <div key={a.assessmentId} className="bg-white p-4 rounded-2xl shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{a.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded ${a.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {a.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{a.description}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Duration: {a.durationMinutes} minutes</p>
                  {a.webcamRequired && <p className="text-orange-600">📹 Webcam Required</p>}
                  <p>Created: {new Date(a.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => openEditForm(a)} className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Edit</button>
                <button onClick={() => deleteAssessment(a)} className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-[#F5EFE8] bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingAssessment ? "Edit" : "Add"} Assessment</h2>
            
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

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  name="durationMinutes"
                  value={formData.durationMinutes}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="flex items-center gap-4 mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="mr-2"
                  />
                  Active
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="webcamRequired"
                    checked={formData.webcamRequired}
                    onChange={(e) => setFormData({ ...formData, webcamRequired: e.target.checked })}
                    className="mr-2"
                  />
                  Webcam Required
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Questions (JSON format)</label>
              <textarea
                placeholder='[{"id": 1, "questionText": "Question?", "options": ["A", "B", "C", "D"], "correctOptionIndex": 0, "category": "Aptitude"}]'
                name="questionsJson"
                value={formData.questionsJson}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg font-mono text-sm"
                rows="10"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter questions in JSON format. Questions will be auto-generated by AI if left empty.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={saveAssessment} className="px-4 py-2 bg-[#2F4156] text-white rounded-lg hover:bg-[#567C8D]">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
