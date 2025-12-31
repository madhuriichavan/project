import { useState, useEffect } from "react";
import { blogAPI } from "../services/api";
import toast from "react-hot-toast";

export const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getBlogs();
      setBlogs(response.data);
    } catch (error) {
      toast.error("Failed to load blogs");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#2F4156] mb-8 text-center">
          Career Blogs
        </h1>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No blogs available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog.blogId}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedBlog(blog)}
              >
                {blog.imageUrl && (
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#2F4156] mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.content.substring(0, 150)}...
                  </p>
                  {blog.author && (
                    <p className="text-sm text-gray-500">By {blog.author}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedBlog && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBlog(null)}
          >
            <div
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedBlog(null)}
                className="float-right text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
              <h2 className="text-3xl font-bold text-[#2F4156] mb-4">
                {selectedBlog.title}
              </h2>
              {selectedBlog.imageUrl && (
                <img
                  src={selectedBlog.imageUrl}
                  alt={selectedBlog.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                {selectedBlog.author && <span>By {selectedBlog.author}</span>}
                <span>{new Date(selectedBlog.createdAt).toLocaleDateString()}</span>
              </div>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

