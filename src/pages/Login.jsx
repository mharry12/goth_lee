

import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Settings, Heart, MessageCircle, Mail, Key, ArrowRight, Loader2, Crown, Star, Zap, Calendar, Eye, Play, Gift, ChevronDown, Menu, X, Sparkles, TrendingUp, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  
  // For Vite, use import.meta.env
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return `${baseUrl}${imagePath}`;
}

// Enhanced Header Component with upgraded design
const EnhancedHeader = ({ 
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
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-xl shadow-2xl border-b border-purple-200/30 sticky top-0 z-50">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 via-white/50 to-blue-50/50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Section */}
          <div className="flex items-center space-x-6">
            {/* Back Button for Subscription Page */}
            {isSubscriptionPage && (
              <button 
                onClick={onBack}
                className="group flex items-center text-gray-600 hover:text-purple-600 transition-all duration-300 transform hover:scale-110"
              >
                <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-100 to-blue-100 group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-300 shadow-lg">
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </div>
                <span className="ml-3 font-semibold hidden sm:block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Back</span>
              </button>
            )}

            {/* Logo/Title Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
               

                <img 
                  src={stream} 
                  alt="" 
                 
                />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent tracking-tight">{title}</h1>
                  {subtitle && (
                    <p className="text-sm text-gray-500 mt-0.5 font-medium">{subtitle}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Search Bar */}
            {showSearch && (
              <div className="hidden lg:block">
                <div className={`relative transition-all duration-500 ${searchFocused ? 'w-96' : 'w-72'}`}>
                  <input
                    type="text"
                    placeholder="Discover amazing creators..."
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-200 bg-gray-50/80 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300 font-medium text-gray-700 placeholder-gray-400"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                  <div className="absolute left-5 top-4 text-purple-500">
                    <Search className="h-6 w-6" />
                  </div>
                  {searchFocused && (
                    <div className="absolute right-4 top-4">
                      <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-3 rounded-2xl hover:bg-purple-100 transition-all duration-300 transform hover:scale-110"
            >
              {showMobileMenu ? <X className="w-6 h-6 text-purple-600" /> : <Menu className="w-6 h-6 text-purple-600" />}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="relative p-4 rounded-2xl hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 transition-all duration-300 transform hover:scale-110 group">
                  <Bell className="w-6 h-6 text-gray-600 group-hover:text-purple-600" />
                  <span className="absolute top-3 right-3 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-lg"></span>
                  <span className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-ping"></span>
                </button>
              </div>

              {/* User Profile Dropdown */}
              {showUserInfo && (
                <div className="relative">
                  <button 
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 transition-all duration-300 transform hover:scale-105 group"
                  >
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-r from-purple-200 to-blue-200 flex items-center justify-center ring-4 ring-purple-500/20 shadow-lg">
                      {userData?.profile_pic ? (
                        <img 
                          src={getImageUrlCRA(userData.profile_pic)} 
                          alt="User" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                            e.target.parentElement.classList.add('bg-gradient-to-r', 'from-purple-200', 'to-blue-200');
                          }}
                        />
                      ) : (
                        <User className="text-purple-700 w-6 h-6" />
                      )}
                    </div>
                    <div className="hidden xl:block text-left">
                      <p className="font-semibold text-gray-900 text-sm">{userData?.email || 'User'}</p>
                      <p className="text-xs text-purple-600 font-medium">
                        ✨ {creatorData?.creator_name || 'Creator'}
                      </p>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-purple-500 transition-transform duration-300 ${showUserDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/50 py-3 z-50 animate-in slide-in-from-top-5 duration-300">
                      <div className="px-6 py-4 border-b border-purple-100/50">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-r from-purple-200 to-blue-200 flex items-center justify-center shadow-lg">
                            {userData?.profile_pic ? (
                              <img 
                                src={getImageUrlCRA(userData.profile_pic)} 
                                alt="User" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="text-purple-700 w-7 h-7" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-lg">{userData?.email || 'User'}</p>
                            <p className="text-sm text-purple-600 font-medium flex items-center">
                              <Crown className="w-4 h-4 mr-1" />
                              Premium Fan
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-6 py-4 border-b border-purple-100/50">
                        <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                          Currently Accessing
                        </p>
                        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-200 shadow-md">
                            {creatorData?.profile_pic ? (
                              <img 
                                src={getImageUrlCRA(creatorData.profile_pic)} 
                                alt="Creator" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="text-gray-500 w-5 h-5 mt-2.5 ml-2.5" />
                            )}
                          </div>
                          <span className="text-sm text-gray-700 font-medium">{creatorData?.creator_name || 'Creator'}</span>
                        </div>
                      </div>

                      <div className="px-3 py-2">
                        <button 
                          onClick={() => {
                            setShowUserDropdown(false);
                            onLogout();
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-2xl transition-all duration-200 font-medium flex items-center"
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
          <div className="lg:hidden border-t border-purple-200/50 py-4 animate-in slide-in-from-top-5 duration-300">
            {/* Mobile Search */}
            {showSearch && (
              <div className="px-2 pb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Discover amazing creators..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 bg-gray-50/80 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 font-medium"
                  />
                  <Search className="absolute left-4 top-4.5 text-purple-500 h-6 w-6" />
                </div>
              </div>
            )}

            {/* Mobile User Info */}
            {showUserInfo && (
              <div className="px-2 py-2 border-t border-purple-200/50">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-r from-purple-200 to-blue-200 flex items-center justify-center shadow-lg">
                      {userData?.profile_pic ? (
                        <img 
                          src={getImageUrlCRA(userData.profile_pic)} 
                          alt="User" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="text-purple-700 w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{userData?.email || 'User'}</p>
                      <p className="text-xs text-purple-600 font-medium">
                        ✨ {creatorData?.creator_name || 'Creator'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="text-sm text-red-600 hover:text-red-700 font-semibold px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-200"
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

// Subscription Plans Component with enhanced design
const SubscriptionPlans = ({ creatorData, onBack }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const subscriptionPlans = [
    {
      id: 'basic',
      name: 'Fan Access',
      price: '$9.99',
      period: 'month',
      description: 'Get access to exclusive content and live streams',
      features: [
        'Access to all live streams',
        'Exclusive behind-the-scenes content',
        'Community chat access',
        'Monthly Q&A sessions'
      ],
      icon: <Star className="w-7 h-7" />,
      color: 'from-blue-500 via-purple-500 to-pink-500',
      popular: false
    },
    {
      id: 'premium',
      name: 'VIP Experience',
      price: '$19.99',
      period: 'month',
      description: 'Premium access with personalized content',
      features: [
        'Everything in Fan Access',
        'Personal messages from creator',
        'Custom content requests',
        'Priority support',
        'Early access to new content'
      ],
      icon: <Crown className="w-7 h-7" />,
      color: 'from-purple-500 via-pink-500 to-red-500',
      popular: true
    },
    {
      id: 'ultimate',
      name: 'Ultimate Fan',
      price: '$39.99',
      period: 'month',
      description: 'The ultimate fan experience with exclusive perks',
      features: [
        'Everything in VIP Experience',
        'One-on-one video calls (monthly)',
        'Personalized merchandise',
        'Exclusive livestream access',
        'Birthday shout-outs',
        'Direct phone number access'
      ],
      icon: <Zap className="w-7 h-7" />,
      color: 'from-pink-500 via-red-500 to-orange-500',
      popular: false
    }
  ];

  const handleSubscribe = async (planId) => {
    setSelectedPlan(planId);
    setIsProcessing(true);

    navigate('/payments', {
      state: {
        creatorData: {
          ...creatorData,
          subscription_price: planId === 'basic' ? 9.99 : 
                           planId === 'premium' ? 19.99 : 39.99
        }
      }
    });
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen">
      {/* Enhanced Header */}
      <EnhancedHeader 
        title="Subscription Plans"
        subtitle={`Choose your plan for ${creatorData?.creator_name}`}
        onBack={onBack}
        showUserInfo={false}
        showSearch={false}
        isSubscriptionPage={true}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gradient-to-r from-purple-200 to-blue-200 ring-8 ring-purple-500/20 shadow-2xl">
                {creatorData?.profile_pic ? (
                  <img 
                    src={getImageUrlCRA(creatorData.profile_pic)} 
                    alt="Creator" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-purple-700 mt-6 ml-6" />
                )}
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Crown className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Subscribe to {creatorData?.creator_name}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get exclusive access to premium content and support your favorite creator with personalized experiences
          </p>
        </div>

        {/* Current Subscription Status */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-12 border border-purple-200/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-50/50 to-orange-50/50"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-3xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Current Subscription Status</h3>
                <p className="text-red-600 font-semibold text-lg flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  No active subscription
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">0</p>
              <p className="text-sm text-gray-500 font-medium">Active subscriptions</p>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-500 hover:shadow-3xl border-2 ${
                plan.popular ? 'ring-4 ring-purple-500/30 border-purple-300 scale-105' : 'border-gray-200/50 hover:border-purple-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white text-center py-4 text-sm font-bold shadow-lg">
                  <div className="flex items-center justify-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    ⭐ MOST POPULAR
                    <Sparkles className="w-4 h-4 ml-2" />
                  </div>
                </div>
              )}
              
              <div className={`bg-gradient-to-br ${plan.color} p-10 text-white relative ${plan.popular ? 'pt-16' : ''}`}>
                <div className="absolute top-4 right-4 opacity-20">
                  <div className="w-20 h-20 text-white">
                    {plan.icon}
                  </div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="text-white">
                      {plan.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold">{plan.price}</div>
                      <div className="text-sm opacity-90 font-medium">per {plan.period}</div>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{plan.name}</h3>
                  <p className="text-sm opacity-90 leading-relaxed font-medium">{plan.description}</p>
                </div>
              </div>
              
              <div className="p-10">
                <ul className="space-y-5 mb-10">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mt-1 mr-4 flex-shrink-0 shadow-lg">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <span className="text-gray-700 font-medium leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isProcessing && selectedPlan === plan.id}
                  className={`w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white shadow-2xl'
                      : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white'
                  } ${isProcessing && selectedPlan === plan.id ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
                >
                  {isProcessing && selectedPlan === plan.id ? (
                    <>
                      <Loader2 className="inline w-6 h-6 mr-3 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Subscribe Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-10 border-2 border-blue-200/50 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                <Gift className="w-8 h-8 mr-3 text-purple-600" />
                Why Subscribe?
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg font-medium">
                Support {creatorData?.creator_name} and get exclusive access to premium content, 
                live streams, and personal interactions. Join a community of dedicated fans and unlock
                personalized experiences that bring you closer to your favorite creator.
              </p>
            </div>
            <div className="text-9xl opacity-10 ml-8 text-purple-500">
              <Gift />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StreamDashboard = ({ userData, creatorData, onLogout, onNavigate }) => {
  const [isBlinking, setIsBlinking] = useState(true);
  const [visibleComments, setVisibleComments] = useState([]);
  const [showSubscriptions, setShowSubscriptions] = useState(false);
  
  // Blinking LIVE effect
  useEffect(() => {
    const blinkInterval = setInterval(() => setIsBlinking(prev => !prev), 800);
    return () => clearInterval(blinkInterval);
  }, []);
  
  // Initial comments
  useEffect(() => {
    const initialComments = [
      { id: 1, user: "fan123", text: "OMG this is amazing! 🔥" },
      { id: 2, user: "streamer_lover", text: "You're the best! ✨" },
      { id: 3, user: "gamer_pro", text: "I've been waiting for this stream all week! 💯" }
    ];
    
    initialComments.forEach((comment, index) => {
      setTimeout(() => {
        setVisibleComments(prev => [...prev, comment]);
      }, index * 2000);
    });
  }, []);
  
  // Add new random comments periodically
  useEffect(() => {
    const randomComments = [
      "This is so cool! 🚀",
      "I love your content! ❤️",
      "Can you show us more? 👀",
      "First time watching, I'm impressed! 🌟",
      "Greetings from California! 🌴",
      "How do you do that so well? 🤔",
      "I've learned so much from your streams 📚",
      "This is my favorite channel 💖"
    ];
    
    const newCommentInterval = setInterval(() => {
      const newComment = {
        id: Math.random().toString(36).substring(2, 9),
        user: `user_${Math.floor(Math.random() * 1000)}`,
        text: randomComments[Math.floor(Math.random() * randomComments.length)]
      };
      
      setVisibleComments(prev => {
        const updated = [...prev, newComment];
        return updated.length > 5 ? updated.slice(updated.length - 5) : updated;
      });
    }, 4000);
    
    return () => clearInterval(newCommentInterval);
  }, []);

  // Generate more diverse content data
  const generateContentData = () => {
    const contentTypes = ['Live Stream', 'Behind Scenes', 'Q&A Session', 'Tutorial', 'Personal Vlog', 'Fan Interaction'];
    const statuses = ['Active', 'Scheduled', 'Completed', 'Processing'];
    const dates = [
      // '2024-12-10', '2024-12-09', '2024-12-08', '2024-12-07', '2024-12-06',
      // '2024-12-05', '2024-12-04', '2024-12-03', '2024-12-02', '2024-12-01'
    ];
    
    const contentData = [];
    
    // Add creator's actual posts if available
    if (creatorData?.posts && creatorData.posts.length > 0) {
      creatorData.posts.forEach(post => {
        contentData.push({
          creator: creatorData.creator_name,
          content: post.title || 'Untitled Content',
          date: post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Recent',
          status: 'Active',
          views: Math.floor(Math.random() * 10000) + 500,
          type: contentTypes[Math.floor(Math.random() * contentTypes.length)]
        });
      });
    }
    
    // Add generated content to fill the dashboard
    const additionalContent = [
      { content: 'Morning Coffee Chat', type: 'Live Stream', views: 8432 },
      { content: 'Weekend Workout Routine', type: 'Tutorial', views: 5621 },
      { content: 'Fan Question Friday', type: 'Q&A Session', views: 12043 },
      { content: 'Behind the Camera', type: 'Behind Scenes', views: 3456 },
      { content: 'My Daily Routine', type: 'Personal Vlog', views: 9876 },
      { content: 'Thank You Message', type: 'Fan Interaction', views: 15432 },
      { content: 'Cooking Challenge', type: 'Live Stream', views: 6789 },
      { content: 'Room Tour 2024', type: 'Behind Scenes', views: 11234 },
      { content: 'Skincare Routine', type: 'Tutorial', views: 7890 },
      { content: 'Late Night Thoughts', type: 'Personal Vlog', views: 4567 }
    ];
    
    additionalContent.forEach((item, index) => {
      contentData.push({
        creator: creatorData?.creator_name || 'Creator',
        content: item.content,
        date: dates[index % dates.length],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        views: item.views,
        type: item.type
      });
    });
    
    return contentData.slice(0, 12);
  };

  const contentData = generateContentData();

  if (showSubscriptions) {
    return <SubscriptionPlans creatorData={creatorData} onBack={() => setShowSubscriptions(false)} />;
  }

  return (
   <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen w-full overflow-x-hidden">
  {/* Enhanced Header */}
  <EnhancedHeader 
    title="Stream Dashboard"
    subtitle="Discover amazing content from your favorite creators"
    userData={userData}
    creatorData={creatorData}
    onLogout={onLogout}
    showUserInfo={true}
    showSearch={true}
  />

  {/* Main content area */}
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
    {/* Subscription Status Alert - Responsive */}
    <div className="mb-8 md:mb-12 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border-2 border-yellow-300/50 rounded-3xl p-4 md:p-8 shadow-2xl relative overflow-hidden w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/20 to-orange-100/20"></div>
      <div className="relative flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4 md:space-x-6 w-full md:w-auto">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-3xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <Crown className="w-5 h-5 md:w-8 md:h-8 text-white" />
          </div>
          <div className="flex-1 md:flex-none">
            <h3 className="text-xl md:text-2xl font-bold text-yellow-800 mb-1 md:mb-2 flex items-center">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 mr-2" />
              No Active Subscription
            </h3>
            <p className="text-yellow-700 font-medium text-base md:text-lg">Subscribe to unlock exclusive content</p>
          </div>
        </div>
        <button 
          onClick={() => setShowSubscriptions(true)}
          className="w-full md:w-auto bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center"
        >
          <Crown className="w-4 h-4 md:w-5 md:h-5 mr-2" />
          View Plans
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
        </button>
      </div>
    </div>

    {/* Featured Section - Responsive */}
    <div className="mb-8 md:mb-12 w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2 md:mb-0">
          Featured Live Now
        </h2>
        <div className="flex items-center space-x-3 text-xs md:text-sm text-gray-500 bg-white/80 backdrop-blur-xl px-3 py-1 md:px-4 md:py-2 rounded-2xl shadow-lg">
          <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
          <span className="font-semibold">98 viewers watching</span>
          <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {/* Featured Stream Preview - Responsive with Mobile Comments */}
        <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 rounded-3xl text-white p-6 md:p-8 lg:p-10 col-span-1 md:col-span-2 relative overflow-hidden h-auto shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
          {/* Blurred background using creator's profile pic */}
          {creatorData?.profile_pic && (
            <div className="absolute inset-0 bg-cover bg-center" style={{ 
              backgroundImage: `url('${getImageUrlCRA(creatorData.profile_pic)}')`,
              filter: 'blur(10px)',
              opacity: 0.3,
              transform: 'scale(1.2)'
            }}></div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/20"></div>
          
          {/* Main Content Area */}
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className={`${isBlinking ? 'bg-red-500 shadow-red-500/50' : 'bg-red-700 shadow-red-700/50'} text-white px-3 py-1 md:px-4 md:py-2 rounded-2xl text-xs md:text-sm font-bold transition-all duration-300 flex items-center w-16 md:w-20 justify-center shadow-2xl`}>
                  <span className={`h-1.5 w-1.5 md:h-2 md:w-2 rounded-full ${isBlinking ? 'bg-white' : 'bg-red-300'} mr-1 md:mr-2 animate-pulse`}></span>
                  LIVE
                </span>
                <div className="bg-black/50 backdrop-blur-xl px-2 py-1 md:px-4 md:py-2 rounded-2xl text-xs md:text-sm flex items-center">
                  <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  98 viewers
                </div>
              </div>
              
              <div className="mt-4 md:mt-6">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1 md:mb-2">{creatorData?.creator_name || 'Creator'}</h3>
                <p className="opacity-90 text-sm md:text-base lg:text-lg font-medium">Watch along with {creatorData?.creator_name || 'Creator'}</p>
              </div>
              
              <div className="mt-4 md:mt-6 lg:mt-8 flex space-x-2 md:space-x-3">
                <button 
                  onClick={() => setShowSubscriptions(true)}
                  className="bg-white/90 backdrop-blur-xl text-purple-700 px-4 py-2 md:px-6 md:py-3 rounded-2xl font-bold hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center text-sm md:text-base"
                >
                  <Crown className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                  Subscribe to Watch
                </button>
              </div>
            </div>

            {/* Live comments section - Now visible on mobile */}
            <div className="mt-6 bg-black/70 backdrop-blur-xl p-3 md:p-4 rounded-2xl border border-white/20">
              <div className="flex items-center justify-between mb-2 lg:mb-4">
                <span className="text-xs lg:text-sm font-bold flex items-center">
                  <MessageCircle className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                  LIVE CHAT
                </span>
                <div className="flex items-center bg-white/20 px-1 py-0.5 lg:px-2 lg:py-1 rounded-xl">
                  <Users className="w-2.5 h-2.5 lg:w-3 lg:h-3 mr-1" />
                  <span className="text-xs font-bold">98</span>
                </div>
              </div>
              
              <div className="max-h-40 overflow-y-auto pr-2">
                <div className="space-y-2 lg:space-y-4">
                  {visibleComments.map(comment => (
                    <div key={comment.id} className="text-xs lg:text-sm animate-in slide-in-from-right-5 duration-500">
                      <div className="flex items-center mb-0.5 lg:mb-1">
                        <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mr-1 lg:mr-2 flex items-center justify-center shadow-lg">
                          <User size={10} className="lg:size-[12px]" />
                        </div>
                        <span className="font-bold text-purple-300">{comment.user}</span>
                      </div>
                      <p className="ml-5 lg:ml-7 text-gray-200 leading-relaxed">{comment.text}</p>
                      <div className="ml-5 lg:ml-7 flex items-center text-[10px] lg:text-xs space-x-2 lg:space-x-3 mt-1 lg:mt-2">
                        <div className="flex items-center hover:text-pink-400 transition-colors cursor-pointer">
                          <Heart size={8} className="lg:size-[10px] mr-0.5 lg:mr-1" />
                          <span>{Math.floor(Math.random() * 20)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Creator - Responsive */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-4 md:p-6 lg:p-8 border border-purple-200/50 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-3xl overflow-hidden shadow-xl ring-2 md:ring-4 ring-purple-500/20">
              {creatorData?.profile_pic ? (
                <img 
                  src={getImageUrlCRA(creatorData.profile_pic)} 
                  alt="Creator" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '';
                    e.target.parentElement.classList.add('bg-gradient-to-r', 'from-purple-200', 'to-blue-200');
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-purple-200 to-blue-200 flex items-center justify-center">
                  <User className="text-purple-700 w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                </div>
              )}
            </div>
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs md:text-sm px-3 py-1 md:px-4 md:py-2 rounded-2xl flex items-center font-bold shadow-lg">
              <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-white mr-1 md:mr-2 animate-pulse"></span>
              Online
            </span>
          </div>
          <h3 className="font-bold text-lg md:text-xl lg:text-xl text-gray-900 mb-1 md:mb-2">{creatorData?.creator_name || 'Creator'}</h3>
          <p className="text-xs md:text-sm text-purple-600 font-semibold flex items-center">
            <Users className="w-3 h-3 md:w-4 md:h-4 mr-1" />
            5.2k followers
          </p>
        </div>

        {/* Quick Stats - Responsive */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-4 md:p-6 lg:p-8 border border-purple-200/50 transform hover:scale-[1.02] transition-all duration-300">
          <h3 className="font-bold text-lg md:text-xl lg:text-xl mb-4 md:mb-6 flex items-center text-gray-900">
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6 mr-2 text-purple-600" />
            Your Stats
          </h3>
          <div className="space-y-2 md:space-y-3 lg:space-y-4">
            <div className="flex justify-between items-center p-2 md:p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl">
              <span className="text-xs md:text-sm text-gray-600 font-medium">Active Subs</span>
              <span className="font-bold text-xl md:text-2xl text-red-600">0</span>
            </div>
            <div className="flex justify-between items-center p-2 md:p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
              <span className="text-xs md:text-sm text-gray-600 font-medium">Hours Watched</span>
              <span className="font-bold text-xl md:text-2xl text-blue-600">24.5</span>
            </div>
            <div className="flex justify-between items-center p-2 md:p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
              <span className="text-xs md:text-sm text-gray-600 font-medium">Creators Following</span>
              <span className="font-bold text-xl md:text-2xl text-green-600">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Dashboard Content - Responsive */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      {/* Upcoming Streams - Responsive */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-4 md:p-6 lg:p-8 border border-purple-200/50">
        <h3 className="font-bold text-xl md:text-2xl mb-4 md:mb-6 flex items-center text-gray-900">
          <Calendar className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 mr-2 md:mr-3 text-purple-600" />
          Upcoming Streams
        </h3>
        <ul className="space-y-3 md:space-y-4 lg:space-y-6">
          <li className="border-b border-purple-100 pb-2 md:pb-3 lg:pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-3 md:mr-4 shadow-lg">
                  <Play className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-base md:text-lg">Live Cooking Show</p>
                  <p className="text-xs md:text-sm text-purple-600 font-medium">{creatorData?.creator_name || 'Creator'}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs md:text-sm text-purple-600 font-bold bg-purple-50 px-2 py-0.5 md:px-3 md:py-1 rounded-xl">Tonight 8 PM</span>
                <div className="flex items-center text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2 justify-end">
                  <Eye className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 md:mr-1" />
                  <span className="font-medium">Subscribers Only</span>
                </div>
              </div>
            </div>
          </li>
          <li className="border-b border-purple-100 pb-2 md:pb-3 lg:pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-3 md:mr-4 shadow-lg">
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-base md:text-lg">Q&A Session</p>
                  <p className="text-xs md:text-sm text-purple-600 font-medium">{creatorData?.creator_name || 'Creator'}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs md:text-sm text-purple-600 font-bold bg-purple-50 px-2 py-0.5 md:px-3 md:py-1 rounded-xl">Tomorrow 3 PM</span>
                <div className="flex items-center text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2 justify-end">
                  <Crown className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 md:mr-1" />
                  <span className="font-medium">VIP Only</span>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mr-3 md:mr-4 shadow-lg">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-base md:text-lg">Behind the Scenes</p>
                  <p className="text-xs md:text-sm text-purple-600 font-medium">{creatorData?.creator_name || 'Creator'}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs md:text-sm text-purple-600 font-bold bg-purple-50 px-2 py-0.5 md:px-3 md:py-1 rounded-xl">Saturday 7 PM</span>
                <div className="flex items-center text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2 justify-end">
                  <Star className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 md:mr-1" />
                  <span className="font-medium">All Tiers</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <button 
          onClick={() => setShowSubscriptions(true)}
          className="mt-4 md:mt-6 text-purple-600 text-xs md:text-sm font-bold hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 md:px-4 md:py-2 rounded-xl transition-all duration-200 flex items-center"
        >
          <Crown className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
          Subscribe to access streams 
          <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2" />
        </button>
      </div>

      {/* Recent Activity - Responsive */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-4 md:p-6 lg:p-8 col-span-1 lg:col-span-2 border border-purple-200/50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 lg:mb-8">
          <h3 className="font-bold text-xl md:text-2xl flex items-center text-gray-900 mb-2 md:mb-0">
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 mr-2 md:mr-3 text-purple-600" />
            Recent Content
          </h3>
          <div className="flex items-center text-xs md:text-sm text-gray-500 bg-gray-50 px-3 py-1 md:px-4 md:py-2 rounded-2xl">
            <span className="mr-2 md:mr-3 font-medium">Showing {contentData.length} items</span>
            <button className="text-purple-600 hover:text-purple-700 font-bold flex items-center">
              View All 
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-0.5 md:ml-1" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-purple-100">
            <thead className="bg-gradient-to-r from-purple-50 to-blue-50">
              <tr>
                <th className="px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 text-left text-xs md:text-sm font-bold text-purple-700 uppercase tracking-wider rounded-tl-2xl">
                  Creator
                </th>
                <th className="px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 text-left text-xs md:text-sm font-bold text-purple-700 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 text-left text-xs md:text-sm font-bold text-purple-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 text-left text-xs md:text-sm font-bold text-purple-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 text-left text-xs md:text-sm font-bold text-purple-700 uppercase tracking-wider rounded-tr-2xl">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-purple-50">
              {contentData.map((item, index) => (
                <tr key={index} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200">
                  <td className="px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 md:h-12 md:w-12 rounded-2xl overflow-hidden shadow-lg ring-2 ring-purple-500/20">
                        {creatorData?.profile_pic ? (
                          <img 
                            src={getImageUrlCRA(creatorData.profile_pic)} 
                            alt="Creator" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '';
                              e.target.parentElement.classList.add('bg-gradient-to-r', 'from-purple-200', 'to-blue-200');
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-purple-200 to-blue-200 flex items-center justify-center">
                            <User className="text-purple-700 w-5 h-5 md:w-6 md:h-6" />
                          </div>
                        )}
                      </div>
                      <div className="ml-2 md:ml-4">
                        <div className="text-xs md:text-sm font-bold text-gray-900 truncate max-w-[80px] md:max-w-none">{item.creator}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-6 whitespace-nowrap">
                    <div className="text-xs md:text-sm font-semibold text-gray-900 truncate max-w-[100px] md:max-w-none">{item.content}</div>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-6 whitespace-nowrap">
                    <span className="px-2 py-0.5 md:px-3 md:py-1 inline-flex text-xs leading-5 font-bold rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-6 whitespace-nowrap">
                    <div className="text-xs md:text-sm text-gray-600 font-medium">{item.date}</div>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-6 whitespace-nowrap">
                    <span className={`px-2 py-0.5 md:px-3 md:py-1 inline-flex text-xs leading-5 font-bold rounded-xl ${
                      item.status === 'Active' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' :
                      item.status === 'Scheduled' ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700' :
                      item.status === 'Processing' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700' :
                      'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
</div>
  );
};

const FanAccessPage = ({ onAccessSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [fanData, setFanData] = useState(() => {
    // Try to get email from sessionStorage if available
    const storedEmail = sessionStorage.getItem('fanEmail');
    return {
      email: storedEmail || '',
      access_code: ''
    };
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFanData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Store email in sessionStorage as user types
    if (name === 'email') {
      sessionStorage.setItem('fanEmail', value);
    }
  };

  const handleFanAccess = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch('https://stream-l2du.onrender.com/api/fan/access/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: fanData.email,
          access_code: fanData.access_code
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Access failed. Please check your credentials.');
      }

      const data = await response.json();

      // Store access code in both localStorage and sessionStorage
      localStorage.setItem('access_code', data.access_code);
      sessionStorage.setItem('access_code', data.access_code);

      const userData = {
        email: fanData.email,
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

      setSuccessMessage(`Welcome to ${data.creator_name}'s streaming dashboard!`);
      
      setTimeout(() => {
        onAccessSuccess(userData, creatorData);
      }, 1000);

    } catch (error) {
      console.error('Fan access error:', error);
      setError(error.message);
      setFanData(prev => ({ ...prev, access_code: '' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64bg-gray-900/80 backdrop-blur-2xl rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96bg-gray-900/80 backdrop-blur-2xlrounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48bg-gray-900/80 backdrop-blur-2xl rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative w-full max-w-lg z-10">
        {/* Card Container */}
        <div className="bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-purple-500/30">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <img 
                  src={stream} 
                  alt="" 
                 
                />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Creator Access
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Enter your email and creator's access code to view their exclusive profile
            </p>
          </div>
          {/* Error Message Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-900 bg-opacity-50 border border-red-500 text-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message Display */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-900 bg-opacity-50 border border-green-500 text-green-200 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Fan Access Form */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <Mail size={20} />
              </div>
              <input
                type="email"
                name="email"
                value={fanData.email}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-10 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Your email address"
                required
              />
            </div>
            
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <Key size={20} />
              </div>
              <input
                type="text"
                name="access_code"
                value={fanData.access_code}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-10 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Creator access code"
                required
              />
            </div>
            
            <button
              type="button"
              onClick={handleFanAccess}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Accessing Profile...
                </>
              ) : (
                <>
                  Access Creator Profile
                  <ArrowRight className="ml-2" size={18} />
                </>
              )}
            </button>
          </div>

          {/* Info Section */}
          <div className="mt-8 p-4 bg-gray-700 bg-opacity-50 rounded-lg">
            <h3 className="text-white font-medium mb-2">How it works:</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Get the access code from your favorite creator</li>
              <li>• Enter your email and the access code above</li>
              <li>• Instantly access their exclusive content</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an access code? 
              <span className="text-purple-400 ml-1">Contact your creator directly</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function StreamingPlatformApp() {
  const [currentView, setCurrentView] = useState('login');
  const [userData, setUserData] = useState(null);
  const [creatorData, setCreatorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Add this line

  // Load session from storage on initial render
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
        // Clear corrupted data
        localStorage.removeItem('streamUserData');
        localStorage.removeItem('streamCreatorData');
      }
      setIsLoading(false);
    };

    loadSession();
  }, []);

  const handleAccessSuccess = (user, creator) => {
    // Store in localStorage for persistent session
    localStorage.setItem('streamUserData', JSON.stringify(user));
    localStorage.setItem('streamCreatorData', JSON.stringify(creator));
    
    setUserData(user);
    setCreatorData(creator);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    // Clear all storage
    localStorage.removeItem('streamUserData');
    localStorage.removeItem('streamCreatorData');
    sessionStorage.removeItem('fanEmail');
    
    setUserData(null);
    setCreatorData(null);
    setCurrentView('login');
  };
 const handleNavigate = (path) => {
    navigate(path);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          <p className="mt-4 text-white">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {currentView === 'login' ? (
        <FanAccessPage onAccessSuccess={handleAccessSuccess} />
      ) : (
        <StreamDashboard 
          userData={userData}
          creatorData={creatorData}
          onLogout={handleLogout}
          onNavigate={handleNavigate} // Add this prop
        />
      )}
    </div>
  );
}