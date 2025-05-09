import { useState } from 'react';
import { 
  Check, 
  User, 
  Shield, 
  Layout, 
  MessageSquare,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export default function WelcomeStream() {
  const [progress, setProgress] = useState(25);
  const [completedSteps, setCompletedSteps] = useState(1);
  const totalSteps = 4;

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex justify-between items-center py-4 mb-8 border-b border-gray-200">
          <div className="font-bold text-xl text-indigo-600">StreamConnect</div>
          <div className="flex items-center gap-3">
            <span className="text-gray-600">Welcome!</span>
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
              N
            </div>
          </div>
        </header>

        {/* Welcome Hero */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-md text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Welcome to StreamConnect!</h1>
          <p className="text-gray-600 mb-6">
            Complete these steps to get started with your new account. We're excited to have you join us!
          </p>
          
          {/* Progress Bar */}
          <div className="my-6">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Account Setup: {progress}% Complete</span>
              <span>{completedSteps} of {totalSteps} steps completed</span>
            </div>
          </div>
        </div>

        {/* Stream Messages */}
        <div className="flex flex-col gap-5">
          {/* Completed Message */}
          <StreamMessage 
            icon={<Check size={18} />} 
            title="Account Created"
            status="completed"
            content="Your account has been successfully created. Welcome to the StreamConnect community!"
          />

          {/* Profile Message */}
          <StreamMessage 
            icon={<User size={18} />} 
            title="Complete Your Profile"
            status="required"
            content="Tell us a bit more about yourself. Adding a profile picture and bio helps others connect with you."
            primaryAction="Complete Profile"
          />

          {/* Security Message */}
          <StreamMessage 
            icon={<Shield size={18} />} 
            title="Enable Two-Factor Authentication"
            status="recommended"
            content="Protect your account with an extra layer of security. Two-factor authentication helps keep your data safe."
            secondaryAction="Set Up 2FA"
          />

          {/* Dashboard Message */}
          <StreamMessage 
            icon={<Layout size={18} />} 
            title="Explore Your Dashboard"
            status="new"
            content="Your dashboard is where you'll manage all your activities. Take a tour to discover all the features available to you."
            secondaryAction="Take the Tour"
          />

          {/* Community Message */}
          <StreamMessage 
            icon={<MessageSquare size={18} />} 
            title="Join the Community"
            content="Connect with other members and join discussions in our community forums. Share ideas and get help from experienced users."
            secondaryAction="Browse Forums"
          />
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-gray-500 text-sm">
          <p>
            Need help? <a href="#" className="text-indigo-600">Contact Support</a> • 
            <a href="#" className="text-indigo-600 mx-1">Privacy Policy</a> • 
            <a href="#" className="text-indigo-600">Terms of Service</a>
          </p>
        </footer>
      </div>
    </div>
  );
}

function StreamMessage({ 
  icon, 
  title, 
  status, 
  content, 
  primaryAction, 
  secondaryAction 
}) {
  const statusStyles = {
    completed: "bg-green-50 text-green-600",
    required: "bg-red-50 text-red-600",
    recommended: "bg-amber-50 text-amber-600",
    new: "bg-blue-50 text-blue-600"
  };

  const getStatusText = (status) => {
    if (!status) return null;
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="bg-white rounded-lg p-5 shadow-md transition-transform duration-300 hover:translate-y-1 hover:shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        {status && (
          <span className={`text-xs px-3 py-1 rounded-full ${statusStyles[status]}`}>
            {getStatusText(status)}
          </span>
        )}
      </div>
      
      <div className="text-gray-600 mb-4">
        <p>{content}</p>
      </div>
      
      {(primaryAction || secondaryAction) && (
        <div className="flex gap-3 mt-4">
          {primaryAction && (
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium flex items-center gap-1 hover:bg-indigo-700 transition-colors">
              {primaryAction}
              <ChevronRight size={16} />
            </button>
          )}
          {secondaryAction && (
            <button className="px-4 py-2 border border-gray-200 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              {secondaryAction}
            </button>
          )}
        </div>
      )}
    </div>
  );
}