// import { useState, useEffect, useRef } from 'react';
// import { ArrowLeft, Send, RefreshCw } from 'lucide-react';
// import * as webllm from "@mlc-ai/web-llm";

// // Initialize AI engine with better model
// let engine = null;
// const MODEL_NAME = "Llama-2-13b-chat-hf-q4f32_1"; // More capable 13B parameter model

// // Conversation memory
// let conversationHistory = [];

// // Initialize WebLLM engine with better configuration
// const initEngine = async () => {
//   try {
//     const initProgressCallback = (report) => {
//       console.log(`Loading: ${report.progress * 100}%`);
//     };
    
//     engine = await webllm.CreateWebWorkerEngine(
//       new Worker(new URL('./worker.js', import.meta.url)), // Custom worker
//       initProgressCallback
//     );
    
//     await engine.reload(MODEL_NAME, {
//       temperature: 0.7, // More creative responses
//       max_gen_len: 512, // Longer responses
//       repetition_penalty: 1.1 // Avoid repetitive text
//     });
    
//     console.log("AI engine loaded successfully");
//     return true;
//   } catch (error) {
//     console.error("Engine initialization failed:", error);
//     return false;
//   }
// };

// // Enhanced intent recognition
// const recognizeIntent = (question) => {
//   const q = question.toLowerCase().trim();
  
//   // Common news-related intents
//   const intents = {
//     summary: q.includes("summary") || q.includes("summarize") || q.includes("overview"),
//     author: q.includes("who wrote") || q.includes("author") || q.includes("reporter"),
//     date: q.includes("when") || q.includes("date") || q.includes("time"),
//     location: q.includes("where") || q.includes("place") || q.includes("location"),
//     verification: q.includes("true") || q.includes("false") || q.includes("verify") || q.includes("fact"),
//     explanation: q.includes("how") || q.includes("why") || q.includes("explain"),
//     impact: q.includes("effect") || q.includes("impact") || q.includes("consequence"),
//     technical: q.includes("technical") || q.includes("detail") || q.includes("specific"),
//     opinion: q.includes("think") || q.includes("opinion") || q.includes("view"),
//     comparison: q.includes("compare") || q.includes("versus") || q.includes("difference"),
//     followup: q.includes("also") || q.includes("more") || q.includes("addition"),
//     clarification: q.includes("what do you mean") || q.includes("clarify") || q.includes("elaborate")
//   };

//   return Object.keys(intents).find(key => intents[key]) || "general";
// };

// // Advanced response generation
// const generateChatResponse = async (question, newsItem) => {
//   try {
//     const intent = recognizeIntent(question);
//     const history = conversationHistory.slice(-3).map(m => `${m.sender}: ${m.text}`).join("\n");
    
//     const prompt = `[INST] <<SYS>>
//     You are an expert news analyst with deep knowledge of current events. Use the following guidelines:
    
//     Article Context:
//     Title: ${newsItem.title}
//     Author: ${newsItem.author || "Unknown"}
//     Published: ${newsItem.timestamp || "Unknown date"}
//     Content: ${newsItem.content || newsItem.description}
    
//     Conversation History:
//     ${history || "No history yet"}
    
//     Instructions:
//     1. For factual questions, provide precise answers with relevant details
//     2. For analytical questions, offer insightful perspectives
//     3. For verification requests, clarify the article's verification status
//     4. For technical questions, explain concepts clearly
//     5. If unsure, say you don't know but suggest possible sources
//     6. Maintain a professional yet approachable tone
//     <</SYS>>
    
//     User Question (Intent: ${intent}): ${question} 
//     Provide a comprehensive response addressing all aspects of the question. [/INST]`;

//     const response = await engine.generate(prompt, {
//       streamInterval: 1, // For potential streaming UI
//       onUpdate: (partialResponse) => {
//         // Could implement streaming UI here
//       }
//     });

//     // Update conversation history
//     conversationHistory.push(
//       { sender: "user", text: question },
//       { sender: "bot", text: response }
//     );

//     return response;
//   } catch (error) {
//     console.error("Generation error:", error);
//     return await handleErrorCase(question, newsItem, error);
//   }
// };

// // Comprehensive error handling
// const handleErrorCase = async (question, newsItem, error) => {
//   console.error("Error in response generation:", error);
  
//   // Try simpler model approach
//   const simpleResponse = generateSimpleResponse(question, newsItem);
//   if (simpleResponse) return simpleResponse;
  
//   // Final fallback
//   return `I'm having trouble generating a complete response. Here's what I can share about "${newsItem.title}": ${
//     newsItem.description || "Please try asking a more specific question."
//   }`;
// };

// // Improved simple response generator
// const generateSimpleResponse = (question, newsItem) => {
//   const q = question.toLowerCase();
//   const responses = {
//     who: `This article was written by ${newsItem.author || "an unknown author"}.`,
//     when: `Published on ${newsItem.timestamp || "an unspecified date"}.`,
//     where: newsItem.location ? `This news is about events in ${newsItem.location}.` : null,
//     summary: `Key points: ${newsItem.description}`,
//     verify: `This article is ${newsItem.isVerified ? "verified by our editorial team" : "not yet verified"}.`,
//     default: [
//       `Regarding "${newsItem.title}", the article discusses ${newsItem.category || "important developments"}.`,
//       `The report mentions: ${newsItem.description}`,
//       `You can find more details in the full article content.`,
//       `This coverage was provided by ${newsItem.source || "our news team"}.`
//     ]
//   };

//   if (q.includes("who")) return responses.who;
//   if (q.includes("when")) return responses.when;
//   if (q.includes("where")) return responses.where || responses.default[0];
//   if (q.includes("summary") || q.includes("overview")) return responses.summary;
//   if (q.includes("verify") || q.includes("true")) return responses.verify;
  
//   return responses.default[Math.floor(Math.random() * responses.default.length)];
// };

// export default function Chatbot({ news, darkMode, setActiveFeature }) {
//   const [chatMessages, setChatMessages] = useState([]);
//   const [chatInput, setChatInput] = useState("");
//   const [isVisible, setIsVisible] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [engineStatus, setEngineStatus] = useState("loading");
//   const [progress, setProgress] = useState(0);
//   const chatContainerRef = useRef(null);
  
//   // Initialize with better loading experience
//   useEffect(() => {
//     const init = async () => {
//       setIsVisible(true);
//       setChatMessages([{
//         sender: "bot",
//         text: "Initializing advanced news analysis assistant... (This may take a minute)"
//       }]);
      
//       try {
//         const success = await initEngine();
//         setEngineStatus(success ? "ready" : "error");
        
//         if (success) {
//           setChatMessages([{
//             sender: "bot",
//             text: `I'm ready to analyze "${news.title}". I can:\n\n` +
//                   `• Explain key concepts\n` +
//                   `• Verify facts\n` +
//                   `• Provide context\n` +
//                   `• Answer detailed questions\n\n` +
//                   `What would you like to know?`
//           }]);
//         } else {
//           setChatMessages([{
//             sender: "bot",
//             text: `I can discuss "${news.title}" with basic functionality. ` +
//                   `(Advanced analysis unavailable)`
//           }]);
//         }
//       } catch (error) {
//         setEngineStatus("error");
//         setChatMessages([{
//           sender: "bot",
//           text: `Let's discuss "${news.title}". ` +
//                 `(Running in limited capacity mode)`
//         }]);
//       }
//     };
    
//     init();
//     return () => {
//       conversationHistory = []; // Reset conversation on unmount
//     };
//   }, [news]);

//   // Auto-scroll with smooth behavior
//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTo({
//         top: chatContainerRef.current.scrollHeight,
//         behavior: 'smooth'
//       });
//     }
//   }, [chatMessages]);

//   const handleSendMessage = async () => {
//     if (!chatInput.trim()) return;
    
//     // Add user message
//     const userMessage = { sender: "user", text: chatInput };
//     setChatMessages(prev => [...prev, userMessage]);
//     setChatInput("");
//     setIsLoading(true);
    
//     try {
//       const botResponse = await generateChatResponse(chatInput, news);
//       setChatMessages(prev => [...prev, { sender: "bot", text: botResponse }]);
//     } catch (error) {
//       console.error("Error in message handling:", error);
//       setChatMessages(prev => [...prev, { 
//         sender: "bot", 
//         text: "I encountered an unexpected error. Please try rephrasing your question."
//       }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResetConversation = () => {
//     conversationHistory = [];
//     setChatMessages([{
//       sender: "bot",
//       text: "Conversation reset. What would you like to know about this article?"
//     }]);
//   };

