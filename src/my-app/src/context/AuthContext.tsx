import React, { createContext, useState, useContext, useEffect } from "react";
import axios, { setAccessToken } from "../api/axios";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  auth: {
    email?: string;
    role?: string;
    accessToken?: string;
    nickname?: string;
    id?: number;
    preference_theme?: string;
  } | null;
  setAuth: React.Dispatch<React.SetStateAction<any>>;
  logout: () => Promise<void>;
  updateNickname: (newNick: string) => void;
  updateTheme: (newTheme: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.post(
          "/refresh-token",
          {},
          {
            withCredentials: true,
          }
        );

        const { accessToken, preference_theme, email, role, id, nickname } =
          response.data;

        setAccessToken(accessToken);

        setAuth({
          accessToken,
          email,
          role,
          id,
          nickname,
          preference_theme: preference_theme || "light",
        });
      } catch (error) {
        console.log("Brak aktywnej sesji (lub sesja wygasła)");
        setAuth(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, []);

  const logout = async () => {
    try {
      await axios.post("/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Błąd wylogowania", error);
    } finally {
      setAuth(null);
      setAccessToken("");
    }
  };

  const updateNickname = (newNick: string) => {
    setAuth((prev: any) => {
      if (!prev) return null;
      return { ...prev, nickname: newNick };
    });
  };

  const updateTheme = (newTheme: string) => {
    setAuth((prev: any) => {
      if (!prev) return null;
      return { ...prev, preference_theme: newTheme };
    });
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, logout, updateNickname, updateTheme, isLoading }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
