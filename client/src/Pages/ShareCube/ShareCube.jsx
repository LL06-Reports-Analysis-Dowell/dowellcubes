import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Loader, RotateCcw } from 'lucide-react'
import { shareCube } from '../../services/api.services'

const ShareCube = () => {
    const [qrData, setQrData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isDragging, setIsDragging] = useState(false)
    const [rotation, setRotation] = useState({ x: -20, y: 45 })
    const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
    const [dragDistance, setDragDistance] = useState(0)
    const cubeRef = useRef(null)
    const navigate = useNavigate()
    const dragThreshold = 10

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    useEffect(() => {
        fetchQRData()
    }, [])

    const fetchQRData = async () => {
        const portfolioId = searchParams.get('portfolioId');
        const workspaceId = searchParams.get('workspaceId');
        const portfolioName = searchParams.get('portfolioName');
        try {
            const data = {
                portfolioId,
                workspaceId,
                portfolioName
            }
            setLoading(true)
            const response = await shareCube(data)
            if (response.success) {
                setQrData(response.data)
            } else {
                toast.error('Failed to fetch QR codes')
            }
        } catch (error) {
            toast.error('Failed to load QR codes.')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // Mouse and Touch Handlers
    const handleMouseDown = (e) => {
        if (e.button !== 0) return
        setIsDragging(false)
        setStartPosition({ x: e.clientX, y: e.clientY })
        setLastPosition({ x: e.clientX, y: e.clientY })
        setDragDistance(0)
    }

    const handleMouseMove = (e) => {
        if (!startPosition.x && !startPosition.y) return
        const deltaX = e.clientX - lastPosition.x
        const deltaY = e.clientY - lastPosition.y

        const distance = Math.sqrt(Math.pow(e.clientX - startPosition.x, 2) + Math.pow(e.clientY - startPosition.y, 2))
        setDragDistance(distance)

        if (distance > dragThreshold) {
            setIsDragging(true)

            setRotation((prev) => ({
                x: Math.min(Math.max(prev.x + deltaY * 0.3, -90), 90),
                y: (prev.y + deltaX * 0.3) % 360
            }))
        }

        setLastPosition({ x: e.clientX, y: e.clientY })
    }

    const handleTouchStart = (e) => {
        const touch = e.touches[0]
        setIsDragging(false)
        setStartPosition({ x: touch.clientX, y: touch.clientY })
        setLastPosition({ x: touch.clientX, y: touch.clientY })
        setDragDistance(0)
    }

    const handleTouchMove = (e) => {
        if (!startPosition.x && !startPosition.y) return
        e.preventDefault()
        const touch = e.touches[0]
        const deltaX = touch.clientX - lastPosition.x
        const deltaY = touch.clientY - lastPosition.y

        const distance = Math.sqrt(Math.pow(touch.clientX - startPosition.x, 2) + Math.pow(touch.clientY - startPosition.y, 2))
        setDragDistance(distance)

        if (distance > dragThreshold) {
            setIsDragging(true)

            setRotation((prev) => ({
                x: Math.min(Math.max(prev.x + deltaY * 0.3, -90), 90),
                y: (prev.y + deltaX * 0.3) % 360
            }))
        }

        setLastPosition({ x: touch.clientX, y: touch.clientY })
    }

    const handleEnd = () => {
        setStartPosition({ x: 0, y: 0 })
        setLastPosition({ x: 0, y: 0 })
        setDragDistance(0)
        setTimeout(() => setIsDragging(false), 0)
    }

    const resetRotation = () => setRotation({ x: -20, y: 45 })

    const handleQRCodeClick = (e, url) => {
        e.stopPropagation()
        if (dragDistance < dragThreshold && url) {
            toast.success('Opening QR code link...', { duration: 2000 })
            window.open(url, '_blank', 'noopener,noreferrer')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div className="flex flex-col items-center space-y-4">
                    <Loader className="animate-spin h-12 w-12 text-indigo-600" />
                    <p className="text-indigo-600 font-medium">Loading your QR cube...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex flex-col items-center">
                {/* Welcome Section */}
                <div className="text-center">
                    <div className="inline-block p-2 rounded-2xl">
                        <img
                            src="https://dowellfileuploader.uxlivinglab.online/hr/logo-2-min-min.png"
                            alt="Company Logo"
                            className="h-20 w-20"
                        />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        DoWell QR Cube! 👋
                    </h1>
                </div>
                <div
                    ref={cubeRef}
                    className="perspective-1000 mx-auto w-full max-w-[450px] h-[450px] flex justify-center items-center touch-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleEnd}
                    onMouseLeave={handleEnd}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleEnd}>
                    <div
                        className="relative w-[250px] h-[250px] transform-style-3d"
                        style={{
                            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                        }}>
                        {qrData?.cubeQrocdeDetails.slice(0, 6).map((qr, index) => {
                            const transforms = [
                                'rotateY(0deg) translateZ(125px)',    // Front
                                'rotateY(180deg) translateZ(125px)',  // Back
                                'rotateY(90deg) translateZ(125px)',   // Right
                                'rotateY(-90deg) translateZ(125px)',  // Left
                                'rotateX(90deg) translateZ(125px)',   // Top
                                'rotateX(-90deg) translateZ(125px)'   // Bottom
                            ]

                            return (
                                <div
                                    key={qr._id}
                                    className="absolute w-[250px] h-[250px] bg-white/90 backdrop-blur-lg border border-indigo-200 rounded-xl shadow-lg transition-transform duration-200"
                                    style={{
                                        transform: transforms[index],
                                        backfaceVisibility: 'hidden'
                                    }}>
                                    <div className="p-6 h-full flex flex-col items-center justify-center">
                                        <h3 className="text-sm font-semibold text-indigo-900">{qr.name}</h3>
                                        <button
                                            className="bg-white p-4 rounded-xl shadow-sm transform hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            onClick={(e) => handleQRCodeClick(e, qr.qrcodeLink)}
                                            onTouchEnd={(e) => {
                                                e.preventDefault()
                                                if (!isDragging) handleQRCodeClick(e, qr.qrcodeLink)
                                            }}>
                                            <img
                                                src={qr.qrcodeImageLink}
                                                alt={qr.name}
                                                className="w-40 h-40 object-contain pointer-events-none"
                                            />
                                        </button>
                                        <h3 className="text-sm font-semibold text-indigo-900">{qr.name}</h3>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="flex flex-wrap justify-center mb-8 gap-4">
                    <button
                        onClick={resetRotation}
                        className="flex items-center bg-white px-4 py-2 rounded-full shadow-md hover:bg-indigo-50 transition-colors duration-200">
                        <RotateCcw className="h-5 w-5 text-indigo-600 mr-2" />
                        <span className="text-gray-600">Reset view</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ShareCube
