import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { profileAPI } from "../services/api";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setUserName(parsedUser.userName || parsedUser.name);
      setUserRole(parsedUser.role);

      // Try to get updated name from profile
      if (parsedUser.role === 'Student') {
        profileAPI.getProfile()
          .then(response => {
            if (response.data?.generalInformation?.name) {
              setUserName(response.data.generalInformation.name);
            }
          })
          .catch(() => {
            // Keep existing name if profile fetch fails or API unavailable
            console.log('Profile API unavailable, using stored name');
          });
      }
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setUserName('');
    setUserRole(null);
    navigate('/');
  };

  // Don't show navbar on login/register pages or assessment pages
  if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password' || location.pathname === '/assessment') {
    return null;
  }

  return (
    <nav className="bg-[#C8D9E6] border-b border-[#C8D9E6] fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/src/assets/logo.png" alt="logo" className="w-50 h-10" />
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {/* Guest Navigation */}
          {!userRole && (
            <>
              <Link
                to="/"
                className={`${location.pathname === '/' ? 'text-[#567C8D]' : 'text-[#2F4156]'} hover:text-[#567C8D] font-medium`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`${location.pathname === '/about' ? 'text-[#567C8D]' : 'text-[#2F4156]'} hover:text-[#567C8D] font-medium`}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className={`${location.pathname === '/contact' ? 'text-[#567C8D]' : 'text-[#2F4156]'} hover:text-[#567C8D] font-medium`}
              >
                Contact Us
              </Link>
              <Link
                to="/explore-careers"
                className={`${location.pathname === '/explore-careers' ? 'text-[#567C8D]' : 'text-[#2F4156]'} hover:text-[#567C8D] font-medium`}
              >
                Explore Careers
              </Link>
              <Link
                to="/blogs"
                className={`${location.pathname === '/blogs' ? 'text-[#567C8D]' : 'text-[#2F4156]'} hover:text-[#567C8D] font-medium`}
              >
                Blogs
              </Link>
            </>
          )}

          {/* Student Dashboard Navigation */}
          {userRole === 'Student' && (
            <>
              <Link
                to="/studentdashboard"
                className={`${location.pathname === '/studentdashboard' ? 'text-[#567C8D]' : 'text-[#2F4156]'} hover:text-[#567C8D] font-medium`}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className={`${location.pathname === '/profile' ? 'text-[#567C8D]' : 'text-[#2F4156]'} hover:text-[#567C8D] font-medium`}
              >
                Profile
              </Link>
              <Link
                to="/assessments"
                className={`${location.pathname === '/assessments' ? 'text-[#567C8D]' : 'text-[#2F4156]'} hover:text-[#567C8D] font-medium`}
              >
                Assessment
              </Link>
              <Link
                to="/roadmap"
                className={`${location.pathname === '/roadmap' ? 'text-[#567C8D]' : 'text-[#2F4156]'} hover:text-[#567C8D] font-medium`}
              >
                Career Path
              </Link>
            </>
          )}

          {/* Admin Dashboard Navigation */}
          {userRole === 'Admin' && (
            <>
              <Link
                to="/admindashboard"
                className={`${location.pathname === '/admindashboard' ? 'text-[#567C8D]' : 'text-[#2F4156]'} hover:text-[#567C8D] font-medium`}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/students"
                className={`${location.pathname === '/admin/students' ? 'text-[#567C8D]' : 'text-[#2F4156]'} hover:text-[#567C8D] font-medium`}
              >
                Students
              </Link>
              <Link
                to="/admin/ExploreCareer"
                className={`${location.pathname === '/admin/ExploreCareer' ? 'text-[#567C8D]' : 'text-[#2F4156]'} hover:text-[#567C8D] font-medium`}
              >
                Careers
              </Link>
              <Link
                to="/admin/blogs"
                className={`${location.pathname === '/admin/blogs' ? 'text-[#567C8D]' : 'text-[#2F4156]'} hover:text-[#567C8D] font-medium`}
              >
                Blogs
              </Link>
            </>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-[#2F4156] hover:text-[#567C8D] font-medium"
              >
                <span>Welcome, {userName}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {userRole === 'Admin' ? (
                    <Link
                      to="/admindashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/studentdashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[#2F4156] hover:text-[#567C8D] font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-[#2F4156] text-white px-5 py-2 rounded-lg hover:bg-[#567C8D] transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-black text-3xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#C8D9E6] px-6 pb-4 space-y-4">
          {/* Guest Navigation */}
          {!userRole && (
            <>
              <Link to="/" className={`block text-lg ${location.pathname === '/' ? 'text-[#567C8D]' : 'text-black'}`} onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link to="/about" className={`block text-lg ${location.pathname === '/about' ? 'text-[#567C8D]' : 'text-black'}`} onClick={() => setIsOpen(false)}>
                About Us
              </Link>
              <Link to="/contact" className={`block text-lg ${location.pathname === '/contact' ? 'text-[#567C8D]' : 'text-black'}`} onClick={() => setIsOpen(false)}>
                Contact Us
              </Link>
              <Link to="/explore-careers" className={`block text-lg ${location.pathname === '/explore-careers' ? 'text-[#567C8D]' : 'text-black'}`} onClick={() => setIsOpen(false)}>
                Explore Careers
              </Link>
              <Link to="/blogs" className={`block text-lg ${location.pathname === '/blogs' ? 'text-[#567C8D]' : 'text-black'}`} onClick={() => setIsOpen(false)}>
                Blogs
              </Link>
            </>
          )}

          {/* Student Dashboard Navigation */}
          {userRole === 'Student' && (
            <>
              <Link to="/studentdashboard" className={`block text-lg ${location.pathname === '/studentdashboard' ? 'text-[#567C8D]' : 'text-black'}`} onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
              <Link to="/profile" className={`block text-lg ${location.pathname === '/profile' ? 'text-[#567C8D]' : 'text-black'}`} onClick={() => setIsOpen(false)}>
                Profile
              </Link>
              <Link to="/assessments" className={`block text-lg ${location.pathname === '/assessments' ? 'text-[#567C8D]' : 'text-black'}`} onClick={() => setIsOpen(false)}>
                Assessment
              </Link>
              <Link to="/roadmap" className={`block text-lg ${location.pathname === '/roadmap' ? 'text-[#567C8D]' : 'text-black'}`} onClick={() => setIsOpen(false)}>
                Career Path
              </Link>
            </>
          )}

          {/* Admin Dashboard Navigation */}
          {userRole === 'Admin' && (
            <>
              <Link to="/admindashboard" className={`block text-lg ${location.pathname === '/admindashboard' ? 'text-[#567C8D]' : 'text-black'}`} onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
              <Link to="/admin/students" className={`block text-lg ${location.pathname === '/admin/students' ? 'text-[#567C8D]' : 'text-black'}`} onClick={() => setIsOpen(false)}>
                Students
              </Link>
              <Link to="/admin/ExploreCareer" className={`block text-lg ${location.pathname === '/admin/ExploreCareer' ? 'text-[#567C8D]' : 'text-black'}`} onClick={() => setIsOpen(false)}>
                Careers
              </Link>
              <Link to="/admin/blogs" className={`block text-lg ${location.pathname === '/admin/blogs' ? 'text-[#567C8D]' : 'text-black'}`} onClick={() => setIsOpen(false)}>
                Blogs
              </Link>
            </>
          )}

          {user ? (
            <>
              <div className="text-black text-lg font-medium">
                {userName}
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block bg-red-600 text-white px-4 py-2 rounded-lg text-center w-full"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block bg-[#2F4156] text-white px-4 py-2 rounded-lg text-center"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block bg-[#567C8D] text-white px-4 py-2 rounded-lg text-center"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
