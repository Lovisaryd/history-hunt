import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({
  token: "",
  localId: "",
  isAuthenticated: false,
  authenticate: (token) => {},
  logout: () => {},
});

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [localId, setlocalId] = useState('')
  const isAuthenticated = !!token;

  useEffect(() => {
    const fetchLocalId = async () => {
      const storedLocalId = await AsyncStorage.getItem("localId");
      if (storedLocalId) {
        setlocalId(storedLocalId);
      }
    };

    fetchLocalId();
  }, []);


  const authenticate = async (token, localId) => {
    setToken(token);
    setlocalId(localId)
    AsyncStorage.setItem("appToken", token);
  };

  const logout = () => {
    setToken(null);
    AsyncStorage.removeItem("appToken");
    AsyncStorage.removeItem('localId')
  };

  const value = {
    token,
    localId,
    isAuthenticated,
    authenticate,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;