import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getCubeQRcode } from '../../../services/api.services';
import { Loader, Compass, Mouse, RotateCcw } from 'lucide-react';

const HomePage = () => {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: -20, y: 45 });
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchQRData();
  }, []);

  const fetchQRData = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Please log in to access this page.');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await getCubeQRcode(accessToken);
      if (response.success) {
        setQrData(response.data);
      } else {
        toast.error('Failed to fetch QR codes');
      }
    } catch (error) {
      toast.error('Failed to load QR codes.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastPosition.x;
    const deltaY = e.clientY - lastPosition.y;

    setRotation({ x: rotation.x + deltaY * 0.5, y: rotation.y + deltaX * 0.5 });
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetRotation = () => setRotation({ x: -20, y: 45 });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="animate-spin h-12 w-12 text-indigo-600" />
          <p className="text-indigo-600 font-medium">Loading your QR cube...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <div className="inline-block p-2 bg-indigo-100 rounded-2xl mb-6">
            <Compass className="h-12 w-12 text-indigo-600" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Welcome to QR Cube! 👋
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore your QR codes in an interactive 3D space. Rotate the cube to discover all sides!
          </p>
        </div>

        {/* Control Panel */}
        <div className="flex justify-center mb-8 space-x-6">
          <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
            <Mouse className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-gray-600">Drag to rotate</span>
          </div>
          <button
            onClick={resetRotation}
            className="flex items-center bg-white px-4 py-2 rounded-full shadow-md hover:bg-indigo-50 transition-colors duration-200"
          >
            <RotateCcw className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-gray-600">Reset view</span>
          </button>
        </div>

        {/* 3D Cube Container */}
        <div 
          className="perspective-1000 mx-auto w-full max-w-[450px] h-[450px] flex justify-center items-center"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* 3D Cube */}
          <div 
            className="relative w-[250px] h-[250px] transform-style-3d"
            style={{
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transition: isDragging ? 'none' : 'transform 0.4s ease',
            }}
          >
            {qrData?.cubeQrocdeDetails.slice(0, 6).map((qr, index) => {
              const transforms = [
                'rotateY(0deg) translateZ(125px)',
                'rotateY(180deg) translateZ(125px)',
                'rotateY(90deg) translateZ(125px)',
                'rotateY(-90deg) translateZ(125px)',
                'rotateX(90deg) translateZ(125px)',
                'rotateX(-90deg) translateZ(125px)',
              ];

              return (
                <div
                  key={qr._id}
                  className="absolute w-[250px] h-[250px] bg-white/90 backdrop-blur-lg border border-indigo-200 rounded-xl shadow-lg transition-transform duration-200"
                  style={{
                    transform: transforms[index],
                  }}
                >
                  <div className="p-6 h-full flex flex-col items-center justify-center">
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                      <img 
                        src={qr.qrcodeImageLink} 
                        alt={qr.name}
                        className="w-40 h-40 object-contain"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-indigo-900">{qr.name}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Portfolio Info */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white px-6 py-3 rounded-full shadow-md">
            <p className="text-gray-600">
              Portfolio: <span className="font-semibold text-indigo-600">{qrData?.portfolioName}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
