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


type FirebaseAuthContextType = {
  user: FirebaseUser | null;
  isLoading: boolean;
  error: Error | null;
  emailLoginMutation: UseMutationResult<any, Error, { email: string; password: string; }>;
  emailRegisterMutation: UseMutationResult<any, Error, { email: string; password: string; displayName: string; }>;
  googleSignInMutation: UseMutationResult<any, Error, void>;
  logoutMutation: UseMutationResult<void, Error, void>;
};


export const FirebaseAuthContext = createContext<FirebaseAuthContextType | null>(null);

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [initializing, setInitializing] = useState(true);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });

    
    return () => unsubscribe();
  }, [initializing]);

  
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

  
  const emailRegisterMutation = useMutation({
    mutationFn: async ({ email, password, displayName }: { email: string; password: string; displayName: string }) => {
      try {
        const result = await createUserWithEmail(email, password);
        if (result.user) {
          await updateUserProfile(result.user, displayName);
        }
        return result.user;
      } catch (error) {
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

 
  const googleSignInMutation = useMutation({
    mutationFn: async () => {
      try {
        const result = await signInWithGoogle();
        return result.user;
      } catch (error) {
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
      if (!error.message.includes('cancelled')) {
        toast({
          title: "Google sign in failed",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

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


export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error("useFirebaseAuth must be used within a FirebaseAuthProvider");
  }
  return context;
}
