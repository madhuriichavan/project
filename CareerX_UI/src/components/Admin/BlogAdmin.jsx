import { useState, useEffect } from "react";
import { blogAPI } from "../../services/api";
import toast from "react-hot-toast";

export const BlogAdmin = () => {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    author: "",
    isPublished: true
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getBlogs();
      setBlogs(response.data || []);
    } catch (error) {
      toast.error("Failed to load blogs");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      content: "",
      imageUrl: "",
      author: "",
      isPublished: true
    });
    setShowForm(true);
  };

  const openEditForm = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || "",
      content: blog.content || "",
      imageUrl: blog.imageUrl || "",
      author: blog.author || "",
      isPublished: blog.isPublished !== undefined ? blog.isPublished : true
    });
    setShowForm(true);
  };

  const saveBlog = async () => {
    try {
      if (editingBlog) {
        await blogAPI.updateBlog(editingBlog.blogId, formData);
        toast.success("Blog updated successfully!");
      } else {
        await blogAPI.createBlog(formData);
        toast.success("Blog created successfully!");
      }
      setShowForm(false);
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to save blog");
      console.error(error);
    }
  };

  const deleteBlog = async (blog) => {
    if (!confirm("Are you sure you want to delete this blog?")) {
      return;
    }
    try {
      await blogAPI.deleteBlog(blog.blogId);
      toast.success("Blog deleted successfully!");
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to delete blog");
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-[#F5EFE8] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#2F4156]">Blog Management</h1>
        <button
          onClick={openAddForm}
          className="px-4 py-2 bg-[#2F4156] text-white rounded-lg hover:bg-[#567C8D]"
        >
          Add Blog
        </button>
      </div>

      {loading ? (
        <p className="text-center py-8">Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p className="text-center py-8 text-gray-600">No blogs found. Create your first blog!</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog.blogId} className="bg-white p-4 rounded-2xl shadow-lg">
              {blog.imageUrl && (
                <img src={blog.imageUrl} alt={blog.title} className="w-full h-32 object-cover rounded-lg mb-3" />
              )}
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{blog.title}</h3>
                <span className={`px-2 py-1 text-xs rounded ${blog.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {blog.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{blog.content}</p>
              {blog.author && <p className="text-xs text-gray-500 mb-3">By {blog.author}</p>}
              <p className="text-xs text-gray-500 mb-3">{new Date(blog.createdAt).toLocaleDateString()}</p>
              <div className="flex gap-2">
                <button onClick={() => openEditForm(blog)} className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Edit</button>
                <button onClick={() => deleteBlog(blog)} className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingBlog ? "Edit" : "Add"} Blog</h2>
            
            <input
              type="text"
              placeholder="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg mb-4"
            />
            
            <input
              type="text"
              placeholder="Author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg mb-4"
            />
            
            <input
              type="text"
              placeholder="Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg mb-4"
            />
            
            <textarea
              placeholder="Content (supports HTML)"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg mb-4"
              rows="10"
            />
            
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="mr-2"
              />
              Publish immediately
            </label>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={saveBlog} className="px-4 py-2 bg-[#2F4156] text-white rounded-lg hover:bg-[#567C8D]">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

