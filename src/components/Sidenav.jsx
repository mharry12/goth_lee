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
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if the screen is mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-collapse on mobile
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Mobile Overlay when sidebar is expanded */}
      {isMobile && !collapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar - Using fixed positioning */}
      <div 
        className={`
          fixed left-0 top-0 h-full bg-gray-800 text-white transition-all duration-300 z-30
          ${collapsed ? 'w-16' : 'w-64'}
        `}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {!collapsed && <h1 className="text-xl font-bold">Stream With Lee</h1>}
          <button onClick={toggleSidebar} className="p-2 rounded hover:bg-gray-700">
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>
        
        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto pt-4">
          <ul className="space-y-2 px-2">
            <li>
              <Link 
                to="/dashboard" 
                className={`flex items-center space-x-2 p-3 rounded-md ${location.pathname === '/dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                <Video size={20} />
                {!collapsed && <span>Live Streams</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/creators" 
                className={`flex items-center space-x-2 p-3 rounded-md ${location.pathname === '/creators' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                <Users size={20} />
                {!collapsed && <span>Creators</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/sub" 
                className={`flex items-center space-x-2 p-3 rounded-md ${location.pathname === '/sub' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                <Heart size={20} />
                {!collapsed && <span>Subscriptions</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/message" 
                className={`flex items-center space-x-2 p-3 rounded-md ${location.pathname === '/message' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                <MessageSquare size={20} />
                {!collapsed && <span>Messages</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/payment" 
                className={`flex items-center space-x-2 p-3 rounded-md ${location.pathname === '/payment' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                <DollarSign size={20} />
                {!collapsed && <span>Payments</span>}
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Footer Navigation */}
        <div className="border-t border-gray-700 p-2">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/settings" 
                className={`flex items-center space-x-2 p-3 rounded-md ${location.pathname === '/settings' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                <Settings size={20} />
                {!collapsed && <span>Settings</span>}
              </Link>
            </li>
            <li>
              <button 
                onClick={() => navigate('/logout')}
                className="flex w-full items-center space-x-2 p-3 rounded-md text-left hover:bg-gray-700"
              >
                <LogOut size={20} />
                {!collapsed && <span>Logout</span>}
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Main Content - Adjusted for proper padding and width */}
      <div 
        className={`
          w-full h-full overflow-y-auto transition-all duration-300
          ${collapsed ? 'ml-16' : 'ml-64'}
        `}
      >
        <Outlet />
      </div>
    </div>
  );
}