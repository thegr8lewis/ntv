import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send } from 'lucide-react';

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

export default function Chatbot({ news, darkMode, setActiveFeature }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const chatContainerRef = useRef(null);
  
  // Use an effect to handle the transition in rendering
  useEffect(() => {
    // Short delay to prevent immediate rendering which causes flickering
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Initialize chat with welcome message
  useEffect(() => {
    setChatMessages([{
      sender: "bot",
      text: `Hi! Ask me anything about this news article.`
    }]);
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    // Add user message
    const newMessages = [
      ...chatMessages,
      { sender: "user", text: chatInput }
    ];
    
    setChatMessages(newMessages);
    setChatInput("");
    
    // Generate and add bot response with slight delay for realistic effect
    setTimeout(() => {
      const botResponse = generateChatResponse(chatInput, news);
      
      setChatMessages(prevMessages => [
        ...prevMessages,
        { sender: "bot", text: botResponse }
      ]);
    }, 500);
  };

  const handleClose = () => {
    // First make the component invisible
    setIsVisible(false);
    
    // Then after a short delay, actually remove it from the DOM
    setTimeout(() => {
      setActiveFeature(null);
    }, 300);
  };

  // CSS classes for smooth transition
  const containerClasses = `fixed inset-0 z-50 ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-opacity duration-300 ${
    isVisible ? 'opacity-100' : 'opacity-0'
  }`;

  return (
    <div className={containerClasses}>
      <div className="bg-blue-600 text-white p-4 shadow-md flex items-center">
        <button 
          onClick={handleClose} 
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
        <div 
          ref={chatContainerRef}
          className="h-[calc(100vh-220px)] overflow-y-auto mb-4 p-4"
        >
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
              className={`flex-1 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500' 
                  : 'bg-white border-gray-300 text-gray-800'
              } border rounded-l-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white px-6 py-3 rounded-r-md hover:bg-blue-700 transition flex items-center justify-center"
            >
              <Send size={20} className="mr-2" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}