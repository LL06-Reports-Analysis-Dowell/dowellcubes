import { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { dashboardConfig } from './dashboardConfig';
import { FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const DashboardPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleLogout = () => {
    // Clear the access token and any user-related data from local storage
    localStorage.removeItem('accessToken');

    console.log('User logged out');

    toast.success('Successfully logged out!');

    navigate('/auth/signin/public');
};

  return (
    <div className="flex min-h-screen">
      <aside
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 w-64 bg-[#0c1014] text-white flex flex-col h-screen fixed z-50 md:static md:translate-x-0`}
      >
        <div className="p-2 flex items-center justify-center">
          <h1 className="text-xl font-bold text-white text-center bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text shadow-lg p-6 rounded-lg max-w-lg mx-auto">
            DoWell Cubes
          </h1>
          <button onClick={toggleMobileMenu} className="md:hidden">
            ✖️
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-4">
            {dashboardConfig.generalItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center text-sm py-4 px-4 cursor-pointer hover:bg-[#005734] hover:rounded-xl transition-all"
                onClick={() => {
                  navigate(`/dashboard${item.path}`);
                  setIsMobileMenuOpen(false);
                }}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center text-sm py-4 px-4 cursor-pointer hover:bg-[#d9534f] hover:rounded-xl transition-all w-full text-left"
          >
            <FaSignOutAlt className="w-5 h-5 mr-3" /> {/* Added icon here */}
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto h-screen scrollbar-hide">
        <div className="flex items-center justify-between bg-[#0c1014] text-white p-4 fixed top-0 left-0 right-0 z-40 md:hidden shadow-lg">
          <h1 className="text-xl font-bold">{dashboardConfig.logo.title}</h1>
          <button onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
            ☰
          </button>
        </div>

        <div className="pt-16 md:pt-0">
          <Outlet />
        </div>
      </main>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardPage;
