import { useState, useEffect } from "react";
import { Check, ArrowRight, CreditCard, Lock, Clock, AlertCircle } from "lucide-react";

// Import the image
import creatorImage from "../assest/lee.jpg";

export default function CreatorSubscriptionPage() {
  const [paymentStep, setPaymentStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  
  const creator = {
    name: "Lee",
    username: "@goth_egg",
    avatar: creatorImage, // Using the imported image here
    coverImage: creatorImage, // Using the same image for cover (you can import a different one if needed)
    description: "A model and content creator with exclusive videos behind-the-scenes. Subscribe to my page for exclusive content videos! Under 18 are not allowed",
    monthlyPrice: 9.99,
    subscriberCount: 5280
  };
  
  const [formData, setFormData] = useState({
    card_holder_name: "",
    card_number: "",
    expiry: "",
    cvc: "",
    brand: "Visa",
    // Billing address fields
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "US"
  });
  
  const handleCardFlip = (flip) => {
    setIsFlipped(flip);
  };
  
  // Format credit card number with spaces
  const formatCardNumber = (value) => {
    if (!value) return "";
    
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    
    // Don't allow more than 16 digits
    if (digits.length > 16) return formData.card_number;
    
    // Add spaces after every 4 digits
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.substring(i, i + 4));
    }
    
    return parts.join(" ");
  };
  
  // Format expiry date (MM/YY)
  const formatExpiryDate = (value) => {
    if (!value) return "";
    
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    
    // Don't allow more than 4 digits
    if (digits.length > 4) return formData.expiry;
    
    // Add slash after first 2 digits
    if (digits.length > 2) {
      return `${digits.substring(0, 2)}/${digits.substring(2)}`;
    }
    
    return digits;
  };
  
  // Format CVC (3-4 digits)
  const formatCVC = (value) => {
    if (!value) return "";
    
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    
    // Don't allow more than 4 digits (some cards have 4-digit CVC)
    return digits.substring(0, 4);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Apply formatting based on field type
    let formattedValue = value;
    
    if (name === "card_number") {
      formattedValue = formatCardNumber(value);
    } else if (name === "expiry") {
      formattedValue = formatExpiryDate(value);
    } else if (name === "cvc") {
      formattedValue = formatCVC(value);
    }
    
    setFormData({
      ...formData,
      [name]: formattedValue
    });
  };
  
  const isFormValid = () => {
    // Check payment card fields
    const cardNumberValid = formData.card_number.replace(/\s/g, '').length === 16;
    const expiryValid = formData.expiry.length === 5; // MM/YY format
    const cvcValid = formData.cvc.length >= 3;
    
    const cardValid = formData.card_holder_name && 
                      cardNumberValid && 
                      expiryValid && 
                      cvcValid;
    
    // Check required billing address fields
    const billingValid = formData.address_line1 && 
                         formData.city && 
                         formData.state && 
                         formData.postal_code;
    
    return cardValid && billingValid;
  };
  
  // Determine card type based on number
  useEffect(() => {
    const cardNumber = formData.card_number.replace(/\s/g, '');
    
    // Basic card type detection
    let brand = "Visa"; // Default
    
    if (/^4/.test(cardNumber)) {
      brand = "Visa";
    } else if (/^5[1-5]/.test(cardNumber)) {
      brand = "Mastercard";
    } else if (/^3[47]/.test(cardNumber)) {
      brand = "American Express";
    } else if (/^6(?:011|5)/.test(cardNumber)) {
      brand = "Discover";
    }
    
    setFormData(prev => ({
      ...prev,
      brand
    }));
  }, [formData.card_number]);
  
  // Handle payment submission with API integration
  const handlePaymentSubmit = async () => {
    setProcessing(true);
    setError("");
    
    try {
      // Parse the expiry date
      const [expiryMonth, expiryYear] = formData.expiry.split('/');
      
      // Prepare the payment data for the API
      const paymentData = {
        digit: formData.card_number.replace(/\s/g, ''), // match serializer's 'digit' field
        card_holder_name: formData.card_holder_name,
        exp_month: parseInt(expiryMonth),
        exp_year: parseInt(`20${expiryYear}`), // ensure it's an integer
        cvv: formData.cvc,
        brand: formData.brand || "Visa", // if you're not collecting this, set a default
        is_default: true, // or false, depending on your app's logic
      
        // Flattened billing address
        billing_address_line1: formData.address_line1,
        billing_address_line2: formData.address_line2 || "",
        billing_city: formData.city,
        billing_state: formData.state,
        billing_postal_code: formData.postal_code,
        billing_country: formData.country
      };
      
      
      // Get the authentication token from wherever you store it (localStorage, context, etc.)
      const access = localStorage.getItem('access'); // or however you store your auth token
      
      // Send the payment data to the API with authentication
      const response = await fetch('https://stream-l2du.onrender.com/api/cards/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access}` // Add this line to include authentication
        },
        body: JSON.stringify(paymentData),
      });
      
      if (!response.ok) {
        // Handle API error responses
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment processing failed');
      }
      
      const responseData = await response.json();
      
      // Handle successful payment
      setProcessing(false);
      setPaymentStep(3);
      setSuccess(true);
      
      // You might want to store the payment response data for reference
      console.log('Payment successful:', responseData);
      
    } catch (err) {
      console.error('Payment error:', err);
      setProcessing(false);
      setError(err.message || "Payment processing failed. Please try again.");
    }
  };
  // Get the next billing date
  const getNextBillingDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="w-full pb-8">
      {/* Creator banner */}
      <div className="relative h-48 bg-gray-800">
        <img 
          src={creator.coverImage} 
          alt="Cover" 
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </div>
      
      <div className="container px-4 mx-auto">
        <div className="relative z-10 max-w-3xl p-6 mx-auto -mt-16 bg-white rounded-lg shadow-lg">
          {/* Creator info */}
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
              <h1 className="text-2xl font-bold">{creator.name}</h1>
              <p className="text-gray-600">{creator.username}</p>
              <div className="flex items-center justify-center mt-2 space-x-2 md:justify-start">
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-purple-600 rounded-full">
                  {creator.subscriberCount.toLocaleString()} subscribers
                </span>
              </div>
            </div>
          </div>
          
          <p className="mb-6 text-gray-700">{creator.description}</p>
          
          {/* Payment steps */}
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              <div className={`flex items-center ${paymentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`flex items-center justify-center w-8 h-8 mr-2 rounded-full ${paymentStep >= 1 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  {paymentStep > 1 ? <Check className="w-5 h-5" /> : <span>1</span>}
                </div>
                <span className="font-medium">Subscribe</span>
              </div>
              <div className={`flex items-center ${paymentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`flex items-center justify-center w-8 h-8 mr-2 rounded-full ${paymentStep >= 2 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  {paymentStep > 2 ? <Check className="w-5 h-5" /> : <span>2</span>}
                </div>
                <span className="font-medium">Payment</span>
              </div>
              <div className={`flex items-center ${paymentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`flex items-center justify-center w-8 h-8 mr-2 rounded-full ${paymentStep >= 3 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  {paymentStep === 3 && success ? <Check className="w-5 h-5" /> : <span>3</span>}
                </div>
                <span className="font-medium">Confirmation</span>
              </div>
            </div>
          </div>
          
          {paymentStep === 1 && (
            <div className="p-6 mb-6 bg-gray-50 rounded-lg">
              <h2 className="mb-4 text-xl font-bold">Subscription Details</h2>
              <div className="flex justify-between mb-4">
                <span>Monthly subscription to {creator.name}</span>
                <span className="font-semibold">${creator.monthlyPrice.toFixed(2)}/month</span>
              </div>
              <div className="p-4 mb-4 bg-blue-50 rounded border border-blue-100">
                <h3 className="mb-2 font-semibold text-blue-800">What you'll get:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Full access to all exclusive content</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Direct messaging with creator</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Early access to new releases</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => setPaymentStep(2)}
                className="w-full py-3 mt-4 text-white transition-all duration-300 bg-blue-500 rounded-lg hover:bg-blue-600 flex items-center justify-center"
              >
                Continue to Payment <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          )}
          
          {paymentStep === 2 && (
            <div className="p-6 mb-6 bg-gray-50 rounded-lg">
              <h2 className="mb-4 text-xl font-bold">Payment Information</h2>
              
              {/* Credit Card Visual */}
              <div 
                className="relative w-full h-48 mb-6 rounded-lg shadow-lg overflow-hidden"
                style={{
                  perspective: '1000px',
                }}
              >
                <div 
                  className={`absolute inset-0 transition-all duration-500 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  <div className="p-6 w-full h-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="w-12 h-8 bg-gray-200 rounded-md mb-4 opacity-80"></div>
                        <div className="text-lg font-mono tracking-wider mb-4">
                          {formData.card_number || '•••• •••• •••• ••••'}
                        </div>
                      </div>
                      <CreditCard className="w-8 h-8 text-white opacity-80" />
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <div className="text-xs uppercase opacity-70">Card Holder</div>
                        <div className="font-medium">{formData.card_holder_name || 'Your Name'}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase opacity-70">Expires</div>
                        <div className="font-medium">{formData.expiry || 'MM/YY'}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`absolute inset-0 transition-all duration-500 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
                  }}
                >
                  <div className="p-0 w-full h-full rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 text-white">
                    <div className="w-full h-12 bg-black mt-4"></div>
                    <div className="p-6">
                      <div className="w-full h-10 bg-white rounded-md flex items-center justify-end px-4">
                        <div className="text-black font-mono">{formData.cvc || '•••'}</div>
                      </div>
                      <div className="mt-4 text-xs text-right opacity-70">
                        This card is used only for payment processing and is handled securely
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                {/* Card Information Section */}
                <h3 className="mb-4 font-semibold text-gray-700">Card Information</h3>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Card Holder Name</label>
                  <input
                    type="text"
                    name="card_holder_name"
                    value={formData.card_holder_name}
                    onChange={handleInputChange}
                    placeholder="Name on card"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="card_number"
                      value={formData.card_number}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      onFocus={() => handleCardFlip(false)}
                    />
                    <CreditCard className="absolute top-2.5 right-3 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Expiry Date</label>
                    <input
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      onFocus={() => handleCardFlip(false)}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">CVC</label>
                    <input
                      type="text"
                      name="cvc"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      onFocus={() => handleCardFlip(true)}
                    />
                  </div>
                </div>
                
                {/* Billing Address Section */}
                <div className="mt-6 mb-4">
                  <h3 className="mb-4 font-semibold text-gray-700">Billing Address</h3>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Address Line 1</label>
                    <input
                      type="text"
                      name="address_line1"
                      value={formData.address_line1}
                      onChange={handleInputChange}
                      placeholder="Street address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      name="address_line2"
                      value={formData.address_line2}
                      onChange={handleInputChange}
                      placeholder="Apartment, suite, unit, etc."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">State / Province</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">ZIP / Postal Code</label>
                      <input
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleInputChange}
                        placeholder="Postal code"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Country</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                                    
                                    <div className="p-4 mb-4 bg-gray-100 rounded border border-gray-200">
                                      <div className="flex justify-between mb-2">
                                        <span>Monthly subscription</span>
                                        <span>${creator.monthlyPrice.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between font-bold">
                                        <span>Total today</span>
                                        <span>${creator.monthlyPrice.toFixed(2)}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center mb-4 text-sm">
                                      <Lock className="w-4 h-4 mr-2 text-gray-500" />
                                      <span className="text-gray-600">Your payment information is encrypted and secure</span>
                                    </div>
                                    
                                    <button 
                                      onClick={handlePaymentSubmit}
                                      disabled={!isFormValid() || processing}
                                      className={`w-full py-3 text-white transition-all duration-300 rounded-lg flex items-center justify-center ${
                                        isFormValid() && !processing ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
                                      }`}
                                    >
                                      {processing ? (
                                        <>
                                          <Clock className="w-5 h-5 mr-2 animate-spin" />
                                          Processing...
                                        </>
                                      ) : (
                                        <>
                                          Pay ${creator.monthlyPrice.toFixed(2)} <ArrowRight className="w-5 h-5 ml-2" />
                                        </>
                                      )}
                                    </button>
                                    
                                    {error && (
                                      <div className="p-4 mt-4 text-red-700 bg-red-100 rounded-lg border border-red-200">
                                        <div className="flex items-center">
                                          <AlertCircle className="w-5 h-5 mr-2" />
                                          {error}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {paymentStep === 3 && success && (
                                <div className="p-6 mb-6 text-center bg-gray-50 rounded-lg">
                                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                                    <Check className="w-10 h-10 text-green-500" />
                                  </div>
                                  <h2 className="mb-2 text-2xl font-bold text-green-600">Payment Successful!</h2>
                                  <p className="mb-6 text-gray-600">Your subscription to {creator.name} has been activated</p>
                                  
                                  <div className="p-4 mb-6 bg-white rounded-lg border border-gray-200">
                                    <div className="flex justify-between mb-2">
                                      <span className="text-gray-600">Subscription Plan</span>
                                      <span>Monthly</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span className="text-gray-600">Amount</span>
                                      <span>${creator.monthlyPrice.toFixed(2)}/month</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span className="text-gray-600">Next billing date</span>
                                      <span>{getNextBillingDate()}</span>
                                    </div>
                                    <div className="flex justify-between mb-2 pt-2 mt-2 border-t border-gray-200">
                                      <span className="font-semibold">Payment method</span>
                                      <span>{formData.brand} •••• {formData.card_number.replace(/\s/g, '').slice(-4)}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 mt-2 border-t border-gray-200">
                                      <span className="font-semibold">Billing address</span>
                                      <span className="text-right">
                                        {formData.address_line1}<br />
                                        {formData.city}, {formData.state} {formData.postal_code}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col space-y-3">
                                    <button 
                                      className="w-full py-3 text-white transition-all duration-300 bg-blue-500 rounded-lg hover:bg-blue-600"
                                    >
                                      View Creator Content
                                    </button>
                                    <button 
                                      className="w-full py-3 transition-all duration-300 bg-gray-100 rounded-lg hover:bg-gray-200"
                                    >
                                      Manage Subscription
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }