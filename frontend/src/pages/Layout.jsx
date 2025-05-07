import { useState, useEffect } from 'react';
import { MoreHorizontal, Check, X, MessageCircle, Globe, Shield, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Translator from './Translator';
import Verification from './Verification';
import Chatbot from './Chatbot';
import newsData from '/src/data/news.json';

export default function Layout() {
  const [expandedNews, setExpandedNews] = useState(null);
  const [activeFeature, setActiveFeature] = useState(null);
  const [activeNewsId, setActiveNewsId] = useState(null);
  const [news, setNews] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (newsData && newsData.Sheet1 && Array.isArray(newsData.Sheet1)) {
        const first100Items = newsData.Sheet1.slice(0, 100);
        
        const transformedNews = first100Items.map((item, index) => {
          const content = typeof item.content === 'string' ? item.content : '';
          const description = content.length > 0 
            ? content.substring(0, 200) + (content.length > 200 ? '...' : '')
            : 'No description available';

          return {
            id: item.id || index.toString(),
            title: item.title || 'Untitled',
            description: description,
            fullContent: content,
            author: item.author || 'Unknown',
            timestamp: formatDate(item.published_date),
            isVerified: true,
            category: 'General',
            image: `https://picsum.photos/800/400?random=${index}`,
            link: item.url || '#',
            keywords: [],
            sentiment: 'neutral',
            source: {
              name: item.source || 'Unknown source',
              url: item.url || '#',
              icon: null
            }
          };
        });
        setNews(transformedNews);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load news data');
      setLoading(false);
      console.error(err);
    }
  }, []);

  function formatDate(dateNumber) {
    if (!dateNumber) return 'Date not available';
    
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
        year: 'numeric' 
      });
    }
  }

  const handleMoreClick = (newsId) => {
    if (expandedNews === newsId) {
      setExpandedNews(null);
      setActiveFeature(null);
    } else {
      setExpandedNews(newsId);
      setActiveFeature(null);
    }
  };

  const handleFeatureClick = (feature, newsId) => {
    setActiveFeature(feature);
    setActiveNewsId(newsId);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const activeNews = news.find(item => item.id === activeNewsId);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <div 
              key={item.id} 
              className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 flex flex-col h-full`}
            >
              <div className="relative flex-grow-0">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    console.error(`Failed to load image: ${item.image}`);
                    e.target.src = `https://picsum.photos/800/400?random=${item.id}`;
                  }}
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
                      {Array.isArray(item.keywords) && item.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {item.keywords.slice(0, 3).map((keyword, index) => (
                            <span key={index} className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}
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
                        title="View original article"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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