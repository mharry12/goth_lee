import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  Check, 
  ArrowRight, 
  CreditCard, 
  Lock, 
  AlertCircle, 
  ChevronLeft,
  Loader2,
  X,
  ShieldCheck,
  Sparkles,
  UserPlus
} from "lucide-react";

export default function CreatorSubscriptionPage() {
  const { creatorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [paymentStep, setPaymentStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [mounted, setMounted] = useState(false);

  const { creatorData: stateCreatorData } = location.state || {};

  const [formData, setFormData] = useState({
    card_holder_name: "",
    card_number: "",
    expiry: "",
    cvc: "",
    brand: "Visa",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "US"
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/150";
    if (imagePath.startsWith('http')) return imagePath;
    return `https://stream-l2du.onrender.com${imagePath}`;
  };

  const initializeCreatorData = async () => {
    try {
      setLoading(true);
      let creatorObj;
      
      if (stateCreatorData) {
        creatorObj = createCreatorObject(stateCreatorData);
      } else {
        const response = await fetch(`https://stream-l2du.onrender.com/api/creators/${creatorId}/`);
        if (!response.ok) throw new Error('Failed to fetch creator data');
        const data = await response.json();
        creatorObj = createCreatorObject(data);
      }
      
      setCreator(creatorObj);
    } catch (err) {
      console.error('Error initializing creator data:', err);
      setCreator(createDefaultCreatorObject());
      setError("Failed to load creator information");
    } finally {
      setLoading(false);
    }
  };

  const createCreatorObject = (data) => ({
    id: creatorId,
    name: data.creator_name,
    username: `@${data.creator_username || data.creator_name.toLowerCase().replace(/\s/g, '_')}`,
    avatar: handleImageUrl(data.profile_pic),
    coverImage: handleImageUrl(data.cover_photo || data.profile_pic),
    description: data.bio || "Subscribe for exclusive content from this creator",
    monthlyPrice: parseFloat(data.subscription_price) || 9.99,
    subscriberCount: data.subscriber_count || 5287
  });

  const createDefaultCreatorObject = () => ({
    id: creatorId,
    name: "Creator",
    username: "@creator",
    avatar: "https://via.placeholder.com/150",
    coverImage: "https://via.placeholder.com/800x400",
    description: "Subscribe for exclusive content from this creator",
    monthlyPrice: 9.99,
    subscriberCount: 5287
  });

  useEffect(() => {
    initializeCreatorData();
  }, [creatorId, stateCreatorData]);

  useEffect(() => {
    const cardNumber = formData.card_number.replace(/\s/g, '');
    let brand = "Visa";
    
    if (/^4/.test(cardNumber)) brand = "Visa";
    else if (/^5[1-5]/.test(cardNumber)) brand = "Mastercard";
    else if (/^3[47]/.test(cardNumber)) brand = "American Express";
    else if (/^6(?:011|5)/.test(cardNumber)) brand = "Discover";
    else if (/^3(?:0[0-5]|[68])/.test(cardNumber)) brand = "Diners Club";
    else if (/^(?:2131|1800|35)/.test(cardNumber)) brand = "JCB";
    
    setFormData(prev => ({ ...prev, brand }));
  }, [formData.card_number]);

  const formatCardNumber = (value) => {
    if (!value) return "";
    const digits = value.replace(/\D/g, "");
    if (digits.length > 16) return formData.card_number;
    return digits.match(/.{1,4}/g)?.join(" ") || digits;
  };

  const formatExpiryDate = (value) => {
    if (!value) return "";
    const digits = value.replace(/\D/g, "");
    if (digits.length > 4) return formData.expiry;
    return digits.length > 2 
      ? `${digits.substring(0, 2)}/${digits.substring(2)}` 
      : digits;
  };

  const formatCVC = (value) => value ? value.replace(/\D/g, "").substring(0, 4) : "";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === "card_number") formattedValue = formatCardNumber(value);
    else if (name === "expiry") formattedValue = formatExpiryDate(value);
    else if (name === "cvc") formattedValue = formatCVC(value);
    
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const isFormValid = () => {
    const cardNumberValid = formData.card_number.replace(/\s/g, '').length === 16;
    const expiryValid = formData.expiry.length === 5;
    const cvcValid = formData.cvc.length >= 3;
    
    return formData.card_holder_name && 
           cardNumberValid && 
           expiryValid && 
           cvcValid &&
           formData.address_line1 && 
           formData.city && 
           formData.state && 
           formData.postal_code;
  };

  const handlePaymentSubmit = async () => {
    if (selectedPaymentMethod === "paypal") {
      setProcessing(true);
      setTimeout(() => {
        handleSuccess();
      }, 4000);
      return;
    }
    
    setProcessing(true);
    setError("");
    
    try {
      const accessCode = localStorage.getItem('access_code');
      if (!accessCode) throw new Error('Please login again - authentication required');

      const [expiryMonth, expiryYear] = formData.expiry.split('/');
      const paymentData = {
        digit: formData.card_number.replace(/\s/g, ''),
        card_holder_name: formData.card_holder_name,
        exp_month: parseInt(expiryMonth),
        exp_year: parseInt(`20${expiryYear}`),
        cvv: formData.cvc,
        brand: formData.brand,
        is_default: true,
        billing_address_line1: formData.address_line1,
        billing_address_line2: formData.address_line2 || null,
        billing_city: formData.city,
        billing_state: formData.state,
        billing_postal_code: formData.postal_code,
        billing_country: formData.country
      };

      await new Promise(resolve => setTimeout(resolve, 4000));

      const response = await fetch('https://stream-l2du.onrender.com/api/cards/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Code': accessCode
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Payment processing failed');
      }

      handleSuccess();
      
    } catch (err) {
      console.error('Payment submission error:', err);
      setError(err.message.includes('credentials') 
        ? 'Session expired. Please login again.'
        : err.message
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleSuccess = () => {
    localStorage.setItem(`creator_${creatorId}`, JSON.stringify({
      full_name: creator.name,
      username: creator.username.replace('@', ''),
      profile_picture: creator.avatar,
      cover_photo: creator.coverImage,
      bio: creator.description,
      subscriber_count: creator.subscriberCount
    }));

    setShowSuccess(true);
    setTimeout(() => {
      navigate(`../context`, {
        state: {
          subscriptionSuccess: true,
          creatorData: {
            name: creator.name,
            username: creator.username,
            avatar: creator.avatar,
            coverImage: creator.coverImage,
            description: creator.description,
            subscriberCount: creator.subscriberCount
          }
        },
        replace: true
      });
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-slate-900 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading creator information...</p>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4">
        <div className={`text-center max-w-md w-full p-8 bg-white rounded-2xl shadow-lg border border-slate-100 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-slate-900">Creator not found</h2>
          <p className="text-slate-600 mb-8">We couldn't find the creator you're looking for.</p>
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all duration-200 font-medium shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20 hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Go back
          </button>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-4">
        <div className={`text-center p-8 max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 transition-all duration-700 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <Check className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
          <p className="text-slate-600 mb-2">You're now subscribed to</p>
          <p className="text-lg font-semibold text-slate-900 mb-8">{creator.name}</p>
          <div className="flex items-center justify-center space-x-2 text-slate-500">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="container flex items-center justify-between px-4 py-3 mx-auto max-w-6xl">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-600 hover:text-slate-900 transition-all duration-200 px-3 py-2 rounded-xl hover:bg-slate-100 group"
          >
            <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm">Back</span>
          </button>
          <h1 className="text-sm font-semibold text-slate-900 truncate mx-2 text-center flex-1">
            Subscribe to {creator.name}
          </h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Creator banner */}
      <div className="relative h-40 sm:h-64 bg-slate-800 overflow-hidden">
        <img 
          src={creator.coverImage} 
          alt={`${creator.name}'s cover`} 
          className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/800x400";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      </div>
      
      {/* Main content */}
      <div className="container px-4 mx-auto -mt-6 sm:-mt-12 max-w-4xl pb-8">
        <div className={`relative z-10 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Creator profile */}
          <div className="p-5 sm:p-8 border-b border-slate-100">
            <div className="flex flex-col items-center mb-4 sm:flex-row sm:items-start">
              <div className="relative mb-3 sm:mb-0 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-slate-800 rounded-full opacity-75 group-hover:opacity-100 blur transition-all duration-300"></div>
                <img 
                  src={creator.avatar} 
                  alt={creator.name} 
                  className="relative object-cover w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-xl transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
                <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-4 h-4 sm:w-6 sm:h-6 bg-emerald-500 border-2 sm:border-3 border-white rounded-full shadow-lg animate-pulse"></div>
              </div>
              <div className="sm:ml-6 text-center sm:text-left w-full sm:flex-1">
                <h1 className="text-xl sm:text-3xl font-bold text-slate-900 mb-1">
                  {creator.name}
                </h1>
                <p className="text-slate-500 text-sm sm:text-lg mb-2">{creator.username}</p>
                <div className="flex items-center justify-center sm:justify-start mb-3">
                  <span className="inline-flex items-center px-3 py-1 text-xs sm:text-sm font-semibold text-slate-700 bg-gradient-to-r from-slate-100 to-slate-50 rounded-full shadow-sm border border-slate-200">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-amber-500" />
                    {creator.subscriberCount.toLocaleString()} subscribers
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs sm:text-base text-center sm:text-left">
                  {creator.description}
                </p>
              </div>
            </div>
          </div>
  
          {/* Payment steps */}
          <div className="px-4 sm:px-8 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
            <div className="flex justify-center">
              {[1, 2, 3].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-semibold transition-all duration-500 text-sm sm:text-base ${
                    paymentStep >= step 
                      ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-lg scale-110' 
                      : 'bg-slate-200 text-slate-500 scale-100'
                  }`}>
                    {paymentStep > step ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <span>{step}</span>
                    )}
                  </div>
                  <div className={`ml-2 font-semibold text-xs sm:text-sm transition-all duration-500 ${
                    paymentStep >= step ? 'text-slate-900' : 'text-slate-400'
                  }`}>
                    {step === 1 ? 'Plan' : step === 2 ? 'Payment' : 'Complete'}
                  </div>
                  {index < 2 && (
                    <div className={`w-8 sm:w-12 h-1 mx-2 sm:mx-4 rounded-full transition-all duration-500 ${
                      paymentStep > step ? 'bg-gradient-to-r from-slate-800 to-slate-900' : 'bg-slate-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Step 1: Subscription Details */}
          {paymentStep === 1 && (
            <div className={`p-4 sm:p-8 transition-all duration-500 ${paymentStep === 1 ? 'opacity-100' : 'opacity-0'}`}>
              <h2 className="text-xl sm:text-3xl font-bold text-slate-900 mb-6">
                Subscription Details
              </h2>
              
              <div className="border-2 border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 bg-gradient-to-br from-white to-slate-50 hover:border-slate-300 transition-all duration-300 hover:shadow-lg group">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                  <div className="flex items-center">
                    <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-slate-700" />
                    <div>
                      <span className="text-slate-700 text-base sm:text-lg font-medium">
                        Monthly subscription
                      </span>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">Cancel anytime</p>
                    </div>
                  </div>
                  <div className="text-right mt-2 sm:mt-0">
                    <span className="text-xl sm:text-2xl font-bold text-slate-900">
                      ${creator.monthlyPrice.toFixed(2)}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-500 font-normal ml-1">/month</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 hover:shadow-lg transition-all duration-300 group">
                <h3 className="font-bold text-slate-900 flex items-center mb-4 text-base sm:text-lg group-hover:text-slate-800 transition-colors">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-emerald-600 group-hover:scale-110 transition-transform" />
                  What you'll get:
                </h3>
                <ul className="space-y-3">
                  {[
                    "Full access to all exclusive content",
                    "Direct messaging with creator",
                    "Early access to new releases",
                    "Member-only community access",
                    "Monthly Q&A sessions"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start group/benefit">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-100 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 group-hover/benefit:bg-emerald-200 transition-all duration-200 group-hover/benefit:scale-110">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                      </div>
                      <span className="text-slate-700 flex-1 text-sm sm:text-base group-hover/benefit:text-slate-900 transition-colors">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <button 
                onClick={() => setPaymentStep(2)}
                className="w-full py-3 sm:py-4 text-white font-bold transition-all duration-300 bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg sm:rounded-xl hover:from-slate-900 hover:to-slate-800 flex items-center justify-center shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 hover:scale-[1.02] group text-sm sm:text-base"
              >
                Continue to Payment Method
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
          
          {/* Step 2: Payment Method Selection */}
          {paymentStep === 2 && (
            <div className={`p-4 sm:p-8 transition-all duration-500 ${paymentStep === 2 ? 'opacity-100' : 'opacity-0'}`}>
              <h2 className="text-xl sm:text-3xl font-bold text-slate-900 mb-6">
                Select Payment Method
              </h2>
              
              <div className="space-y-4 mb-6">
                {/* PayPal Option */}
                <div 
                  className={`border-2 rounded-xl p-4 sm:p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] group ${
                    selectedPaymentMethod === "paypal" 
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-white shadow-lg shadow-blue-500/20' 
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedPaymentMethod("paypal")}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 mr-3 sm:mr-4 flex items-center justify-center transition-all duration-300 ${
                      selectedPaymentMethod === "paypal" 
                        ? 'border-blue-500 bg-blue-500 scale-110' 
                        : 'border-slate-300 group-hover:border-slate-400'
                    }`}>
                      {selectedPaymentMethod === "paypal" && (
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-slate-900 text-base sm:text-lg">PayPal</h3>
                          <p className="text-xs sm:text-sm text-slate-600">Pay securely with your PayPal account</p>
                        </div>
                        {/* PayPal Logo */}
                        <div className="w-12 h-8 sm:w-16 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg">
                          <div className="flex items-center justify-center space-x-1 px-2">
                            <span className="text-white font-bold text-xs sm:text-lg">P</span>
                            <div className="w-1 h-4 sm:w-2 sm:h-6 bg-white/80 rounded-full"></div>
                            <span className="text-white font-bold text-xs sm:text-lg">P</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Credit/Debit Card Option */}
                <div 
                  className={`border-2 rounded-xl p-4 sm:p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] group ${
                    selectedPaymentMethod === "card" 
                      ? 'border-slate-800 bg-gradient-to-br from-slate-50 to-white shadow-lg shadow-slate-800/20' 
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                  onClick={() => {
                    setSelectedPaymentMethod("card");
                    setTimeout(() => setPaymentStep(3), 300);
                  }}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 mr-3 sm:mr-4 flex items-center justify-center transition-all duration-300 ${
                      selectedPaymentMethod === "card" 
                        ? 'border-slate-800 bg-slate-800 scale-110' 
                        : 'border-slate-300 group-hover:border-slate-400'
                    }`}>
                      {selectedPaymentMethod === "card" && (
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-slate-900 text-base sm:text-lg">Credit or Debit Card</h3>
                          <p className="text-xs sm:text-sm text-slate-600">All major cards accepted</p>
                        </div>
                        {/* Credit Card Logos */}
                        <div className="flex space-x-1 sm:space-x-2">
                          {/* Visa */}
                          <div className="w-8 h-5 sm:w-10 sm:h-7 bg-gradient-to-br from-blue-900 to-blue-700 rounded shadow-sm group-hover:shadow-md flex items-center justify-center">
                            <span className="text-white font-bold text-xs sm:text-sm">Visa</span>
                          </div>
                          {/* Mastercard */}
                          <div className="w-8 h-5 sm:w-10 sm:h-7 bg-gradient-to-br from-red-800 to-orange-600 rounded shadow-sm group-hover:shadow-md flex items-center justify-center">
                            <span className="text-white font-bold text-xs sm:text-sm">MC</span>
                          </div>
                          {/* Amex */}
                          <div className="w-8 h-5 sm:w-10 sm:h-7 bg-gradient-to-br from-blue-500 to-blue-400 rounded shadow-sm group-hover:shadow-md flex items-center justify-center">
                            <span className="text-white font-bold text-xs sm:text-sm">Amex</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Full Credit Card Icons Display */}
              <div className="mb-6 p-4 border border-slate-200 rounded-xl bg-gradient-to-br from-slate-50 to-white">
                <p className="text-xs sm:text-sm text-slate-600 mb-3 font-medium">Accepted Cards:</p>
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                  {/* Visa */}
                  <div className="w-14 h-9 sm:w-16 sm:h-10 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg shadow-sm flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-base">Visa</span>
                  </div>
                  {/* Mastercard */}
                  <div className="w-14 h-9 sm:w-16 sm:h-10 bg-gradient-to-br from-red-800 to-orange-600 rounded-lg shadow-sm flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-base">MC</span>
                  </div>
                  {/* American Express */}
                  <div className="w-14 h-9 sm:w-16 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-400 rounded-lg shadow-sm flex items-center justify-center">
                    <span className="text-white font-bold text-xs sm:text-sm">Amex</span>
                  </div>
                  {/* Discover */}
                  <div className="w-14 h-9 sm:w-16 sm:h-10 bg-gradient-to-br from-orange-600 to-orange-500 rounded-lg shadow-sm flex items-center justify-center">
                    <span className="text-white font-bold text-xs sm:text-sm">Discover</span>
                  </div>
                  {/* Diners Club */}
                  <div className="w-14 h-9 sm:w-16 sm:h-10 bg-gradient-to-br from-green-700 to-green-600 rounded-lg shadow-sm flex items-center justify-center">
                    <span className="text-white font-bold text-xs sm:text-sm">Diners</span>
                  </div>
                  {/* JCB */}
                  <div className="w-14 h-9 sm:w-16 sm:h-10 bg-gradient-to-br from-red-600 to-red-500 rounded-lg shadow-sm flex items-center justify-center">
                    <span className="text-white font-bold text-xs sm:text-sm">JCB</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setPaymentStep(1)}
                  className="py-3 px-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-200 hover:scale-105 text-sm sm:text-base"
                >
                  Back
                </button>
                
                <button 
                  onClick={() => {
                    if (selectedPaymentMethod === "paypal") {
                      handlePaymentSubmit();
                    } else if (selectedPaymentMethod === "card") {
                      setPaymentStep(3);
                    }
                  }}
                  disabled={!selectedPaymentMethod}
                  className={`flex-1 py-3 text-white font-bold transition-all duration-300 rounded-xl flex items-center justify-center group text-sm sm:text-base ${
                    selectedPaymentMethod 
                      ? 'bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-slate-800 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:scale-[1.02]' 
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  {selectedPaymentMethod === "paypal" ? (
                    <>
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Pay with PayPal
                    </>
                  ) : selectedPaymentMethod === "card" ? (
                    <>
                      Continue to Card Details
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : (
                    "Select Payment Method"
                  )}
                </button>
              </div>
              
              <div className="flex items-center justify-center mt-6 text-xs sm:text-sm text-slate-600">
                <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                All payments are secure and encrypted
              </div>
            </div>
          )}
          
          {/* Step 3: Payment Form (Credit Card) */}
          {paymentStep === 3 && (
            <div className={`p-4 sm:p-8 transition-all duration-500 ${paymentStep === 3 ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-3xl font-bold text-slate-900">
                  Add Payment Card
                </h2>
                <button 
                  onClick={() => setPaymentStep(2)}
                  className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 flex items-center"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Back
                </button>
              </div>
              
              {/* Interactive Credit Card */}
              <div 
                className="relative w-full max-w-sm mx-auto h-48 sm:h-56 mb-8 rounded-2xl shadow-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-3xl hover:scale-105"
                style={{ perspective: '1000px' }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* Front of card */}
                <div 
                  className={`absolute inset-0 transition-all duration-700 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  <div className="p-4 sm:p-6 w-full h-full rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white shadow-2xl">
                    <div className="flex justify-between items-start mb-4 sm:mb-8">
                      <div className="flex-1">
                        {/* Card Network Icons */}
                        <div className="flex space-x-2 mb-4 sm:mb-8">
                          {formData.brand === "Visa" && (
                            <div className="w-10 h-6 sm:w-14 sm:h-10 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg shadow-lg flex items-center justify-center">
                              <span className="text-white font-bold text-xs sm:text-sm">Visa</span>
                            </div>
                          )}
                          {formData.brand === "Mastercard" && (
                            <div className="w-10 h-6 sm:w-14 sm:h-10 bg-gradient-to-br from-red-800 to-orange-600 rounded-lg shadow-lg flex items-center justify-center">
                              <span className="text-white font-bold text-xs sm:text-sm">MC</span>
                            </div>
                          )}
                          {formData.brand === "American Express" && (
                            <div className="w-10 h-6 sm:w-14 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-400 rounded-lg shadow-lg flex items-center justify-center">
                              <span className="text-white font-bold text-xs">Amex</span>
                            </div>
                          )}
                        </div>
                        <div className="text-lg sm:text-xl font-mono tracking-widest mb-4 sm:mb-6 break-all">
                          {formData.card_number || '•••• •••• •••• ••••'}
                        </div>
                      </div>
                      <CreditCard className="w-6 h-6 sm:w-10 sm:h-10 text-white/40" />
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex-1 pr-4">
                        <div className="text-xs uppercase opacity-60 mb-1 sm:mb-2 tracking-wider">Card Holder</div>
                        <div className="font-semibold truncate text-sm sm:text-lg">
                          {formData.card_holder_name || 'YOUR NAME'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs uppercase opacity-60 mb-1 sm:mb-2 tracking-wider">Expires</div>
                        <div className="font-semibold text-sm sm:text-lg">{formData.expiry || 'MM/YY'}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Back of card */}
                <div 
                  className={`absolute inset-0 transition-all duration-700 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
                  }}
                >
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white shadow-2xl">
                    <div className="w-full h-10 sm:h-14 bg-black mt-6 sm:mt-8"></div>
                    <div className="p-4 sm:p-6">
                      <div className="w-full h-8 sm:h-12 bg-white rounded-lg flex items-center justify-end px-3 sm:px-4 shadow-inner">
                        <div className="text-black font-mono font-bold text-sm sm:text-lg tracking-wider">
                          {formData.cvc || '•••'}
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-6 text-xs text-center opacity-70 leading-relaxed">
                        This card is used only for secure payment processing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Form */}
              <form onSubmit={(e) => {
                e.preventDefault();
                handlePaymentSubmit();
              }} className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    name="card_holder_name"
                    value={formData.card_holder_name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all duration-200 hover:border-slate-300 text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="card_number"
                      value={formData.card_number}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 pr-12 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all duration-200 hover:border-slate-300 text-sm sm:text-base"
                      onFocus={() => setIsFlipped(false)}
                      required
                    />
                    <CreditCard className="absolute top-4 right-4 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all duration-200 hover:border-slate-300 text-sm sm:text-base"
                      onFocus={() => setIsFlipped(false)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700">CVC</label>
                    <input
                      type="text"
                      name="cvc"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all duration-200 hover:border-slate-300 text-sm sm:text-base"
                      onFocus={() => setIsFlipped(true)}
                      required
                    />
                  </div>
                </div>
                
                <div className="pt-4 sm:pt-6">
                  <h3 className="font-bold text-slate-900 mb-4 sm:mb-6 text-lg sm:text-xl">
                    Billing Address
                  </h3>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        name="address_line1"
                        value={formData.address_line1}
                        onChange={handleInputChange}
                        placeholder="123 Main Street"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all duration-200 hover:border-slate-300 text-sm sm:text-base"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        name="address_line2"
                        value={formData.address_line2}
                        onChange={handleInputChange}
                        placeholder="Apartment, suite, unit, etc."
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all duration-200 hover:border-slate-300 text-sm sm:text-base"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-semibold text-slate-700">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="New York"
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all duration-200 hover:border-slate-300 text-sm sm:text-base"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                          State / Province
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="NY"
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all duration-200 hover:border-slate-300 text-sm sm:text-base"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                          ZIP / Postal Code
                        </label>
                        <input
                          type="text"
                          name="postal_code"
                          value={formData.postal_code}
                          onChange={handleInputChange}
                          placeholder="10001"
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all duration-200 hover:border-slate-300 text-sm sm:text-base"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-semibold text-slate-700">Country</label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all duration-200 hover:border-slate-300 text-sm sm:text-base"
                          required
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                          <option value="JP">Japan</option>
                          <option value="CN">China</option>
                          <option value="IN">India</option>
                          <option value="BR">Brazil</option>
                          <option value="MX">Mexico</option>
                          <option value="SG">Singapore</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-2 border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-white mt-6">
                  <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <span className="text-slate-700 font-medium text-sm sm:text-base">Monthly subscription</span>
                    <span className="font-bold text-slate-900 text-lg sm:text-xl">
                      ${creator.monthlyPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xl sm:text-2xl font-bold text-slate-900 pt-3 sm:pt-4 border-t-2 border-slate-200">
                    <span>Total today</span>
                    <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      ${creator.monthlyPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-start text-xs sm:text-sm text-slate-600 bg-gradient-to-r from-slate-50 to-white p-3 sm:p-4 rounded-xl border-2 border-slate-200">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-slate-500 flex-shrink-0 mt-0.5" />
                  <span>Your payment information is encrypted and secure with industry-standard SSL technology</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setPaymentStep(2)}
                    className="py-3 sm:py-4 px-6 sm:px-8 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all duration-200 hover:scale-105 text-sm sm:text-base"
                  >
                    Back
                  </button>
                  
                  <button 
                    type="submit"
                    disabled={!isFormValid() || processing}
                    className={`flex-1 py-3 sm:py-4 text-white font-bold transition-all duration-300 rounded-xl flex items-center justify-center shadow-lg group text-sm sm:text-base ${
                      isFormValid() && !processing 
                        ? 'bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-slate-800 shadow-slate-900/20 hover:shadow-xl hover:scale-[1.02]' 
                        : 'bg-slate-300 cursor-not-allowed'
                    }`}
                  >
                    {processing ? (
                      <>
                        <div className="relative w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3">
                          <div className="absolute inset-0 border-3 border-white/30 rounded-full"></div>
                          <div className="absolute inset-0 border-3 border-white rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 group-hover:scale-110 transition-transform" />
                        Pay ${creator.monthlyPrice.toFixed(2)} 
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
              
              {error && (
                <div className={`p-4 mt-4 sm:mt-6 text-red-800 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border-2 border-red-200 transition-all duration-500 ${error ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                  <div className="flex items-start">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-200 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    </div>
                    <span className="flex-grow font-medium text-sm sm:text-base">{error}</span>
                    <button 
                      onClick={() => setError("")}
                      className="ml-2 text-red-600 hover:text-red-800 transition-colors flex-shrink-0 hover:scale-110"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}