import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { selfIdentification } from '../../../services/api.services';
import { Loader } from 'lucide-react';

const UserDetailsPage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error('Please log in to access this page.');
        navigate('/login');
        return;
      }

      try {
        setLoadingPage(true);
        const response = await selfIdentification(accessToken);

        if (response.success) {
          const data = response.data;
          setUserDetails(data);
          setEmail(data.email || '');
        } else {
          toast.error('Failed to fetch user details');
        }
      } catch (error) {
        toast.error('Failed to load user details.');
        console.error(error);
      } finally {
        setLoadingPage(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Please log in to update your email.');
      navigate('/login');
      return;
    }

    // Call your API for email update here (similar to the function in previous examples)
    setLoading(false);
  };

  if (loadingPage) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="animate-spin h-8 w-8 text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="space-y-10">
        <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
          <h1 className="text-3xl font-semibold text-indigo-700 mb-2">User Profile</h1>
          <p className="text-gray-500">View and manage your account information</p>

          {userDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">Account Information</h2>
                <dl className="grid gap-4 text-gray-700">
                  <div>
                    <dt className="font-medium text-gray-500">Product ID</dt>
                    <dd className="text-lg">{userDetails.workspaceName}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">User ID</dt>
                    <dd className="text-lg">{userDetails.portfolioName}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">Member Type</dt>
                    <dd className="text-lg">{userDetails.memberType}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">Status</dt>
                    <dd>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        userDetails.status === 'enable' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {userDetails.status}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">Login History</h2>
                <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
                  <div className="text-sm text-gray-500 mb-2">
                    Total Logins: {userDetails.loginInfo?.count}
                  </div>
                  <div className="space-y-2">
                    {userDetails.loginInfo?.dates?.slice(-5).map((date, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <span className="w-4 h-4 rounded-full bg-indigo-200 flex items-center justify-center mr-2 text-indigo-600">
                          {index + 1}
                        </span>
                        <span className="text-gray-600">
                          {new Date(date).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Email</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-3"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-50"
            >
              {loading ? (
                <Loader className="animate-spin h-5 w-5 text-white" />
              ) : (
                'Update Email'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
