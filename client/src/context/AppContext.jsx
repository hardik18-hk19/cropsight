import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { userAPI, authAPI } from "../services/api";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);
  const [userRole, setUserRole] = useState("");

  const getUserData = useCallback(async () => {
    try {
      const data = await userAPI.getUserData();
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  const getUserRole = useCallback(async () => {
    try {
      const data = await userAPI.getUserRole();
      data.success ? setUserRole(data.userRole) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  useEffect(() => {
    getUserRole();
  }, [getUserRole]);

  const getAuthState = useCallback(async () => {
    try {
      const data = await authAPI.isAuthenticated();
      if (data && data.success) {
        setIsLoggedIn(true);
        getUserData();
        getUserRole();
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
      // Only show toast for actual errors, not auth failures
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  }, [getUserData, getUserRole]);

  useEffect(() => {
    getAuthState();
  }, [getAuthState]);

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    userRole,
    setUserRole,
  };

  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};
