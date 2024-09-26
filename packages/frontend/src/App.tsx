import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Vehicles from './components/Vehicles';
import Refuelings from './components/Refuelings';
import Navbar from './components/Navbar';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Statistics from './components/Statistics';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/vehicles"
                  element={
                    <PrivateRoute>
                      <Vehicles />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/statistics"
                  element={
                    <PrivateRoute>
                      <Statistics />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/refuelings"
                  element={
                    <PrivateRoute>
                      <Refuelings />
                    </PrivateRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/vehicles" />} />
              </Routes>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </I18nextProvider>
  );
};
export default App;
