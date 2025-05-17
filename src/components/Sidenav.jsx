import { useState, useEffect } from 'react';
import {
  Menu,
  Video,
  Users,
  Heart,
  MessageSquare,
  DollarSign,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

export default function SideNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if the screen is mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Mobile Overlay when sidebar is expanded */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar - Using translate instead of width for better slide animation */}
      <div 
        className={`
          fixed left-0 top-0 h-full bg-gray-800 text-white transition-all duration-300 z-30 w-64
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-900">
          <h1 className="text-xl text-white font-bold">Stream With Cindy</h1>
          <button onClick={toggleSidebar} className="p-2 rounded hover:bg-gray-700">
            <X size={20} />
          </button>
        </div>
        
        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto pt-4">
          <ul className="space-y-2 px-2">
            <li>
              <Link 
                to="/dashboard" 
                className={`flex items-center space-x-2 p-3 rounded-md ${location.pathname === '/dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <Video size={20} />
                <span className="ml-2">Live Streams</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/creators" 
                className={`flex items-center space-x-2 p-3 rounded-md ${location.pathname === '/creators' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <Users size={20} />
                <span className="ml-2">Creators</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/sub" 
                className={`flex items-center space-x-2 p-3 rounded-md ${location.pathname === '/sub' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <Heart size={20} />
                <span className="ml-2">Subscriptions</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/message" 
                className={`flex items-center space-x-2 p-3 rounded-md ${location.pathname === '/message' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <MessageSquare size={20} />
                <span className="ml-2">Messages</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/payment" 
                className={`flex items-center space-x-2 p-3 rounded-md ${location.pathname === '/payment' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <DollarSign size={20} />
                <span className="ml-2">Payments</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Footer Navigation */}
        <div className="border-t border-gray-700 p-2 mt-auto">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/settings" 
                className={`flex items-center space-x-2 p-3 rounded-md ${location.pathname === '/settings' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <Settings size={20} />
                <span className="ml-2">Settings</span>
              </Link>
            </li>
            <li>
              <button 
                onClick={() => {
                  navigate('/logout');
                  if (isMobile) setSidebarOpen(false);
                }}
                className="flex w-full items-center space-x-2 p-3 rounded-md text-left hover:bg-gray-700"
              >
                <LogOut size={20} />
                <span className="ml-2">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Header with toggle button */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-slate-950 shadow-sm z-10 flex items-center px-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded text-white hover:bg-gray-600"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 font-bold text-white text-lg">Stream With Cindy</h1>
      </div>
      
      {/* Main Content - Full width with Outlet for React Router */}
      <div className="w-full h-full overflow-y-auto pt-14">
        <Outlet />
      </div>
    </div>
  );
}