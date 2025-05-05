import { useState } from 'react';
import { MoreHorizontal, Check, X, MessageCircle, Globe, Shield, ChevronDown, ArrowLeft, XCircle } from 'lucide-react';

// Mock news data
const mockNews = [
  {
    id: 1,
    title: "New Renewable Energy Plant Opens in Nevada",
    description: "A state-of-the-art renewable energy facility has opened in Nevada today, promising to power over 100,000 homes with clean solar energy. The $500 million investment represents one of the largest renewable energy projects in the Southwest region this year.",
    author: "Energy Today",
    timestamp: "3 hours ago",
    isVerified: true,
    image: "/api/placeholder/800/400"
  },
  {
    id: 2,
    title: "Global Tech Conference Announces Virtual Format",
    description: "The annual Global Tech Summit has announced it will maintain a hybrid model for its upcoming event, allowing attendees to participate either in-person or virtually. This decision comes after record participation in last year's online platform.",
    author: "Tech Weekly",
    timestamp: "5 hours ago",
    isVerified: true,
    image: "/api/placeholder/800/400"
  },
  {
    id: 3,
    title: "Scientists Discover Potential New Antibiotic Compound",
    description: "Researchers at Cambridge University have identified a promising new compound that shows effectiveness against antibiotic-resistant bacteria. The discovery, published yesterday in Nature, could lead to the development of new treatments for infections that have become increasingly difficult to treat.",
    author: "Medical Journal",
    timestamp: "Yesterday",
    isVerified: true,
    image: "/api/placeholder/800/400"
  },
  {
    id: 4,
    title: "Stock Markets Rally Following Interest Rate Announcement",
    description: "Global markets saw significant gains today following the central bank's decision to maintain current interest rates. The S&P 500 rose 1.3%, while European markets closed up by nearly 1%.",
    author: "Financial Times",
    timestamp: "4 hours ago",
    isVerified: false,
    image: "/api/placeholder/800/400"
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
    `The article discusses developments in ${newsItem.title.includes("Energy") ? "renewable energy" : 
      newsItem.title.includes("Tech") ? "technology" : 
      newsItem.title.includes("Scientists") ? "medical research" : 
      "financial markets"}.`,
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

export default function NewsApp() {
  const [expandedNews, setExpandedNews] = useState(null);
  const [activeFeature, setActiveFeature] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

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
      const selectedNews = mockNews.find(news => news.id === expandedNews);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">NewsFlash</h1>
          <p className="text-gray-600">Stay informed with the latest stories</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          {mockNews.map((news) => {
            const newsContent = getNewsContent(news);
            
            return (
              <div key={news.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="relative">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-72 object-cover"
                  />
                  <div className="absolute top-4 right-4">
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
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm font-medium">{news.author} • {news.timestamp}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-2xl font-bold text-gray-800 flex-1 mr-4 leading-tight">
                      {newsContent.title}
                    </h2>
                    <button 
                      onClick={() => handleMoreClick(news.id)}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition"
                      aria-label="More options"
                    >
                      <MoreHorizontal size={22} />
                    </button>
                  </div>
                  
                  {/* Options menu */}
                  {expandedNews === news.id && (
                    <div className="mb-4 bg-white rounded-lg p-2 shadow-md border border-gray-100">
                      <div className="flex flex-col divide-y divide-gray-100">
                        <button 
                          onClick={() => handleFeatureClick("translate")}
                          className={`flex items-center p-3 text-sm ${activeFeature === "translate" ? "text-blue-600 font-medium" : "hover:bg-blue-50 text-gray-700"} transition-colors`}
                        >
                          <Globe size={18} className="mr-3" /> Translate
                        </button>
                        <button 
                          onClick={() => handleFeatureClick("verify")}
                          className={`flex items-center p-3 text-sm ${activeFeature === "verify" ? "text-blue-600 font-medium" : "hover:bg-blue-50 text-gray-700"} transition-colors`}
                        >
                          <Shield size={18} className="mr-3" /> Verify
                        </button>
                        <button 
                          onClick={() => handleFeatureClick("chat")}
                          className={`flex items-center p-3 text-sm ${activeFeature === "chat" ? "text-blue-600 font-medium" : "hover:bg-blue-50 text-gray-700"} transition-colors`}
                        >
                          <MessageCircle size={18} className="mr-3" /> Interact
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Feature content */}
                  {activeFeature === "translate" && expandedNews === news.id && (
                    <div className="mb-6 bg-blue-50 rounded-lg p-4 shadow-md">
                      <div className="flex justify-between items-center mb-4 border-b border-blue-100 pb-2">
                        <h3 className="font-semibold text-blue-800">Translation</h3>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <button 
                              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                              className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm flex items-center shadow-sm hover:bg-gray-50"
                            >
                              {languages.find(l => l.code === selectedLanguage)?.name}
                              <ChevronDown size={16} className="ml-1" />
                            </button>
                            
                            {showLanguageDropdown && (
                              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-36">
                                {languages.map(lang => (
                                  <button
                                    key={lang.code}
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
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
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Close translation"
                          >
                            <XCircle size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeFeature === "verify" && expandedNews === news.id && (
                    <div className="mb-6 bg-gray-50 rounded-lg p-4 shadow-md">
                      <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                        <h3 className="font-semibold text-gray-800">Verification Status</h3>
                        <button 
                          onClick={() => setActiveFeature(null)}
                          className="text-gray-500 hover:text-gray-700"
                          aria-label="Close verification"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                      <div className={`flex items-center ${news.isVerified ? "text-green-700" : "text-amber-700"}`}>
                        {news.isVerified ? (
                          <>
                            <div className="bg-green-100 p-2 rounded-full mr-3">
                              <Check size={20} />
                            </div>
                            <div>
                              <p className="font-medium">Verified Information</p>
                              <p className="text-sm text-gray-600">This article has been fact-checked by our team.</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="bg-amber-100 p-2 rounded-full mr-3">
                              <X size={20} />
                            </div>
                            <div>
                              <p className="font-medium">Unverified Content</p>
                              <p className="text-sm text-gray-600">This story is still being verified by our fact-checkers.</p>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="mt-6 bg-white p-3 rounded-md border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Source Information</h4>
                        <p className="text-sm text-gray-600">Published by: {news.author}</p>
                        <p className="text-sm text-gray-600">Published: {news.timestamp}</p>
                        <p className="text-sm text-gray-600 mt-2">
                          {news.isVerified ? 
                            "Our fact-checking team has confirmed the accuracy of this report using multiple reliable sources." : 
                            "This article is currently being reviewed by our fact-checking team. Check back soon for verification status."}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {activeFeature === "chat" && expandedNews === news.id && (
                    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
                      <div className="bg-blue-700 text-white p-4 shadow-md flex items-center">
                        <button 
                          onClick={() => setActiveFeature(null)} 
                          className="mr-3 hover:bg-blue-800 p-1 rounded-full transition"
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
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {msg.text}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="sticky bottom-0 bg-white p-2 border-t border-gray-200 shadow-lg">
                          <div className="flex">
                            <input
                              type="text"
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              placeholder="Ask about this news article..."
                              className="flex-1 border border-gray-300 rounded-l-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  
                  <p className="text-gray-700 mb-6 leading-relaxed">{newsContent.description}</p>
                  
                  <div className="flex justify-between items-center text-gray-500 text-sm border-t border-gray-100 pt-4 mt-4">
                    <span className="font-medium">{news.author}</span>
                    <span>{news.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}