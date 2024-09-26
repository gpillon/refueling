import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/vehicles" className="hover:text-gray-300">{t('vehicles')}</Link>
          <Link to="/refuelings" className="hover:text-gray-300">{t('refuelings')}</Link>
          <Link to="/statistics" className="hover:text-gray-300">{t('statistics')}</Link>
        </div>
        <div className="flex items-center space-x-4">
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            value={i18n.language}
            className="bg-gray-700 text-white px-2 py-1 rounded"
          >
            <option value="en">English</option>
            <option value="it">Italiano</option>
            <option value="es">Español</option>
          </select>
          <button onClick={handleLogout} className="hover:text-gray-300">{t('logout')}</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;