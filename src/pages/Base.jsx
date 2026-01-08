import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Users, 
  CreditCard, 
  Key, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  LogOut,
  Shield,
  UserPlus,
  Copy,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  Upload,
  FileText
} from 'lucide-react';

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('creators');
  const [showPassword, setShowPassword] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [alerts, setAlerts] = useState({});
  const [profilePreview, setProfilePreview] = useState(null);

  // API Base URL
  const API_BASE = 'https://stream-l2du.onrender.com/api';
  
  // Login state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Content Creators state
  const [creators, setCreators] = useState([]);
  const [stats, setStats] = useState({
    totalCreators: 0,
    totalCreditCards: 0,
    totalPosts: 0
  });

  // New creator form state
  const [newCreator, setNewCreator] = useState({
    email: '',
    password: '',
    full_name: '',
    profile_picture: null
  });

  // Credit card data state
  const [creditCards, setCreditCards] = useState([]);

  // Check auth status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);


  useEffect(() => {
  if (authToken) {
    loadDashboardData();
  }
}, [authToken]);


  const checkAuthStatus = () => {
  const token = sessionStorage?.getItem('admin_token') || null;
  const userStr = sessionStorage?.getItem('admin_user') || null;
  
  if (token && userStr) {
  try {
    const user = JSON.parse(userStr);
    setAuthToken(token);
    setIsLoggedIn(true);
    // ❌ remove loadDashboardData() here
  } catch (error) {
    console.error('Error parsing stored user data:', error);
    handleLogout();
  }
}

};

  const showAlert = (tabName, message, type = 'info') => {
    setAlerts(prev => ({
      ...prev,
      [tabName]: { message, type }
    }));
    
    // Auto clear after 5 seconds
    setTimeout(() => {
      setAlerts(prev => {
        const newAlerts = { ...prev };
        delete newAlerts[tabName];
        return newAlerts;
      });
    }, 5000);
  };

  // Alert Component
  const AlertComponent = ({ tabName }) => {
    const alert = alerts[tabName];
    if (!alert) return null;
    
    const alertColors = {
      success: 'bg-green-100 text-green-800 border-green-200',
      error: 'bg-red-100 text-red-800 border-red-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    
    return (
      <div className={`p-4 rounded-lg border-2 mb-4 flex items-center ${alertColors[alert.type]}`}>
        <AlertCircle className="w-5 h-5 mr-2" />
        {alert.message}
      </div>
    );
  };


  const authFetch = async (url, options = {}) => {
  let token = authToken;

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    // Try refreshing the token
    const newToken = await refreshAuthToken();
    if (!newToken) throw new Error("Unauthorized");

    // Retry the request with new token
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      },
    });
  }

  return res;
};


  // Handle admin login
