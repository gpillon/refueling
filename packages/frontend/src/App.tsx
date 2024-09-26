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
import Home from './components/Home';
import AdminUserComponent from './components/AdminUserComponent';
import useAdminGuard from './hooks/useAdminGuard';



const AppContent: React.FC = () => {

  const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
  };
  
  const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const checkIsAdmin = useAdminGuard();
    const isAdmin = checkIsAdmin();
    console.log('Is admin:', isAdmin);
    
    if (isAdmin === undefined) {
      return null; // or a loading indicator
    }
    
    return isAdmin ? <>{children}</> : <Navigate to="/" />;
  };
  
  const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {children}
    </div>
  );

  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="min-h-screen">
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route
            path="/vehicles"
            element={
              <PrivateRoute>
                <Layout>
                  <Vehicles />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/statistics"
            element={
              <PrivateRoute>
                <Layout>
                  <Statistics />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/refuelings"
            element={
              <PrivateRoute>
                <Layout>
                  <Refuelings />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminRoute>
                  <Layout>
                    <AdminUserComponent />
                  </Layout>
                </AdminRoute>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </I18nextProvider>
  );
};

export default App;