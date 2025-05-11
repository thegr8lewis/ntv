import { useState, useEffect, useRef } from 'react';
import { 
  MoreHorizontal, 
  Check, 
  X, 
  MessageCircle, 
  Globe, 
  Shield, 
  ExternalLink, 
  Search, 
  Filter, 
  X as XIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Translator from './Translator';
import Verification from './Verification';
import Chatbot from './Chatbot';
import AdsComponent from './adds';
import newsData from '/src/data/news.json';

export default function Layout() {
  const [expandedNews, setExpandedNews] = useState(null);
  const [activeFeature, setActiveFeature] = useState(null);
  const [activeNewsId, setActiveNewsId] = useState(null);
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userTopics, setUserTopics] = useState([]);
  const [isGuest, setIsGuest] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [availableTopics, setAvailableTopics] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [ads, setAds] = useState([]);
  const [adsLoading, setAdsLoading] = useState(true);
  const [adsError, setAdsError] = useState(null);
  const [showAdPopup, setShowAdPopup] = useState(false);
  const filterRef = useRef(null);
  const isMobile = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      isMobile.current = window.innerWidth < 768;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile.current && ads.length > 0) {
      const timer = setTimeout(() => {
        setShowAdPopup(true);
      }, 15000); // Show popup after 15 seconds on mobile
      return () => clearTimeout(timer);
    }
  }, [ads]);

  const processNewsData = (data) => {
    try {
      if (!data) return [];
      const rawItems = data.Sheet1 || (Array.isArray(data) ? data : []);
      
      return rawItems
        .filter(item => item && typeof item === 'object')
        .map((item, index) => {
          const content = typeof item.content === 'string' ? item.content : '';
          const description = content.length > 0 
            ? content.substring(0, 200) + (content.length > 200 ? '...' : '')
            : 'No description available';

          return {
            id: item.id || `news-${index}`,
            title: item.title || 'Untitled News',
            description: description,
            fullContent: content,
            author: item.author || 'Unknown Author',
            timestamp: formatDate(item.published_date),
            isVerified: true,
            category: item.category || 'General',
            image: `https://picsum.photos/800/400?random=${index}`,
            link: item.url || '#',
            keywords: [],
            sentiment: 'neutral',
            source: {
              name: item.source || 'Unknown Source',
              url: item.url || '#',
              icon: null
            }
          };
        });
    } catch (err) {
      console.error('Error processing news data:', err);
      return [];
    }
  };

  useEffect(() => {
    try {
      if (newsData) {
        const processedNews = processNewsData(newsData);
        const topics = [...new Set(processedNews.map(item => item.category))]
          .filter(topic => typeof topic === 'string' && topic.trim() !== '');
        setAvailableTopics(topics);
      }
    } catch (err) {
      console.error('Error extracting topics:', err);
      setAvailableTopics([]);
    }
  }, []);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch('/src/data/adds.json');
        if (!response.ok) throw new Error('Failed to fetch ads');
        const data = await response.json();
        setAds(data);
        setAdsLoading(false);
      } catch (err) {
        setAdsError(err.message);
        setAdsLoading(false);
      }
    };

    fetchAds();
  }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem('newsAppUserEmail');
    const storedIsGuest = localStorage.getItem('newsAppIsGuest');
    const storedTopics = localStorage.getItem('newsAppUserTopics');
    
    if (storedEmail && storedIsGuest === 'false' && storedTopics) {
      try {
        setIsGuest(false);
        const parsedTopics = JSON.parse(storedTopics);
        setUserTopics(Array.isArray(parsedTopics) ? parsedTopics : []);
      } catch (err) {
        console.error('Error parsing stored topics:', err);
        setUserTopics([]);
      }
    }

    try {
      const processedNews = processNewsData(newsData);
      setNews(processedNews.slice(0, 150));
      setFilteredNews(processedNews.slice(0, 150));
      setLoading(false);
    } catch (err) {
      setError('Failed to load news data');
      setLoading(false);
    }
  }, [isGuest]);

  useEffect(() => {
    let results = [...news];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(item => 
        (typeof item.title === 'string' && item.title.toLowerCase().includes(query)) || 
        (typeof item.description === 'string' && item.description.toLowerCase().includes(query)) ||
        (typeof item.fullContent === 'string' && item.fullContent.toLowerCase().includes(query)) ||
        (typeof item.author === 'string' && item.author.toLowerCase().includes(query)) ||
        (typeof item.category === 'string' && item.category.toLowerCase().includes(query))
      );
    }
    
    if (selectedTopics.length > 0) {
      results = results.filter(item => selectedTopics.includes(item.category));
    }
    
    setFilteredNews(results);
  }, [searchQuery, selectedTopics, news]);

  function formatDate(dateNumber) {
    if (!dateNumber) return 'Date not available';
    
    try {
      const date = new Date((dateNumber - 25569) * 86400 * 1000);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Less than an hour ago';
      if (diffInHours < 24) return `${diffInHours} hours ago`;
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Date not available';
    }
  }

  const handleMoreClick = (newsId) => {
    setExpandedNews(expandedNews === newsId ? null : newsId);
    setActiveFeature(null);
  };

  const handleFeatureClick = (feature, newsId) => {
    setActiveFeature(feature);
    setActiveNewsId(newsId);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleTopicToggle = (topic) => {
    setSelectedTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTopics([]);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeNews = news.find(item => item.id === activeNewsId) || null;

  const topicsToShow = !isGuest && userTopics.length > 0
    ? availableTopics.filter(topic => {
        const userTopicNames = userTopics.map(topicId => {
          const id = Number(topicId);
          switch(id) {
            case 1: return 'Politics';
            case 2: return 'Business';
            case 3: return 'Technology';
            case 4: return 'Science';
            case 5: return 'Health';
            case 6: return 'Sports';
            case 7: return 'Entertainment';
            case 8: return 'Travel';
            case 9: return 'Food';
            case 10: return 'Fashion';
            case 11: return 'Education';
            case 12: return 'Environment';
            default: return '';
          }
        }).filter(Boolean);
        
        return userTopicNames.includes(topic);
      })
    : availableTopics;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
        <div className="animate-pulse text-xl">Loading news...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} transition-colors duration-300`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="container mx-auto px-4 py-8">
        <div className={`mb-8 p-4 rounded-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} shadow-md`}>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              </div>
              <input
                type="text"
                placeholder="Search articles by title, content, author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <XIcon size={18} className={darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} />
                </button>
              )}
            </div>
            
            <div className="relative" ref={filterRef}>
              <button 
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  darkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                } transition-colors`}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={18} />
                Filter Topics
                {selectedTopics.length > 0 && (
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    darkMode ? 'bg-blue-800 text-blue-100' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedTopics.length}
                  </span>
                )}
              </button>
              
              {isFilterOpen && (
                <div 
                  className={`absolute right-0 mt-2 w-64 p-4 rounded-lg shadow-lg z-20 ${
                    darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="mb-2 flex justify-between items-center">
                    <h3 className="font-medium">Topics</h3>
                    <div className="flex items-center gap-2">
                      {selectedTopics.length > 0 && (
                        <button 
                          onClick={clearFilters}
                          className={`text-xs ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                        >
                          Clear all
                        </button>
                      )}
                      <button 
                        onClick={() => setIsFilterOpen(false)}
                        className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                      >
                        <XIcon size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto">
                    {topicsToShow.length > 0 ? (
                      topicsToShow.map((topic) => (
                        <div key={topic} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`topic-${topic}`}
                            checked={selectedTopics.includes(topic)}
                            onChange={() => handleTopicToggle(topic)}
                            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label 
                            htmlFor={`topic-${topic}`}
                            className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                          >
                            {topic}
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No topics available
                      </p>
                    )}
                  </div>
                  
                  {!isGuest && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Showing topics from your subscription preferences
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {(searchQuery || selectedTopics.length > 0) && (
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Showing {filteredNews.length} of {news.length} articles
              </div>
            )}
          </div>
          
          {selectedTopics.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedTopics.map(topic => (
                <span 
                  key={topic}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {topic}
                  <button 
                    onClick={() => handleTopicToggle(topic)}
                    className="ml-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 p-0.5"
                  >
                    <XIcon size={14} />
                  </button>
                </span>
              ))}
              
              <button 
                onClick={clearFilters}
                className={`text-xs px-3 py-1 rounded-full ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Clear all
              </button>
            </div>
          )}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* News Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto max-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredNews.length > 0 ? (
                filteredNews.map((item) => (
                  <div 
                    key={item.id} 
                    className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 flex flex-col h-full`}
                  >
                    <div className="relative flex-grow-0">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <span className={`text-xs font-medium px-3 py-1.5 rounded-full flex items-center shadow-sm ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
                          {item.category}
                        </span>
                        {item.isVerified ? (
                          <span className={`text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                            <Check size={12} />
                            Verified
                          </span>
                        ) : (
                          <span className={`text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm ${darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`}>
                            <Shield size={12} />
                            Unverified
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold line-clamp-2">{item.title}</h2>
                        <button 
                          onClick={() => handleMoreClick(item.id)}
                          className={`rounded-full p-2 ml-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                          <MoreHorizontal size={20} />
                        </button>
                      </div>
                      
                      {expandedNews === item.id && (
                        <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex space-x-3">
                            <button 
                              onClick={() => handleFeatureClick('translate', item.id)}
                              className={`flex items-center px-3 py-2 rounded-lg ${activeFeature === 'translate' && activeNewsId === item.id ? (darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
                            >
                              <Globe size={16} className="mr-2" />
                              Translate
                            </button>
                            <button 
                              onClick={() => handleFeatureClick('verify', item.id)}
                              className={`flex items-center px-3 py-2 rounded-lg ${activeFeature === 'verify' && activeNewsId === item.id ? (darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
                            >
                              <Shield size={16} className="mr-2" />
                              Verify
                            </button>
                            <button 
                              onClick={() => handleFeatureClick('discuss', item.id)}
                              className={`flex items-center px-3 py-2 rounded-lg ${activeFeature === 'discuss' && activeNewsId === item.id ? (darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
                            >
                              <MessageCircle size={16} className="mr-2" />
                              Discuss
                            </button>
                          </div>
                          
                          {activeFeature === 'translate' && activeNewsId === item.id && (
                            <Translator 
                              news={{
                                title: item.title,
                                description: item.description,
                                content: item.fullContent
                              }} 
                              darkMode={darkMode} 
                              setActiveFeature={setActiveFeature} 
                            />
                          )}
                          {activeFeature === 'verify' && activeNewsId === item.id && 
                            <Verification news={item} darkMode={darkMode} />}
                        </div>
                      )}
                      
                      <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-3`}>{item.description}</p>
                      
                      <div className="mt-auto">
                        {item.keywords && item.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {item.keywords.slice(0, 3).map((keyword, index) => (
                              <span key={index} className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <span className="font-medium">{item.author}</span> • {item.timestamp}
                          </div>
                          <div className="flex space-x-2">
                            <Link 
                              to={`/news/${item.id}`}
                              className={`px-3 py-1 text-sm rounded-lg ${darkMode ? 'bg-blue-800 hover:bg-blue-700 text-blue-100' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'}`}
                            >
                              Read More
                            </Link>
                            <a 
                              href={item.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700 text-blue-400' : 'hover:bg-gray-100 text-blue-600'}`}
                            >
                              <ExternalLink size={16} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`col-span-full py-10 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="text-xl font-medium mb-3">No articles found</div>
                  <p className="mb-4">Try adjusting your search query or filters.</p>
                  <button 
                    onClick={clearFilters}
                    className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-800 text-blue-100 hover:bg-blue-700' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Ads Component with Popup Fix */}
          {!adsLoading && !adsError && ads.length > 0 && (
            <div className="hidden lg:block w-80">
              <div className="sticky top-20">
                <div className={showAdPopup ? 'relative z-50' : 'relative z-10'}>
                  <AdsComponent 
                    ads={ads} 
                    darkMode={darkMode} 
                    isMobile={isMobile.current} 
                    showAdPopup={showAdPopup} 
                    setShowAdPopup={setShowAdPopup} 
                    popupStyle={showAdPopup ? { top: '80px' } : {}} // Adjust popup position below header
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {activeFeature === 'discuss' && activeNews && (
        <Chatbot 
          key={`chatbot-${activeNewsId}`} 
          news={activeNews} 
          darkMode={darkMode} 
          setActiveFeature={() => {
            setActiveFeature(null);
            setActiveNewsId(null);
          }} 
        />
      )}
      
      <Footer darkMode={darkMode} />
    </div>
  );
}