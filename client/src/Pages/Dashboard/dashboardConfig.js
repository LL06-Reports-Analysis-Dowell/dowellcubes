import { FaHome, FaCog, FaFileDownload, FaFileAlt, FaClipboardList } from 'react-icons/fa'; // Import the gear icon

export const dashboardConfig = {
  logo: {
    src: 'logo',
    alt: 'Logo',
    title: 'MyApp',
  },
  generalItems: [
    { label: 'Home', icon: FaHome, path: '/' },
    { label: 'Report', icon: FaFileAlt, path: '/report' },
    { label: 'Download', icon: FaFileDownload, path: '/download' }, 
    { label: 'Preference', icon: FaClipboardList, path: '/preference' }, // Updated icon
    { label: 'Settings', icon: FaCog, path: '/setting' }
  ]
};