//   const handleClose = () => {
//     setIsVisible(false);
//     setTimeout(() => setActiveFeature(null), 300);
//   };

//   const containerClasses = `fixed inset-0 z-50 ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-opacity duration-300 ${
//     isVisible ? 'opacity-100' : 'opacity-0'
//   }`;

//   return (
//     <div className={containerClasses}>
//       <div className={`${darkMode ? 'bg-gray-800' : 'bg-blue-600'} text-white p-4 shadow-md flex items-center justify-between`}>
//         <div className="flex items-center">
//           <button 
//             onClick={handleClose} 
//             className="mr-3 hover:opacity-80 p-1 rounded-full transition"
//           >
//             <ArrowLeft size={20} />
//           </button>
//           <div>
//             <h2 className="font-semibold">News Analysis Assistant</h2>
//             <p className="text-sm opacity-90">Discussing: {news.title}</p>
//           </div>
//         </div>
//         <div className="flex items-center space-x-2">
//           {engineStatus === "loading" && (
//             <div className="text-xs flex items-center">
//               <span>Loading AI: {Math.round(progress * 100)}%</span>
//             </div>
//           )}
//           <button
//             onClick={handleResetConversation}
//             className="text-xs flex items-center p-2 rounded hover:bg-white hover:bg-opacity-10 transition"
//             title="Reset conversation"
//           >
//             <RefreshCw size={16} className="mr-1" />
//             Reset
//           </button>
//         </div>
//       </div>
      
//       <div className="container mx-auto p-4 max-w-3xl h-[calc(100vh-64px)] flex flex-col">
//         <div 
//           ref={chatContainerRef}
//           className="flex-1 overflow-y-auto mb-4 p-4 space-y-4"
//         >
//           {chatMessages.map((msg, index) => (
//             <div 
//               key={index} 
//               className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
//             >
//               <div 
//                 className={`max-w-[85%] px-4 py-3 rounded-2xl ${
//                   msg.sender === "user" 
//                     ? "bg-blue-600 text-white" 
//                     : darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-100 text-gray-800"
//                 } whitespace-pre-wrap`}
//               >
//                 {msg.text}
//               </div>
//             </div>
//           ))}
          
//           {isLoading && (
//             <div className="flex justify-start">
//               <div className={`px-4 py-2 rounded-2xl ${
//                 darkMode ? 'bg-gray-700' : 'bg-gray-100'
//               }`}>
//                 <div className="flex space-x-2">
//                   <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
//                   <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{animationDelay: '0.2s'}}></div>
//                   <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{animationDelay: '0.4s'}}></div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
        
//         <div className={`sticky bottom-0 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} p-2 border-t shadow-lg`}>
//           <div className="flex">
//             <input
//               type="text"
//               value={chatInput}
//               onChange={(e) => setChatInput(e.target.value)}
//               placeholder="Ask about this news article..."
//               className={`flex-1 ${
//                 darkMode 
//                   ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400' 
//                   : 'bg-white border-gray-300 text-gray-800'
//               } border rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
//               onKeyPress={(e) => {
//                 if (e.key === "Enter" && !isLoading) handleSendMessage();
//               }}
//               disabled={isLoading}
//             />
//             <button
//               onClick={handleSendMessage}
//               className={`${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-3 rounded-r-lg transition flex items-center justify-center min-w-[100px]`}
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <span className="flex items-center">
//                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Thinking...
//                 </span>
//               ) : (
//                 <>
//                   <Send size={18} className="mr-1" />
//                   Send
//                 </>
//               )}
//             </button>
//           </div>
//           <div className="text-xs mt-2 text-center text-gray-500">
//             {engineStatus === "ready" ? "AI Assistant Ready" : 
//              engineStatus === "error" ? "Basic Mode - Some features limited" : 
//              "Loading AI Model..."}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, RefreshCw, BookOpen, ShieldAlert, Calendar, MapPin, User } from 'lucide-react';

