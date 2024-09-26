import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Language switcher */}
      
      {!isAuthenticated && (
        <div className="absolute top-4 right-4 z-10">
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            value={i18n.language}
            className="bg-white bg-opacity-20 px-2 py-1 rounded-full backdrop-filter backdrop-blur-lg text-white"
          >
            <option value="en" className="text-black">English</option>
            <option value="it" className="text-black">Italiano</option>
            <option value="es" className="text-black">Español</option>
            <option value="rm" className="text-black">So De Roma</option>
            <option value="na" className="text-black">So De Napoli</option>
          </select>
        </div>
      )}

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-yellow-300 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-green-300 rounded-full opacity-50 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-red-300 rounded-full opacity-50 animate-ping"></div>
      </div>

      <div className="text-center bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-xl max-w-md relative z-10">
        <h1 className="text-4xl font-bold mb-6 text-white">{t('welcomeMessage')}</h1>
        <p className="text-lg mb-8 text-white">{t('homeDescription')}</p>
        <div className="space-y-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/vehicles"
                className="bg-white text-blue-600 hover:bg-blue-100 font-bold py-2 px-4 rounded-full text-base inline-block transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              >
                {t('viewVehicles')}
              </Link>
              <Link
                to="/refuelings"
                className="bg-white text-green-600 hover:bg-green-100 font-bold py-2 px-4 rounded-full text-base inline-block ml-2 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              >
                {t('viewRefuelings')}
              </Link>
              <Link
                to="/statistics"
                className="bg-white text-purple-600 hover:bg-purple-100 font-bold py-2 px-4 rounded-full text-base inline-block ml-2 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              >
                {t('viewStatistics')}
              </Link>
            </>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-white text-blue-600 hover:bg-blue-100 font-bold py-2 px-4 rounded-full text-base inline-block transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              {t('login')}
            </button>
          )}
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
};

export default Home;