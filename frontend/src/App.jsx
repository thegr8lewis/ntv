import { useState, useEffect } from 'react';
import { MoreHorizontal, Check, X, MessageCircle, Globe, Shield, ChevronDown, ArrowLeft, XCircle, Search, Bell, User } from 'lucide-react';

// Mock news data with random image fetching
const mockNews = [
  {
    id: 1,
    title: "New Renewable Energy Plant Opens in Nevada",
    description: "A state-of-the-art renewable energy facility has opened in Nevada today, promising to power over 100,000 homes with clean solar energy. The $500 million investment represents one of the largest renewable energy projects in the Southwest region this year.",
    author: "Energy Today",
    timestamp: "3 hours ago",
    isVerified: true,
    category: "Environment"
  },
  {
    id: 2,
    title: "Global Tech Conference Announces Virtual Format",
    description: "The annual Global Tech Summit has announced it will maintain a hybrid model for its upcoming event, allowing attendees to participate either in-person or virtually. This decision comes after record participation in last year's online platform.",
    author: "Tech Weekly",
    timestamp: "5 hours ago",
    isVerified: true,
    category: "Technology"
  },
  {
    id: 3,
    title: "Scientists Discover Potential New Antibiotic Compound",
    description: "Researchers at Cambridge University have identified a promising new compound that shows effectiveness against antibiotic-resistant bacteria. The discovery, published yesterday in Nature, could lead to the development of new treatments for infections that have become increasingly difficult to treat.",
    author: "Medical Journal",
    timestamp: "Yesterday",
    isVerified: true,
    category: "Health"
  },
  {
    id: 4,
    title: "Stock Markets Rally Following Interest Rate Announcement",
    description: "Global markets saw significant gains today following the central bank's decision to maintain current interest rates. The S&P 500 rose 1.3%, while European markets closed up by nearly 1%.",
    author: "Financial Times",
    timestamp: "4 hours ago",
    isVerified: false,
    category: "Finance"
  }
];

// Languages for translation feature
const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" }
];

// Random image categories for better relevance
const imageCategories = {
  "Environment": ["nature", "sustainability", "solar", "renewable", "energy"],
  "Technology": ["technology", "computer", "digital", "innovation", "future"],
  "Health": ["medical", "healthcare", "science", "laboratory", "research"],
  "Finance": ["business", "finance", "stock", "office", "economy"]
};

// Mock translations (simulating translation API)
const mockTranslate = (text, lang) => {
  if (lang === "en") return text;
  
  // This is just a simulation - in a real app, you'd use a translation API
  const translations = {
    es: {
      "New Renewable Energy Plant Opens in Nevada": "Nueva planta de energía renovable abre en Nevada",
      "A state-of-the-art renewable energy facility has opened in Nevada today, promising to power over 100,000 homes with clean solar energy. The $500 million investment represents one of the largest renewable energy projects in the Southwest region this year.": "Una instalación de energía renovable de última generación ha abierto hoy en Nevada, prometiendo abastecer a más de 100.000 hogares con energía solar limpia. La inversión de 500 millones de dólares representa uno de los mayores proyectos de energía renovable en la región del Suroeste este año."
    },
    fr: {
      "New Renewable Energy Plant Opens in Nevada": "Nouvelle centrale d'énergie renouvelable ouvre au Nevada",
      "A state-of-the-art renewable energy facility has opened in Nevada today, promising to power over 100,000 homes with clean solar energy. The $500 million investment represents one of the largest renewable energy projects in the Southwest region this year.": "Une installation d'énergie renouvelable à la pointe de la technologie a ouvert aujourd'hui au Nevada, promettant d'alimenter plus de 100 000 foyers en énergie solaire propre. L'investissement de 500 millions de dollars représente l'un des plus grands projets d'énergie renouvelable dans la région du Sud-Ouest cette année."
    }
  };

  // Return translation if available, otherwise return original text with language code note
  if (translations[lang] && translations[lang][text]) {
    return translations[lang][text];
  }
  return `[${lang.toUpperCase()}] ${text}`;
};

