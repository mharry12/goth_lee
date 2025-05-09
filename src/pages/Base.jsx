import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Settings, Heart, MessageCircle } from 'lucide-react';
// Import the image (assuming the path is correct)
import leeImage from "../assest/lee.jpg";
import { Link } from "react-router-dom";


const StreamDashboard = () => {
  const [isBlinking, setIsBlinking] = useState(true);
  const [visibleComments, setVisibleComments] = useState([]);
  
  // Blinking LIVE effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(prev => !prev);
    }, 800);
    
    return () => clearInterval(blinkInterval);
  }, []);
  
  // Initial comments
  useEffect(() => {
    const initialComments = [
      { id: 1, user: "fan123", text: "OMG this is amazing!" },
      { id: 2, user: "streamer_lover", text: "You're the best!" },
      { id: 3, user: "gamer_pro", text: "I've been waiting for this stream all week!" }
    ];
    
    initialComments.forEach((comment, index) => {
      setTimeout(() => {
        setVisibleComments(prev => [...prev, comment]);
      }, index * 2000);
    });
  }, []);
  
  // Add new random comments periodically
  useEffect(() => {
    const newCommentInterval = setInterval(() => {
      const randomComments = [
        "This is so cool!",
        "I love your content!",
        "Can you show us more?",
        "First time watching, I'm impressed!",
        "Greetings from California!",
        "How do you do that so well?",
        "I've learned so much from your streams",
        "This is my favorite channel"
      ];
      
      const newComment = {
        id: Math.random().toString(36).substring(2, 9),
        user: `user_${Math.floor(Math.random() * 1000)}`,
        text: randomComments[Math.floor(Math.random() * randomComments.length)]
      };
      
      setVisibleComments(prev => {
        // Keep only the most recent 5 comments
        const updated = [...prev, newComment];
        return updated.length > 5 ? updated.slice(updated.length - 5) : updated;
      });
    }, 4000);
    
    return () => clearInterval(newCommentInterval);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search creators or content..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                <User className="text-purple-700" />
              </div>
              <span className="font-medium">User</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="p-6">
        {/* Featured Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Featured Live Now</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Featured Stream Preview */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white p-6 col-span-2 relative overflow-hidden h-64">
              {/* Blurred background */}
              <div className="absolute inset-0 bg-cover bg-center" style={{ 
                backgroundImage: `url('/api/placeholder/800/480')`,
                filter: 'blur(8px)',
                opacity: 0.7,
                transform: 'scale(1.1)'
              }}></div>
              
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <span className={`${isBlinking ? 'bg-red-500' : 'bg-red-700'} text-white px-2 py-1 rounded-md text-xs font-bold transition-colors duration-300 flex items-center w-16 justify-center`}>
                    <span className={`h-2 w-2 rounded-full ${isBlinking ? 'bg-white' : 'bg-red-300'} mr-1`}></span>
                    LIVE
                  </span>
                  <h3 className="text-xl font-bold mt-4">goth__egg</h3>
                  <p className="mt-1 opacity-90">Watch along with Lee</p>
                </div>
                <div className="mt-6 flex space-x-2">
                  <Link to='/payment'>
                  <button className="bg-white text-purple-700 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">Watch Now</button>
                  
                  </Link>
                  <Link to='/payment'>
                  <button className="bg-black bg-opacity-30 text-white px-4 py-2 rounded-md font-medium hover:bg-black hover:bg-opacity-40 transition-colors">Subscribe</button>
                  </Link>
                </div>
              </div>
              
              {/* Live comments section */}
              <div className="absolute top-0 right-0 w-48 h-full bg-black bg-opacity-60 p-3 overflow-y-auto rounded-tr-lg rounded-br-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold">LIVE CHAT</span>
                  <div className="flex items-center">
                    <span className="text-xs mr-1">98</span>
                    <MessageCircle size={12} />
                  </div>
                </div>
                
                <div className="space-y-3">
                  {visibleComments.map(comment => (
                    <div key={comment.id} className="text-xs animate-pulse">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-gray-300 mr-1 flex items-center justify-center">
                          <User size={10} />
                        </div>
                        <span className="font-bold">{comment.user}</span>
                      </div>
                      <p className="ml-5 text-gray-200">{comment.text}</p>
                      <div className="ml-5 flex items-center text-gray-400 text-xs space-x-2 mt-1">
                        <div className="flex items-center">
                          <Heart size={8} className="mr-1" />
                          <span>{Math.floor(Math.random() * 20)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 px-2 py-1 rounded-md text-xs z-10">
                98 viewers
              </div>
            </div>

            {/* Featured Creator 1 */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img src={leeImage} alt="Lee" className="w-full h-full object-cover" />
                </div>
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-white mr-1 animate-pulse"></span>
                  Online
                </span>
              </div>
              <h3 className="font-bold">goth__egg</h3>
              <p className="text-sm text-gray-500">5.2k subscribers</p>
              <Link to='/payment'>
              <button className="mt-3 w-full bg-purple-600 text-white py-2 rounded-md font-medium hover:bg-purple-700 transition-colors">
                Subscribe
              </button>
              </Link>
            </div>

            {/* Featured Creator 2 */}
            {/* <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img src={leeImage} alt="Lee" className="w-full h-full object-cover" />
                </div>
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-white mr-1 animate-pulse"></span>
                  Online
                </span>
              </div>
              <h3 className="font-bold">goth__egg</h3>
              <p className="text-sm text-gray-500">5.2k subscribers</p>
              <a href='/payment'>
              <button className="mt-3 w-full bg-purple-600 text-white py-2 rounded-md font-medium hover:bg-purple-700 transition-colors">
                Subscribe
              </button>
              </a>
            </div> */}
            
          </div>
        </div>
        
        {/* Dashboard Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upcoming Streams */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-4">Upcoming Streams</h3>
            <ul className="space-y-4">
              <li className="border-b pb-3">
                <p className="font-medium">Streaming with Lee</p>
                <p className="text-sm text-gray-500">goth__egg</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-purple-600">Today, 11:30pm</span>
                  <button className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full">
                    Remind me
                  </button>
                </div>
              </li>
              <li className="border-b pb-3">
                <p className="font-medium">Behind the Scenes</p>
                <p className="text-sm text-gray-500">goth__egg</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-purple-600">Tomorrow, 6:30 PM</span>
                  <button className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full">
                    Remind me
                  </button>
                </div>
              </li>
              <li>
                <p className="font-medium">Fun with Lee</p>
                <p className="text-sm text-gray-500">goth__egg</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-purple-600">Saturday, 8:00 PM</span>
                  <button className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full">
                    Remind me
                  </button>
                </div>
              </li>
            </ul>
            <button className="mt-4 text-purple-600 text-sm font-medium">
              View all upcoming streams
            </button>
          </div>

          {/* Subscription Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-4">Your Subscriptions</h3>
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-700">0</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Unactive</p>
                <p className="font-bold text-lg">0</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Available offers</p>
                <p className="font-bold text-lg">2</p>
              </div>
            </div>
            <button className="mt-4 w-full bg-gray-100 hover:bg-gray-200 py-2 rounded-md font-medium transition-colors">
              Manage Subscriptions
            </button>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-4">Payment Method</h3>
            <div className="bg-gray-50 p-4 rounded-md mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-6 bg-blue-600 rounded mr-3"></div>
                <div>
                  <p className="font-medium">•••• •••• •••• </p>
                  <p className="text-xs text-gray-500">Expires 00/00</p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Default</span>
            </div>
            <div className="flex space-x-2">
              <Link to='./payment'>
              <button className="flex-1 bg-purple-600 text-white py-2 rounded-md font-medium hover:bg-purple-700 transition-colors">
                Add Payment Method
              </button>
              </Link>
              <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-md transition-colors">
                <Settings />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creator
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                        <img src={leeImage} alt="Lee" className="w-full h-full object-cover" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">goth__egg</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Private Stream With Lee</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">May 30th, 2025</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Book
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                        <img src={leeImage} alt="Lee" className="w-full h-full object-cover" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">goth__egg</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Premium Content With Lee</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">June 7, 2025</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Subscribe
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                        <img src={leeImage} alt="Lee" className="w-full h-full object-cover" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">goth__egg</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Monthly Update About Lee</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">June 30, 2025</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      Remind me
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StreamDashboard;