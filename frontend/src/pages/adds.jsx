// import { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight, Star, Heart, ShoppingCart, Share2, X as XIcon } from 'lucide-react';

// const AdPopup = ({ ads, darkMode, onClose }) => {
//   const [currentAdIndex, setCurrentAdIndex] = useState(0);
//   const [liked, setLiked] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   if (!ads || ads.length === 0) return null;

//   const currentAd = ads[currentAdIndex];

//   const productImages = [
//     currentAd.img,
//     currentAd.img.replace('kjkbv680-0', 'kjkbv680-1'),
//     currentAd.img.replace('kjkbv680-0', 'kjkbv680-2')
//   ];

//   const formatPrice = (price) => {
//     return price.replace(/â¹/g, '₹').replace(/,/g, '');
//   };

//   const actualPrice = formatPrice(currentAd.actual_price);
//   const soldPrice = formatPrice(currentAd.sold_price);
//   const discount = Math.round(((actualPrice - soldPrice) / actualPrice) * 100);

//   return (
//     <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${darkMode ? 'bg-black/70' : 'bg-black/50'}`}>
//       <div className={`relative rounded-xl shadow-lg overflow-hidden w-full max-w-md ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
//         <button 
//           onClick={onClose}
//           className={`absolute top-2 right-2 p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
//         >
//           <XIcon size={20} />
//         </button>
        
//         <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 text-white">
//           <div className="flex justify-between items-center">
//             <span className="font-bold">Sponsored</span>
//             <div className="flex items-center space-x-2">
//               <button className="p-1 rounded-full hover:bg-white/10">
//                 <Share2 size={16} />
//               </button>
//               <button 
//                 className="p-1 rounded-full hover:bg-white/10"
//                 onClick={() => setLiked(!liked)}
//               >
//                 <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="p-4">
//           <div className="relative h-48 overflow-hidden rounded-lg bg-gray-100 mb-3">
//             <img
//               src={productImages[currentImageIndex]}
//               alt={currentAd.title}
//               className="w-full h-full object-contain"
//             />
//           </div>

//           <div className="flex justify-between items-start mb-2">
//             <span className={`text-sm font-medium ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{currentAd.brand}</span>
//             <div className={`flex items-center px-2 py-1 rounded ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
//               <Star size={12} className="fill-yellow-400 text-yellow-400" />
//               <span className="ml-1 text-xs font-medium">4.5</span>
//             </div>
//           </div>

//           <h3 className={`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>{currentAd.title}</h3>

//           <div className="flex items-center mb-3">
//             <span className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>₹{soldPrice}</span>
//             <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} line-through`}>₹{actualPrice}</span>
//             <span className="ml-2 text-sm font-medium text-green-600">{discount}% off</span>
//           </div>

//           <div className="flex space-x-2">
//             <button className={`flex-1 flex items-center justify-center py-2 px-3 border rounded-lg text-sm font-medium ${
//               darkMode 
//                 ? 'border-purple-500 text-purple-400 hover:bg-purple-900/30' 
//                 : 'border-purple-600 text-purple-600 hover:bg-purple-50'
//             }`}>
//               <ShoppingCart size={16} className="mr-1" />
//               Add to Cart
//             </button>
//             <button className="flex-1 py-2 px-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white text-sm font-medium hover:opacity-90">
//               Buy Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AdColumn = ({ ads, darkMode }) => {
//   const [currentAdIndex, setCurrentAdIndex] = useState(0);
//   const [liked, setLiked] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentAdIndex(prev => (prev + 1) % ads.length);
//       setCurrentImageIndex(0);
//     }, 10000); // Change ad every 10 seconds
//     return () => clearInterval(interval);
//   }, [ads.length]);

//   if (!ads || ads.length === 0) return null;

//   const currentAd = ads[currentAdIndex];

//   const productImages = [
//     currentAd.img,
//     currentAd.img.replace('kjkbv680-0', 'kjkbv680-1'),
//     currentAd.img.replace('kjkbv680-0', 'kjkbv680-2')
//   ];

//   const formatPrice = (price) => {
//     return price.replace(/â¹/g, '₹').replace(/,/g, '');
//   };

//   const actualPrice = formatPrice(currentAd.actual_price);
//   const soldPrice = formatPrice(currentAd.sold_price);
//   const discount = Math.round(((actualPrice - soldPrice) / actualPrice) * 100);

