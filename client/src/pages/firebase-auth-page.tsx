import React, { useState } from 'react';
import { useFirebaseAuth } from '@/hooks/use-firebase-auth';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { FcGoogle } from 'react-icons/fc';
import { Loader2 } from 'lucide-react';

const FirebaseAuthPage: React.FC = () => {
  const { user, emailLoginMutation, emailRegisterMutation, googleSignInMutation } = useFirebaseAuth();
  const [, setLocation] = useLocation();

  // Form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  
  // Validation state
  const [registerPasswordError, setRegisterPasswordError] = useState('');

  // Check if user is already logged in
  if (user) {
    setLocation('/');
    return null;
  }

  // Handle login form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    emailLoginMutation.mutate({ email: loginEmail, password: loginPassword });
  };

  // Handle registration form submission
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (registerPassword !== registerConfirmPassword) {
      setRegisterPasswordError('Passwords do not match');
      return;
    }

    // Validate password length
    if (registerPassword.length < 6) {
      setRegisterPasswordError('Password must be at least 6 characters');
      return;
    }

    setRegisterPasswordError('');

    // Submit registration
    emailRegisterMutation.mutate({
      email: registerEmail,
      password: registerPassword,
      displayName: registerName
    });
  };

  // Handle Google sign in
  const handleGoogleSignIn = () => {
    googleSignInMutation.mutate();
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left column: Auth form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">QuickRent Furnish</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in or create an account to get started with furniture rental
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            {/* Login Tab */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Enter your email and password to sign in to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your@email.com" 
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={emailLoginMutation.isPending}
                    >
                      {emailLoginMutation.isPending ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>
                </CardContent>
                <div className="px-6 py-2">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                </div>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleGoogleSignIn}
                    disabled={googleSignInMutation.isPending}
                  >
                    {googleSignInMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FcGoogle className="mr-2 h-4 w-4" />
                    )}
                    Google
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Register Tab */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Enter your details to create a new account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input 
                        id="register-email" 
                        type="email" 
                        placeholder="your@email.com" 
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input 
                        id="register-password" 
                        type="password" 
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        required
                      />
                      {registerPasswordError && (
                        <p className="text-sm text-red-500">{registerPasswordError}</p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={emailRegisterMutation.isPending}
                    >
                      {emailRegisterMutation.isPending ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>
                </CardContent>
                <div className="px-6 py-2">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                </div>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleGoogleSignIn}
                    disabled={googleSignInMutation.isPending}
                  >
                    {googleSignInMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FcGoogle className="mr-2 h-4 w-4" />
                    )}
                    Google
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Right column: Hero image and info */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Modern furniture"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
          <div className="absolute bottom-0 p-8 text-white">
            <h2 className="text-3xl font-bold">Modern Furniture Rental</h2>
            <p className="mt-2 max-w-xl">
              Furnish your space with premium furniture without the commitment of buying. 
              Rent for as long as you need, then return or swap for something new.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center">
                <span className="mr-2">✓</span> No long-term commitments
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span> Free delivery and assembly
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span> Flexible rental periods
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseAuthPage;
