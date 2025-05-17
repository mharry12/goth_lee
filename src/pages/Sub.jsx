import React, { useState, useEffect } from 'react';
import { 
  Menu, Video, Users, Heart, MessageSquare, DollarSign, 
  Settings, LogOut, Bell, User, Check, X, ChevronDown 
} from 'lucide-react';
import { Link } from "react-router-dom";

const SubscriptionPlans = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePlanType, setActivePlanType] = useState('monthly');
  const [openFaqItems, setOpenFaqItems] = useState({});
  const [username, setUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState('');

  // Load username from localStorage on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setUsername('User'); // Default value
    }
  }, []);

  // Save username to localStorage whenever it changes
  useEffect(() => {
    if (username && username !== 'User') {
      localStorage.setItem('username', username);
    }
  }, [username]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleFaqItem = (index) => {
    setOpenFaqItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const togglePlanType = (type) => {
    setActivePlanType(type);
  };

  const handleEditUsername = () => {
    setTempUsername(username);
    setIsEditing(true);
  };

  const handleSaveUsername = () => {
    if (tempUsername.trim()) {
      setUsername(tempUsername.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // We're now using Link components for navigation instead of this function
  // Keeping other functions intact

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 text-gray-800">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold">Subscription Plans</h1>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-full hover:bg-gray-100">
                <Bell />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                  <User className="text-purple-700" />
                </div>
                {isEditing ? (
                  <div className="flex items-center space-x-1">
                    <input
                      type="text"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      className="border rounded px-2 py-1 text-sm w-32"
                      autoFocus
                    />
                    <button onClick={handleSaveUsername} className="text-green-600 hover:text-green-800 p-1">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={handleCancelEdit} className="text-red-600 hover:text-red-800 p-1">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <span className="font-medium cursor-pointer hover:underline" onClick={handleEditUsername}>
                    {username}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Subscription Plans Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* Plans Toggle Section */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold mb-6">Choose Your {username}'s Stream Experience</h2>
              
              <div className="inline-flex p-1 bg-gray-100 rounded-lg">
                <button 
                  className={`px-6 py-2 rounded-md font-medium ${
                    activePlanType === 'monthly' ? 'bg-purple-600 text-white' : 'text-gray-700'
                  }`}
                  onClick={() => togglePlanType('monthly')}
                >
                  Monthly
                </button>
                <button 
                  className={`px-6 py-2 rounded-md font-medium ${
                    activePlanType === 'annual' ? 'bg-purple-600 text-white' : 'text-gray-700'
                  }`}
                  onClick={() => togglePlanType('annual')}
                >
                  Annual (Save 20%)
                </button>
              </div>
            </div>
            
            {/* Subscription Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Free Plan */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-gray-400">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Free</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <p className="text-gray-500 mb-6">Basic access to streaming content</p>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Watch public streams</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Follow up to 10 creators</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Basic chat features</span>
                    </li>
                    <li className="flex items-start text-gray-400">
                      <X className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <span>No ad-free viewing</span>
                    </li>
                    <li className="flex items-start text-gray-400">
                      <X className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <span>No exclusive content</span>
                    </li>
                  </ul>
                </div>
                <div className="px-6 pb-6">
                  <Link to="/payment">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md">
                      Subscribe
                    </button>
                  </Link>
                </div>
              </div>
              
              {/* Plus Plan */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-purple-500 transform scale-105">
                <div className="bg-purple-50 px-4 py-2 text-center">
                  <span className="text-purple-700 font-medium text-sm">MOST POPULAR</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Plus</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold">${activePlanType === 'monthly' ? '9.99' : '7.99'}</span>
                    <span className="text-gray-500 ml-1">/{activePlanType === 'monthly' ? 'month' : 'month, billed annually'}</span>
                  </div>
                  <p className="text-gray-500 mb-6">Enhanced streaming experience</p>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>All Free features</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Ad-free viewing</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>HD streaming quality</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Follow unlimited creators</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Access to exclusive content</span>
                    </li>
                  </ul>
                </div>
                <div className="px-6 pb-6">
                  <Link to="/payment">
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md">
                      Subscribe
                    </button>
                  </Link>
                </div>
              </div>
              
              {/* Premium Plan */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-indigo-600">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Premium</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold">${activePlanType === 'monthly' ? '19.99' : '15.99'}</span>
                    <span className="text-gray-500 ml-1">/{activePlanType === 'monthly' ? 'month' : 'month, billed annually'}</span>
                  </div>
                  <p className="text-gray-500 mb-6">Ultimate fan experience</p>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>All Plus features</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>4K streaming quality</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>5 subscriber tokens monthly</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Early access to new features</span>
                    </li>
                  </ul>
                </div>
                <div className="px-6 pb-6">
                  <Link to="/payment">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md">
                      Subscribe
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* FAQ Section */}
            <div className="mt-12 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* FAQ Item 1 */}
                <div>
                  <button 
                    className="flex justify-between items-center w-full text-left font-medium"
                    onClick={() => toggleFaqItem(0)}
                  >
                    <span>What is the difference between the plans?</span>
                    <ChevronDown 
                      className={`h-5 w-5 transition-transform ${openFaqItems[0] ? 'transform rotate-180' : ''}`} 
                    />
                  </button>
                  {openFaqItems[0] && (
                    <div className="mt-2 pl-0 text-gray-600">
                      <p>Each plan offers increasing levels of benefits. The Free plan gives you basic access to public streams. The Plus plan removes ads and provides HD quality along with access to exclusive content. The Premium plan offers everything in Plus with 4K streaming, more subscriber tokens, and priority support.</p>
                    </div>
                  )}
                </div>
                
                {/* FAQ Item 2 */}
                <div>
                  <button 
                    className="flex justify-between items-center w-full text-left font-medium"
                    onClick={() => toggleFaqItem(1)}
                  >
                    <span>Can I change my plan later?</span>
                    <ChevronDown 
                      className={`h-5 w-5 transition-transform ${openFaqItems[1] ? 'transform rotate-180' : ''}`} 
                    />
                  </button>
                  {openFaqItems[1] && (
                    <div className="mt-2 pl-0 text-gray-600">
                      <p>Yes, you can upgrade or downgrade your plan at any time. Changes will take effect immediately, and your billing will be prorated based on the remaining days in your current billing cycle.</p>
                    </div>
                  )}
                </div>
                
                {/* FAQ Item 3 */}
                <div>
                  <button 
                    className="flex justify-between items-center w-full text-left font-medium"
                    onClick={() => toggleFaqItem(2)}
                  >
                    <span>What are subscriber tokens?</span>
                    <ChevronDown 
                      className={`h-5 w-5 transition-transform ${openFaqItems[2] ? 'transform rotate-180' : ''}`} 
                    />
                  </button>
                  {openFaqItems[2] && (
                    <div className="mt-2 pl-0 text-gray-600">
                      <p>Subscriber tokens allow you to subscribe to your favorite creators without additional cost. Each token gives you a one-month subscription to a creator of your choice. Premium subscribers receive 5 tokens monthly, while Plus subscribers receive 2 tokens.</p>
                    </div>
                  )}
                </div>
                
                {/* FAQ Item 4 */}
                <div>
                  <button 
                    className="flex justify-between items-center w-full text-left font-medium"
                    onClick={() => toggleFaqItem(3)}
                  >
                    <span>Is there a refund policy?</span>
                    <ChevronDown 
                      className={`h-5 w-5 transition-transform ${openFaqItems[3] ? 'transform rotate-180' : ''}`} 
                    />
                  </button>
                  {openFaqItems[3] && (
                    <div className="mt-2 pl-0 text-gray-600">
                      <p>We offer a 7-day money-back guarantee for new subscribers. If you're not satisfied with your subscription, you can request a full refund within the first week. After that period, we do not provide refunds for partial subscription periods.</p>
                    </div>
                  )}
                </div>
                
                {/* FAQ Item 5 */}
                <div>
                  <button 
                    className="flex justify-between items-center w-full text-left font-medium"
                    onClick={() => toggleFaqItem(4)}
                  >
                    <span>How do I cancel my subscription?</span>
                    <ChevronDown 
                      className={`h-5 w-5 transition-transform ${openFaqItems[4] ? 'transform rotate-180' : ''}`} 
                    />
                  </button>
                  {openFaqItems[4] && (
                    <div className="mt-2 pl-0 text-gray-600">
                      <p>You can cancel your subscription at any time through your account settings. After cancellation, you'll still have access to your subscription benefits until the end of your current billing period.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Need Help Section */}
            <div className="mt-12 mb-12 bg-purple-50 rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-bold text-purple-700">Need help choosing the right plan?</h3>
                  <p className="text-purple-600">Our support team is ready to assist you with any questions.</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-medium">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SubscriptionPlans;