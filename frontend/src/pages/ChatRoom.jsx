// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { ArrowLeft, Send, X, MessageSquare, MapPin, Phone, ChevronDown, User } from 'lucide-react';

// export default function ChatRoom({ darkMode = false, onClose }) {
//   const [room, setRoom] = useState('Farming');
//   const [inputMessage, setInputMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [resources, setResources] = useState([]);
//   const [location, setLocation] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isVisible, setIsVisible] = useState(true);
//   const [locationError, setLocationError] = useState(null);
//   const messagesEndRef = useRef(null);

//   // Initial bot message
//   useEffect(() => {
//     setMessages([{
//       sender: 'bot',
//       text: `Hello! I'm your ${room} assistant. How can I help you today?`,
//       timestamp: new Date()
//     }]);
//   }, [room]);

//   // Get user location
//   useEffect(() => {
//     const getLocation = async () => {
//       try {
//         if (navigator.geolocation) {
//           const position = await new Promise((resolve, reject) => {
//             navigator.geolocation.getCurrentPosition(resolve, reject, {
//               enableHighAccuracy: true,
//               timeout: 10000,
//               maximumAge: 0
//             });
//           });
//           setLocation({
//             lat: position.coords.latitude,
//             lon: position.coords.longitude,
//             accuracy: position.coords.accuracy
//           });
//         } else {
//           setLocationError('Geolocation is not supported by your browser');
//         }
//       } catch (err) {
//         console.error('Location error:', err);
//         setLocationError('Please enable location services for accurate nearby results');
//       }
//     };

//     getLocation();
//   }, []);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, resources]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!inputMessage.trim()) return;

//     // Add user message
//     const userMessage = {
//       sender: 'user',
//       text: inputMessage,
//       timestamp: new Date()
//     };
//     setMessages(prev => [...prev, userMessage]);
//     setInputMessage('');
//     setLoading(true);
//     setResources([]);

//     try {
//       const res = await axios.post('http://localhost:8000/api/chat/', {
//         room,
//         question: inputMessage,
//         location: location ? { lat: location.lat, lon: location.lon } : null
//       });

//       // Add bot response
//       const botMessage = {
//         sender: 'bot',
//         text: res.data.answer,
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, botMessage]);
//       setResources(res.data.resources || []);
      
//     } catch (err) {
//       console.error(err);
//       const errorMessage = {
//         sender: 'bot',
//         text: 'Sorry, I encountered an error. Please try again later.',
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setIsVisible(false);
//     setTimeout(() => {
//       onClose?.();
//     }, 300);
//   };

//   const formatTime = (date) => {
//     return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const containerClasses = `fixed inset-0 z-50 ${
//     darkMode ? 'bg-gray-900' : 'bg-gray-50'
//   } transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`;

//   return (
//     <div className={containerClasses}>
//       <div
//         className={`${
//           darkMode ? 'bg-gray-800' : 'bg-white'
//         } shadow-lg rounded-lg mx-auto my-4 max-w-3xl overflow-hidden flex flex-col h-[calc(100vh-32px)]`}
//       >
//         {/* Header */}
//         <div
//           className={`${
//             darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
//           } px-6 py-4 flex items-center justify-between`}
//         >
//           <div className="flex items-center">
//             <button
//               onClick={handleClose}
//               className="mr-3 hover:bg-blue-700 p-2 rounded-full transition"
//               aria-label="Back"
//             >
//               <ArrowLeft size={18} />
//             </button>
//             <div>
//               <h2 className="font-semibold tracking-tight">Kenya Community Assistant</h2>
//               <div className="flex items-center mt-1">
//                 <MessageSquare size={14} className="mr-1 text-blue-300" />
//                 <p className="text-xs text-blue-200">{room} Support</p>
//               </div>
//             </div>
//           </div>
//           <button
//             onClick={handleClose}
//             className="hover:bg-blue-700 p-2 rounded-full transition"
//             aria-label="Close"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Chat Content */}
//         <div
//           className={`flex-1 overflow-y-auto overflow-x-hidden p-4 ${
//             darkMode ? 'bg-gray-900' : 'bg-gray-50'
//           }`}
//         >
//           {/* Room Selector - Only show at start */}
//           {messages.length <= 1 && (
//             <div className="mb-6">
//               <div className="flex items-center justify-between mb-2">
//                 <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                   Select Assistance Category
//                 </label>
//                 <ChevronDown size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
//               </div>
//               <select
//                 className={`w-full p-3 rounded-xl border ${
//                   darkMode
//                     ? 'bg-gray-800 border-gray-700 text-white'
//                     : 'bg-white border-gray-200 text-gray-800'
//                 } appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
//                 value={room}
//                 onChange={(e) => setRoom(e.target.value)}
//               >
//                 <option value="Farming">Farming</option>
//                 <option value="Health">Health</option>
//                 <option value="Education">Education</option>
//               </select>
//             </div>
//           )}

