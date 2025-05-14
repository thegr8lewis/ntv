// import { useParams, useNavigate } from 'react-router-dom';
// import TextToSpeech from './TextToSpeech';
// import { ArrowLeft, ExternalLink, Check, Shield, Filter, Volume2, Home, MoreHorizontal, Globe, MessageCircle, Briefcase, Megaphone, X } from 'lucide-react';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
// import { useEffect, useState } from 'react';
// import newsData from '../data/news.json';
// import jobsData from '../data/jobs.json';
// import Translator from '../pages/Translator';
// import Verification from './Verification';
// import Chatbot from './Chatbot';

// export default function NewsDetailPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [newsItem, setNewsItem] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [relatedNews, setRelatedNews] = useState([]);
//   const [jobAds, setJobAds] = useState([]);
//   const [currentJobIndex, setCurrentJobIndex] = useState(0);
//   const [filterType, setFilterType] = useState('category');
//   const [activeFeature, setActiveFeature] = useState(null);
//   const [darkMode, setDarkMode] = useState(false);
//   const [expandedOptions, setExpandedOptions] = useState(false);
//   const [showTextToSpeech, setShowTextToSpeech] = useState(false);

//   useEffect(() => {
//     const fetchNewsData = async () => {
//       try {
//         setLoading(true);
        
//         const allNewsItems = newsData.Sheet1 || [];
        
//         const currentItem = allNewsItems.find(item => 
//           item.id?.toString() === id
//         );

//         if (!currentItem) {
//           throw new Error(`News article with ID ${id} not found`);
//         }

//         const transformedItem = {
//           id: currentItem.id || id,
//           title: currentItem.title || 'Untitled Article',
//           description: currentItem.content ? 
//             currentItem.content.substring(0, 200) + '...' : 
//             'No description available',
//           fullContent: currentItem.content || 'No content available',
//           author: currentItem.author || 'Unknown Author',
//           timestamp: formatDate(currentItem.published_date),
//           isVerified: true,
//           category: currentItem.category || 'General',
//           image: `https://picsum.photos/800/400?random=${id}`,
//           link: currentItem.url || '#',
//           keywords: [],
//           source: {
//             name: currentItem.source || 'Unknown Source',
//             url: currentItem.url || '#',
//             icon: null
//           }
//         };

//         setNewsItem(transformedItem);

//         const related = allNewsItems
//           .filter(item => item.id !== id)
//           .filter(item => {
//             if (filterType === 'author') {
//               return (
//                 String(item.author || '').trim().toLowerCase() ===
//                 String(transformedItem.author || '').trim().toLowerCase()
//               );
//             } else {
//               return (item.category || 'General') === transformedItem.category;
//             }
//           })
//           .slice(0, 7);

//         setRelatedNews(related);

//         // Load all job ads
//         const jobs = jobsData.Sheet1.map(job => ({
//           id: job.job_id,
//           title: job.title,
//           company: job.company_name,
//           salary: job.salary_standardized 
//             ? `$${parseInt(job.salary_standardized).toLocaleString()}/year` 
//             : 'Not specified',
//           viaLink: job.apply_link?.link || '#', // Use apply_link.link for via
//           thumbnail: job.thumbnail || `https://picsum.photos/50/50?random=${job.job_id}`,
//         }));
//         setJobAds(jobs);

//         setLoading(false);
//       } catch (err) {
//         console.error('Error loading news:', err);
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchNewsData();
//   }, [id, filterType]);

//   // Rotate job ads every 3 seconds
//   useEffect(() => {
//     if (jobAds.length > 1) {
//       const interval = setInterval(() => {
//         setCurrentJobIndex(prev => (prev + 1) % jobAds.length);
//       }, 3000);
//       return () => clearInterval(interval);
//     }
//   }, [jobAds]);

//   const toggleFilterType = () => {
//     setFilterType(prev => prev === 'category' ? 'author' : 'category');
//   };

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//   };

//   function formatDate(dateNumber) {
//     if (!dateNumber) return 'Date not available';
    
//     try {
//       const date = new Date((dateNumber - 25569) * 86400 * 1000);
//       if (isNaN(date.getTime())) return 'Invalid date';
      
//       const now = new Date();
//       const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
//       if (diffInHours < 1) {
//         return 'Less than an hour ago';
//       } else if (diffInHours < 24) {
//         return `${diffInHours} hours ago`;
//       } else {
//         return date.toLocaleDateString('en-US', { 
//           month: 'short', 
//           day: 'numeric', 
//           year: 'numeric' 
//         });
//       }
//     } catch {
//       return 'Date not available';
//     }
//   }

//   const handleFeatureClick = (feature) => {
//     setActiveFeature(activeFeature === feature ? null : feature);
//     setExpandedOptions(false);
//   };

//   const toggleOptions = () => {
//     setExpandedOptions(!expandedOptions);
//     if (expandedOptions) {
//       setActiveFeature(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
//         <div className="text-xl animate-pulse">Loading news article...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} p-4`}>
//         <div className="text-xl text-red-600 mb-4">{error}</div>
//         <button 
//           onClick={() => navigate('/')}
//           className={`px-4 py-2 ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors`}
//         >
//           Return to Homepage
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} flex flex-col transition-colors duration-300`}>
//       <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
//       <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
//         <div className="flex flex-row flex-wrap gap-4 mb-6">
//           <button 
//             onClick={() => navigate(-1)}
//             className={`flex items-center px-4 py-2 text-sm sm:text-base ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5`}
//           >
//             <ArrowLeft className="mr-2" size={16} strokeWidth={2.5} />
//             <span className="font-medium"></span>
//           </button>

//           <button 
//             onClick={() => navigate('/news-home')}
//             className={`flex items-center px-4 py-2 text-sm sm:text-base ${darkMode ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-emerald-600 hover:bg-emerald-700'} text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5`}
//           >
//             <Home className="mr-2" size={16} strokeWidth={2.5} />
//             <span className="font-medium"></span>
//           </button>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
//           {/* Main Article */}
//           <div className="w-full lg:w-7/12">
//             {newsItem && (
//               <article className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md overflow-hidden`}>
//                 <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-full">
//                   <img 
//                     src={newsItem.image} 
//                     alt={newsItem.title} 
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.src = `https://picsum.photos/800/400?random=${newsItem.id}`;
//                     }}
//                   />
//                   <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-wrap gap-2 justify-end">
//                     <span className={`text-xs font-medium px-2 py-1 sm:px-3 sm:py-1.5 rounded-full ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'} flex items-center shadow-sm`}>
//                       {newsItem.category}
//                     </span>
//                     {newsItem.isVerified ? (
//                       <span className={`text-xs font-medium px-2 py-1 sm:px-3 sm:py-1.5 rounded-full ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'} flex items-center gap-1 shadow-sm`}>
//                         <Check size={12} />
//                         Verified
//                       </span>
//                     ) : (
//                       <span className={`text-xs font-medium px-2 py-1 sm:px-3 sm:py-1.5 rounded-full ${darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'} flex items-center gap-1 shadow-sm`}>
//                         <Shield size={12} />
//                         Unverified
//                       </span>
//                     )}
//                   </div>
//                 </div>
                
//                 <div className="p-4 sm:p-6 md:p-8">
//                   <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
//                     <div className="flex-1">
//                       <div className="flex justify-between items-start">
//                         <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{newsItem.title}</h1>
//                         <div className="relative">
//                           <button 
//                             onClick={toggleOptions}
//                             className={`ml-4 p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
//                           >
//                             <MoreHorizontal size={18} />
//                           </button>
                          
//                           {expandedOptions && (
//                             <div className={`absolute right-0 mt-1 w-48 rounded-md shadow-lg z-10 ${darkMode ? 'bg-gray-700' : 'bg-white'} ring-1 ${darkMode ? 'ring-gray-600' : 'ring-gray-200'}`}>
//                               <div className="py-1">
//                                 <button
//                                   onClick={() => handleFeatureClick('translate')}
//                                   className={`flex items-center px-4 py-2 text-sm w-full text-left ${activeFeature === 'translate' ? (darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800') : (darkMode ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-gray-100 text-gray-800')}`}
//                                 >
//                                   <Globe size={16} className="mr-2" />
//                                   Translate
//                                 </button>
//                                 <button
//                                   onClick={() => handleFeatureClick('verify')}
//                                   className={`flex items-center px-4 py-2 text-sm w-full text-left ${activeFeature === 'verify' ? (darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800') : (darkMode ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-gray-100 text-gray-800')}`}
//                                 >
//                                   <Shield size={16} className="mr-2" />
//                                   Verify
//                                 </button>
//                                 <button
//                                   onClick={() => handleFeatureClick('discuss')}
//                                   className={`flex items-center px-4 py-2 text-sm w-full text-left ${activeFeature === 'discuss' ? (darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800') : (darkMode ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-gray-100 text-gray-800')}`}
//                                 >
//                                   <MessageCircle size={16} className="mr-2" />
//                                   Discuss
//                                 </button>
//                                 <button
//                                   onClick={() => handleFeatureClick('speech')}
//                                   className={`flex items-center px-4 py-2 text-sm w-full text-left ${activeFeature === 'speech' ? (darkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800') : (darkMode ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-gray-100 text-gray-800')}`}
//                                 >
//                                   <Volume2 size={16} className="mr-2" />
//                                   Listen
//                                 </button>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                         <span className="font-medium">{newsItem.author}</span> • {newsItem.timestamp}
//                       </div>
//                     </div>
//                     <a 
//                       href={newsItem.link} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className={`flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 text-sm ${darkMode ? 'bg-blue-900 text-blue-100 hover:bg-blue-800' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'} rounded-lg transition-colors whitespace-nowrap`}
//                     >
//                       <ExternalLink size={14} className="mr-2" />
//                       Original Source
//                     </a>
//                   </div>
                  
//                   {activeFeature === 'translate' && (
//                     <div className="mb-6">
//                       <Translator 
//                         news={{
//                           title: newsItem.title,
//                           description: newsItem.description,
//                           content: newsItem.fullContent
//                         }} 
//                         darkMode={darkMode} 
//                         setActiveFeature={setActiveFeature} 
//                       />
//                     </div>
//                   )}
                  
//                   {activeFeature === 'verify' && (
//                     <div className="mb-6">
//                       <Verification 
//                         news={newsItem} 
//                         darkMode={darkMode} 
//                         setActiveFeature={setActiveFeature} 
//                       />
//                     </div>
//                   )}
                  
//                   <div className={`prose max-w-none ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm sm:text-base`}>
//                     {newsItem.description && (
//                       <p className="text-base sm:text-lg mb-4">{newsItem.description}</p>
//                     )}
//                     <div className="whitespace-pre-line">
//                       {newsItem.fullContent}
//                     </div>
//                   </div>
                  
//                   <div className={`mt-6 sm:mt-8 pt-4 sm:pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
//                     <h3 className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Source Information</h3>
//                     <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-1`}>
//                       {newsItem.source.name && <p>Source: {newsItem.source.name}</p>}
//                       {newsItem.source.url && (
//                         <p>
//                           URL:{' '}
//                           <a 
//                             href={newsItem.source.url} 
//                             target="_blank" 
//                             rel="noopener noreferrer" 
//                             className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} underline break-all`}
//                           >
//                             {newsItem.source.url}
//                           </a>
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </article>
//             )}
//           </div>

//           {/* Related News and Job Ads */}
//           <div className="w-full lg:w-5/12">
//             <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-4 sm:p-6 sticky top-4`}>
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg sm:text-xl font-bold">Related News & Jobs</h2>
//                 <button 
//                   onClick={toggleFilterType}
//                   className={`flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm rounded-lg ${
//                     filterType === 'author' 
//                       ? darkMode 
//                         ? 'bg-blue-900 text-blue-200' 
//                         : 'bg-blue-100 text-blue-800'
//                       : darkMode 
//                         ? 'bg-gray-700 text-gray-300' 
//                         : 'bg-gray-100 text-gray-800'
//                   }`}
//                 >
//                   <Filter size={14} />
//                   {filterType === 'author' ? 'Same Author' : 'Same Category'}
//                 </button>
//               </div>

//               {relatedNews.length > 0 || jobAds.length > 0 ? (
//                 <ul className="space-y-3 sm:space-y-4">
//                   {/* Job Ad (Single, Rotating) */}
//                   {jobAds.length > 0 && (
//                     <li className="pb-3 sm:pb-4">
//                       <div 
//                         className={`p-2 sm:p-3 rounded-lg transition-colors ${
//                           darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
//                         }`} // Distinct background
//                       >
//                         <div className="flex items-center gap-2 sm:gap-3">
//                           <img 
//                             src={jobAds[currentJobIndex].thumbnail} 
//                             alt={jobAds[currentJobIndex].company} 
//                             className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
//                             onError={(e) => {
//                               e.target.src = `https://picsum.photos/50/50?random=${jobAds[currentJobIndex].id}`;
//                             }}
//                           />
//                           <div className="flex-1 min-w-0">
//                             <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} text-sm sm:text-base line-clamp-1`}>
//                               {jobAds[currentJobIndex].title}
//                             </h3>
//                             <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 flex flex-wrap gap-1 sm:gap-2`}>
//                               <span>{jobAds[currentJobIndex].company}</span>
//                               <span className="hidden sm:inline">•</span>
//                               <span>{jobAds[currentJobIndex].salary}</span>
//                             </div>
//                             <div className={`text-xs ${darkMode ? 'text-yellow-400' : 'text-yellow-600'} mt-1 flex items-center gap-1`}>
//                               <Megaphone size={12} />
//                               Paid Ad
//                             </div>
//                           </div>
//                           <a 
//                             href={jobAds[currentJobIndex].viaLink} 
//                             target="_blank" 
//                             rel="noopener noreferrer"
//                             className={`p-1.5 sm:p-2 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'} transition-colors flex-shrink-0`}
//                           >
//                             <Briefcase size={14} />
//                           </a>
//                         </div>
//                       </div>
//                     </li>
//                   )}
//                   {/* Related News Items */}
//                   {relatedNews.map(item => (
//                     <li key={item.id} className={`pb-3 sm:pb-4 last:pb-0`}>
//                       <a 
//                         href={`/news/${item.id}`} 
//                         className={`block p-2 sm:p-3 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
//                       >
//                         <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} text-sm sm:text-base line-clamp-2`}>{item.title}</h3>
//                         <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
//                           <span>{item.author}</span> • <span>{formatDate(item.published_date)}</span>
//                         </div>
//                       </a>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                   No {filterType === 'author' ? 'articles by this author' : 'articles in this category'} or jobs found
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
      
//       {activeFeature === 'discuss' && (
//         <div className="fixed inset-0 z-[1001]">
//           <Chatbot 
//             key={`chatbot-${id}`}
//             news={newsItem} 
//             darkMode={darkMode} 
//             setActiveFeature={() => {
//               setActiveFeature(null);
//               setExpandedOptions(false);
//             }} 
//           />
//         </div>
//       )}

//       {activeFeature === 'speech' && (
//   <TextToSpeech 
//     text={`${newsItem.title}. ${newsItem.fullContent}`}
//     darkMode={darkMode}
//     onClose={() => {
//       setActiveFeature(null);
//       setExpandedOptions(false);
//     }}
//   />
// )}
      
//       <Footer darkMode={darkMode} />
//     </div>
//   );
// }

// src/pages/NewsDetailPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Check,
  Shield,
  Filter,
  Home,
  MoreHorizontal,
  Globe,
  MessageCircle,
  Briefcase,
  Megaphone,
  X,
  Volume2,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import newsData from '../data/news.json';
import jobsData from '../data/jobs.json';
import Translator from '../pages/Translator';
import Verification from './Verification';
import Chatbot from './Chatbot';
import TextToSpeech from '../pages/TextToSpeech';

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [jobAds, setJobAds] = useState([]);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [filterType, setFilterType] = useState('category');
  const [activeFeature, setActiveFeature] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [expandedOptions, setExpandedOptions] = useState(false);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setLoading(true);

        const allNewsItems = newsData.Sheet1 || [];

        const currentItem = allNewsItems.find(
          (item) => item.id?.toString() === id
        );

        if (!currentItem) {
          throw new Error(`News article with ID ${id} not found`);
        }

        const transformedItem = {
          id: currentItem.id || id,
          title: currentItem.title || 'Untitled Article',
          description: currentItem.content
            ? currentItem.content.substring(0, 200) + '...'
            : 'No description available',
          fullContent: currentItem.content || 'No content available',
          author: currentItem.author || 'Unknown Author',
          timestamp: formatDate(currentItem.published_date),
          isVerified: true,
          category: currentItem.category || 'General',
          image: `https://picsum.photos/800/400?random=${id}`,
          link: currentItem.url || '#',
          keywords: [],
          source: {
            name: currentItem.source || 'Unknown Source',
            url: currentItem.url || '#',
            icon: null,
          },
        };

        setNewsItem(transformedItem);

        const related = allNewsItems
          .filter((item) => item.id !== id)
          .filter((item) => {
            if (filterType === 'author') {
              return (
                String(item.author || '')
                  .trim()
                  .toLowerCase() ===
                String(transformedItem.author || '')
                  .trim()
                  .toLowerCase()
              );
            } else {
              return (item.category || 'General') === transformedItem.category;
            }
          })
          .slice(0, 7);

        setRelatedNews(related);

        // Load all job ads
        const jobs = jobsData.Sheet1.map((job) => ({
          id: job.job_id,
          title: job.title,
          company: job.company_name,
          salary: job.salary_standardized
            ? `$${parseInt(job.salary_standardized).toLocaleString()}/year`
            : 'Not specified',
          viaLink: job.apply_link?.link || '#',
          thumbnail: job.thumbnail || `https://picsum.photos/50/50?random=${job.job_id}`,
        }));
        setJobAds(jobs);

        setLoading(false);
      } catch (err) {
        console.error('Error loading news:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [id, filterType]);

  // Rotate job ads every 3 seconds
  useEffect(() => {
    if (jobAds.length > 1) {
      const interval = setInterval(() => {
        setCurrentJobIndex((prev) => (prev + 1) % jobAds.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [jobAds]);

  const toggleFilterType = () => {
    setFilterType((prev) => (prev === 'category' ? 'author' : 'category'));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  function formatDate(dateNumber) {
    if (!dateNumber) return 'Date not available';

    try {
      const date = new Date((dateNumber - 25569) * 86400 * 1000);
      if (isNaN(date.getTime())) return 'Invalid date';

      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

      if (diffInHours < 1) {
        return 'Less than an hour ago';
      } else if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
    } catch {
      return 'Date not available';
    }
  }

  const handleFeatureClick = (feature) => {
    setActiveFeature(activeFeature === feature ? null : feature);
    setExpandedOptions(false);
  };

  const toggleOptions = () => {
    setExpandedOptions(!expandedOptions);
    if (expandedOptions) {
      setActiveFeature(null);
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'
        }`}
      >
        <div className="text-xl animate-pulse">Loading news article...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${
          darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'
        } p-4`}
      >
        <div className="text-xl text-red-600 mb-4">{error}</div>
        <button
          onClick={() => navigate('/')}
          className={`px-4 py-2 ${
            darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
          } text-white rounded-lg transition-colors`}
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'
      } flex flex-col transition-colors duration-300`}
    >
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-row flex-wrap gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center px-4 py-2 text-sm sm:text-base ${
              darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
            } text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5`}
          >
            <ArrowLeft className="mr-2" size={16} strokeWidth={2.5} />
            <span className="font-medium">Back</span>
          </button>

          <button
            onClick={() => navigate('/news-home')}
            className={`flex items-center px-4 py-2 text-sm sm:text-base ${
              darkMode
                ? 'bg-emerald-700 hover:bg-emerald-600'
                : 'bg-emerald-600 hover:bg-emerald-700'
            } text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5`}
          >
            <Home className="mr-2" size={16} strokeWidth={2.5} />
            <span className="font-medium">News Home</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main Article */}
          <div className="w-full lg:w-7/12">
            {newsItem && (
              <article
                className={`${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } rounded-xl shadow-md overflow-hidden`}
              >
                <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-full">
                  <img
                    src={newsItem.image}
                    alt={newsItem.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://picsum.photos/800/400?random=${newsItem.id}`;
                    }}
                  />
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-wrap gap-2 justify-end">
                    <span
                      className={`text-xs font-medium px-2 py-1 sm:px-3 sm:py-1.5 rounded-full ${
                        darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'
                      } flex items-center shadow-sm`}
                    >
                      {newsItem.category}
                    </span>
                    {newsItem.isVerified ? (
                      <span
                        className={`text-xs font-medium px-2 py-1 sm:px-3 sm:py-1.5 rounded-full ${
                          darkMode
                            ? 'bg-green-900 text-green-200'
                            : 'bg-green-100 text-green-800'
                        } flex items-center gap-1 shadow-sm`}
                      >
                        <Check size={12} />
                        Verified
                      </span>
                    ) : (
                      <span
                        className={`text-xs font-medium px-2 py-1 sm:px-3 sm:py-1.5 rounded-full ${
                          darkMode
                            ? 'bg-yellow-900 text-yellow-200'
                            : 'bg-yellow-100 text-yellow-800'
                        } flex items-center gap-1 shadow-sm`}
                      >
                        <Shield size={12} />
                        Unverified
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                          {newsItem.title}
                        </h1>
                        <div className="relative">
                          <button
                            onClick={toggleOptions}
                            className={`ml-4 p-2 rounded-full ${
                              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                            } transition-colors`}
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {expandedOptions && (
                            <div
                              className={`absolute right-0 mt-1 w-48 rounded-md shadow-lg z-10 ${
                                darkMode ? 'bg-gray-700' : 'bg-white'
                              } ring-1 ${
                                darkMode ? 'ring-gray-600' : 'ring-gray-200'
                              }`}
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => handleFeatureClick('translate')}
                                  className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                                    activeFeature === 'translate'
                                      ? darkMode
                                        ? 'bg-blue-900 text-blue-200'
                                        : 'bg-blue-100 text-blue-800'
                                      : darkMode
                                        ? 'hover:bg-gray-600 text-gray-200'
                                        : 'hover:bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  <Globe size={16} className="mr-2" />
                                  Translate
                                </button>
                                <button
                                  onClick={() => handleFeatureClick('verify')}
                                  className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                                    activeFeature === 'verify'
                                      ? darkMode
                                        ? 'bg-green-900 text-green-200'
                                        : 'bg-green-100 text-green-800'
                                      : darkMode
                                        ? 'hover:bg-gray-600 text-gray-200'
                                        : 'hover:bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  <Shield size={16} className="mr-2" />
                                  Verify
                                </button>
                                <button
                                  onClick={() => handleFeatureClick('discuss')}
                                  className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                                    activeFeature === 'discuss'
                                      ? darkMode
                                        ? 'bg-purple-900 text-purple-200'
                                        : 'bg-purple-100 text-purple-800'
                                      : darkMode
                                        ? 'hover:bg-gray-600 text-gray-200'
                                        : 'hover:bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  <MessageCircle size={16} className="mr-2" />
                                  Discuss
                                </button>
                                <button
                                  onClick={() => handleFeatureClick('read')}
                                  className={`flex items-center px-4 py-2 text-sm w-full text-left ${
                                    activeFeature === 'read'
                                      ? darkMode
                                        ? 'bg-teal-900 text-teal-200'
                                        : 'bg-teal-100 text-teal-800'
                                      : darkMode
                                        ? 'hover:bg-gray-600 text-gray-200'
                                        : 'hover:bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  <Volume2 size={16} className="mr-2" />
                                  Read Aloud
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className={`text-xs sm:text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        <span className="font-medium">{newsItem.author}</span> •{' '}
                        {newsItem.timestamp}
                      </div>
                    </div>
                    <a
                      href={newsItem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 text-sm ${
                        darkMode
                          ? 'bg-blue-900 text-blue-100 hover:bg-blue-800'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      } rounded-lg transition-colors whitespace-nowrap`}
                    >
                      <ExternalLink size={14} className="mr-2" />
                      Original Source
                    </a>
                  </div>

                  {activeFeature === 'translate' && (
                    <div className="mb-6">
                      <Translator
                        news={{
                          title: newsItem.title,
                          description: newsItem.description,
                          content: newsItem.fullContent,
                        }}
                        darkMode={darkMode}
                        setActiveFeature={setActiveFeature}
                      />
                    </div>
                  )}

                  {activeFeature === 'verify' && (
                    <div className="mb-6">
                      <Verification
                        news={newsItem}
                        darkMode={darkMode}
                        setActiveFeature={setActiveFeature}
                      />
                    </div>
                  )}

                  {activeFeature === 'read' && (
                    <div className="mb-6">
                      <TextToSpeech
                        text={`${newsItem.title}. ${newsItem.fullContent}`}
                        darkMode={darkMode}
                        setActiveFeature={setActiveFeature}
                      />
                    </div>
                  )}

                  <div
                    className={`prose max-w-none ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    } text-sm sm:text-base`}
                  >
                    {newsItem.description && (
                      <p className="text-base sm:text-lg mb-4">
                        {newsItem.description}
                      </p>
                    )}
                    <div className="whitespace-pre-line">
                      {newsItem.fullContent}
                    </div>
                  </div>

                  <div
                    className={`mt-6 sm:mt-8 pt-4 sm:pt-6 border-t ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    <h3
                      className={`text-xs sm:text-sm font-medium ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      } mb-2`}
                    >
                      Source Information
                    </h3>
                    <div
                      className={`text-xs sm:text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      } space-y-1`}
                    >
                      {newsItem.source.name && (
                        <p>Source: {newsItem.source.name}</p>
                      )}
                      {newsItem.source.url && (
                        <p>
                          URL:{' '}
                          <a
                            href={newsItem.source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${
                              darkMode
                                ? 'text-blue-400 hover:text-blue-300'
                                : 'text-blue-600 hover:text-blue-800'
                            } underline break-all`}
                          >
                            {newsItem.source.url}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )}
          </div>

          {/* Related News and Job Ads */}
          <div className="w-full lg:w-5/12">
            <div
              className={`${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } rounded-xl shadow-md p-4 sm:p-6 sticky top-4`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold">
                  Related News & Jobs
                </h2>
                <button
                  onClick={toggleFilterType}
                  className={`flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm rounded-lg ${
                    filterType === 'author'
                      ? darkMode
                        ? 'bg-blue-900 text-blue-200'
                        : 'bg-blue-100 text-blue-800'
                      : darkMode
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <Filter size={14} />
                  {filterType === 'author' ? 'Same Author' : 'Same Category'}
                </button>
              </div>

              {relatedNews.length > 0 || jobAds.length > 0 ? (
                <ul className="space-y-3 sm:space-y-4">
                  {/* Job Ad (Single, Rotating) */}
                  {jobAds.length > 0 && (
                    <li className="pb-3 sm:pb-4">
                      <div
                        className={`p-2 sm:p-3 rounded-lg transition-colors ${
                          darkMode
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <img
                            src={jobAds[currentJobIndex].thumbnail}
                            alt={jobAds[currentJobIndex].company}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.src = `https://picsum.photos/50/50?random=${jobAds[currentJobIndex].id}`;
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h3
                              className={`font-medium ${
                                darkMode ? 'text-gray-200' : 'text-gray-800'
                              } text-sm sm:text-base line-clamp-1`}
                            >
                              {jobAds[currentJobIndex].title}
                            </h3>
                            <div
                              className={`text-xs ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              } mt-1 flex flex-wrap gap-1 sm:gap-2`}
                            >
                              <span>{jobAds[currentJobIndex].company}</span>
                              <span className="hidden sm:inline">•</span>
                              <span>{jobAds[currentJobIndex].salary}</span>
                            </div>
                            <div
                              className={`text-xs ${
                                darkMode ? 'text-yellow-400' : 'text-yellow-600'
                              } mt-1 flex items-center gap-1`}
                            >
                              <Megaphone size={12} />
                              Paid Ad
                            </div>
                          </div>
                          <a
                            href={jobAds[currentJobIndex].viaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-1.5 sm:p-2 rounded-full ${
                              darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'
                            } transition-colors flex-shrink-0`}
                          >
                            <Briefcase size={14} />
                          </a>
                        </div>
                      </div>
                    </li>
                  )}
                  {/* Related News Items */}
                  {relatedNews.map((item) => (
                    <li key={item.id} className={`pb-3 sm:pb-4 last:pb-0`}>
                      <a
                        href={`/news/${item.id}`}
                        className={`block p-2 sm:p-3 rounded-lg transition-colors ${
                          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                        }`}
                      >
                        <h3
                          className={`font-medium ${
                            darkMode ? 'text-gray-200' : 'text-gray-800'
                          } text-sm sm:text-base line-clamp-2`}
                        >
                          {item.title}
                        </h3>
                        <div
                          className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          } mt-1`}
                        >
                          <span>{item.author}</span> •{' '}
                          <span>{formatDate(item.published_date)}</span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  className={`text-xs sm:text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  No {filterType === 'author' ? 'articles by this author' : 'articles in this category'} or jobs found
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {activeFeature === 'discuss' && (
        <div className="fixed inset-0 z-[1001]">
          <Chatbot
            key={`chatbot-${id}`}
            news={newsItem}
            darkMode={darkMode}
            setActiveFeature={() => {
              setActiveFeature(null);
              setExpandedOptions(false);
            }}
          />
        </div>
      )}

      <Footer darkMode={darkMode} />
    </div>
  );
}