import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { 
  Check, Play, Image, Heart, MessageCircle, 
  ChevronLeft, ChevronRight, Loader2, X,
  AlertCircle, Mail, Star, Lock, Users
} from "lucide-react";

export default function CreatorContentPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedContent, setSelectedContent] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [creatorContent, setCreatorContent] = useState({ videos: [], images: [] });
  const [error, setError] = useState(null);
  const [creator, setCreator] = useState({
    name: "",
    username: "",
    avatar: "",
    coverImage: "",
    description: "",
    subscriberCount: 0,
    isSubscribed: false,
    monthlyPrice: 9.99
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  
  const location = useLocation();
  const { creatorId } = useParams();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return "Recently";
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    const getCreatorInfo = () => {
      try {
        const locationState = location.state || {};
        
        if (locationState.subscriptionSuccess && locationState.creatorData) {
          const creatorData = {
            ...locationState.creatorData,
            isSubscribed: true
          };
          setCreator(creatorData);
          localStorage.setItem(`creator_${creatorId}`, JSON.stringify({
            ...creatorData,
            username: creatorData.username.replace('@', '')
          }));
          
          setShowSuccessMessage(true);
          const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
          return () => clearTimeout(timer);
        }
        
        const storedCreator = localStorage.getItem(`creator_${creatorId}`);
        if (storedCreator) {
          const creatorData = JSON.parse(storedCreator);
          setCreator({
            name: creatorData.full_name || creatorData.name || "Creator",
            username: `@${creatorData.username || "creator"}`,
            avatar: creatorData.profile_picture || creatorData.avatar || "https://via.placeholder.com/150",
            coverImage: creatorData.cover_photo || creatorData.coverImage || "https://via.placeholder.com/800x200",
            description: creatorData.bio || creatorData.description || "Exclusive content for subscribers",
            subscriberCount: creatorData.subscriber_count || creatorData.subscriberCount || 0,
            isSubscribed: true,
            monthlyPrice: creatorData.monthlyPrice || 9.99
          });
        } else {
          fetchCreatorInfo();
        }
      } catch (err) {
        console.error("Error loading creator info:", err);
        setError("Failed to load creator information");
      }
    };

    const fetchCreatorInfo = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/creators/${creatorId}/`);
        if (!response.ok) throw new Error('Failed to fetch creator data');
        const data = await response.json();
        
        setCreator({
          name: data.creator_name || "Creator",
          username: `@${data.creator_username || "creator"}`,
          avatar: data.profile_pic || "https://via.placeholder.com/150",
          coverImage: data.cover_photo || "https://via.placeholder.com/800x200",
          description: data.bio || "Exclusive content for subscribers",
          subscriberCount: data.subscriber_count || 0,
          isSubscribed: false,
          monthlyPrice: data.monthly_price || 9.99
        });
      } catch (err) {
        console.error("Error fetching creator info:", err);
        setCreator({
          name: "Creator",
          username: "@creator",
          avatar: "https://via.placeholder.com/150",
          coverImage: "https://via.placeholder.com/800x200",
          description: "Exclusive content for subscribers",
          subscriberCount: 0,
          isSubscribed: false,
          monthlyPrice: 9.99
        });
      }
    };

    getCreatorInfo();
  }, [location.state, creatorId]);

  useEffect(() => {
    const fetchContent = async () => {
      console.log('🚀 Starting fetchContent...');
      console.log('Creator ID:', creatorId);
      console.log('Creator is subscribed:', creator.isSubscribed);
      
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        console.log('Token exists:', !!token);
        console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'null');
        
        const url = `http://127.0.0.1:8000/api/creators/${creatorId}/content/`;
        console.log('📡 Fetching from URL:', url);
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('📥 Response status:', response.status);
        console.log('📥 Response ok:', response.ok);
        console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Error response body:', errorText);
          throw new Error(`Failed to fetch content: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('📊 Raw API data:', data);
        console.log('📊 Data type:', typeof data);
        console.log('📊 Data length:', Array.isArray(data) ? data.length : 'Not an array');
        
        const baseUrl = 'http://127.0.0.1:8000';
        const processedData = {
          videos: [],
          images: []
        };

        if (Array.isArray(data)) {
          data.forEach((item, index) => {
            console.log(`🔍 Processing item ${index}:`, item);
            
            const contentItem = {
              id: item.id,
              title: item.title || "Untitled",
              date: item.created_at ? formatDate(item.created_at) : "Recently",
              likes: item.likes_count || 0,
              comments: item.comments_count || 0,
              description: item.description || ""
            };

            if (item.video) {
              console.log('📹 Found video:', item.video);
              processedData.videos.push({
                ...contentItem,
                type: "video",
                src: item.video.startsWith('http') ? item.video : `${baseUrl}${item.video}`,
                thumbnail: item.thumbnail 
                  ? (item.thumbnail.startsWith('http') ? item.thumbnail : `${baseUrl}${item.thumbnail}`)
                  : (item.image 
                      ? (item.image.startsWith('http') ? item.image : `${baseUrl}${item.image}`)
                      : creator.avatar),
                duration: formatDuration(item.duration) || "0:00"
              });
            }
            
            if (item.image && !item.video) {
              console.log('🖼️ Found image:', item.image);
              processedData.images.push({
                ...contentItem,
                type: "image",
                src: item.image.startsWith('http') ? item.image : `${baseUrl}${item.image}`
              });
            }
          });
        } else {
          console.warn('⚠️ Data is not an array:', data);
        }

        console.log('✅ Processed data:', processedData);
        console.log('✅ Videos count:', processedData.videos.length);
        console.log('✅ Images count:', processedData.images.length);

        setCreatorContent(processedData);
        
        setTimeout(() => {
          console.log('🎬 Setting contentLoaded to true');
          setContentLoaded(true)
        }, 500);
        
      } catch (err) {
        console.error('💥 Error in fetchContent:', err);
        console.error('💥 Error stack:', err.stack);
        setError(err.message);
      } finally {
        setTimeout(() => {
          console.log('⏰ Setting loading to false');
          setLoading(false);
        }, 300);
      }
    };
    
    console.log('🔍 Checking conditions...');
    console.log('creatorId:', creatorId);
    console.log('creator.isSubscribed:', creator.isSubscribed);
    
    if (creatorId && creator.isSubscribed) {
      console.log('✅ Conditions met, calling fetchContent');
      fetchContent();
    } else {
      console.log('❌ Conditions not met, skipping fetchContent');
      // If not subscribed but we have creatorId, still stop loading
      if (creatorId) {
        setTimeout(() => setLoading(false), 300);
      }
    }
  }, [creatorId, creator.isSubscribed, creator.avatar]);

  const filteredContent = () => {
    return activeTab === "all" 
      ? [...creatorContent.videos, ...creatorContent.images]
      : creatorContent[activeTab];
  };

  const openLightbox = (content) => {
    setSelectedContent(content);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };
  
  const navigateLightbox = (direction) => {
    const currentList = filteredContent();
    const currentIndex = currentList.findIndex(item => item.id === selectedContent.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : currentList.length - 1;
    } else {
      newIndex = currentIndex < currentList.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedContent(currentList[newIndex]);
  };

  const handleSubscribe = () => {
    navigate(`/creator/${creatorId}/subscribe`, {
      state: { creatorData: creator }
    });
  };

  const ContentCard = ({ item, index }) => (
    <div 
      className={`relative overflow-hidden rounded-xl shadow-lg transition-all duration-700 hover:scale-[1.03] hover:shadow-2xl cursor-pointer group bg-white ${
        contentLoaded ? 'animate-fade-in-up opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => openLightbox(item)}
    >
      <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img 
          src={item.type === "video" ? item.thumbnail : item.src} 
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = item.type === "video" 
              ? "https://via.placeholder.com/500x281" 
              : "https://via.placeholder.com/500x500";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {item.type === "video" && (
          <>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all duration-300">
              <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg">
                <Play className="w-6 h-6 text-blue-600 ml-1" />
              </div>
            </div>
            <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
              {item.duration}
            </div>
          </>
        )}
        
        <div className="absolute top-3 left-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-700 capitalize">
            {item.type}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate text-lg group-hover:text-blue-600 transition-colors duration-300">
          {item.title}
        </h3>
        <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span className="flex items-center hover:text-red-500 transition-colors duration-200">
              <Heart className="w-4 h-4 mr-1" />
              {item.likes.toLocaleString()}
            </span>
            {item.comments > 0 && (
              <span className="flex items-center hover:text-blue-500 transition-colors duration-200">
                <MessageCircle className="w-4 h-4 mr-1" />
                {item.comments.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-gray-500">{item.date}</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="relative">
            <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-xl font-medium text-gray-700 animate-pulse">Loading content...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the latest updates</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-xl shadow-lg p-6 animate-fade-in">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="font-semibold text-center text-gray-800 text-lg mb-2">Oops! Something went wrong</h3>
          <p className="text-center text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-[1.02]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!creator.isSubscribed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 animate-fade-in-up">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">Exclusive Content</h2>
          <p className="text-gray-600 mb-8 text-center leading-relaxed">
            Subscribe to {creator.name} to unlock their premium content and join an exclusive community
          </p>
          <button
            onClick={handleSubscribe}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
          >
            Subscribe for ${creator.monthlyPrice.toFixed(2)}/month
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {showSuccessMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-white border border-green-200 rounded-xl shadow-lg px-6 py-4 flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-green-800 font-medium">Subscription successful! Welcome to the community</span>
            <button 
              onClick={() => setShowSuccessMessage(false)}
              className="ml-4 text-green-600 hover:text-green-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="relative h-64 bg-gradient-to-r from-gray-800 to-gray-900 overflow-hidden">
        <img 
          src={creator.coverImage} 
          alt="Cover" 
          className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/800x200";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
      </div>
      
      <div className="container px-4 mx-auto">
        <div className="relative z-10 max-w-5xl mx-auto -mt-20 mb-8">
          <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm animate-fade-in-up">
            <div className="flex flex-col items-center mb-8 md:flex-row md:items-start">
              <div className="relative mb-6 md:mb-0">
                <div className="relative">
                  <img 
                    src={creator.avatar} 
                    alt={creator.name} 
                    className="object-cover w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                  />
                  <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-3 border-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="md:ml-8 text-center md:text-left flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{creator.name}</h1>
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium px-3 py-1 rounded-full inline-flex items-center shadow-md">
                    <Check className="w-4 h-4 mr-1" />
                    Subscribed
                  </span>
                </div>
                <p className="text-gray-600 text-lg mb-3">{creator.username}</p>
                <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-md">
                    <Users className="w-4 h-4 mr-1" />
                    {creator.subscriberCount.toLocaleString()} subscribers
                  </span>
                </div>
                <p className="text-gray-700 text-base leading-relaxed">{creator.description}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <button className="flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-[1.02] shadow-lg">
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </button>
              <button className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-[1.02] shadow-md">
                <Star className="w-4 h-4 mr-2" />
                Add to Favorites
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex border-b border-gray-200">
              {["all", "videos", "images"].map((tab, index) => (
                <button
                  key={tab}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-300 flex items-center justify-center relative ${
                    activeTab === tab
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 animate-slide-in"></div>
                  )}
                  {tab === "videos" && <Play className="w-4 h-4 mr-2" />}
                  {tab === "images" && <Image className="w-4 h-4 mr-2" />}
                  {tab === "all" ? "All Content" : 
                   `${tab.charAt(0).toUpperCase() + tab.slice(1)} (${creatorContent[tab]?.length || 0})`}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto">
          {filteredContent().length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredContent().map((item, index) => (
                <ContentCard key={`${item.type}-${item.id}`} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center animate-fade-in">
              <div className="text-gray-400 mb-6">
                <Image className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No content available yet</h3>
              <p className="text-gray-500 text-base">
                Check back later for new content from {creator.name}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {isLightboxOpen && selectedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in">
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white bg-black/50 backdrop-blur-sm rounded-full p-3 hover:bg-black/70 transition-all duration-300 z-10"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => navigateLightbox('prev')}
            className="absolute top-1/2 left-6 transform -translate-y-1/2 text-white bg-black/50 backdrop-blur-sm rounded-full p-3 hover:bg-black/70 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => navigateLightbox('next')}
            className="absolute top-1/2 right-6 transform -translate-y-1/2 text-white bg-black/50 backdrop-blur-sm rounded-full p-3 hover:bg-black/70 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <div className="max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-zoom-in">
            {selectedContent.type === "video" ? (
              <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
                <div className="relative pt-[56.25%]">
                  <video 
                    src={selectedContent.src}
                    poster={selectedContent.thumbnail}
                    controls
                    autoPlay
                    className="absolute inset-0 w-full h-full object-contain rounded-t-2xl"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.poster = "https://via.placeholder.com/800x450";
                    }}
                  >
                    <source src={selectedContent.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="p-6 bg-gray-900 text-white">
                  <h3 className="text-2xl font-bold mb-3">{selectedContent.title}</h3>
                  <p className="text-gray-300 text-base leading-relaxed mb-4">{selectedContent.description}</p>
                  <div className="flex items-center text-sm text-gray-400 space-x-4">
                    <span>{selectedContent.date}</span>
                    <span className="flex items-center hover:text-red-400 transition-colors cursor-pointer">
                      <Heart className="w-4 h-4 mr-1" />
                      {selectedContent.likes.toLocaleString()}
                    </span>
                    {selectedContent.comments > 0 && (
                      <span className="flex items-center hover:text-blue-400 transition-colors cursor-pointer">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {selectedContent.comments.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={selectedContent.src} 
                  alt={selectedContent.title}
                  className="max-w-full max-h-[70vh] object-contain mx-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/800x800";
                  }}
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{selectedContent.title}</h3>
                  <p className="text-gray-600 text-base leading-relaxed mb-4">{selectedContent.description}</p>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span>{selectedContent.date}</span>
                    <span className="flex items-center hover:text-red-500 transition-colors cursor-pointer">
                      <Heart className="w-4 h-4 mr-1" />
                      {selectedContent.likes.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slide-down {
          from { 
            opacity: 0; 
            transform: translate(-50%, -100%); 
          }
          to { 
            opacity: 1; 
            transform: translate(-50%, 0); 
          }
        }
        
        @keyframes slide-in {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        
        @keyframes zoom-in {
          from { 
            opacity: 0; 
            transform: scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-zoom-in {
          animation: zoom-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}