// Conversation memory with enhanced context tracking
let conversationContext = {
  history: [],
  currentTopic: null,
  userPreferences: {
    detailLevel: 'normal', // 'brief', 'normal', 'detailed'
    responseStyle: 'analytical' // 'factual', 'analytical', 'casual'
  }
};

// Enhanced intent and context recognition
const analyzeInput = (input, newsItem) => {
  const text = input.toLowerCase().trim();
  
  // Detect response length preference
  const lengthPref = text.includes('brief') ? 'brief' : 
                    text.includes('detail') ? 'detailed' : 
                    conversationContext.userPreferences.detailLevel;

  // Detect style preference
  const stylePref = text.includes('casual') ? 'casual' :
                    text.includes('fact') ? 'factual' :
                    text.includes('analyze') ? 'analytical' :
                    conversationContext.userPreferences.responseStyle;

  // Update context
  conversationContext.userPreferences = {
    detailLevel: lengthPref,
    responseStyle: stylePref
  };

  // Detect specific content requests
  const contentRequests = {
    statistics: /stat|data|figure|number|percent/i.test(text),
    quotes: /quote|say|mention/i.test(text),
    background: /context|backstory|history/i.test(text),
    implications: /implic|consequence|effect|impact/i.test(text),
    opinions: /opinion|view|think|believe/i.test(text),
    comparisons: /compare|contrast|versus|difference/i.test(text),
    technical: /technical|detail|specific|how it works/i.test(text)
  };

  // Detect question type
  const questionType = {
    factual: /who|what|when|where|which|how many/i.test(text),
    explanatory: /why|how|explain|describe/i.test(text),
    evaluative: /good|bad|effective|success/i.test(text),
    predictive: /will|future|next|predict/i.test(text)
  };

  return {
    intent: Object.keys(contentRequests).find(k => contentRequests[k]) || 'general',
    questionType: Object.keys(questionType).find(k => questionType[k]) || 'other',
    lengthPref,
    stylePref,
    needsFollowUp: /more|else|another|additional/i.test(text),
    isClarification: /clarify|explain|mean|elaborate/i.test(text)
  };
};

// Generate comprehensive, context-aware responses using OpenAI API
const generateDetailedResponse = async (input, newsItem) => {
  const analysis = analyzeInput(input, newsItem);
  const { intent, questionType, lengthPref, stylePref } = analysis;

  // Prepare messages array for OpenAI API
  const messages = [
    {
      role: "system",
      content: `You are an expert news analyst with deep knowledge of current events. Use these guidelines:

      Article Context:
      Title: ${newsItem.title}
      Author: ${newsItem.author || "Unknown"}
      Published: ${newsItem.timestamp || "Unknown date"}
      
      User Preferences:
      - Detail level: ${lengthPref}
      - Style: ${stylePref}
      - Current focus: ${conversationContext.currentTopic || "General discussion"}

      Response Guidelines:
      1. For ${lengthPref} responses: ${lengthPref === 'brief' ? '1-2 sentences' : lengthPref === 'detailed' ? '4-6 paragraphs' : '2-3 paragraphs'}
      2. Use ${stylePref} style: ${stylePref === 'factual' ? 'Just the facts' : stylePref === 'analytical' ? 'Provide analysis' : 'Conversational tone'}
      3. For ${intent} requests: ${getIntentGuidance(intent)}
      4. For ${questionType} questions: ${getQuestionTypeGuidance(questionType)}`
    },
    ...conversationContext.history.slice(-3).map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    {
      role: "user",
      content: `Article Content: ${newsItem.content || newsItem.description}\n\nQuestion: ${input}`
    }
  ];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.7,
        max_tokens: lengthPref === 'detailed' ? 1000 : lengthPref === 'brief' ? 150 : 500,
        top_p: 0.9,
        frequency_penalty: 0.2,
        presence_penalty: 0.2
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const botResponse = data.choices[0].message.content;
    
    // Update conversation context
    conversationContext.history.push(
      { role: 'user', content: input },
      { role: 'assistant', content: botResponse }
    );
    conversationContext.currentTopic = intent;

    return enhanceResponseStructure(botResponse, analysis);
  } catch (error) {
    console.error("API Error:", error);
    return await handleGenerationError(input, newsItem, error);
  }
};

