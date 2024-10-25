import { Route, Routes, Outlet } from 'react-router-dom';
import Healthcheck from './Pages/ServerHealthStatus/ServerHealthStatus';
import { Toaster } from 'react-hot-toast';
import DashboardPage from './Pages/Dashboard/DashboardPage';
import HomePage from './Pages/Dashboard/DashboardPages/HomePage';
import ReportPage from './Pages/Dashboard/DashboardPages/ReportPage';
import DownloadPage from './Pages/Dashboard/DashboardPages/DownloadPage';
import SettingPage from './Pages/Dashboard/DashboardPages/SettingPage';
import AdminSigninPage from './Pages/Auth/SigninPage/AdminSigninPage';
import PublicSigninPage from './Pages/Auth/SigninPage/PublicSigninPage';
import PublicSignupPage from './Pages/Auth/SignupPage/PublicSignupPage';
import AdminSignupPage from './Pages/Auth/SignupPage/AdminSignupPage';
import LogoutPage from './Pages/Dashboard/DashboardPages/LogoutPage';
import PreferencePage from './Pages/Dashboard/DashboardPages/PreferencePage';
import NotFoundPage from './Pages/PageNotFound/NotFoundPage';
import WelcomePage from './Pages/Home/WelcomePage';


const App = () => {
  return (
    <>
      <Toaster reverseOrder={false} />
      <Routes>
        {/* Auth Routes */}
        <Route path="/dowellcubes/auth" element={<Outlet />}>
          <Route path="signin/admin" element={<AdminSigninPage />} />
          <Route path="signin/public" element={<PublicSigninPage />} />
          <Route path="signup/public" element={<PublicSignupPage />} />
          <Route path="signup/admin" element={<AdminSignupPage />} />
        </Route>

        {/* Healthcheck Route */}
        <Route path="/dowellcubes/healthcheck" element={<Healthcheck />} />
        <Route path="/dowellcubes/page-not-found" element={<NotFoundPage />} />
        <Route path="/dowellcubes" element={<WelcomePage />} />
        <Route path="/" element={<WelcomePage />} />

        {/* Dashboard Routes */}
        <Route path="/dowellcubes/dashboard" element={<DashboardPage />}>
          <Route index element={<HomePage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="download" element={<DownloadPage />} />
          <Route path="setting" element={<SettingPage />} />
          <Route path="preferences" element={<PreferencePage />} />
          <Route path="logout" element={<LogoutPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
