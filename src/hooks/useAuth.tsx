import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  login,
  register as apiRegister,
  logout as apiLogout,
  User,
} from "@/lib/api";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    role: "clinic" | "pharmacy" | "rider";
    name: string;
    organization?: string;
    address?: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session from localStorage (user data persisted after login)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const loginHandler = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user } = await login({ email, password });
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } finally {
      setLoading(false);
    }
  };

  const registerHandler = async (userData: {
    email: string;
    password: string;
    role: "clinic" | "pharmacy" | "rider";
    name: string;
    organization?: string;
    address?: string;
    phone?: string;
  }) => {
    setLoading(true);
    try {
      const { user } = await apiRegister(userData);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } finally {
      setLoading(false);
    }
  };

  const logoutHandler = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: loginHandler,
        register: registerHandler,
        logout: logoutHandler,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
