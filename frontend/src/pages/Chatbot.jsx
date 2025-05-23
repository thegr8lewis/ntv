import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, X, MessageSquare } from 'lucide-react';

export default function Chatbot({ news, darkMode, setActiveFeature }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      inputRef.current?.focus();
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setChatMessages([
      {
        sender: 'bot',
        text: `Hi! I'm your news assistant. Ask me anything about this article: "${news.title}".`,
      },
    ]);
  }, [news]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const generateChatResponse = async (question) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'mistral', // Switch to 'phi' if using a smaller model
          prompt: `You are a helpful news assistant. Answer this question about the article titled "${news.title}"${
            news.author ? ` by ${news.author}` : ''
          }${
            news.timestamp ? `, published ${news.timestamp}` : ''
          }${
            news.category ? ` in category ${news.category}` : ''
          }${
            news.isVerified ? '. The article is verified by fact-checkers.' : '. The article is not yet verified.'
          }: ${question}`,
          stream: false,
          max_tokens: 150, // Limit response length
          temperature: 0.7, // Balance creativity and accuracy
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.response || 'I couldn’t generate a response. Please try again.';
    } catch (error) {
      console.error('Error calling Ollama API:', error);
      return 'Sorry, I’m having trouble connecting to the local AI service. Ensure Ollama is running (run "ollama serve" in a terminal) and the Mistral model is installed (run "ollama list" to verify).';
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;

    // Add user message
    const userMessage = { sender: 'user', text: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');

    try {
      const botResponse = await generateChatResponse(chatInput);
      setChatMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Sorry, I encountered an error processing your request.',
        },
      ]);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setActiveFeature(null);
    }, 300);
  };

  const containerClasses = `fixed inset-0 z-50 ${
    darkMode ? 'bg-gray-900' : 'bg-gray-50'
  } transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`;

  return (
    <div className={containerClasses}>
      <div
        className={`${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg rounded-lg mx-auto my-4 max-w-3xl overflow-hidden flex flex-col h-[calc(100vh-32px)]`}
      >
        {/* Header */}
        <div
          className={`${
            darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
          } px-6 py-4 flex items-center justify-between`}
        >
          <div className="flex items-center">
            <button
              onClick={handleClose}
              className="mr-3 hover:bg-blue-700 p-2 rounded-full transition"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="font-semibold tracking-tight">{news.title}</h2>
              <div className="flex items-center mt-1">
                <MessageSquare size={14} className="mr-1 text-blue-300" />
                <p className="text-xs text-blue-200">Interactive Chat Assistant</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="hover:bg-blue-700 p-2 rounded-full transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat Messages */}
        <div
          ref={chatContainerRef}
          className={`flex-1 overflow-y-auto overflow-x-hidden p-6 ${
            darkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}
        >
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`mb-6 flex ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'bot' && (
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    darkMode ? 'bg-blue-600' : 'bg-blue-100'
                  }`}
                >
                  <MessageSquare
                    size={16}
                    className={darkMode ? 'text-white' : 'text-blue-600'}
                  />
                </div>
              )}
              <div
                className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? `${darkMode ? 'bg-blue-600' : 'bg-blue-600'} text-white ml-4`
                    : darkMode
                    ? 'bg-gray-800 text-gray-200'
                    : 'bg-white text-gray-800 shadow-sm'
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === 'user' && (
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ml-3 ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                >
                  <span className="text-xs font-semibold">You</span>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-6">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  darkMode ? 'bg-blue-600' : 'bg-blue-100'
                }`}
              >
                <MessageSquare
                  size={16}
                  className={darkMode ? 'text-white' : 'text-blue-600'}
                />
              </div>
              <div
                className={`px-4 py-3 rounded-2xl ${
                  darkMode
                    ? 'bg-gray-800 text-gray-200'
                    : 'bg-white text-gray-800 shadow-sm'
                }`}
              >
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div
          className={`p-4 ${
            darkMode
              ? 'bg-gray-800 border-t border-gray-700'
              : 'bg-white border-t border-gray-100'
          } shadow-lg`}
        >
          <div className="flex items-center bg-opacity-50 rounded-full overflow-hidden shadow-sm">
            <input
              ref={inputRef}
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about this news article..."
              className={`flex-1 ${
                darkMode
                  ? 'bg-gray-700 text-gray-200 placeholder-gray-400'
                  : 'bg-gray-100 text-gray-800 placeholder-gray-500'
              } px-6 py-4 focus:outline-none rounded-l-full`}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className={`${
                darkMode ? 'bg-blue-600' : 'bg-blue-600'
              } text-white px-6 py-4 hover:bg-blue-700 transition flex items-center justify-center ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <Send size={18} className={isLoading ? 'animate-pulse' : ''} />
            </button>
          </div>
          <div className="text-xs text-center mt-2 text-gray-500">
            {news.isVerified
              ? '✓ Article verified by fact-checkers'
              : 'Article not yet verified'}
          </div>
        </div>
      </div>
    </div>
  );
}