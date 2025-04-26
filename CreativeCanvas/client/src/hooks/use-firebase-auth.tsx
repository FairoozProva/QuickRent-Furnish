import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { 
  auth, 
  FirebaseUser, 
  signInWithEmail, 
  createUserWithEmail, 
  signInWithGoogle, 
  logoutUser,
  updateUserProfile 
} from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

// Types for our auth context
type FirebaseAuthContextType = {
  user: FirebaseUser | null;
  isLoading: boolean;
  error: Error | null;
  emailLoginMutation: UseMutationResult<any, Error, { email: string; password: string; }>;
  emailRegisterMutation: UseMutationResult<any, Error, { email: string; password: string; displayName: string; }>;
  googleSignInMutation: UseMutationResult<any, Error, void>;
  logoutMutation: UseMutationResult<void, Error, void>;
};

// Create the auth context
export const FirebaseAuthContext = createContext<FirebaseAuthContextType | null>(null);

// Provider component
export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Set up auth state listener on mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [initializing]);

  // Email sign in mutation
  const emailLoginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      try {
        const result = await signInWithEmail(email, password);
        return result.user;
      } catch (error) {
        // Format the error for better UX
        const errorMessage = (error as Error).message;
        const formattedError = errorMessage.includes('auth/') 
          ? errorMessage.split('auth/')[1].split(')')[0].replace(/-/g, ' ')
          : errorMessage;
        throw new Error(formattedError);
      }
    },
    onSuccess: () => {
      toast({
        title: "Sign in successful",
        description: "Welcome back!",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Email registration mutation
  const emailRegisterMutation = useMutation({
    mutationFn: async ({ email, password, displayName }: { email: string; password: string; displayName: string }) => {
      try {
        const result = await createUserWithEmail(email, password);
        // Set display name
        if (result.user) {
          await updateUserProfile(result.user, displayName);
        }
        return result.user;
      } catch (error) {
        // Format the error for better UX
        const errorMessage = (error as Error).message;
        const formattedError = errorMessage.includes('auth/') 
          ? errorMessage.split('auth/')[1].split(')')[0].replace(/-/g, ' ')
          : errorMessage;
        throw new Error(formattedError);
      }
    },
    onSuccess: () => {
      toast({
        title: "Registration successful",
        description: "Your account has been created",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Google sign-in mutation
  const googleSignInMutation = useMutation({
    mutationFn: async () => {
      try {
        const result = await signInWithGoogle();
        return result.user;
      } catch (error) {
        // Google sign-in can be cancelled by the user, which isn't an error
        if ((error as Error).message.includes('cancelled')) {
          throw new Error('Sign in was cancelled');
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Google sign in successful",
        description: "Welcome!",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: Error) => {
      // Don't show error toast if user just cancelled the popup
      if (!error.message.includes('cancelled')) {
        toast({
          title: "Google sign in failed",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logoutUser();
    },
    onSuccess: () => {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <FirebaseAuthContext.Provider
      value={{
        user,
        isLoading: initializing,
        error: null,
        emailLoginMutation,
        emailRegisterMutation,
        googleSignInMutation,
        logoutMutation,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
}

// Hook to use the auth context
export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error("useFirebaseAuth must be used within a FirebaseAuthProvider");
  }
  return context;
}