// Chat bot response generation
const generateChatResponse = (question, newsItem) => {
  // In a real app, this would connect to an AI service
  const responses = [
    `This news about "${newsItem.title}" was reported by ${newsItem.author}.`,
    `The article was published ${newsItem.timestamp}.`,
    `This news is ${newsItem.isVerified ? "verified" : "not yet verified"} by our fact-checking team.`,
    `The article discusses developments in ${newsItem.category}.`,
    `You might be interested in reading more articles from ${newsItem.author}.`
  ];
  
  // Simple keyword matching
  if (question.toLowerCase().includes("who")) {
    return `This article was published by ${newsItem.author}.`;
  }
  if (question.toLowerCase().includes("when")) {
    return `This news was published ${newsItem.timestamp}.`;
  }
  if (question.toLowerCase().includes("verify") || question.toLowerCase().includes("true")) {
    return `This article is ${newsItem.isVerified ? "verified by our fact-checking team" : "currently under review by our fact-checking team"}.`;
  }
  
  // Default response
  return responses[Math.floor(Math.random() * responses.length)];
};

// Function to get a random image based on category
const getRandomImage = (category) => {
  const keywords = imageCategories[category] || ["news"];
  const keyword = keywords[Math.floor(Math.random() * keywords.length)];
  const width = 1200;
  const height = 800;
  const seed = Math.floor(Math.random() * 1000);
  
  // Using Unsplash Source API for random relevant images
  return `https://source.unsplash.com/random/${width}x${height}?${keyword}&sig=${seed}`;
};

