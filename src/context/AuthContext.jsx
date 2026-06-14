import { createContext, useState, useEffect } from 'react';
import Loader from '../components/Loader';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token') || null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (authToken) => {
    try {
      const [resBasic, resExtended] = await Promise.all([
        fetch(import.meta.env.VITE_API_URL + '/api/user/profile', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        }),
        fetch(import.meta.env.VITE_API_URL + '/api/profile/me', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        })
      ]);

      if (resBasic.ok) {
        const basicData = await resBasic.json();
        let extendedData = {};
        if (resExtended.ok) {
          extendedData = await resExtended.json();
        }
        setUserProfile({ ...basicData, ...extendedData });
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  // Restore session from localStorage if token exists
  useEffect(() => {
    if (token) {
      // Decode JWT payload (just the payload part)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Check if expired
        if (payload.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser({ email: payload.email, role: payload.role });
          fetchUserProfile(token).finally(() => setLoading(false));
          return; // Skip setLoading(false) here, handled in finally
        }
      } catch (err) {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('auth_token', newToken);
    await fetchUserProfile(newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, token, login, logout, loading, fetchUserProfile }}>
      {loading ? <Loader fullScreen={true} /> : children}
    </AuthContext.Provider>
  );
};
