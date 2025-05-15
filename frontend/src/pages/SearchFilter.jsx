import { useState, useRef } from 'react';
import { Search, Filter, X as XIcon } from 'lucide-react';

export default function SearchFilter({
  darkMode,
  searchQuery,
  setSearchQuery,
  selectedTopics,
  setSelectedTopics,
  availableTopics,
  isGuest,
  userTopics,
  filteredNewsLength,
  newsLength,
  topicsToShow
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const handleTopicToggle = (topic) => {
    setSelectedTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTopics([]);
  };

  return (
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
            Showing {filteredNewsLength} of {newsLength} articles
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
  );
}