//           {/* Location Status */}
//           {locationError && (
//             <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
//               {locationError}
//             </div>
//           )}

//           {/* Chat Messages */}
//           <div className="space-y-4">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//               >
//                 {msg.sender === 'bot' && (
//                   <div
//                     className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
//                       darkMode ? 'bg-blue-600' : 'bg-blue-100'
//                     }`}
//                   >
//                     <MessageSquare
//                       size={16}
//                       className={darkMode ? 'text-white' : 'text-blue-600'}
//                     />
//                   </div>
//                 )}
//                 <div
//                   className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-3 rounded-2xl ${
//                     msg.sender === 'user'
//                       ? `${darkMode ? 'bg-blue-600' : 'bg-blue-600'} text-white`
//                       : darkMode
//                       ? 'bg-gray-800 text-gray-200'
//                       : 'bg-white text-gray-800 shadow-sm'
//                   }`}
//                 >
//                   <p>{msg.text}</p>
//                   <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-200' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                     {formatTime(msg.timestamp)}
//                   </p>
//                 </div>
//                 {msg.sender === 'user' && (
//                   <div
//                     className={`w-8 h-8 rounded-full flex items-center justify-center ml-3 ${
//                       darkMode ? 'bg-gray-700' : 'bg-gray-200'
//                     }`}
//                   >
//                     <User size={16} className={darkMode ? 'text-white' : 'text-gray-600'} />
//                   </div>
//                 )}
//               </div>
//             ))}

