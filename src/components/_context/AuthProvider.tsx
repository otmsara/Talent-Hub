import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { User } from "../../../types/types"; // Your actual User type definition
import { getUser } from "@/actions/actions"; // Your actual function to get user data
import { useToast } from "@/hooks/use-toast"; // Your actual useToast hook

import { useNavigate } from "react-router-dom"; // This is the key change for React Router DOM
// --- Mocks for demonstration purposes (DELETE these when you use your actual imports) ---
// Mock User type for demonstration
type User = {
  id: string;
  name: string;
  accessToken?: string;
  // Add other properties as per your actual User type
};

// Mock getUser function for demonstration
const getUser = async (): Promise<{ success: boolean; data: User | null; err?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate a successful user fetch
      const mockUser: User = { id: "user-123-abc", name: "Authenticated User", accessToken: "mock_auth_token" };
      resolve({ success: true, data: mockUser });

      // Uncomment the line below and comment the above two lines to simulate a failed user fetch
      // resolve({ success: false, data: null, err: "Session expired. Please log in again." });
    }, 700); // Simulate network delay
  });
};

// Mock useToast hook for demonstration
const useToast = () => {
  return {
    toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
      console.log(`Toast: [${variant || 'default'}] ${title} - ${description}`);
      // In a real application, this would trigger a visual toast notification.
    },
  };
};
// --- END Mocks ---


// Define the interface for the AuthContext
export interface AuthContextInterface {
  auth: User | null;
  setAuth: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
}

// Create the AuthContext with a default value
const AuthContext = createContext<AuthContextInterface>({
  auth: null,
  setAuth: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate(); // Using useNavigate from react-router-dom

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true); // Indicate that authentication check is in progress
      try {
        const result = await getUser();
        const { success, err, data } = result || {
          success: false,
          data: null,
          err: "An unexpected error occurred during authentication.",
        };

        if (success) {
          setAuth(data); // Set authenticated user data
          toast({
            title: "Authentication Successful",
            description: "Welcome back!",
            variant: "success",
          });
          // Optional: Redirect to a dashboard or home page after successful authentication
          // navigate('/dashboard');
        } else {
          setAuth(null); // Clear auth state on failure
          toast({
            title: "Authentication Failed",
            description: err || "Please log in again.",
            variant: "destructive",
          });
          // Optional: Redirect to login page on authentication failure
          // navigate('/login');
        }
      } catch (error) {
        console.error("Error during authentication check:", error);
        setAuth(null);
        toast({
          title: "Authentication Error",
          description: "Could not connect to authentication service.",
          variant: "destructive",
        });
        // Optional: Redirect to login page on error
        // navigate('/login');
      } finally {
        setLoading(false); // Authentication check is complete
      }
    };

    checkAuth();
  }, []); // Empty dependency array ensures this runs only once on component mount

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;