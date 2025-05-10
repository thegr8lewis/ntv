import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Mail, Eye, Check, Menu, Moon, Sun } from 'lucide-react';
import { getTopics, subscribeUser, updateUserTopics } from './api';
import homepageImage from '/src/assets/homepage.png';
import newsData from '/src/data/news.json';
import { motion } from 'framer-motion';

const NewsApp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('landing');
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [newsTopics, setNewsTopics] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Enhanced news data processing
  const processNewsData = () => {
    try {
      if (!newsData) {
        console.warn('News data not loaded');
        return [[], []];
      }

      // Handle Sheet1 structure
      const rawItems = newsData.Sheet1 || [];
      const validItems = rawItems.filter(item => 
        item && typeof item === 'object' && item.id
      );

      console.log('Processed news items:', validItems.length);
      return [
        validItems.slice(0, 3),  // Featured news
        validItems.slice(3, 7)   // Top stories
      ];
    } catch (error) {
      console.error('Error processing news data:', error);
      return [[], []];
    }
  };

  const [featuredNews, topStories] = processNewsData();

  useEffect(() => {
    // Check for existing user session
    const storedEmail = localStorage.getItem('newsAppUserEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      const isGuestUser = localStorage.getItem('newsAppIsGuest') === 'true';
      setIsGuest(isGuestUser);
      
      if (!isGuestUser) {
        const storedTopics = localStorage.getItem('newsAppUserTopics');
        if (storedTopics) {
          try {
            setSelectedTopics(JSON.parse(storedTopics));
          } catch (e) {
            console.error('Error parsing stored topics:', e);
          }
        }
        setStep('topics');
      } else {
        navigate('/news-home');
      }
    }

    // Load topics from API
    const fetchTopics = async () => {
      setTopicsLoading(true);
      try {
        const topics = await getTopics();
        if (topics && Array.isArray(topics)) {
          setNewsTopics(topics);
        } else {
          setNewsTopics([
            { id: 1, name: 'Politics', icon: '🏛️' },
            { id: 2, name: 'Business', icon: '💼' },
            { id: 3, name: 'Technology', icon: '💻' },
            { id: 4, name: 'Science', icon: '🔬' },
            { id: 5, name: 'Health', icon: '🏥' },
            { id: 6, name: 'Sports', icon: '⚽' },
            { id: 7, name: 'Entertainment', icon: '🎬' },
            { id: 8, name: 'Travel', icon: '✈️' },
            { id: 9, name: 'Food', icon: '🍲' },
            { id: 10, name: 'Fashion', icon: '👗' },
            { id: 11, name: 'Education', icon: '🎓' },
            { id: 12, name: 'Environment', icon: '🌿' }
          ]);
        }
      } catch (error) {
        console.error('Error loading topics:', error);
        setError('Failed to load topics. Using default topics instead.');
      } finally {
        setTopicsLoading(false);
      }
    };
    
    fetchTopics();
  }, [navigate]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const response = await subscribeUser(email);
      
      if (response?.is_existing) {
        setMessage('You are already subscribed. Redirecting to news feed...');
        setSelectedTopics(Array.isArray(response.topics) ? response.topics : []);
        
        localStorage.setItem('newsAppUserEmail', email);
        localStorage.setItem('newsAppIsGuest', 'false');
        localStorage.setItem('newsAppUserTopics', JSON.stringify(response.topics || []));
        
        setTimeout(() => {
          navigate('/news-home');
        }, 3000);
      } else {
        setIsGuest(false);
        localStorage.setItem('newsAppUserEmail', email);
        localStorage.setItem('newsAppIsGuest', 'false');
        setStep('topics');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setError(error.response?.data?.error || 'Subscription failed. Please try again or continue as guest.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGuestEntry = () => {
    setIsGuest(true);
    localStorage.setItem('newsAppUserEmail', 'guest');
    localStorage.setItem('newsAppIsGuest', 'true');
    navigate('/news-home');
  };
  
  const toggleTopic = (topicId) => {
    setSelectedTopics(prev => {
      if (prev.includes(topicId)) {
        return prev.filter(id => id !== topicId);
      } else {
        return [...prev, topicId];
      }
    });
  };
  
  const handleContinue = async () => {
    if (selectedTopics.length < 6) {
      setError('Please select at least 6 topics');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await updateUserTopics(email, selectedTopics);
      localStorage.setItem('newsAppUserTopics', JSON.stringify(selectedTopics));
      navigate('/news-home');
    } catch (error) {
      console.error('Error updating topics:', error);
      setError(error.response?.data?.error || 'Failed to save your preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getContentPreview = (content) => {
    if (!content) return 'No content available...';
    try {
      return typeof content === 'string' 
        ? content.split(' ').slice(0, 20).join(' ') + '...'
        : 'Content preview unavailable...';
    } catch {
      return 'Content preview unavailable...';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navbar */}
      <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className={`text-2xl font-serif font-bold ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                NewsFlash
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${darkMode ? 'text-blue-300 hover:bg-gray-700' : 'text-blue-600 hover:bg-gray-100'}`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <a href="#" className={`px-3 py-2 text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                About
              </a>
              <a href="#" className={`px-3 py-2 text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                Features
              </a>
              <a href="#" className={`px-3 py-2 text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                Contact
              </a>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleDarkMode}
                className={`p-2 mr-2 rounded-full ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={toggleMobileMenu}
                className={`p-2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className={`block px-3 py-2 text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                About
              </a>
              <a href="#" className={`block px-3 py-2 text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Features
              </a>
              <a href="#" className={`block px-3 py-2 text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Contact
              </a>
            </div>
          </div>
        )}
      </nav>
      
      {/* Main content */}
      <main className="flex-grow">
        {step === 'landing' && (
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="lg:w-1/2">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className={`text-4xl md:text-5xl font-serif font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}
                >
                  Stay Informed, <span className="text-blue-600">Stay Ahead</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={`mt-3 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}
                >
                  Get personalized news updates from around the globe. Subscribe now for curated content that matters to you.
                </motion.p>
                
                <div className="mt-8">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`mb-4 p-3 rounded-md ${darkMode ? 'bg-red-900/50 text-red-100' : 'bg-red-100 text-red-800'}`}
                    >
                      {error}
                    </motion.div>
                  )}
                  {message && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`mb-4 p-3 rounded-md ${darkMode ? 'bg-blue-900/50 text-blue-100' : 'bg-blue-100 text-blue-800'}`}
                    >
                      {message}
                    </motion.div>
                  )}
                  
                  <motion.form 
                    onSubmit={handleSubscribe}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="sm:flex gap-3 mb-4"
                  >
                    <label htmlFor="email" className="sr-only">Email address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`flex-grow px-5 py-3 placeholder-gray-500  rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                      placeholder="Enter your email"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-shrink-0 flex items-center justify-center px-5 py-3 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                    >
                      {loading ? 'Subscribing...' : 'Subscribe'} <Mail className="ml-2" size={18} />
                    </button>
                  </motion.form>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-4"
                  >
                    <button
                      onClick={handleGuestEntry}
                      disabled={loading}
                      className={`w-full sm:w-auto flex items-center justify-center px-5 py-3 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} disabled:opacity-50 transition-colors`}
                    >
                      Continue as Guest <Eye className="ml-2" size={18} />
                    </button>
                  </motion.div>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-8"
                >
                  <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Featured News {featuredNews.length > 0 ? `(${featuredNews.length})` : ''}
                  </h3>
                  {featuredNews.length > 0 ? (
                    <div className="space-y-4">
                      {featuredNews.map((news, index) => (
                        <motion.div
                          key={news.id || `news-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                          className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} shadow-sm cursor-pointer transition-colors border-l-4 ${darkMode ? 'border-blue-400' : 'border-blue-600'}`}
                        >
                          <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {news.title || 'Untitled News'}
                          </h4>
                          <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                            {getContentPreview(news.content)}
                          </p>
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <span>{news.source || 'Unknown source'}</span>
                            <span className="mx-2">•</span>
                            <span>{news.category ? news.category.charAt(0).toUpperCase() + news.category.slice(1) : 'General'}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} text-center`}>
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        No featured news available at the moment
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
              
              <div className="mt-10 lg:mt-0 lg:w-1/2 relative">
                <div className="absolute right-0 w-3/4 h-full overflow-hidden">
                  <motion.img 
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    src={homepageImage} 
                    alt="News App Preview" 
                    className="w-full h-full object-cover object-left rounded-l-lg shadow-xl"
                  />
                </div>
                
                                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className={`absolute left-0 bottom-0 w-3/4 ml-8 pl-8 pr-6 py-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} z-10`}
                    >
                  <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Top Stories {topStories.length > 0 ? `(${topStories.length})` : ''}
                  </h3>
                  {topStories.length > 0 ? (
                    <div className="space-y-3">
                      {topStories.map((story, index) => (
                        <div key={story.id || `story-${index}`} className="border-b pb-3 last:border-b-0 last:pb-0">
                          <h4 className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                            {story.category ? story.category.charAt(0).toUpperCase() + story.category.slice(1) : 'General'}
                          </h4>
                          <p className={`mt-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} line-clamp-2`}>
                            {story.title || 'No title available'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-center`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        No top stories available
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        )}
        
        {step === 'topics' && (
          <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6`}
            >
              <h2 className={`text-2xl font-serif font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Choose Your Interests
              </h2>
              <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Select at least 6 topics you're interested in to personalize your news feed.
              </p>
              
              <div className="mt-6">
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Selected: {selectedTopics.length} of 6 required
                </p>
                {error && (
                  <div className={`mt-2 p-3 rounded-md ${darkMode ? 'bg-red-900/50 text-red-100' : 'bg-red-100 text-red-800'}`}>
                    {error}
                  </div>
                )}
                {topicsLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <motion.div 
                    className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.05 }}
                  >
                    {newsTopics.map((topic) => (
                      <motion.button
                        key={topic.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleTopic(topic.id)}
                        className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                          selectedTopics.includes(topic.id)
                            ? 'bg-blue-600 text-white shadow-md'
                            : darkMode
                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        <span className="mr-2">{topic.icon}</span>
                        <span className="text-left">{topic.name}</span>
                        {selectedTopics.includes(topic.id) && (
                          <Check size={16} className="ml-auto" />
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </div>
              
              <div className="mt-8 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContinue}
                  disabled={selectedTopics.length < 6 || loading}
                  className={`flex items-center px-5 py-3 rounded-md font-medium transition-all ${
                    selectedTopics.length >= 6
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } disabled:opacity-50`}
                >
                  {loading ? 'Saving...' : 'Continue'} <ChevronRight size={18} className="ml-1" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NewsApp;