// Helper functions for response generation
const getIntentGuidance = (intent) => {
  const guidance = {
    statistics: "Focus on numerical data, percentages, and measurable impacts",
    quotes: "Include direct quotes or paraphrases from sources",
    background: "Provide historical context and relevant background information",
    implications: "Discuss potential consequences and ripple effects",
    opinions: "Present balanced perspectives from multiple viewpoints",
    comparisons: "Draw parallels to similar events or situations",
    technical: "Explain mechanisms and processes in detail",
    general: "Cover all key aspects of the topic"
  };
  return guidance[intent] || "Address the core topic comprehensively";
};

const getQuestionTypeGuidance = (type) => {
  return {
    factual: "Provide precise information with sources if available",
    explanatory: "Break down complex concepts into understandable parts",
    evaluative: "Offer balanced assessment of strengths and weaknesses",
    predictive: "Discuss potential future developments based on evidence",
    other: "Address the question thoroughly based on available information"
  }[type];
};

const enhanceResponseStructure = (response, analysis) => {
  if (analysis.lengthPref === 'detailed') {
    return response.split('\n').map((para, i) => {
      if (i === 0) return `**${para.trim()}**`;
      if (para.length > 120) return `- ${para.trim()}`;
      return para;
    }).join('\n\n');
  }
  return response;
};

// Comprehensive error handling with context recovery
const handleGenerationError = async (input, newsItem, error) => {
  console.error("Error in response generation:", error);
  
  // Final fallback with article highlights
  return `I'm having technical difficulties generating a full response. Here are key points from "${newsItem.title}":\n\n` +
         `- ${newsItem.description}\n` +
         (newsItem.author ? `- Reported by ${newsItem.author}\n` : '') +
         (newsItem.timestamp ? `- Published on ${newsItem.timestamp}\n` : '') +
         `\nPlease try asking a more specific question.`;
};

