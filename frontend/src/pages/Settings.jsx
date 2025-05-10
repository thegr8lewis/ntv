import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Mail, Check, X, ArrowLeft, User, Settings, PlusCircle, Edit } from 'lucide-react';
import { updateUserEmail, updateUserTopics, getTopics } from './api';

const SettingsPage = ({ darkMode }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [newsTopics, setNewsTopics] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('account');

  useEffect(() => {
    // Check user status from localStorage
    const storedEmail = localStorage.getItem('newsAppUserEmail');
    const isGuest = localStorage.getItem('newsAppIsGuest') === 'true';
    const storedTopics = localStorage.getItem('newsAppUserTopics');

    if (storedEmail && storedEmail !== 'guest') {
      setEmail(storedEmail);
      setNewEmail(storedEmail);
      setIsSubscribed(true);
    }

    if (storedTopics) {
      setSelectedTopics(JSON.parse(storedTopics));
    }

    // Load topics for all users
    const fetchTopics = async () => {
      try {
        const topics = await getTopics();
        setNewsTopics(topics);
      } catch (error) {
        console.error('Error loading topics:', error);
      }
    };
    fetchTopics();
  }, []);

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    if (!newEmail || newEmail === email) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUserEmail(email, newEmail);
      localStorage.setItem('newsAppUserEmail', newEmail);
      setEmail(newEmail);
      setSuccess('Email updated successfully!');
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating email:', error);
      setError(error.response?.data?.error || 'Failed to update email. Please try again.');
      
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicsUpdate = async () => {
    if (selectedTopics.length < 6) {
      setError('Please select at least 6 topics');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUserTopics(email, selectedTopics);
      localStorage.setItem('newsAppUserTopics', JSON.stringify(selectedTopics));
      setSuccess('Topics updated successfully!');
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate('/news-home');
      }, 1500);
    } catch (error) {
      console.error('Error updating topics:', error);
      setError('Failed to update topics. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
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

  const handleEditTopicsClick = () => {
    navigate('/');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/news-home')}
              className={`flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}
            >
              <ArrowLeft size={20} className="mr-2" />
              <span className="font-medium">Back to News</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <div className="w-16"></div> {/* Spacer for alignment */}
        </div>

        {(error || success) && (
          <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
            error 
              ? (darkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-100 text-red-800')
              : (darkMode ? 'bg-green-900/50 text-green-200' : 'bg-green-100 text-green-800')
          } transition-all duration-300 ease-in-out`}>
            <span>{error || success}</span>
            <button onClick={() => error ? setError(null) : setSuccess(null)}>
              <X size={18} />
            </button>
          </div>
        )}

        {/* Edit Topics Button - Added at the top level */}
        <div className="mb-6">
          {/* <button
            onClick={handleEditTopicsClick}
            className={`px-5 py-3 rounded-lg font-medium text-white transition-all flex items-center ${
              darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
            } shadow-md hover:shadow-lg`}
          >
            <Edit size={18} className="mr-2" />
            Edit Topics
          </button> */}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Modern Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className={`rounded-xl ${darkMode ? 'bg-gray-800/90 backdrop-blur' : 'bg-white'} shadow-lg overflow-hidden`}>
              <div className="p-6 border-b border-opacity-20 ${darkMode ? 'border-gray-700' : 'border-gray-200'}">
                <div className={`flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-600' : 'bg-blue-100'} ${darkMode ? 'text-blue-100' : 'text-blue-600'}`}>
                    <User size={20} />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium truncate max-w-[180px]">{email || 'Guest User'}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {isSubscribed ? 'Subscribed' : 'Guest User'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-2">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'account' 
                      ? (darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-700') 
                      : (darkMode ? 'text-gray-300 hover:bg-gray-700/70' : 'text-gray-700 hover:bg-gray-100')
                  }`}
                >
                  <Settings size={18} className="mr-3" />
                  <span className="font-medium">Account</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('topics')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'topics' 
                      ? (darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-700') 
                      : (darkMode ? 'text-gray-300 hover:bg-gray-700/70' : 'text-gray-700 hover:bg-gray-100')
                  }`}
                >
                  <PlusCircle size={18} className="mr-3" />
                  <span className="font-medium">Topics</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            {activeTab === 'account' && (
              <div className={`rounded-xl ${darkMode ? 'bg-gray-800/90 backdrop-blur' : 'bg-white'} shadow-lg p-8`}>
                <h2 className="text-2xl font-bold mb-6">Account Information</h2>
                
                <form onSubmit={handleEmailUpdate} className="space-y-6">
                  <div>
                    <label htmlFor="currentEmail" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Current Email
                    </label>
                    <div className={`flex items-center px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700/70 text-gray-300' : 'bg-gray-100 text-gray-500'}`}>
                      <Mail size={18} className="mr-3 opacity-70" />
                      <span>{email || 'Guest User'}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="newEmail" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      New Email
                    </label>
                    <div className={`relative rounded-lg overflow-hidden ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <Mail size={18} className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                      <input
                        id="newEmail"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                          darkMode 
                            ? 'bg-gray-700/70 border-gray-600 text-white focus:ring-blue-600/50' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500/50'
                        } border`}
                        placeholder="Enter new email address"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={loading || newEmail === email}
                      className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all flex justify-center items-center ${
                        loading || newEmail === email
                          ? 'bg-blue-500/50 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                      }`}
                    >
                      {loading ? 'Updating...' : 'Update Email'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'topics' && (
              <div className={`rounded-xl ${darkMode ? 'bg-gray-800/90 backdrop-blur' : 'bg-white'} shadow-lg p-8`}>
                <h2 className="text-2xl font-bold mb-2">Your News Topics</h2>
                <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Select at least 6 topics you're interested in to personalize your news feed.
                </p>
                
                {!isSubscribed && (
                  <div className={`mb-8 p-6 rounded-xl ${darkMode ? 'bg-gray-700/70' : 'bg-blue-50'} border ${darkMode ? 'border-gray-600' : 'border-blue-100'}`}>
                    <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Subscribe to Customize Your News
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      You need to be subscribed to save your topic preferences and personalize your news feed.
                    </p>
                    <button
                      onClick={() => navigate('/')}
                      className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-md hover:shadow-lg"
                    >
                      Subscribe Now
                    </button>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Selected: <span className={`font-bold ${selectedTopics.length >= 6 ? 'text-green-500' : 'text-yellow-500'}`}>{selectedTopics.length}</span> of 6 required
                    </p>
                    <div className={`h-2 w-32 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div 
                        className={`h-full ${selectedTopics.length >= 6 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                        style={{ width: `${Math.min(selectedTopics.length / 6 * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {newsTopics.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => toggleTopic(topic.id)}
                        className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                          selectedTopics.includes(topic.id)
                            ? darkMode 
                              ? 'bg-blue-600/90 text-white shadow-md hover:bg-blue-700' 
                              : 'bg-blue-500 text-white shadow-md hover:bg-blue-600'
                            : darkMode
                              ? 'bg-gray-700/70 text-gray-200 hover:bg-gray-600/90'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        <span className="mr-2">{topic.icon}</span>
                        <span className="font-medium">{topic.name}</span>
                        {selectedTopics.includes(topic.id) && (
                          <Check size={16} className="ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleTopicsUpdate}
                  disabled={selectedTopics.length < 6 || loading || !isSubscribed}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all flex justify-center items-center ${
                    !isSubscribed
                      ? 'bg-gray-400 cursor-not-allowed opacity-60'
                      : selectedTopics.length >= 6
                        ? loading 
                          ? 'bg-blue-500/50 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                        : 'bg-gray-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  {loading ? 'Updating...' : isSubscribed ? 'Save Topics & Return to News' : 'Subscribe to Save Topics'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;