export default function NewsApp() {
  const [expandedNews, setExpandedNews] = useState(null);
  const [activeFeature, setActiveFeature] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize news data with images
  useEffect(() => {
    const newsWithImages = mockNews.map(news => ({
      ...news,
      image: getRandomImage(news.category)
    }));
    setNewsData(newsWithImages);
  }, []);

  const handleMoreClick = (newsId) => {
    if (expandedNews === newsId) {
      setExpandedNews(null);
      setActiveFeature(null);
    } else {
      setExpandedNews(newsId);
      setActiveFeature(null);
    }
  };

  const handleFeatureClick = (feature) => {
    setActiveFeature(feature);
    if (feature === "chat") {
      // Reset chat for new news item
      setChatMessages([{
        sender: "bot",
        text: `Hi! Ask me anything about this news article.`
      }]);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    // Add user message
    const newMessages = [
      ...chatMessages,
      { sender: "user", text: chatInput }
    ];
    
    setChatMessages(newMessages);
    
    // Generate and add bot response
    setTimeout(() => {
      const selectedNews = newsData.find(news => news.id === expandedNews);
      const botResponse = generateChatResponse(chatInput, selectedNews);
      
      setChatMessages(prevMessages => [
        ...prevMessages,
        { sender: "bot", text: botResponse }
      ]);
    }, 500);
    
    setChatInput("");
  };

  const getNewsContent = (news) => {
    if (activeFeature === "translate") {
      return {
        title: mockTranslate(news.title, selectedLanguage),
        description: mockTranslate(news.description, selectedLanguage)
      };
    }
    return { title: news.title, description: news.description };
  };

  const refreshImages = () => {
    const refreshedNews = newsData.map(news => ({
      ...news,
      image: getRandomImage(news.category)
    }));
    setNewsData(refreshedNews);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} transition-colors duration-300`}>
      <header className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg sticky top-0 z-40 transition-colors duration-300`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">NewsFlash</h1>
              <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-blue-100 text-blue-800'}`}>Live</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <div className={`flex items-center rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-4 py-2`}>
                <Search size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                <input 
                  type="text" 
                  placeholder="Search news..." 
                  className={`ml-2 bg-transparent outline-none ${darkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'} w-40`} 
                />
              </div>
              
              <button 
                onClick={refreshImages}
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'} transition`}
              >
                Refresh Images
              </button>
              
              <button 
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition md:hidden`}>
                <Search size={20} />
              </button>
              <button className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition relative`}>
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition md:hidden`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition`}>
                <User size={20} />
              </button>
            </div>
          </div>
          <nav className="mt-4 flex items-center space-x-6 overflow-x-auto pb-2 text-sm font-medium">
            <a href="#" className="text-blue-500 border-b-2 border-blue-500 pb-2">Top Stories</a>
            <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} pb-2`}>Technology</a>
            <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} pb-2`}>Business</a>
            <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} pb-2`}>Science</a>
            <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} pb-2`}>Health</a>
            <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} pb-2`}>Entertainment</a>
            <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} pb-2`}>Sports</a>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {newsData.map((news) => {
            const newsContent = getNewsContent(news);
            
            return (
              <div 
                key={news.id} 
                className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1`}
              >
                <div className="relative">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/800/400"; // Fallback to placeholder if image fails
                    }}
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full flex items-center shadow-sm ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
                      {news.category}
                    </span>
                    {news.isVerified ? (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1.5 rounded-full flex items-center shadow-sm">
                        <Check size={12} className="mr-1" /> Verified
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-full flex items-center shadow-sm">
                        <X size={12} className="mr-1" /> Unverified
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white text-sm font-medium">{news.author} • {news.timestamp}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} flex-1 mr-4 leading-tight`}>
                      {newsContent.title}
                    </h2>
                    <button 
                      onClick={() => handleMoreClick(news.id)}
                      className={`p-2 ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'} rounded-full transition`}
                      aria-label="More options"
                    >
                      <MoreHorizontal size={22} />
                    </button>
                  </div>
                  
                  {/* Options menu */}
                  {expandedNews === news.id && (
                    <div className={`mb-4 ${darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-100'} rounded-lg p-2 shadow-md`}>
                      <div className="flex flex-col divide-y divide-gray-100">
                        <button 
                          onClick={() => handleFeatureClick("translate")}
                          className={`flex items-center p-3 text-sm ${activeFeature === "translate" ? "text-blue-500 font-medium" : `${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-blue-50 text-gray-700'}`} transition-colors`}
                        >
                          <Globe size={18} className="mr-3" /> Translate
                        </button>
                        <button 
                          onClick={() => handleFeatureClick("verify")}
                          className={`flex items-center p-3 text-sm ${activeFeature === "verify" ? "text-blue-500 font-medium" : `${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-blue-50 text-gray-700'}`} transition-colors`}
                        >
                          <Shield size={18} className="mr-3" /> Verify
                        </button>
                        <button 
                          onClick={() => handleFeatureClick("chat")}
                          className={`flex items-center p-3 text-sm ${activeFeature === "chat" ? "text-blue-500 font-medium" : `${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-blue-50 text-gray-700'}`} transition-colors`}
                        >
                          <MessageCircle size={18} className="mr-3" /> Interact
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Feature content */}
                  {activeFeature === "translate" && expandedNews === news.id && (
                    <div className={`mb-6 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg p-4 shadow-md`}>
                      <div className={`flex justify-between items-center mb-4 border-b ${darkMode ? 'border-gray-600' : 'border-blue-100'} pb-2`}>
                        <h3 className={`font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>Translation</h3>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <button 
                              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                              className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} border rounded-md px-3 py-1 text-sm flex items-center shadow-sm hover:bg-gray-50`}
                            >
                              {languages.find(l => l.code === selectedLanguage)?.name}
                              <ChevronDown size={16} className="ml-1" />
                            </button>
                            
                            {showLanguageDropdown && (
                              <div className={`absolute right-0 mt-1 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} border rounded-md shadow-lg z-10 w-36`}>
                                {languages.map(lang => (
                                  <button
                                    key={lang.code}
                                    className={`block w-full text-left px-4 py-2 text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                    onClick={() => {
                                      setSelectedLanguage(lang.code);
                                      setShowLanguageDropdown(false);
                                    }}
                                  >
                                    {lang.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <button 
                            onClick={() => setActiveFeature(null)}
                            className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                            aria-label="Close translation"
                          >
                            <XCircle size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeFeature === "verify" && expandedNews === news.id && (
                    <div className={`mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 shadow-md`}>
                      <div className={`flex justify-between items-center mb-4 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'} pb-2`}>
                        <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Verification Status</h3>
                        <button 
                          onClick={() => setActiveFeature(null)}
                          className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                          aria-label="Close verification"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                      <div className={`flex items-center ${news.isVerified ? 'text-green-500' : 'text-amber-500'}`}>
                        {news.isVerified ? (
                          <>
                            <div className={`${darkMode ? 'bg-green-900' : 'bg-green-100'} p-2 rounded-full mr-3`}>
                              <Check size={20} />
                            </div>
                            <div>
                              <p className="font-medium">Verified Information</p>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>This article has been fact-checked by our team.</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className={`${darkMode ? 'bg-amber-900' : 'bg-amber-100'} p-2 rounded-full mr-3`}>
                              <X size={20} />
                            </div>
                            <div>
                              <p className="font-medium">Unverified Content</p>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>This story is still being verified by our fact-checkers.</p>
                            </div>
                          </>
                        )}
                      </div>
                      <div className={`mt-6 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} p-3 rounded-md border`}>
                        <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Source Information</h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Published by: {news.author}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Published: {news.timestamp}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                          {news.isVerified ? 
                            "Our fact-checking team has confirmed the accuracy of this report using multiple reliable sources." : 
                            "This article is currently being reviewed by our fact-checking team. Check back soon for verification status."}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {activeFeature === "chat" && expandedNews === news.id && (
                    <div className={`fixed inset-0 ${darkMode ? 'bg-gray-900' : 'bg-white'} z-50 overflow-y-auto`}>
                      <div className="bg-blue-600 text-white p-4 shadow-md flex items-center">
                        <button 
                          onClick={() => setActiveFeature(null)} 
                          className="mr-3 hover:bg-blue-700 p-1 rounded-full transition"
                        >
                          <ArrowLeft size={20} />
                        </button>
                        <div>
                          <h2 className="font-semibold">Interactive Chat</h2>
                          <p className="text-sm text-blue-100">Discussing: {news.title}</p>
                        </div>
                      </div>
                      
                      <div className="container mx-auto p-4 max-w-3xl">
                        <div className="h-[calc(100vh-220px)] overflow-y-auto mb-4 p-4">
                          {chatMessages.map((msg, index) => (
                            <div 
                              key={index} 
                              className={`mb-4 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <div 
                                className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-3 rounded-2xl ${
                                  msg.sender === "user" 
                                    ? "bg-blue-600 text-white" 
                                    : darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {msg.text}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className={`sticky bottom-0 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} p-2 border-t shadow-lg`}>
                          <div className="flex">
                            <input
                              type="text"
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              placeholder="Ask about this news article..."
                              className={`flex-1 ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500' : 'bg-white border-gray-300 text-gray-800'} border rounded-l-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") handleSendMessage();
                              }}
                            />
                            <button
                              onClick={handleSendMessage}
                              className="bg-blue-600 text-white px-6 py-3 rounded-r-md hover:bg-blue-700 transition font-medium"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-6 leading-relaxed`}>{newsContent.description}</p>
                  
                  <div className={`flex justify-between items-center ${darkMode ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-100'} text-sm border-t pt-4 mt-4`}>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-2 ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
                        {news.author.charAt(0)}
                      </span>
                      <span className="font-medium">{news.author}</span>
                    </div>
                    <span>{news.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      
      <footer className={`mt-12 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'} py-8`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>NewsFlash</h2>
              <p className="mt-1 text-sm">Stay informed with the latest news</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div>
                <h3 className="font-medium mb-2">Categories</h3>
                <ul className="text-sm space-y-1">
                  <li>Technology</li>
                  <li>Business</li>
                  <li>Science</li>
                  <li>Health</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">About</h3>
                <ul className="text-sm space-y-1">
                  <li>Our Team</li>
                  <li>Contact Us</li>
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Follow Us</h3>
                <div className="flex space-x-3 text-sm">
                  <a href="#" className={`${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}>Twitter</a>
                  <a href="#" className={`${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}>Facebook</a>
                  <a href="#" className={`${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}>Instagram</a>
                </div>
              </div>
            </div>
          </div>
          <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center text-sm`}>
            <p>© 2025 NewsFlash. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}