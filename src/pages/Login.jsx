import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formHeight, setFormHeight] = useState('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  // Form data states
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  // Track and update form height to ensure proper display
  useEffect(() => {
    // Set a timeout to ensure the DOM has updated
    const timeout = setTimeout(() => {
      const loginForm = document.getElementById('login-form');
      const signupForm = document.getElementById('signup-form');
      
      if (loginForm && signupForm) {
        const loginHeight = loginForm.offsetHeight;
        const signupHeight = signupForm.offsetHeight;
        const maxHeight = Math.max(loginHeight, signupHeight);
        setFormHeight(`${maxHeight}px`);
      }
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [isLogin]);

  // Add auth state check on component mount
  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('access') || sessionStorage.getItem('access');
    if (token) {
      // Validate token with a quick check to the server
      validateAuthToken(token);
    }

    // Check if there's a Google auth code in the URL (for redirect back from Google)
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    
    if (authCode) {
      // Process the Google auth code
      handleGoogleAuthCode(authCode);
      // Clear the URL parameters to avoid reprocessing on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  useEffect(() => {
    const loadGoogleSDK = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google Identity SDK loaded');
      };
      script.onerror = () => {
        console.error('Failed to load Google Identity SDK');
      };
      document.body.appendChild(script);
    };
  
    loadGoogleSDK();
  }, []);
  
  // Handle Google auth code after redirect
  const handleGoogleAuthCode = async (authCode) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Send the auth code to your backend
      const response = await fetch('https://stream-l2du.onrender.com//api/user/google-auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code: authCode,
          redirect_uri: window.location.origin + '/google-callback'  // Must match what you used in the initial request
        }),
        credentials: 'include',
      });
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text || 'Authentication failed with no message' };
      }
      
      if (!response.ok) {
        throw new Error(data.message || `Google authentication failed with status ${response.status}`);
      }
      
      // Handle successful login
      const { access, refresh, username, is_new_user } = data;
      
      // Store tokens
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      if (username) {
        localStorage.setItem('username', username);
      }
      
      // Show appropriate message
      setSuccessMessage(is_new_user 
        ? 'Account created successfully with Google!' 
        : `Welcome back, ${username || 'User'}!`);
      
      // Navigate to dashboard after slight delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error) {
      console.error('Google auth error:', error);
      setError(error.message || 'Google authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Token validation function
  const validateAuthToken = async (token) => {
    try {
      const response = await fetch('https://stream-l2du.onrender.com/api/user/validate-token/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Token is valid, redirect to main page
        navigate('/');
      }
      // If invalid, we stay on login page (no action needed)
    } catch (error) {
      console.log('Token validation error:', error);
      // We'll stay on the login page
    }
  };

  const toggleForm = () => {
    setIsAnimating(true);
    // Clear any previous errors when switching forms
    setError(null);
    setSuccessMessage(null);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
    }, 400);
  };

  // Handle input changes for login form
  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData({
      ...loginData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle input changes for signup form
  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData({
      ...signupData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle login submission with improved error handling
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
  
    try {
      const response = await fetch('https://stream-l2du.onrender.com/api/user/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        }),
        credentials: 'include',
      });
  
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text || 'Login failed with no message' };
      }
  
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid email or password. Please try again.');
        } else if (response.status === 429) {
          throw new Error('Too many login attempts. Please try again later.');
        } else {
          throw new Error(data.message || `Login failed with status ${response.status}`);
        }
      }
  
      const { access, refresh, username } = data;
  
      if (loginData.rememberMe) {
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
        if (username) {
          localStorage.setItem('username', username);
        }
      } else {
        sessionStorage.setItem('access', access);
        sessionStorage.setItem('refresh', refresh);
        if (username) {
          sessionStorage.setItem('username', username);
        }
      }
  
      setSuccessMessage(username ? `Welcome back, ${username}!` : 'Login successful!');
  
      // Navigate to dashboard after slight delay
      setTimeout(() => {
        navigate('/dashboard'); // Client-side navigation
      }, 1000);
  
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle signup submission with improved error handling
  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    // Validation
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!signupData.agreeTerms) {
      setError('You must agree to the Terms and Privacy Policy');
      return;
    }
    
    // Password strength validation
    if (signupData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // API call for signup
      const response = await fetch('https://stream-l2du.onrender.com/api/user/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: signupData.fullName,
          email: signupData.email,
          password: signupData.password
        }),
        credentials: 'include', // Important for cookies
      });
      
      // Handle response
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text || 'Registration failed with no message' };
      }
      
      if (!response.ok) {
        // Handle specific errors
        if (response.status === 409) {
          throw new Error('An account with this email already exists');
        } else {
          throw new Error(data.message || `Registration failed with status ${response.status}`);
        }
      }
      
      // Handle successful signup
      console.log('Signup successful:', data);
      
      // Check if the backend returned a username and save it
      if (data.username) {
        localStorage.setItem('username', data.username);
      }
      
      // Set a success message
      setSuccessMessage('Account created successfully! Please log in with your credentials.');
      
      // Clear the signup form
      setSignupData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      });
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        setIsAnimating(true);
        setTimeout(() => {
          setIsLogin(true);
          setIsAnimating(false);
        }, 400);
      }, 1500);
      
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  // Modified Google Auth implementation - uses Google Identity Services SDK
  const handleGoogleAuth = () => {
    setIsLoading(true);
    setError(null);
  
    try {
      if (!window.google) {
        throw new Error('Google Identity SDK not loaded');
      }
  
      google.accounts.id.initialize({
        client_id: '847878289589-qvg5hqrijf9nl0apn8htit8flfne12u5.apps.googleusercontent.com',
        callback: async (response) => {
          const idToken = response.credential;
  
          try {
            const res = await fetch('https://stream-l2du.onrender.com/api/user/google-login/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token: idToken }),

            });
  
            if (!res.ok) {
              const errMsg = await res.text();
              throw new Error(`Backend error: ${errMsg}`);
            }
            const { access, refresh, username } = data;
  
            if (loginData.rememberMe) {
              localStorage.setItem('access', access);
              localStorage.setItem('refresh', refresh);
              if (username) {
                localStorage.setItem('username', username);
              }
            } else {
              sessionStorage.setItem('access', access);
              sessionStorage.setItem('refresh', refresh);
              if (username) {
                sessionStorage.setItem('username', username);
              }
            }
        
            setSuccessMessage(username ? `Welcome back, ${username}!` : 'Login successful!');
        
            // Navigate to dashboard after slight delay
            setTimeout(() => {
              navigate('/dashboard'); // Client-side navigation
            }, 1000);
        
            const data = await res.json();
            console.log('Login success:', data);
            // Store token, navigate, etc.
  
          } catch (err) {
            console.error('Backend auth error:', err);
            setError(err.message || 'Authentication failed');
          } finally {
            setIsLoading(false);
          }
        },
      });
  
      google.accounts.id.prompt();
    } catch (err) {
      console.error('Google auth error:', err);
      setError(err.message || 'Google authentication failed');
      setIsLoading(false);
    }
  };
  
  

  // Handle password reset request
  const handleForgotPassword = async () => {
    if (!loginData.email) {
      setError('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Updated to production URL
      const response = await fetch('https://stream-l2du.onrender.com/api/user/reset-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email
        }),
      });
      
      // Parse response
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text || 'Request failed with no message' };
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset link');
      }
      
      // Show success message
      setSuccessMessage('Password reset link sent to your email');
      
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4">
      <div className="relative w-full max-w-md">
        {/* Card Container */}
        <div className="bg-gray-700 rounded-xl shadow-xl p-8">
          {/* Toggle Switch at Top */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-800 rounded-full p-1 flex w-64">
              <button
                onClick={() => !isAnimating && !isLoading && setIsLogin(true)}
                className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${
                  isLogin ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => !isAnimating && !isLoading && setIsLogin(false)}
                className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${
                  !isLogin ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Create Account With BWT'}
            </h1>
            <p className="text-gray-300 mt-2">
              {isLogin ? 'Please sign in to continue' : 'Sign up to get started'}
            </p>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message Display */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Forms Container with Dynamic Height */}
          <div style={{ minHeight: formHeight }} className="relative">
            {/* Login Form */}
            <div 
              id="login-form"
              className={`transition-all duration-500 ${
                isAnimating ? (isLogin ? 'opacity-0 translate-x-full' : 'opacity-0 -translate-x-full') : 'opacity-100 translate-x-0'
              } ${!isLogin && !isAnimating ? 'hidden' : ''}`}
            >
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg py-3 pl-10 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email"
                    required
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg py-3 pl-10 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Password"
                    required
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="rememberMe"
                      type="checkbox"
                      checked={loginData.rememberMe}
                      onChange={handleLoginChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <button 
                      type="button"
                      onClick={handleForgotPassword}
                      className="font-medium text-blue-400 hover:text-blue-300"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-full flex items-center justify-center transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2" size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {/* Signup Form */}
            <div 
              id="signup-form"
              className={`transition-all duration-500 ${
                isAnimating ? (isLogin ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full') : 'opacity-100 translate-x-0'
              } ${isLogin && !isAnimating ? 'hidden' : ''} ${!isLogin || isAnimating ? 'absolute top-0 left-0 w-full' : ''}`}
            >
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={signupData.fullName}
                    onChange={handleSignupChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg py-3 pl-10 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full Name"
                    required
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg py-3 pl-10 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email" 
                    required
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg py-3 pl-10 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Password (min. 8 characters)"
                    required
                    minLength="8"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg py-3 pl-10 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm Password"
                    required
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    id="agree-terms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={signupData.agreeTerms}
                    onChange={handleSignupChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 rounded"
                    required
                  />
                  <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-300">
                    I agree to the Terms and Privacy Policy
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-full flex items-center justify-center transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2" size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Toggle text link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-300">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleForm}
                className="text-blue-400 hover:text-blue-300 font-medium"
                disabled={isAnimating || isLoading}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
          
          {/* Divider */}
          <div className="relative mt-6 mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-700 text-gray-300">Or continue with</span>
            </div>
          </div>
          
          {/* Google Sign-in Button - Backend integrated implementation */}
          <div className="flex justify-center">
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-full py-3 px-4 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-gray-700" />
                  Please wait...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {isLogin ? "Sign in with Google" : "Sign up with Google"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}