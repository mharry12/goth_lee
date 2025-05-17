import { useState, useEffect } from "react";
import { Check, ArrowRight, Play, Image, Heart, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import col_v1 from "../assest/col v.mp4";
import col_v2 from "../assest/col v 2.mp4";
import col_1 from "../assest/col 1.JPG";
import col_2 from "../assest/col 2.JPG";
import col_3 from "../assest/col 3.JPG";
import col_5 from "../assest/col 5.JPG";
import col_6 from "../assest/col 6.JPG";
import col_7 from "../assest/col 7.JPG";
import col_8 from "../assest/col 8.JPG";
import col_9 from "../assest/col 9.JPG";
import col_10 from "../assest/col 10.JPG";
import col_11 from "../assest/col 11.JPG";
import col_12 from "../assest/col 12.JPG";
import col_14 from "../assest/col 14.JPG";
import col from "../assest/col.jpg"


export default function CreatorContentPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedContent, setSelectedContent] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const creator = {
    name: "Colston Cindy",
    username: "@cindy_col",
    avatar: col, // Using imported avatar image
    coverImage: col, // Using imported cover image
    description: "Thanks for subscribing! Here's my exclusive content just for subscribers. New videos and pics every week!",
    subscriberCount: 5280
  };
  
  // Sample content data with imported assets
  const creatorContent = {
    videos: [
      {
        id: 1,
        type: "video",
        src: col_v1,
        thumbnail: col_v1, // Using image as thumbnail for video
        title: "Playing with my big sweet dildo",
        duration: "3:45",
        likes: 428,
        comments: 32,
        date: "3 days ago"
      },
      {
        id: 2,
        type: "video",
        src: col_v2,
        thumbnail: col_v2, // Using image as thumbnail for video
        title: "Playing with me suprior sweet dildo - Day 2",
        duration: "2:30",
        likes: 356,
        comments: 27,
        date: "1 week ago"
      }
    ],
    images: [
      { id: 1, type: "image", src: col_1, title: "Summer photoshoot", likes: 723, date: "2 days ago" },
      { id: 2, type: "image", src: col_2, title: "Can you give me Maximum head?", likes: 651, date: "3 days ago" },
      { id: 3, type: "image", src: col_3, title: "City lights", likes: 589, date: "4 days ago" },
      { id: 5, type: "image", src: col_5, title: "Love my shape?", likes: 498, date: "6 days ago" },
      { id: 6, type: "image", src: col_6, title: "Getting a temporary tatto on my face", likes: 476, date: "1 week ago" },
      { id: 7, type: "image", src: col_7, title: "My source tits....", likes: 432, date: "1 week ago" },
      { id: 8, type: "image", src: col_8, title: "Still in love with my facial look", likes: 401, date: "1 week ago" },
      { id: 9, type: "image", src: col_9, title: "Sunny day", likes: 387, date: "2 weeks ago" },
      { id: 10, type: "image", src: col_10, title: "Can you give the doggey i really need?", likes: 365, date: "2 weeks ago" },
      { id: 11, type: "image", src: col_11, title: "Can you suck my tits?", likes: 365, date: "2 weeks ago" },
      { id: 12, type: "image", src: col_12, title: "Can you fuck me harder?", likes: 365, date: "2 weeks ago" },
      { id: 14, type: "image", src: col_14, title: "Lovely morning with lovely shape", likes: 365, date: "2 weeks ago" },






    ]
  };
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Function to filter content based on active tab
  const filteredContent = () => {
    if (activeTab === "all") {
      return [...creatorContent.videos, ...creatorContent.images];
    } else if (activeTab === "videos") {
      return creatorContent.videos;
    } else {
      return creatorContent.images;
    }
  };
  
  // Handle opening the lightbox
  const openLightbox = (content) => {
    setSelectedContent(content);
    setIsLightboxOpen(true);
  };
  
  // Navigate to previous item in lightbox
  const prevItem = () => {
    const currentList = activeTab === "videos" ? creatorContent.videos : 
                        activeTab === "images" ? creatorContent.images : 
                        [...creatorContent.videos, ...creatorContent.images];
    
    const currentIndex = currentList.findIndex(item => item.id === selectedContent.id && item.type === selectedContent.type);
    if (currentIndex > 0) {
      setSelectedContent(currentList[currentIndex - 1]);
    } else {
      setSelectedContent(currentList[currentList.length - 1]);
    }
  };
  
  // Navigate to next item in lightbox
  const nextItem = () => {
    const currentList = activeTab === "videos" ? creatorContent.videos : 
                        activeTab === "images" ? creatorContent.images : 
                        [...creatorContent.videos, ...creatorContent.images];
    
    const currentIndex = currentList.findIndex(item => item.id === selectedContent.id && item.type === selectedContent.type);
    if (currentIndex < currentList.length - 1) {
      setSelectedContent(currentList[currentIndex + 1]);
    } else {
      setSelectedContent(currentList[0]);
    }
  };
  
  // Content card component with animation
  const ContentCard = ({ item }) => (
    <div 
      className="relative overflow-hidden rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer animate-fade-in"
      onClick={() => openLightbox(item)}
    >
      <div className="relative">
        <img 
          src={item.type === "video" ? item.thumbnail : item.src} 
          alt={item.title}
          className="w-full h-auto object-cover"
        />
        {item.type === "video" && (
          <>
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center transition-transform duration-300 transform hover:scale-110">
                <Play className="w-6 h-6 text-blue-600 ml-1" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded">
              {item.duration}
            </div>
          </>
        )}
      </div>
      <div className="p-3 bg-white">
        <h3 className="font-medium text-gray-800 truncate">{item.title}</h3>
        <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Heart className="w-4 h-4 mr-1" />
            {item.likes}
            {item.comments && (
              <span className="flex items-center ml-3">
                <MessageCircle className="w-4 h-4 mr-1" />
                {item.comments}
              </span>
            )}
          </div>
          <span>{item.date}</span>
        </div>
      </div>
    </div>
  );
  
  // Loading animation component
  const LoadingAnimation = () => (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">Loading exclusive content...</p>
    </div>
  );
  
  // Lightbox component
  const Lightbox = () => {
    if (!selectedContent) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 animate-fade-in">
        <div className="absolute top-4 right-4">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="text-white bg-gray-800 bg-opacity-70 rounded-full p-2 transition hover:bg-opacity-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <button 
            onClick={prevItem}
            className="text-white bg-gray-800 bg-opacity-70 rounded-full p-2 transition hover:bg-opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
        
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <button 
            onClick={nextItem}
            className="text-white bg-gray-800 bg-opacity-70 rounded-full p-2 transition hover:bg-opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        
        <div className="max-w-4xl max-h-[80vh] overflow-hidden">
          {selectedContent.type === "video" ? (
            <div className="bg-black rounded-lg overflow-hidden animate-scale-in">
              <div className="relative pt-[56.25%]">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Use video element instead of image for videos */}
                  <video 
                    src={selectedContent.src}
                    poster={selectedContent.thumbnail}
                    controls
                    className="w-full h-full object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
              <div className="p-4 bg-gray-900 text-white">
                <h3 className="text-xl font-semibold">{selectedContent.title}</h3>
                <div className="flex items-center mt-2 text-gray-300">
                  <span>{selectedContent.date}</span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    {selectedContent.likes}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {selectedContent.comments}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-scale-in">
              <img 
                src={selectedContent.src} 
                alt={selectedContent.title}
                className="max-w-full max-h-[70vh] object-contain"
              />
              <div className="mt-4 text-white">
                <h3 className="text-xl font-semibold">{selectedContent.title}</h3>
                <div className="flex items-center mt-2 text-gray-300">
                  <span>{selectedContent.date}</span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    {selectedContent.likes}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  if (loading) {
    return <LoadingAnimation />;
  }
  
  return (
    <div className="bg-gray-100 min-h-screen pb-12">
      {/* Creator banner */}
      <div className="relative h-48 bg-gray-800">
        <img 
          src={creator.coverImage} 
          alt="Cover" 
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
      </div>
      
      <div className="container px-4 mx-auto">
        {/* Creator info */}
        <div className="relative z-10 max-w-3xl mx-auto -mt-16 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 animate-slide-up">
            <div className="flex flex-col items-center mb-6 md:flex-row md:items-start">
              <div className="relative mb-4 md:mb-0">
                <img 
                  src={creator.avatar} 
                  alt={creator.name} 
                  className="object-cover w-24 h-24 rounded-full border-4 border-white shadow-md"
                />
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="md:ml-6 text-center md:text-left">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{creator.name}</h1>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                    <Check className="w-3 h-3 mr-1" />
                    Subscribed
                  </span>
                </div>
                <p className="text-gray-600">{creator.username}</p>
                <div className="flex items-center justify-center mt-2 space-x-2 md:justify-start">
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-purple-600 rounded-full">
                    {creator.subscriberCount.toLocaleString()} subscribers
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700">{creator.description}</p>
            
            <div className="mt-6 flex flex-wrap gap-2">
              <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </button>
              <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                <Heart className="w-4 h-4 mr-2" />
                Favorite
              </button>
            </div>
          </div>
        </div>
        
        {/* Content tabs */}
        <div className="max-w-6xl mx-auto mb-6">
          <div className="bg-white rounded-lg shadow p-4 animate-fade-in">
            <div className="flex border-b border-gray-200">
              <button
                className={`px-4 py-2 font-medium rounded-t-lg transition ${
                  activeTab === "all" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("all")}
              >
                All Content
              </button>
              <button
                className={`px-4 py-2 font-medium rounded-t-lg transition flex items-center ${
                  activeTab === "videos" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("videos")}
              >
                <Play className="w-4 h-4 mr-1" />
                Videos ({creatorContent.videos.length})
              </button>
              <button
                className={`px-4 py-2 font-medium rounded-t-lg transition flex items-center ${
                  activeTab === "images" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("images")}
              >
                <Image className="w-4 h-4 mr-1" />
                Photos ({creatorContent.images.length})
              </button>
            </div>
          </div>
        </div>
        
        {/* Content grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContent().map((item, index) => (
              <div key={`${item.type}-${item.id}`} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <ContentCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Lightbox */}
      {isLightboxOpen && <Lightbox />}
      
      {/* Custom animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}