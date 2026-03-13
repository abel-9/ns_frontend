import type { Me } from "#/features/user/types";
import { Route } from "#/routes/__root";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: Me | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Me | null>(null);
  const data = Route.useLoaderData();

  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    }
  }, [data]);

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
