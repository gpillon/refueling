import { useEffect, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../types';

const useAdminGuard = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      setIsAdmin(decoded.role === 'admin');
    } else {
      setIsAdmin(false);
    }
  }, []);

  const checkIsAdmin = useCallback(() => isAdmin, [isAdmin]);

  return checkIsAdmin;
};

export default useAdminGuard;