//             {/* Loading Indicator */}
//             {loading && (
//               <div className="flex justify-start">
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
//                     darkMode ? 'bg-blue-600' : 'bg-blue-100'
//                   }`}
//                 >
//                   <MessageSquare
//                     size={16}
//                     className={darkMode ? 'text-white' : 'text-blue-600'}
//                   />
//                 </div>
//                 <div
//                   className={`px-4 py-3 rounded-2xl ${
//                     darkMode
//                       ? 'bg-gray-800 text-gray-200'
//                       : 'bg-white text-gray-800 shadow-sm'
//                   }`}
//                 >
//                   <div className="flex space-x-2">
//                     <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
//                     <div
//                       className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
//                       style={{ animationDelay: '0.2s' }}
//                     ></div>
//                     <div
//                       className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
//                       style={{ animationDelay: '0.4s' }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Resources */}
//             {resources.length > 0 && (
//               <div className="flex justify-start">
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
//                     darkMode ? 'bg-blue-600' : 'bg-blue-100'
//                   }`}
//                 >
//                   <MessageSquare
//                     size={16}
//                     className={darkMode ? 'text-white' : 'text-blue-600'}
//                   />
//                 </div>
//                 <div
//                   className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-3 rounded-2xl ${
//                     darkMode
//                       ? 'bg-gray-800 text-gray-200'
//                       : 'bg-white text-gray-800 shadow-sm'
//                   }`}
//                 >
//                   <div className="flex items-center mb-2">
//                     <MapPin size={16} className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
//                     <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                       Nearby Resources
//                     </h3>
//                   </div>
//                   <div className="space-y-3">
//                     {resources.map((r, idx) => (
//                       <div
//                         key={idx}
//                         className={`p-3 rounded-lg ${
//                           darkMode ? 'bg-gray-700' : 'bg-gray-100'
//                         }`}
//                       >
//                         <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                           {r.name} ({r.distance_km} km)
//                         </p>
//                         <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                           {r.address}
//                         </p>
//                         {r.phone && (
//                           <div className="flex items-center mt-1">
//                             <Phone size={14} className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
//                             <a 
//                               href={`tel:${r.phone}`} 
//                               className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
//                             >
//                               {r.phone}
//                             </a>
//                           </div>
//                         )}
//                         <a 
//                           href={`https://www.google.com/maps/dir/?api=1&destination=${r.latitude},${r.longitude}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className={`mt-2 inline-flex items-center text-xs ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
//                         >
//                           <MapPin size={12} className="mr-1" />
//                           Get Directions
//                         </a>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input Area */}
//         <div
//           className={`p-4 ${
//             darkMode
//               ? 'bg-gray-800 border-t border-gray-700'
//               : 'bg-white border-t border-gray-100'
//           } shadow-lg`}
//         >
//           <form onSubmit={handleSubmit} className="flex items-center bg-opacity-50 rounded-full overflow-hidden shadow-sm">
//             <input
//               type="text"
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               placeholder={`Ask about ${room}...`}
//               className={`flex-1 ${
//                 darkMode
//                   ? 'bg-gray-700 text-gray-200 placeholder-gray-400'
//                   : 'bg-gray-100 text-gray-800 placeholder-gray-500'
//               } px-6 py-4 focus:outline-none rounded-l-full`}
//               disabled={loading}
//             />
//             <button
//               type="submit"
//               disabled={loading || !inputMessage.trim()}
//               className={`${
//                 darkMode ? 'bg-blue-600' : 'bg-blue-600'
//               } text-white px-6 py-4 hover:bg-blue-700 transition flex items-center justify-center ${
//                 loading ? 'opacity-70 cursor-not-allowed' : ''
//               }`}
//             >
//               <Send size={18} className={loading ? 'animate-pulse' : ''} />
//             </button>
//           </form>
//           <div className={`text-xs text-center mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
//             {location
//               ? `✓ Using your location (accuracy: ${Math.round(location.accuracy)}m)`
//               : locationError || 'Enable location for nearby results'}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { ArrowLeft, Send, X, MessageSquare, MapPin, Phone, ChevronDown, User, Store, Navigation, LocateFixed } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom styles for the chatroom and map
const styles = `
  .pulse-icon {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .pulse-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
    transform: scale(1);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
  }
  .modern-map {
    border-radius: 0.75rem;
  }
  .modern-popup {
    border-radius: 0.5rem;
    padding: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  .leaflet-popup-content-wrapper {
    border-radius: 8px !important;
  }
  .leaflet-popup-content {
    margin: 10px 12px;
    line-height: 1.4;
  }
  .map-legend {
    position: absolute;
    bottom: 25px;
    right: 10px;
    z-index: 1000;
    background: white;
    padding: 8px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  .legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    font-size: 12px;
  }
  .legend-color {
    width: 12px;
    height: 12px;
    margin-right: 5px;
    border-radius: 50%;
  }
`;

// Cache for location and resources
const locationCache = {
  coords: null,
  timestamp: null,
  resources: null,
  CACHE_EXPIRY: 5 * 60 * 1000 // 5 minutes
};

// Helper to check cache validity
const isCacheValid = () => {
  if (!locationCache.timestamp) return false;
  return (Date.now() - locationCache.timestamp) < locationCache.CACHE_EXPIRY;
};

// Format distance
const formatDistance = (km) => {
  if (!km) return 'N/A';
  return km < 1
    ? `${Math.round(km * 1000)} meters`
    : `${km.toFixed(1)} km`;
};

// Custom SVG icon for shops
const createSvgIcon = () => {
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#d97706" width="30" height="30">
      <circle cx="12" cy="12" r="12" fill="white"/>
      <circle cx="12" cy="12" r="10" fill="#f59e0b"/>
      <path d="M6 9h12v8H6z" fill="white"/>
      <path d="M7 7h10l1 2H6z" fill="white"/>
    </svg>
  `;
  return L.divIcon({
    className: 'custom-div-icon',
    html: svgContent,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

// Pulse icon for user location
const createPulseIcon = () => {
  return L.divIcon({
    className: 'pulse-icon',
    iconSize: [20, 20],
    html: `<div class="pulse-dot" style="background-color: #3b82f6"></div>`
  });
};

export default function ChatRoom({ darkMode = false, onClose }) {
  const [room, setRoom] = useState('Farming');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [resources, setResources] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const messagesEndRef = useRef(null);
  const permissionDenied = useRef(false);

  // Initial bot message
  useEffect(() => {
    setMessages([{
      sender: 'bot',
      text: `Hello! I'm your ${room} assistant. How can I help you today? You can ask about ${room} or find nearby farming shops (e.g., "nearest shops").`,
      timestamp: new Date()
    }]);
  }, [room]);

  // Get user location with better error handling
  const requestLocation = useCallback(() => {
    if (permissionDenied.current) {
      setLocationError('Location access denied. Please enable permissions in your browser settings.');
      return;
    }

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    // Check cache first
    if (locationCache.coords && isCacheValid()) {
      setLocation(locationCache.coords);
      if (locationCache.resources) {
        setResources(locationCache.resources);
      }
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        setLocation(coords);
        locationCache.coords = coords;
        locationCache.timestamp = Date.now();
      },
      (err) => {
        console.error('Location error:', err);
        if (err.code === 1) {
          permissionDenied.current = true;
          setLocationError('Location access denied. Please enable permissions in your browser settings.');
        } else {
          setLocationError('Unable to determine your location. Please try again.');
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, resources, showMap]);

  // Initial location request
  useEffect(() => {
    requestLocation();

    // Permission change listener
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
        permissionStatus.onchange = () => {
          if (permissionStatus.state === 'granted') {
            permissionDenied.current = false;
            requestLocation();
          } else if (permissionStatus.state === 'denied') {
            permissionDenied.current = true;
            setLocationError('Location access denied. Please enable permissions in your browser settings.');
          }
        };
      }).catch(e => console.error('Permission query error:', e));
    }
  }, [requestLocation]);

  // Handle message submission