// Handle admin login
const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await fetch(`${API_BASE}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    const data = await response.json();

    // Debug: log the response data
    console.log('Login response:', data);

    if (response.ok) {
      if (!data.role) {
        showAlert('login', 'Invalid response from server', 'error');
        return;
      }

      // Flexible role check
      const userRole = data.role.toUpperCase();
      const isAdminOrCreator = ['ADMIN', 'SUPERUSER', 'CREATOR'].includes(userRole);

      if (!isAdminOrCreator) {
        showAlert('login', 'Only creators and admins can access this dashboard', 'error');
        return;
      }

      // ✅ Store tokens and user data in BOTH storages
      setAuthToken(data.access);

      const userData = {
        id: data.user_id,
        email: data.email,
        full_name: data.full_name,
        role: data.role
      };

      // Session storage
      sessionStorage.setItem('admin_token', data.access);
      sessionStorage.setItem('admin_refresh_token', data.refresh);
      sessionStorage.setItem('admin_user', JSON.stringify(userData));

      // Local storage
      localStorage.setItem('admin_token', data.access);
      localStorage.setItem('admin_refresh_token', data.refresh);
      localStorage.setItem('admin_user', JSON.stringify(userData));

      // Debug: confirm saved
      console.log("Session admin_token:", sessionStorage.getItem('admin_token'));
      console.log("Local admin_token:", localStorage.getItem('admin_token'));

      setIsLoggedIn(true);
      loadDashboardData();
      showAlert('dashboard', 'Login successful!', 'success');
    } else {
      showAlert('login', data.detail || 'Invalid credentials', 'error');
    }
  } catch (error) {
    showAlert('login', 'Network error. Please try again.', 'error');
    console.error('Login error:', error);
  } finally {
    setLoading(false);
  }
};

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthToken(null);
    sessionStorage?.removeItem('admin_token');
    sessionStorage?.removeItem('admin_user');
    setLoginData({ email: '', password: '' });
    setCreators([]);
    setCreditCards([]);
  };

  // Load all dashboard data
  const loadDashboardData = async () => {
    await Promise.all([
      loadCreditCards(),
      loadCreators(),
      loadStats()
    ]);
  };

  // Load credit cards
// Load credit cards
const loadCreditCards = async () => {
  try {
    const response = await authFetch(`${API_BASE}/cards/`);
    if (response.ok) {
      const data = await response.json();
      
      // Debug: log the response to see its structure
      console.log('Credit cards response:', data);
      
      // Handle different response formats
      let cards = [];
      
      if (Array.isArray(data)) {
        // If the response is already an array
        cards = data;
      } else if (data.results && Array.isArray(data.results)) {
        // If the response has a "results" property containing the array
        cards = data.results;
      } else if (data.cards && Array.isArray(data.cards)) {
        // If the response has a "cards" property containing the array
        cards = data.cards;
      } else if (data.items && Array.isArray(data.items)) {
        // If the response has an "items" property containing the array
        cards = data.items;
      } else if (data.data && Array.isArray(data.data)) {
        // If the response has a "data" property containing the array
        cards = data.data;
      } else {
        // If we can't find an array, log an error and set empty array
        console.error('Unexpected credit cards response format:', data);
        showAlert('credit-cards', 'Unexpected data format received', 'error');
      }
      
      setCreditCards(cards);
      setStats(prev => ({ ...prev, totalCreditCards: cards.length }));
    } else {
      showAlert('credit-cards', 'Failed to load credit cards', 'error');
    }
  } catch (error) {
    showAlert('credit-cards', 'Error loading credit cards', 'error');
    console.error('Error loading credit cards:', error);
  }
};


  // Load creators (you'll need to implement this endpoint)
  const loadCreators = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/creators/`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      });
      
      if (response.ok) {
        const creatorsData = await response.json();
        setCreators(creatorsData);
        setStats(prev => ({ ...prev, totalCreators: creatorsData.length }));
      } else {
        const errorData = await response.json();
        showAlert('creators', errorData.detail || 'Failed to load creators', 'error');
      }
    } catch (error) {
      showAlert('creators', 'Error loading creators', 'error');
      console.error('Error loading creators:', error);
    }
  };

  // Load statistics
  const loadStats = async () => {
    try {
      // You can implement a dedicated stats endpoint or calculate from existing data
      const statsResponse = await fetch(`${API_BASE}/admin/stats/`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Create new content creator
 const handleCreateCreator = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const formData = new FormData();
    formData.append('email', newCreator.email);
    formData.append('password', newCreator.password);
    formData.append('full_name', newCreator.full_name);
    
    if (newCreator.profile_picture) {
      formData.append('profile_picture', newCreator.profile_picture);
    }
    
    const response = await fetch(`${API_BASE}/creator/signup/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (response.ok) {
      showAlert('creators', `Creator created successfully! Access code: ${data.access_code}`, 'success');
      setNewCreator({ email: '', password: '', full_name: '', profile_picture: null });
      document.getElementById('creator-form').reset();
      loadCreators(); // Refresh creators list
      loadStats(); // Refresh stats
    } else {
      const errorMsg = typeof data === 'object' ? 
        Object.values(data).flat().join(', ') : 
        'Failed to create creator';
      showAlert('creators', errorMsg, 'error');
    }
  } catch (error) {
    showAlert('creators', 'Network error. Please try again.', 'error');
    console.error('Creator creation error:', error);
  } finally {
    setLoading(false);
  }
};

  // Helper function to handle creator deletion
  const handleDeleteCreator = async (creatorId) => {
    if (window.confirm('Are you sure you want to delete this creator?')) {
      try {
        // Implement delete endpoint if available
        const response = await fetch(`${API_BASE}/admin/creators/${creatorId}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          }
        });
        
        if (response.ok) {
          setCreators(creators.filter(creator => creator.id !== creatorId));
          showAlert('creators', 'Creator deleted successfully', 'success');
        } else {
          showAlert('creators', 'Failed to delete creator', 'error');
        }
      } catch (error) {
        // For demo purposes, remove from local state
        setCreators(creators.filter(creator => creator.id !== creatorId));
        showAlert('creators', 'Creator removed from list', 'info');
      }
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(text);
    setTimeout(() => setCopySuccess(''), 2000);
  };
  
  const refreshAuthToken = async () => {
  try {
    const refreshToken = sessionStorage.getItem('admin_refresh_token');
    const response = await fetch(`${API_BASE}/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken })
    });
    
    if (response.ok) {
      const data = await response.json();
      setAuthToken(data.access);
      sessionStorage.setItem('admin_token', data.access);
      return data.access;
    } else {
      handleLogout();
      return null;
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    handleLogout();
    return null;
  }
};

// Update all API calls to handle token expiration

  // Login Form Component

  const LoginForm = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Use useRef for immediate value access without re-render delay
  const loginDataRef = useRef(loginData);
  
  // Keep ref in sync with state
  useEffect(() => {
    loginDataRef.current = loginData;
  }, [loginData]);

  // Optimized handleInputChange
  const handleInputChange = useCallback((field) => (e) => {
    const value = e.target.value;
    
    // Update state immediately in one go
    setLoginData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Your login logic here
      console.log('Login data:', loginDataRef.current);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Portal</h1>
          <p className="text-gray-600 mt-2">Sign in to access dashboard</p>
        </div>
        
        <AlertComponent tabName="login" />
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={loginData.email}
              onChange={handleInputChange('email')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150"
              placeholder="admin@example.com"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={handleInputChange('password')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 transition-all duration-150"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};


  // Main Dashboard Component
  const Dashboard = () => (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('creators')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'creators'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              Content Creators
            </button>
            <button
              onClick={() => setActiveTab('credit-cards')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'credit-cards'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <CreditCard className="w-5 h-5 inline mr-2" />
              Credit Cards
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AlertComponent tabName="dashboard" />
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'creators' && <CreatorsTab />}
        {activeTab === 'credit-cards' && <CreditCardsTab />}
      </main>
    </div>
  );

  // Overview Tab
  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Creators</p>
              <p className="text-3xl font-bold">{stats.totalCreators}</p>
            </div>
            <Users className="w-10 h-10 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Credit Cards</p>
              <p className="text-3xl font-bold">{stats.totalCreditCards}</p>
            </div>
            <CreditCard className="w-10 h-10 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Posts</p>
              <p className="text-3xl font-bold">{stats.totalPosts}</p>
            </div>
            <FileText className="w-10 h-10 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">This Month</p>
              <p className="text-3xl font-bold">
                {creditCards.filter(card => {
                  const cardDate = new Date(card.created_at);
                  const currentDate = new Date();
                  return cardDate.getMonth() === currentDate.getMonth() && 
                         cardDate.getFullYear() === currentDate.getFullYear();
                }).length}
              </p>
            </div>
            <CreditCard className="w-10 h-10 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UserPlus className="w-5 h-5 mr-2 text-blue-600" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => setActiveTab('creators')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Creator
            </button>
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-green-600" />
            Recent Activity
          </h3>
          <div className="space-y-2">
            {creditCards.slice(0, 3).map((card, index) => (
              <div key={index} className="text-sm text-gray-600 flex justify-between">
                <span>New card from {card.card_holder_name}</span>
                <span>{new Date(card.created_at).toLocaleDateString()}</span>
              </div>
            ))}
            {creditCards.length === 0 && (
              <p className="text-gray-500 text-sm">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Content Creators Tab
  const CreatorsTab = () => (

    
    <div className="space-y-6">
      <AlertComponent tabName="creators" />
      
      {/* Create New Creator Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <UserPlus className="w-6 h-6 mr-2 text-blue-600" />
          Create New Content Creator
        </h2>
        <form id="creator-form" onSubmit={handleCreateCreator} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={newCreator.full_name}
                onChange={(e) => setNewCreator({...newCreator, full_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Creator full name"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newCreator.email}
                onChange={(e) => setNewCreator({...newCreator, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="creator@example.com"
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={newCreator.password}
                onChange={(e) => setNewCreator({...newCreator, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Create secure password"
                required
                disabled={loading}
              />
            </div>
           <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      setNewCreator({...newCreator, profile_picture: file});
      
      // Create preview
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setProfilePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setProfilePreview(null);
      }
    }}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    disabled={loading}
  />
  {profilePreview && (
    <div className="mt-2">
      <img 
        src={profilePreview} 
        alt="Profile preview" 
        className="w-20 h-20 rounded-full object-cover border"
      />
    </div>
  )}
</div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Creator
              </>
            )}
          </button>
        </form>
      </div>

      {/* Creators List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Content Creators ({creators.length})</h3>
          <button
            onClick={loadCreators}
            disabled={loading}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Access Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
          <tbody className="divide-y divide-gray-200">
  {creators.length > 0 ? creators.map((creator) => (
    <tr key={creator.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {creator.profile_picture ? (
            <img 
              src={creator.profile_picture} 
              alt={creator.full_name || creator.name} 
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
              <Users className="w-5 h-5 text-gray-500" />
            </div>
          )}
          <div className="text-sm font-medium text-gray-900">
            {creator.full_name || creator.name}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {creator.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center">
          <span className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">
            {creator.access_code || creator.accessCode}
          </span>
          <button
            onClick={() => copyToClipboard(creator.access_code || creator.accessCode)}
            className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
            title="Copy access code"
          >
            {copySuccess === (creator.access_code || creator.accessCode) ? 
              <CheckCircle className="w-4 h-4 text-green-600" /> : 
              <Copy className="w-4 h-4" />
            }
          </button>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          creator.status === 'active' || creator.is_active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {creator.status || (creator.is_active ? 'active' : 'inactive')}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {creator.joinDate || (creator.created_at ? new Date(creator.created_at).toLocaleDateString() : 'N/A')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={() => {/* Add edit functionality */}}
            className="text-blue-600 hover:text-blue-900 transition-colors"
            title="Edit creator"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteCreator(creator.id)}
            className="text-red-600 hover:text-red-900 transition-colors"
            title="Delete creator"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )) : (
    <tr>
      <td colSpan="6" className="px-6 py-8 text-center">
        <div className="flex flex-col items-center text-gray-500">
          <Users className="w-12 h-12 mb-2 text-gray-400" />
          <p>No creators found.</p>
          <p className="text-sm">Create your first creator above!</p>
        </div>
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Credit Cards Tab
const CreditCardsTab = () => {
  // Ensure creditCards is always an array to prevent map errors
  const safeCreditCards = Array.isArray(creditCards) ? creditCards : [];
  
  return (
    <div className="space-y-6">
      <AlertComponent tabName="credit-cards" />
      
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <CreditCard className="w-6 h-6 mr-2 text-blue-600" />
          Credit Card Submissions ({safeCreditCards.length})
        </h2>
        <button
          onClick={loadCreditCards}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Cards
        </button>
      </div>

      {/* Credit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeCreditCards.map((card) => (
          <div key={card.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm opacity-75">
                {card.brand || 'CREDIT CARD'}
              </div>
              <div className="text-xs opacity-50">
                ID: {card.id}
              </div>
            </div>
            
            <div className="font-mono text-lg mb-4 tracking-widest">
              {card.digit || 'No card number'}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs opacity-75">CARDHOLDER</div>
                <div className="text-sm font-semibold">{card.card_holder_name}</div>
              </div>
              <div>
                <div className="text-xs opacity-75">EXPIRES</div>
                <div className="text-sm font-semibold">
                  {String(card.exp_month || '').padStart(2, '0')}/{card.exp_year}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs opacity-75">CVV</div>
              <div className="text-sm font-semibold font-mono">{card.cvv}</div>
            </div>
            
            <div className="border-t border-gray-700 pt-4">
              <div className="text-xs opacity-75 mb-2">BILLING ADDRESS</div>
              <div className="text-xs">
                {card.billing_address_line1 || 'N/A'}
                {card.billing_address_line2 && <><br />{card.billing_address_line2}</>}
                <br />
                {card.billing_city || ''}, {card.billing_state || ''} {card.billing_postal_code || ''}
                <br />
                {card.billing_country || ''}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700 text-xs opacity-75">
              Submitted: {card.created_at ? new Date(card.created_at).toLocaleDateString() : 'Unknown date'}
            </div>
          </div>
        ))}
        
        {safeCreditCards.length === 0 && (
          <div className="col-span-full text-center py-12">
            <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No credit cards submitted yet</p>
            <p className="text-gray-400 text-sm">Cards will appear here when users submit them</p>
          </div>
        )}
      </div>

      {/* Detailed Table View */}
      {safeCreditCards.length > 0 && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Detailed View</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Card Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holder</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CVV</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Billing Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Postal Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Default</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {safeCreditCards.map((card) => (
                  <tr key={card.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">
                        {card.digit || 'No card number'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {card.card_holder_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {String(card.exp_month || '').padStart(2, '0')}/{card.exp_year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {card.cvv}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {card.brand || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div>{card.billing_address_line1}</div>
                      {card.billing_address_line2 && <div>{card.billing_address_line2}</div>}
                      <div>{card.billing_city}, {card.billing_state}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {card.billing_country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {card.billing_postal_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {card.is_default ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {card.created_at ? new Date(card.created_at).toLocaleDateString() : 'Unknown date'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

  // Show login form if not logged in
  if (!isLoggedIn) {
    return <LoginForm />;
  }

  // Show dashboard if logged in
  return <Dashboard />;
};


export default AdminDashboard;