import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import useAdminGuard from '../hooks/useAdminGuard';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const checkIsAdmin = useAdminGuard();
  const isAdmin = checkIsAdmin();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <button 
            onClick={toggleMenu} 
            className="md:hidden text-white focus:outline-none"
          >
            {/* Hamburger icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          {/* Regular menu items (hidden on mobile) */}
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="hover:text-gray-300">{t('home')}</Link>
            <Link to="/vehicles" className="hover:text-gray-300">{t('vehicles')}</Link>
            <Link to="/refuelings" className="hover:text-gray-300">{t('refuelings')}</Link>
            <Link to="/statistics" className="hover:text-gray-300">{t('statistics')}</Link>
            {isAdmin && <Link to="/admin" className="hover:text-gray-300">{t('admin')}</Link>}
          </div>
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
            <option value="rm">So De Roma</option>
            <option value="na">So De Napoli</option>
          </select>
          <button onClick={handleLogout} className="hover:text-gray-300">{t('logout')}</button>
        </div>
      </div>

      {/* Mobile menu (visible when hamburger is clicked) */}
      {isOpen && (
        <div className="md:hidden mt-4">
          <Link to="/" className="block hover:text-gray-300 py-2" onClick={closeMenu}>
            {t('home')}
          </Link>
          <Link to="/vehicles" className="block hover:text-gray-300 py-2" onClick={closeMenu}>
            {t('vehicles')}
          </Link>
          <Link to="/refuelings" className="block hover:text-gray-300 py-2" onClick={closeMenu}>
            {t('refuelings')}
          </Link>
          <Link to="/statistics" className="block hover:text-gray-300 py-2" onClick={closeMenu}>
            {t('statistics')}
          </Link>
          {isAdmin && <Link to="/admin" className="block hover:text-gray-300 py-2" onClick={closeMenu}>{t('admin')}</Link>}
        </div>
      )}
    </nav>
  );
};

export default Navbar;