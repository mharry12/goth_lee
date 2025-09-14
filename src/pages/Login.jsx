import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Settings, Heart, MessageCircle, Mail, Key, ArrowRight, Loader2, Crown, Star, Zap, Calendar, Eye, Play, Gift, ChevronDown, Menu, X, Sparkles, TrendingUp, Users, Clock, Shield, CheckCircle } from 'lucide-react';
import stream from '../assest/streamy.jpg'

// Helper function to safely parse localStorage items
const safeParse = (item) => {
  try {
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Failed to parse storage item:', error);
    return null;
  }
};

// Helper function to get full image URL
const getImageUrlCRA = (imagePath) => {
  if (!imagePath) return null;
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return `${baseUrl}${imagePath}`;
}

// Professional Loading Component
const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-200 flex flex-col items-center max-w-sm mx-4">
        <div className="relative mb-6">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-400 rounded-full animate-spin animate-reverse"></div>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Please wait</h3>
        <p className="text-sm text-slate-600 text-center">{message}</p>
      </div>
    </div>
  );
};

// Professional Header Component
const ProfessionalHeader = ({ 
  title, 
  subtitle, 
  userData, 
  creatorData, 
  onLogout, 
  onBack, 
  showUserInfo = true,
  showSearch = true,
  isSubscriptionPage = false 
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Back Button for Subscription Page */}
            {isSubscriptionPage && (
              <button 
                onClick={onBack}
                className="flex items-center text-slate-600 hover:text-slate-900 transition-colors duration-200 group"
              >
                <div className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </div>
                <span className="ml-2 font-medium hidden sm:block">Back</span>
              </button>
            )}

            {/* Logo/Title Section */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <img 
                  src={stream} 
                  alt="StreamPro" 
                  className="w-6 h-6 object-contain filter brightness-0 invert"
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-slate-500">{subtitle}</p>
                )}
              </div>
            </div>

            {/* Search Bar */}
            {showSearch && (
              <div className="hidden lg:block ml-8">
                <div className="relative w-80">
                  <input
                    type="text"
                    placeholder="Search creators and content..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                  <Search className="absolute left-3 top-2.5 text-slate-400 h-4 w-4" />
                </div>
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Notifications */}
              <div className="relative">
                <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                  <Bell className="w-5 h-5 text-slate-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>

              {/* User Profile Dropdown */}
              {showUserInfo && (
                <div className="relative">
                  <button 
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
                      {userData?.profile_pic ? (
                        <img 
                          src={getImageUrlCRA(userData.profile_pic)} 
                          alt="User" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="text-slate-500 w-4 h-4" />
                      )}
                    </div>
                    <div className="hidden xl:block text-left">
                      <p className="text-sm font-medium text-slate-900">{userData?.email || 'User'}</p>
                      <p className="text-xs text-slate-500">{creatorData?.creator_name || 'Viewer'}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
                            {userData?.profile_pic ? (
                              <img 
                                src={getImageUrlCRA(userData.profile_pic)} 
                                alt="User" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="text-slate-500 w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{userData?.email || 'User'}</p>
                            <p className="text-sm text-slate-500 flex items-center">
                              <Crown className="w-3 h-3 mr-1" />
                              Premium Member
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-700 mb-2">Currently Viewing</p>
                        <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg">
                          <div className="w-6 h-6 rounded-md overflow-hidden bg-slate-200">
                            {creatorData?.profile_pic ? (
                              <img 
                                src={getImageUrlCRA(creatorData.profile_pic)} 
                                alt="Creator" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="text-slate-500 w-3 h-3 mt-1.5 ml-1.5" />
                            )}
                          </div>
                          <span className="text-sm text-slate-700">{creatorData?.creator_name || 'Creator'}</span>
                        </div>
                      </div>

                      <div className="px-2 py-2">
                        <button 
                          onClick={() => {
                            setShowUserDropdown(false);
                            onLogout();
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 flex items-center"
                        >
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-slate-200 py-4">
            {/* Mobile Search */}
            {showSearch && (
              <div className="px-2 pb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search creators and content..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 text-slate-400 h-4 w-4" />
                </div>
              </div>
            )}

            {/* Mobile User Info */}
            {showUserInfo && (
              <div className="px-2 py-2 border-t border-slate-200">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
                      {userData?.profile_pic ? (
                        <img 
                          src={getImageUrlCRA(userData.profile_pic)} 
                          alt="User" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="text-slate-500 w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{userData?.email || 'User'}</p>
                      <p className="text-xs text-slate-500">{creatorData?.creator_name || 'Creator'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

// Professional Subscription Plans Component
const ProfessionalSubscriptionPlans = ({ creatorData, onBack }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const subscriptionPlans = [
    {
      id: 'basic',
      name: 'Basic Access',
      price: '$9.99',
      period: 'month',
      description: 'Essential access to creator content and community',
      features: [
        'Access to all live streams',
        'Community chat participation',
        'Monthly exclusive content',
        'Basic customer support'
      ],
      icon: <Star className="w-6 h-6" />,
      popular: false,
      color: 'border-slate-200'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$19.99',
      period: 'month',
      description: 'Enhanced experience with priority access and perks',
      features: [
        'Everything in Basic Access',
        'Priority customer support',
        'Early access to new content',
        'Monthly Q&A session access',
        'Exclusive behind-the-scenes content',
        'Ad-free streaming experience'
      ],
      icon: <Crown className="w-6 h-6" />,
      popular: true,
      color: 'border-blue-500 ring-2 ring-blue-100'
    },
    {
      id: 'ultimate',
      name: 'VIP Experience',
      price: '$39.99',
      period: 'month',
      description: 'Ultimate access with personalized creator interaction',
      features: [
        'Everything in Premium',
        'Monthly one-on-one video call',
        'Personalized content requests',
        'Exclusive merchandise access',
        'Direct messaging privileges',
        'Birthday and special occasion recognition',
        'Priority livestream interaction'
      ],
      icon: <Zap className="w-6 h-6" />,
      popular: false,
      color: 'border-slate-200'
    }
  ];

  const handleSubscribe = async (planId) => {
    setSelectedPlan(planId);
    setIsProcessing(true);

    // Simulate 3-second loading
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Here you would normally navigate to payments
    // navigate('/payments', { state: { creatorData, planId } });
    
    setIsProcessing(false);
    setSelectedPlan(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <ProfessionalHeader 
        title="Subscription Plans"
        subtitle={`Choose your plan for ${creatorData?.creator_name}`}
        onBack={onBack}
        showUserInfo={false}
        showSearch={false}
        isSubscriptionPage={true}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 border-4 border-white shadow-lg">
              {creatorData?.profile_pic ? (
                <img 
                  src={getImageUrlCRA(creatorData.profile_pic)} 
                  alt="Creator" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-slate-500 mt-5 ml-5" />
              )}
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Subscribe to {creatorData?.creator_name}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get exclusive access to premium content and support your favorite creator
          </p>
        </div>

        {/* Current Status */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Current Status</h3>
                <p className="text-slate-600">No active subscription</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-slate-900">0</p>
              <p className="text-sm text-slate-500">Active plans</p>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-sm border-2 ${plan.color} p-8 ${
                plan.popular ? 'scale-105 shadow-lg' : ''
              } transition-all duration-300 hover:shadow-lg`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className={`p-3 rounded-xl ${plan.popular ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                    {plan.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500 ml-2">/{plan.period}</span>
                </div>
                <p className="text-slate-600 text-sm">{plan.description}</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isProcessing && selectedPlan === plan.id}
                className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                } ${isProcessing && selectedPlan === plan.id ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
              >
                {isProcessing && selectedPlan === plan.id ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  'Subscribe Now'
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Secure & Transparent</h3>
              <p className="text-slate-700 mb-4">
                All subscriptions are processed securely with industry-standard encryption. 
                Cancel anytime with no hidden fees or commitments.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  30-day money-back guarantee
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Cancel anytime, no questions asked
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Instant access upon subscription
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Loading Screen Overlay */}
      {isProcessing && (
        <LoadingScreen message="Processing your subscription..." />
      )}
    </div>
  );
};

// Professional Dashboard Component
const ProfessionalDashboard = ({ userData, creatorData, onLogout, onNavigate }) => {
  const [showSubscriptions, setShowSubscriptions] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationMessage, setNavigationMessage] = useState('');

  const handleNavigation = async (destination, message) => {
    setNavigationMessage(message);
    setIsNavigating(true);
    
    // 3-second delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    if (destination === 'subscriptions') {
      setShowSubscriptions(true);
    }
    
    setIsNavigating(false);
  };

  // Generate content data
  const generateContentData = () => {
    const contentTypes = ['Live Stream', 'Tutorial', 'Q&A Session', 'Behind Scenes'];
    const statuses = ['Live', 'Scheduled', 'Completed'];
    
    const contentData = [];
    
    if (creatorData?.posts && creatorData.posts.length > 0) {
      creatorData.posts.forEach(post => {
        contentData.push({
          title: post.title || 'Untitled Content',
          type: contentTypes[Math.floor(Math.random() * contentTypes.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          date: post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Recent',
          views: Math.floor(Math.random() * 5000) + 100
        });
      });
    }
    
    // Add sample data
    const sampleContent = [
      { title: 'Weekly Update Stream', type: 'Live Stream', status: 'Live', views: 1250 },
      { title: 'Beginner Tutorial Series', type: 'Tutorial', status: 'Completed', views: 3420 },
      { title: 'Fan Q&A Session', type: 'Q&A Session', status: 'Scheduled', views: 0 },
      { title: 'Studio Tour', type: 'Behind Scenes', status: 'Completed', views: 890 }
    ];
    
    sampleContent.forEach(item => {
      contentData.push({
        ...item,
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
      });
    });
    
    return contentData.slice(0, 8);
  };

  const contentData = generateContentData();

  if (showSubscriptions) {
    return <ProfessionalSubscriptionPlans creatorData={creatorData} onBack={() => setShowSubscriptions(false)} />;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <ProfessionalHeader 
        title="Creator Dashboard"
        subtitle="Professional content streaming platform"
        userData={userData}
        creatorData={creatorData}
        onLogout={onLogout}
        showUserInfo={true}
        showSearch={true}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subscription Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-900">Subscription Required</h3>
                <p className="text-amber-700">Subscribe to unlock premium content and features</p>
              </div>
            </div>
            <button 
              onClick={() => handleNavigation('subscriptions', 'Loading subscription plans...')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center whitespace-nowrap"
            >
              <Crown className="w-4 h-4 mr-2" />
              View Plans
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-slate-900">0</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Views</p>
                <p className="text-2xl font-bold text-slate-900">12.5K</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Watch Time</p>
                <p className="text-2xl font-bold text-slate-900">45h</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Following</p>
                <p className="text-2xl font-bold text-slate-900">1</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Stream */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative">
              {creatorData?.profile_pic && (
                <div className="absolute inset-0 opacity-20">
                  <img 
                    src={getImageUrlCRA(creatorData.profile_pic)} 
                    alt="Background" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 mx-auto backdrop-blur-sm">
                    <Play className="w-10 h-10 text-white ml-1" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{creatorData?.creator_name || 'Creator'}</h3>
                  <p className="text-slate-300 mb-4">Premium content requires subscription</p>
                  <button 
                    onClick={() => handleNavigation('subscriptions', 'Loading subscription options...')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Subscribe to Watch
                  </button>
                </div>
              </div>
              
              <div className="absolute top-4 left-4">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                  LIVE
                </span>
              </div>
              
              <div className="absolute top-4 right-4">
                <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  124 viewers
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Live Stream</h3>
                <div className="flex items-center text-sm text-slate-500">
                  <Clock className="w-4 h-4 mr-1" />
                  Started 2h ago
                </div>
              </div>
              <p className="text-slate-600 mb-4">Join the conversation and interact with {creatorData?.creator_name || 'the creator'} in real-time.</p>
              <div className="flex items-center space-x-4">
                <button className="flex items-center text-slate-600 hover:text-red-600 transition-colors duration-200">
                  <Heart className="w-4 h-4 mr-1" />
                  <span className="text-sm">245</span>
                </button>
                <button className="flex items-center text-slate-600 hover:text-blue-600 transition-colors duration-200">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">58</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Creator Info */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-sm">
                  {creatorData?.profile_pic ? (
                    <img 
                      src={getImageUrlCRA(creatorData.profile_pic)} 
                      alt="Creator" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="text-slate-500 w-8 h-8 mt-4 ml-4" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">{creatorData?.creator_name || 'Creator'}</h3>
                  <p className="text-slate-600 text-sm">Content Creator</p>
                  <div className="flex items-center mt-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-sm text-slate-600">Online</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-700 text-sm mb-4">{creatorData?.bio || 'Welcome to my channel! Subscribe for exclusive content.'}</p>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>5.2K followers</span>
                <span>124 watching</span>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Upcoming
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Play className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">Weekly Q&A Session</p>
                    <p className="text-xs text-slate-600">Tomorrow at 8:00 PM</p>
                    <span className="inline-block text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md mt-1">
                      Subscribers Only
                    </span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">Behind the Scenes Tour</p>
                    <p className="text-xs text-slate-600">Friday at 6:00 PM</p>
                    <span className="inline-block text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-md mt-1">
                      VIP Access
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Content */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Recent Content
              </h3>
              <span className="text-sm text-slate-500">{contentData.length} items</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Content</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {contentData.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-200 flex items-center justify-center flex-shrink-0">
                          {creatorData?.profile_pic ? (
                            <img 
                              src={getImageUrlCRA(creatorData.profile_pic)} 
                              alt="Creator" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="text-slate-500 w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'Live' ? 'bg-red-100 text-red-800' :
                        item.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.status === 'Live' && <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-1 animate-pulse"></span>}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.views.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Loading Screen Overlay */}
      {isNavigating && (
        <LoadingScreen message={navigationMessage} />
      )}
    </div>
  );
};

// Professional Login Component
const ProfessionalLogin = ({ onAccessSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: sessionStorage.getItem('userEmail') || '',
    access_code: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'email') {
      sessionStorage.setItem('userEmail', value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('https://stream-l2du.onrender.com/api/fan/access/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Authentication failed. Please verify your credentials.');
      }

      const data = await response.json();

      const userData = {
        email: formData.email,
        profile_pic: data.user_profile_pic,
        last_login: new Date().toISOString()
      };

      const creatorData = {
        creator_name: data.creator_name,
        creator_email: data.creator_email,
        bio: data.bio,
        access_code: data.access_code,
        profile_pic: data.profile_pic,
        posts: data.posts || []
      };

      onAccessSuccess(userData, creatorData);

    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.message);
      setFormData(prev => ({ ...prev, access_code: '' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
            <img 
              src={stream} 
              alt="StreamPro" 
              className="w-8 h-8 object-contain filter brightness-0 invert"
            />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome to StreamNine</h2>
          <p className="text-slate-400">Professional streaming platform access </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="access_code" className="block text-sm font-medium text-slate-700 mb-2">
                Access Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="access_code"
                  name="access_code"
                  type="text"
                  value={formData.access_code}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter creator access code"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Access Platform
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Info Section */}
          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">How to Access:</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Obtain access code from your creator
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Enter your email and access code above
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Enjoy exclusive premium content
              </li>
            </ul>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Secure access • Professional platform • Premium content
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function ProfessionalStreamingApp() {
  const [currentView, setCurrentView] = useState('login');
  const [userData, setUserData] = useState(null);
  const [creatorData, setCreatorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = () => {
      try {
        const storedUser = localStorage.getItem('streamUserData');
        const storedCreator = localStorage.getItem('streamCreatorData');
        
        if (storedUser && storedCreator) {
          setUserData(safeParse(storedUser));
          setCreatorData(safeParse(storedCreator));
          setCurrentView('dashboard');
        }
      } catch (error) {
        console.error('Failed to load session:', error);
        localStorage.removeItem('streamUserData');
        localStorage.removeItem('streamCreatorData');
      }
      setIsLoading(false);
    };

    loadSession();
  }, []);

  const handleAccessSuccess = (user, creator) => {
    localStorage.setItem('streamUserData', JSON.stringify(user));
    localStorage.setItem('streamCreatorData', JSON.stringify(creator));
    
    setUserData(user);
    setCreatorData(creator);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('streamUserData');
    localStorage.removeItem('streamCreatorData');
    sessionStorage.removeItem('userEmail');
    
    setUserData(null);
    setCreatorData(null);
    setCurrentView('login');
  };

  if (isLoading) {
    return <LoadingScreen message="Initializing platform..." />;
  }

  return (
    <>
      {currentView === 'login' ? (
        <ProfessionalLogin onAccessSuccess={handleAccessSuccess} />
      ) : (
        <ProfessionalDashboard 
          userData={userData}
          creatorData={creatorData}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}