export default function Chatbot({ news, darkMode, setActiveFeature }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState("ready");
  const chatContainerRef = useRef(null);
  
  // Initialize with conversation setup
  useEffect(() => {
    setIsVisible(true);
    setChatMessages([{
      sender: "bot",
      text: `I'm ready to analyze "${news.title}". I can provide:\n\n` +
            `• Detailed explanations\n` +
            `• Contextual background\n` +
            `• Statistical analysis\n` +
            `• Expert perspectives\n` +
            `• Future implications\n\n` +
            `You can ask for specific details or request a particular style (e.g., "Explain technically" or "Summarize briefly").`,
      meta: { type: "welcome" }
    }]);
    
    // Initialize conversation context
    conversationContext = {
      ...conversationContext,
      currentTopic: "article overview",
      history: [{
        role: 'system',
        content: `New conversation started about article: ${news.title}`
      }]
    };
    
    return () => {
      conversationContext.history = [];
    };
  }, [news]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    // Add user message
    const userMessage = { 
      sender: "user", 
      text: chatInput,
      meta: { timestamp: new Date().toLocaleTimeString() }
    };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsLoading(true);
    setApiStatus("processing");
    
    try {
      const botResponse = await generateDetailedResponse(chatInput, news);
      setChatMessages(prev => [...prev, { 
        sender: "bot", 
        text: botResponse,
        meta: {
          type: "response",
          intent: analyzeInput(chatInput, news).intent,
          length: botResponse.length > 500 ? "long" : botResponse.length > 200 ? "medium" : "short"
        }
      }]);
      setApiStatus("ready");
    } catch (error) {
      console.error("Error in message handling:", error);
      setChatMessages(prev => [...prev, { 
        sender: "bot", 
        text: "I encountered an unexpected error processing your request. Please try rephrasing or asking a different question.",
        meta: { type: "error" }
      }]);
      setApiStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetConversation = () => {
    conversationContext = {
      history: [],
      currentTopic: null,
      userPreferences: {
        detailLevel: 'normal',
        responseStyle: 'analytical'
      }
    };
    setChatMessages([{
      sender: "bot",
      text: "Conversation reset. What would you like to know about this article?",
      meta: { type: "system" }
    }]);
    setApiStatus("ready");
  };

  const handleQuickQuestion = (question) => {
    setChatInput(question);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setActiveFeature(null), 300);
  };

  const containerClasses = `fixed inset-0 z-50 ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-opacity duration-300 ${
    isVisible ? 'opacity-100' : 'opacity-0'
  }`;

  return (
    <div className={containerClasses}>
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-blue-600'} text-white p-4 shadow-md flex items-center justify-between`}>
        <div className="flex items-center">
          <button 
            onClick={handleClose} 
            className="mr-3 hover:opacity-80 p-1 rounded-full transition"
            aria-label="Close chat"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-semibold">News Analysis Assistant</h2>
            <p className="text-sm opacity-90">Discussing: {news.title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleResetConversation}
            className="text-xs flex items-center p-2 rounded hover:bg-white hover:bg-opacity-10 transition"
            title="Reset conversation"
            aria-label="Reset conversation"
          >
            <RefreshCw size={16} className="mr-1" />
            Reset
          </button>
        </div>
      </div>
      
      <div className="container mx-auto p-4 max-w-3xl h-[calc(100vh-64px)] flex flex-col">
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto mb-4 p-4 space-y-4"
        >
          {chatMessages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[90%] px-4 py-3 rounded-2xl ${
                  msg.sender === "user" 
                    ? "bg-blue-600 text-white" 
                    : darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-100 text-gray-800"
                } whitespace-pre-wrap`}
              >
                {msg.text}
                {msg.sender === "bot" && msg.meta?.intent && (
                  <div className={`text-xs mt-2 flex items-center ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {msg.meta.intent === 'statistics' && <BookOpen size={12} className="mr-1" />}
                    {msg.meta.intent === 'verification' && <ShieldAlert size={12} className="mr-1" />}
                    {msg.meta.intent === 'date' && <Calendar size={12} className="mr-1" />}
                    {msg.meta.intent === 'location' && <MapPin size={12} className="mr-1" />}
                    {msg.meta.intent === 'author' && <User size={12} className="mr-1" />}
                    {msg.meta.type === 'response' && `Analyzed as ${msg.meta.intent} question`}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className={`px-4 py-2 rounded-2xl ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
                <div className="text-xs mt-1">
                  Analyzing your question...
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Quick question suggestions */}
        {!isLoading && chatMessages.length <= 2 && (
          <div className={`mb-2 grid grid-cols-2 gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <button 
              onClick={() => handleQuickQuestion("Summarize the key points")}
              className="text-xs p-2 rounded border hover:bg-blue-50 hover:border-blue-200 transition"
            >
              Summarize key points
            </button>
            <button 
              onClick={() => handleQuickQuestion("Explain the main concepts")}
              className="text-xs p-2 rounded border hover:bg-blue-50 hover:border-blue-200 transition"
            >
              Explain main concepts
            </button>
            <button 
              onClick={() => handleQuickQuestion("What's the background context?")}
              className="text-xs p-2 rounded border hover:bg-blue-50 hover:border-blue-200 transition"
            >
              Background context
            </button>
            <button 
              onClick={() => handleQuickQuestion("What are the implications?")}
              className="text-xs p-2 rounded border hover:bg-blue-50 hover:border-blue-200 transition"
            >
              Future implications
            </button>
          </div>
        )}
        
        <div className={`sticky bottom-0 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} p-2 border-t shadow-lg`}>
          <div className="flex">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about this news article..."
              className={`flex-1 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-800'
              } border rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !isLoading) handleSendMessage();
              }}
              disabled={isLoading}
              aria-label="Type your question"
            />
            <button
              onClick={handleSendMessage}
              className={`${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-3 rounded-r-lg transition flex items-center justify-center min-w-[100px]`}
              disabled={isLoading}
              aria-label="Send message"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Thinking...
                </span>
              ) : (
                <>
                  <Send size={18} className="mr-1" />
                  Send
                </>
              )}
            </button>
          </div>
          <div className="text-xs mt-2 text-center text-gray-500">
            {apiStatus === "ready" ? "AI Assistant Ready" : 
             apiStatus === "processing" ? "Processing your question..." : 
             "Error - Please try again"}
          </div>
        </div>
      </div>
    </div>
  );
}