//   return (
//     <div className={`sticky top-4 h-fit rounded-xl shadow-lg overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
//       <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 text-white">
//         <div className="flex justify-between items-center">
//           <span className="font-bold text-sm">Sponsored</span>
//           <div className="flex items-center space-x-2">
//             <button 
//               className="p-1 rounded-full hover:bg-white/10"
//               onClick={() => setLiked(!liked)}
//             >
//               <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="p-4">
//         <div className="relative h-40 overflow-hidden rounded-lg bg-gray-100 mb-3">
//           <img
//             src={productImages[currentImageIndex]}
//             alt={currentAd.title}
//             className="w-full h-full object-contain"
//           />
//         </div>

//         <div className="flex justify-between items-start mb-1">
//           <span className={`text-xs font-medium ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{currentAd.brand}</span>
//           <div className={`flex items-center px-2 py-1 rounded ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
//             <Star size={12} className="fill-yellow-400 text-yellow-400" />
//             <span className="ml-1 text-xs font-medium">4.5</span>
//           </div>
//         </div>

//         <h3 className={`text-sm font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-1 line-clamp-2`}>{currentAd.title}</h3>

//         <div className="flex items-center mb-2">
//           <span className={`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>₹{soldPrice}</span>
//           <span className={`ml-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} line-through`}>₹{actualPrice}</span>
//           <span className="ml-1 text-xs font-medium text-green-600">{discount}% off</span>
//         </div>

//         <button className={`w-full py-2 px-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white text-sm font-medium hover:opacity-90`}>
//           View Deal
//         </button>
//       </div>
//     </div>
//   );
// };

// const AdsComponent = ({ ads, darkMode, isMobile, showAdPopup, setShowAdPopup }) => {
//   if (!ads || ads.length === 0) return null;

//   return (
//     <>
//       {/* Column Ad - Desktop */}
//       <div className="hidden lg:block lg:w-80">
//         <AdColumn ads={ads} darkMode={darkMode} />
//       </div>

//       {/* Popup Ad - Mobile */}
//       {showAdPopup && isMobile && (
//         <AdPopup ads={ads} darkMode={darkMode} onClose={() => setShowAdPopup(false)} />
//       )}
//     </>
//   );
// };

// export default AdsComponent;

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart, Share2, X as XIcon, ExternalLink, Briefcase, MapPin, Clock, DollarSign, Home, ShoppingCart } from 'lucide-react';

const JobAdPopup = ({ job, darkMode, onClose }) => {
  const [liked, setLiked] = useState(false);

  if (!job) return null;

  // Safely format extensions array
  const getExtensions = () => {
    try {
      if (!job.extensions) return [];
      if (Array.isArray(job.extensions)) return job.extensions;
      if (typeof job.extensions === 'string') {
        // Clean the string before parsing
        const cleaned = job.extensions.replace(/'/g, '"').replace(/\\/g, '');
        return JSON.parse(cleaned);
      }
      return [];
    } catch (e) {
      console.error('Error parsing extensions:', e);
      return [];
    }
  };

  const extensions = getExtensions();

  // Safely get description tokens
  const getDescriptionTokens = () => {
    try {
      if (!job.description_tokens) return [];
      if (Array.isArray(job.description_tokens)) return job.description_tokens;
      if (typeof job.description_tokens === 'string') {
        // Clean the string before parsing
        const cleaned = job.description_tokens.replace(/'/g, '"').replace(/\\/g, '');
        return JSON.parse(cleaned);
      }
      return [];
    } catch (e) {
      console.error('Error parsing description tokens:', e);
      return [];
    }
  };

  const descriptionTokens = getDescriptionTokens();

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${darkMode ? 'bg-black/70' : 'bg-black/50'}`}>
      <div className={`relative rounded-xl shadow-lg overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
        <button 
          onClick={onClose}
          className={`absolute top-2 right-2 p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          <XIcon size={20} />
        </button>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-4 text-white">
          <div className="flex justify-between items-center">
            <span className="font-bold">Job Opportunity</span>
            <div className="flex items-center space-x-2">
              <button className="p-1 rounded-full hover:bg-white/10">
                <Share2 size={16} />
              </button>
              <button 
                className="p-1 rounded-full hover:bg-white/10"
                onClick={() => setLiked(!liked)}
              >
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
              {job.thumbnail ? (
                <img src={job.thumbnail} alt={job.company_name} className="w-full h-full object-contain" />
              ) : (
                <Briefcase size={24} className="text-gray-400" />
              )}
            </div>
            <div>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{job.title}</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{job.company_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className={`flex items-center gap-2 p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <MapPin size={16} className={darkMode ? 'text-blue-300' : 'text-blue-600'} />
              <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.location}</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <Clock size={16} className={darkMode ? 'text-blue-300' : 'text-blue-600'} />
              <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.schedule_type}</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <DollarSign size={16} className={darkMode ? 'text-blue-300' : 'text-blue-600'} />
              <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.salary || 'Not specified'}</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <Home size={16} className={darkMode ? 'text-blue-300' : 'text-blue-600'} />
              <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {job.work_from_home === "TRUE" ? 'Remote' : 'On-site'}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Job Description</h3>
            <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`}>
              <p className={`whitespace-pre-line ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {job.description || 'No description provided'}
              </p>
            </div>
          </div>

          {extensions.length > 0 && (
            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Details</h3>
              <ul className={`space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {extensions.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {descriptionTokens.length > 0 && (
            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Skills</h3>
              <div className="flex flex-wrap gap-2">
                {descriptionTokens.map((skill, index) => (
                  <span 
                    key={index} 
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-3">
            <a 
              href={`https://www.linkedin.com/jobs/view/${job.job_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white font-medium hover:opacity-90 flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
              Apply on LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobAdCard = ({ job, darkMode, onViewMore }) => {
  const [liked, setLiked] = useState(false);

  if (!job) return null;

  // Safely format extensions array
  const getExtensions = () => {
    try {
      if (!job.extensions) return [];
      if (Array.isArray(job.extensions)) return job.extensions;
      if (typeof job.extensions === 'string') {
        // Clean the string before parsing
        const cleaned = job.extensions.replace(/'/g, '"').replace(/\\/g, '');
        return JSON.parse(cleaned);
      }
      return [];
    } catch (e) {
      console.error('Error parsing extensions:', e);
      return [];
    }
  };

  const extensions = getExtensions();

  // Safely get description tokens
  const getDescriptionTokens = () => {
    try {
      if (!job.description_tokens) return [];
      if (Array.isArray(job.description_tokens)) return job.description_tokens;
      if (typeof job.description_tokens === 'string') {
        // Clean the string before parsing
        const cleaned = job.description_tokens.replace(/'/g, '"').replace(/\\/g, '');
        return JSON.parse(cleaned);
      }
      return [];
    } catch (e) {
      console.error('Error parsing description tokens:', e);
      return [];
    }
  };

  const descriptionTokens = getDescriptionTokens();

  // Shorten description
  const shortDescription = job.description && job.description.length > 150 
    ? job.description.substring(0, 150) + '...' 
    : job.description || 'No description provided';

  return (
    <div className={`rounded-xl shadow-lg overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-3 text-white">
        <div className="flex justify-between items-center">
          <span className="font-bold text-sm">Job Opportunity</span>
          <div className="flex items-center space-x-2">
            <button 
              className="p-1 rounded-full hover:bg-white/10"
              onClick={() => setLiked(!liked)}
            >
              <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
            {job.thumbnail ? (
              <img src={job.thumbnail} alt={job.company_name} className="w-full h-full object-contain" />
            ) : (
              <Briefcase size={20} className="text-gray-400" />
            )}
          </div>
          <div>
            <h3 className={`text-sm font-bold line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{job.title}</h3>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{job.company_name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <MapPin size={14} className="flex-shrink-0" />
            <span className="text-xs truncate">{job.location || 'Location not specified'}</span>
          </div>
          <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <DollarSign size={14} className="flex-shrink-0" />
            <span className="text-xs truncate">{job.salary || 'Salary not specified'}</span>
          </div>
          <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <Clock size={14} className="flex-shrink-0" />
            <span className="text-xs truncate">{job.schedule_type || 'Schedule not specified'}</span>
          </div>
          <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <Home size={14} className="flex-shrink-0" />
            <span className="text-xs truncate">
              {job.work_from_home === "TRUE" ? 'Remote' : 'On-site'}
            </span>
          </div>
        </div>

        <div className="mb-3">
          <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-3`}>
            {shortDescription}
          </p>
          <button 
            onClick={onViewMore}
            className={`text-xs mt-1 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
          >
            View more
          </button>
        </div>

        {descriptionTokens.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {descriptionTokens.slice(0, 3).map((skill, index) => (
              <span 
                key={index} 
                className={`px-2 py-0.5 rounded-full text-xs ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <a 
          href={`https://www.linkedin.com/jobs/view/${job.job_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full py-2 px-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white text-xs font-medium hover:opacity-90 flex items-center justify-center gap-1`}
        >
          <ExternalLink size={14} />
          Apply
        </a>
      </div>
    </div>
  );
};

const ProductAdPopup = ({ product, darkMode, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  if (!product) return null;

  const productImages = [
    product.img,
    product.img.replace('kjkbv680-0', 'kjkbv680-1'),
    product.img.replace('kjkbv680-0', 'kjkbv680-2')
  ].filter(Boolean); // Filter out any undefined/null values

  const formatPrice = (price) => {
    if (!price) return '0';
    return price.replace(/â¹/g, '₹').replace(/,/g, '');
  };

  const actualPrice = formatPrice(product.actual_price);
  const soldPrice = formatPrice(product.sold_price);
  const discount = actualPrice && soldPrice 
    ? Math.round((parseInt(actualPrice) - parseInt(soldPrice)) / parseInt(actualPrice) * 100)
    : 0;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${darkMode ? 'bg-black/70' : 'bg-black/50'}`}>
      <div className={`relative rounded-xl shadow-lg overflow-hidden w-full max-w-md ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
        <button 
          onClick={onClose}
          className={`absolute top-2 right-2 p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          <XIcon size={20} />
        </button>
        
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 text-white">
          <div className="flex justify-between items-center">
            <span className="font-bold">Sponsored</span>
            <div className="flex items-center space-x-2">
              <button className="p-1 rounded-full hover:bg-white/10">
                <Share2 size={16} />
              </button>
              <button 
                className="p-1 rounded-full hover:bg-white/10"
                onClick={() => setLiked(!liked)}
              >
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="relative h-48 overflow-hidden rounded-lg bg-gray-100 mb-3">
            {productImages[currentImageIndex] ? (
              <img
                src={productImages[currentImageIndex]}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingCart size={24} className="text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex justify-between items-start mb-2">
            <span className={`text-sm font-medium ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{product.brand || 'Brand'}</span>
            <div className={`flex items-center px-2 py-1 rounded ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="ml-1 text-xs font-medium">4.5</span>
            </div>
          </div>

          <h3 className={`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>{product.title || 'Product'}</h3>

          <div className="flex items-center mb-3">
            <span className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>₹{soldPrice}</span>
            {actualPrice && (
              <>
                <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} line-through`}>₹{actualPrice}</span>
                <span className="ml-2 text-sm font-medium text-green-600">{discount}% off</span>
              </>
            )}
          </div>

          <div className="flex space-x-2">
            <button className={`flex-1 flex items-center justify-center py-2 px-3 border rounded-lg text-sm font-medium ${
              darkMode 
                ? 'border-purple-500 text-purple-400 hover:bg-purple-900/30' 
                : 'border-purple-600 text-purple-600 hover:bg-purple-50'
            }`}>
              <ShoppingCart size={16} className="mr-1" />
              Add to Cart
            </button>
            <button className="flex-1 py-2 px-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white text-sm font-medium hover:opacity-90">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductAdCard = ({ product, darkMode, onViewMore }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  if (!product) return null;

  const productImages = [
    product.img,
    product.img.replace('kjkbv680-0', 'kjkbv680-1'),
    product.img.replace('kjkbv680-0', 'kjkbv680-2')
  ].filter(Boolean); // Filter out any undefined/null values

  const formatPrice = (price) => {
    if (!price) return '0';
    return price.replace(/â¹/g, '₹').replace(/,/g, '');
  };

  const actualPrice = formatPrice(product.actual_price);
  const soldPrice = formatPrice(product.sold_price);
  const discount = actualPrice && soldPrice 
    ? Math.round((parseInt(actualPrice) - parseInt(soldPrice)) / parseInt(actualPrice) * 100)
    : 0;

  return (
    <div className={`rounded-xl shadow-lg overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 text-white">
        <div className="flex justify-between items-center">
          <span className="font-bold text-sm">Sponsored</span>
          <div className="flex items-center space-x-2">
            <button 
              className="p-1 rounded-full hover:bg-white/10"
              onClick={() => setLiked(!liked)}
            >
              <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="relative h-40 overflow-hidden rounded-lg bg-gray-100 mb-3">
          {productImages[currentImageIndex] ? (
            <img
              src={productImages[currentImageIndex]}
              alt={product.title}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingCart size={24} className="text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex justify-between items-start mb-1">
          <span className={`text-xs font-medium ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{product.brand || 'Brand'}</span>
          <div className={`flex items-center px-2 py-1 rounded ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-xs font-medium">4.5</span>
          </div>
        </div>

        <h3 className={`text-sm font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-1 line-clamp-2`}>{product.title || 'Product'}</h3>

        <div className="flex items-center mb-2">
          <span className={`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>₹{soldPrice}</span>
          {actualPrice && (
            <>
              <span className={`ml-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} line-through`}>₹{actualPrice}</span>
              <span className="ml-1 text-xs font-medium text-green-600">{discount}% off</span>
            </>
          )}
        </div>

        <button 
          onClick={onViewMore}
          className={`w-full py-2 px-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white text-xs font-medium hover:opacity-90`}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const AdsComponent = ({ darkMode, isMobile, showAdPopup, setShowAdPopup }) => {
  const [ads, setAds] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [showFullAd, setShowFullAd] = useState(null);
  const [showFullJob, setShowFullJob] = useState(null);

  // Fetch both ads and jobs data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch product ads
        const adsResponse = await fetch('/src/data/adds.json');
        if (!adsResponse.ok) throw new Error('Failed to fetch ads');
        const adsData = await adsResponse.json();
        
        // Fetch jobs data
        const jobsResponse = await fetch('/src/data/jobs.json');
        if (!jobsResponse.ok) throw new Error('Failed to fetch jobs');
        const jobsData = await jobsResponse.json();
        
        setAds(Array.isArray(adsData) ? adsData : []);
        setJobs(Array.isArray(jobsData?.Sheet1) ? jobsData.Sheet1 : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setAds([]);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Rotate between ads every 2 seconds
  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex(prev => (prev + 1) % ads.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [ads.length]);

  // Rotate between jobs every 2 seconds
  useEffect(() => {
    if (jobs.length > 1) {
      const interval = setInterval(() => {
        setCurrentJobIndex(prev => (prev + 1) % jobs.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [jobs.length]);

  // Show popup on mobile after delay
  useEffect(() => {
    if (isMobile && (ads.length > 0 || jobs.length > 0)) {
      const timer = setTimeout(() => {
        setShowAdPopup(true);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, ads.length, jobs.length, setShowAdPopup]);

  if (loading) return null;
  if (error) {
    console.error(error);
    return null;
  }

  const currentAd = ads[currentAdIndex];
  const currentJob = jobs[currentJobIndex];

  return (
    <>
      {/* Column Ads - Desktop */}
      <div className="hidden lg:block lg:w-80 space-y-4">
        {jobs.length > 0 && (
          <JobAdCard 
            job={currentJob} 
            darkMode={darkMode} 
            onViewMore={() => setShowFullJob(currentJob)} 
          />
        )}
        {ads.length > 0 && (
          <ProductAdCard 
            product={currentAd} 
            darkMode={darkMode} 
            onViewMore={() => setShowFullAd(currentAd)} 
          />
        )}
      </div>

      {/* Popup Ads - Mobile */}
      {showAdPopup && isMobile && (
        <>
          {jobs.length > 0 && (
            <JobAdPopup 
              job={currentJob} 
              darkMode={darkMode} 
              onClose={() => setShowAdPopup(false)} 
            />
          )}
          {ads.length > 0 && jobs.length === 0 && (
            <ProductAdPopup 
              product={currentAd} 
              darkMode={darkMode} 
              onClose={() => setShowAdPopup(false)} 
            />
          )}
        </>
      )}

      {/* Full View Modals */}
      {showFullAd && (
        <ProductAdPopup 
          product={showFullAd} 
          darkMode={darkMode} 
          onClose={() => setShowFullAd(null)} 
        />
      )}
      {showFullJob && (
        <JobAdPopup 
          job={showFullJob} 
          darkMode={darkMode} 
          onClose={() => setShowFullJob(null)} 
        />
      )}
    </>
  );
};

export default AdsComponent;