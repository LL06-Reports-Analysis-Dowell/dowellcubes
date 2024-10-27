import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signin } from '../../../services/api.services';
import { toast } from 'react-hot-toast';
import { Lock, Building2, Briefcase, Loader2 } from 'lucide-react';

const PublicSigninPage = () => {
  const [workspaceName, setWorkspaceName] = useState('');
  const [portfolioName, setPortfolioName] = useState('');
  const [password, setPassword] = useState('');
  const [workspaceDisabled, setWorkspaceDisabled] = useState(false);
  const [portfolioDisabled, setPortfolioDisabled] = useState(false);
  const [loading, setLoading] = useState(false);  // Loading state

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const { exp } = JSON.parse(atob(accessToken.split('.')[1]));
        if (Date.now() < exp * 1000) {
          navigate('/dashboard');
          return;
        }
      } catch (err) {
        console.log(err);
        toast.error('Error decoding token. Please sign in again.');
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const wsName = urlParams.get('workspaceName');
    const pfName = urlParams.get('portfolioName');

    if (wsName) {
      setWorkspaceName(wsName);
      setWorkspaceDisabled(true);
    }
    if (pfName) {
      setPortfolioName(pfName);
      setPortfolioDisabled(true);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    const payload = { workspaceName, portfolioName, password };
  
    try {
      const response = await signin(payload); 
  
      if (response.success) {
        localStorage.setItem('accessToken', response.data.accessToken);
        navigate('/dashboard');
      } else {
        toast.error(response.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        console.log('Error details:', error.response.data);
        toast.error(error.response.data.message || 'An error occurred. Please try again.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
        console.error('Error during login:', error);
      }
    } finally {
      setLoading(false);  // Reset loading to false
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="w-full max-w-md px-8 py-12 bg-white rounded-2xl shadow-xl relative">
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-2xl">
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
          </div>
        )}

        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <img
            src="https://dowellfileuploader.uxlivinglab.online/hr/logo-2-min-min.png"
            alt="Company Logo"
            className="h-20 w-20 mb-2"
          />
        </div>
        
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome back</h2>
        <p className="text-center text-gray-600 mb-8">Please enter your details to sign in</p>

        <form onSubmit={handleSubmit} className="space-y-6" disabled={loading}>
          <div className="space-y-4">
            <div className="relative">
              <Building2 className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="workspaceName"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Product ID"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                disabled={workspaceDisabled || loading}
              />
            </div>

            <div className="relative">
              <Briefcase className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="User ID"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Portfolio Name"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                disabled={portfolioDisabled || loading}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                id="password"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <a 
              href="/forgot-password" 
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 bg-[#005734] hover:bg-[#005734] text-white font-medium rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-200 ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublicSigninPage;