const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
  
    const userMessage = {
      sender: 'user',
      text: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);
    setResources([]);
    setShowMap(false);
  
    const lowerMessage = inputMessage.toLowerCase();
    const isLocationQuery = lowerMessage.includes('nearby') || lowerMessage.includes('closest') || lowerMessage.includes('shops') || lowerMessage.includes('market');
  
    try {
      console.log('Sending request to /api/chat/', {
        room,
        question: inputMessage,
        location: location ? { lat: location.lat, lon: location.lon } : null
      });
      const res = await axios.post('http://localhost:8000/api/chat/', {
        room,
        question: inputMessage,
        location: location ? { lat: location.lat, lon: location.lon } : null
      });
      console.log('Received response:', res.data);
  
      const botMessage = {
        sender: 'bot',
        text: res.data.answer,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setResources(res.data.resources || []);
      if (isLocationQuery && res.data.resources.length > 0) {
        setShowMap(true);
        locationCache.resources = res.data.resources;
        locationCache.timestamp = Date.now();
      }
    } catch (err) {
      console.error('Chat error:', err.response?.data || err.message);
      const errorMessage = {
        sender: 'bot',
        text: err.response?.data?.answer || err.response?.data?.error || 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMap = () => {
    if (!location || !showMap || !resources.length) return null;

    return (
      <div className="h-64 rounded-xl overflow-hidden border border-gray-300 shadow-md my-4">
        <MapContainer
          center={[location.lat, location.lon]}
          zoom={13}
          className="h-full w-full modern-map"
        >
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* User location */}
          <Marker position={[location.lat, location.lon]} icon={createPulseIcon()}>
            <Popup className="modern-popup">
              <div className="text-sm">
                <strong className="text-blue-600 block mb-1">Your Location</strong>
                <p>{location.lat.toFixed(6)}, {location.lon.toFixed(6)}</p>
              </div>
            </Popup>
          </Marker>
          <Circle
            center={[location.lat, location.lon]}
            radius={location.accuracy || 100}
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.1,
              weight: 1
            }}
          />
          {/* Shop markers */}
          {resources.map((resource, idx) => (
            <Marker
              key={idx}
              position={[resource.latitude, resource.longitude]}
              icon={createSvgIcon()}
            >
              <Popup className="modern-popup">
                <div className="text-sm space-y-1">
                  <strong className="text-orange-600 block">{resource.name}</strong>
                  <p>{resource.address}</p>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    <span>{formatDistance(resource.distance_km)} away</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          {/* Map legend */}
          <div className="map-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
              <span>Your Location</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
              <span>Farming Shops</span>
            </div>
          </div>
        </MapContainer>
      </div>
    );
  };

  const renderResources = () => {
    if (!resources.length) return null;

    return (
      <div className="grid grid-cols-1 gap-4">
        {resources.map((resource, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg ${darkMode ? 'bg-orange-900 border-orange-700' : 'bg-orange-50 border-orange-200'} border`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Store className="text-orange-600 w-6 h-6" />
              <h3 className={`text-lg font-medium ${darkMode ? 'text-orange-200' : 'text-orange-800'}`}>
                {resource.name}
              </h3>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {resource.address}
            </p>
            <div className="flex flex-col gap-2 text-sm mt-2">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                <span>{formatDistance(resource.distance_km)} away</span>
              </div>
              {resource.phone && resource.phone !== 'N/A' && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${resource.phone}`} className="text-blue-600 hover:underline">
                    {resource.phone}
                  </a>
                </div>
              )}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${resource.latitude},${resource.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Get Directions
              </a>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const containerClasses = `fixed inset-0 z-50 ${
    darkMode ? 'bg-gray-900' : 'bg-gray-50'
  } transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`;

  return (
    <div className={containerClasses}>
      <style>{styles}</style>
      <div
        className={`${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg rounded-lg mx-auto my-4 max-w-3xl overflow-hidden flex flex-col h-[calc(100vh-32px)]`}
      >
        {/* Header */}
        <div
          className={`${
            darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
          } px-6 py-4 flex items-center justify-between`}
        >
          <div className="flex items-center">
            <button
              onClick={handleClose}
              className="mr-3 hover:bg-blue-700 p-2 rounded-full transition"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="font-semibold tracking-tight">Kenya Community Assistant</h2>
              <div className="flex items-center mt-1">
                <MessageSquare size={14} className="mr-1 text-blue-300" />
                <p className="text-xs text-blue-200">{room} Support</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="hover:bg-blue-700 p-2 rounded-full transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat Content */}
        <div
          className={`flex-1 overflow-y-auto overflow-x-hidden p-4 ${
            darkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}
        >
          {/* Room Selector */}
          {messages.length <= 1 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Select Assistance Category
                </label>
                <ChevronDown size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              </div>
              <select
                className={`w-full p-3 rounded-xl border ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-200 text-gray-800'
                } appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              >
                <option value="Farming">Farming</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
              </select>
            </div>
          )}

          {/* Location Status */}
          {locationError && (
            <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
              {locationError}
              {locationError.includes('denied') && (
                <button
                  onClick={requestLocation}
                  className="ml-2 text-blue-600 hover:underline"
                >
                  Retry
                </button>
              )}
            </div>
          )}

          {/* Chat Messages */}
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      darkMode ? 'bg-blue-600' : 'bg-blue-100'
                    }`}
                  >
                    <MessageSquare
                      size={16}
                      className={darkMode ? 'text-white' : 'text-blue-600'}
                    />
                  </div>
                )}
                <div
                  className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? `${darkMode ? 'bg-blue-600' : 'bg-blue-600'} text-white`
                      : darkMode
                      ? 'bg-gray-800 text-gray-200'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-200' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
                {msg.sender === 'user' && (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ml-3 ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}
                  >
                    <User size={16} className={darkMode ? 'text-white' : 'text-gray-600'} />
                  </div>
                )}
              </div>
            ))}

            {/* Resources Map and Details */}
            {renderMap()}
            {renderResources()}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    darkMode ? 'bg-blue-600' : 'bg-blue-100'
                  }`}
                >
                  <MessageSquare
                    size={16}
                    className={darkMode ? 'text-white' : 'text-blue-600'}
                  />
                </div>
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    darkMode
                      ? 'bg-gray-800 text-gray-200'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                    <div
                      className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div
          className={`p-4 ${
            darkMode
              ? 'bg-gray-800 border-t border-gray-700'
              : 'bg-white border-t border-gray-100'
          } shadow-lg`}
        >
          <form onSubmit={handleSubmit} className="flex items-center bg-opacity-50 rounded-full overflow-hidden shadow-sm">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask about ${room} or nearby shops...`}
              className={`flex-1 ${
                darkMode
                  ? 'bg-gray-700 text-gray-200 placeholder-gray-400'
                  : 'bg-gray-100 text-gray-800 placeholder-gray-500'
              } px-6 py-4 focus:outline-none rounded-l-full`}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className={`${
                darkMode ? 'bg-blue-600' : 'bg-blue-600'
              } text-white px-6 py-4 hover:bg-blue-700 transition flex items-center justify-center ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <Send size={18} className={loading ? 'animate-pulse' : ''} />
            </button>
          </form>
          <div className={`text-xs text-center mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            {location
              ? `✓ Using your location (accuracy: ${Math.round(location.accuracy)}m)`
              : locationError || 'Enable location for nearby results'}
          </div>
        </div>
      </div>
    </div>
  );
}