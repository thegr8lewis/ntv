// import { useState, useEffect, useRef } from 'react';
// import { ArrowLeft, Send, X, MessageSquare } from 'lucide-react';

// export default function Chatbot({ item, darkMode, setActiveFeature }) {
//   const [chatMessages, setChatMessages] = useState([]);
//   const [chatInput, setChatInput] = useState('');
//   const [isVisible, setIsVisible] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const chatContainerRef = useRef(null);
//   const inputRef = useRef(null);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsVisible(true);
//       inputRef.current?.focus();
//     }, 50);

//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (!item) {
//       setChatMessages([{ sender: 'bot', text: 'Sorry, no item data is available. Please try again.' }]);
//       return;
//     }

//     let initialMessage = 'Hi! I’m your assistant. Ask me anything about this item.';
//     if (item.type === 'news') {
//       initialMessage = `Hi! I'm your news assistant. Ask me anything about this article: "${item.title || 'Untitled'}".`;
//     } else if (item.type === 'job') {
//       initialMessage = `Hi! I'm your job assistant. Ask me anything about this job opportunity: "${item.title || 'Untitled'}" at ${item.company_name || 'the company'}.`;
//     } else if (item.type === 'product') {
//       initialMessage = `Hi! I'm your product assistant. Ask me anything about this product: "${item.title || 'Untitled'}" from ${item.brand || 'the brand'}.`;
//     }

//     setChatMessages([{ sender: 'bot', text: initialMessage }]);
//   }, [item]);

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [chatMessages]);

//   const generateChatResponse = async (question) => {
//     setIsLoading(true);
//     try {
//       if (!item) {
//         return 'No item data is available. Please try again.';
//       }

//       let prompt = `You are a helpful assistant. Answer this question about the item: ${question}`;
//       if (item.type === 'news') {
//         prompt = `You are a helpful news assistant. Answer this question about the article titled "${item.title || 'Untitled'}"${
//           item.author ? ` by ${item.author}` : ''
//         }${
//           item.timestamp ? `, published ${item.timestamp}` : ''
//         }${
//           item.category ? ` in category ${item.category}` : ''
//         }${
//           item.isVerified ? '. The article is verified by fact-checkers.' : '. The article is not yet verified.'
//         }: ${question}`;
//       } else if (item.type === 'job') {
//         prompt = `You are a helpful job assistant. Answer this question about the job opportunity titled "${item.title || 'Untitled'}" at ${item.company_name || 'the company'}${
//           item.location ? ` in ${item.location}` : ''
//         }${
//           item.schedule_type ? `, schedule: ${item.schedule_type}` : ''
//         }${
//           item.work_from_home === "TRUE" ? ', remote work available' : ', on-site work'
//         }${
//           item.salary ? `, salary: ${item.salary}` : ''
//         }. Description: ${item.description || 'No description provided'}: ${question}`;
//       } else if (item.type === 'product') {
//         prompt = `You are a helpful product assistant. Answer this question about the product titled "${item.title || 'Untitled'}" from ${item.brand || 'the brand'}${
//           item.sold_price ? `, sold for ₹${item.sold_price}` : ''
//         }${
//           item.actual_price ? `, original price ₹${item.actual_price}` : ''
//         }. Description: ${item.description || 'No description provided'}: ${question}`;
//       }

//       const response = await fetch('http://localhost:11434/api/generate', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           model: 'mistral',
//           prompt,
//           stream: false,
//           max_tokens: 150,
//           temperature: 0.7,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Ollama API request failed with status ${response.status}`);
//       }

//       const data = await response.json();
//       return data.response || 'I couldn’t generate a response. Please try again.';
//     } catch (error) {
//       console.error('Error calling Ollama API:', error);
//       return 'Sorry, I’m having trouble connecting to the local AI service. Ensure Ollama is running (run "ollama serve" in a terminal) and the Mistral model is installed (run "ollama list" to verify).';
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!chatInput.trim() || isLoading) return;

//     const userMessage = { sender: 'user', text: chatInput };
//     setChatMessages((prev) => [...prev, userMessage]);
//     setChatInput('');

//     try {
//       const botResponse = await generateChatResponse(chatInput);
//       setChatMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
//     } catch (error) {
//       setChatMessages((prev) => [
//         ...prev,
//         {
//           sender: 'bot',
//           text: 'Sorry, I encountered an error processing your request.',
//         },
//       ]);
//     }
//   };

//   const handleClose = () => {
//     setIsVisible(false);
//     setTimeout(() => {
//       setActiveFeature(null);
//     }, 300);
//   };

//   const title = item ? (
//     item.type === 'news' ? item.title : 
//     item.type === 'job' ? `${item.title || 'Untitled'} at ${item.company_name || 'the company'}` : 
//     item.title || 'Untitled'
//   ) : 'Item';

//   const footerMessage = item ? (
//     item.type === 'news' && item.isVerified
//       ? '✓ Article verified by fact-checkers'
//       : item.type === 'news'
//       ? 'Article not yet verified'
//       : 'Information based on ad content'
//   ) : 'No item data available';

//   const containerClasses = `fixed inset-0 z-50 ${
//     darkMode ? 'bg-gray-900' : 'bg-gray-50'
//   } transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`;

//   return (
//     <div className={containerClasses}>
//       <div
//         className={`${
//           darkMode ? 'bg-gray-800' : 'bg-white'
//         } shadow-lg rounded-lg mx-auto my-4 max-w-3xl overflow-hidden flex flex-col h-[calc(100vh-32px)]`}
//       >
//         <div
//           className={`${
//             darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
//           } px-6 py-4 flex items-center justify-between`}
//         >
//           <div className="flex items-center">
//             <button
//               onClick={handleClose}
//               className="mr-3 hover:bg-blue-700 p-2 rounded-full transition"
//               aria-label="Back"
//             >
//               <ArrowLeft size={18} />
//             </button>
//             <div>
//               <h2 className="font-semibold tracking-tight">{title}</h2>
//               <div className="flex items-center mt-1">
//                 <MessageSquare size={14} className="mr-1 text-blue-300" />
//                 <p className="text-xs text-blue-200">Interactive Chat Assistant</p>
//               </div>
//             </div>
//           </div>
//           <button
//             onClick={handleClose}
//             className="hover:bg-blue-700 p-2 rounded-full transition"
//             aria-label="Close"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         <div
//           ref={chatContainerRef}
//           className={`flex-1 overflow-y-auto overflow-x-hidden p-6 ${
//             darkMode ? 'bg-gray-900' : 'bg-gray-50'
//           }`}
//         >
//           {chatMessages.map((msg, index) => (
//             <div
//               key={index}
//               className={`mb-6 flex ${
//                 msg.sender === 'user' ? 'justify-end' : 'justify-start'
//               }`}
//             >
//               {msg.sender === 'bot' && (
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
//                     darkMode ? 'bg-blue-600' : 'bg-blue-100'
//                   }`}
//                 >
//                   <MessageSquare
//                     size={16}
//                     className={darkMode ? 'text-white' : 'text-blue-600'}
//                   />
//                 </div>
//               )}
//               <div
//                 className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-3 rounded-2xl ${
//                   msg.sender === 'user'
//                     ? `${darkMode ? 'bg-blue-600' : 'bg-blue-600'} text-white ml-4`
//                     : darkMode
//                     ? 'bg-gray-800 text-gray-200'
//                     : 'bg-white text-gray-800 shadow-sm'
//                 }`}
//               >
//                 {msg.text}
//               </div>
//               {msg.sender === 'user' && (
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center ml-3 ${
//                     darkMode ? 'bg-gray-700' : 'bg-gray-200'
//                   }`}
//                 >
//                   <span className="text-xs font-semibold">You</span>
//                 </div>
//               )}
//             </div>
//           ))}
//           {isLoading && (
//             <div className="flex justify-start mb-6">
//               <div
//                 className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
//                   darkMode ? 'bg-blue-600' : 'bg-blue-100'
//                 }`}
//               >
//                 <MessageSquare
//                   size={16}
//                   className={darkMode ? 'text-white' : 'text-blue-600'}
//                 />
//               </div>
//               <div
//                 className={`px-4 py-3 rounded-2xl ${
//                   darkMode
//                     ? 'bg-gray-800 text-gray-200'
//                     : 'bg-white text-gray-800 shadow-sm'
//                 }`}
//               >
//                 <div className="flex space-x-2">
//                   <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
//                   <div
//                     className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
//                     style={{ animationDelay: '0.2s' }}
//                   ></div>
//                   <div
//                     className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
//                     style={{ animationDelay: '0.4s' }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         <div
//           className={`p-4 ${
//             darkMode
//               ? 'bg-gray-800 border-t border-gray-700'
//               : 'bg-white border-t border-gray-100'
//           } shadow-lg`}
//         >
//           <div className="flex items-center bg-opacity-50 rounded-full overflow-hidden shadow-sm">
//             <input
//               ref={inputRef}
//               type="text"
//               value={chatInput}
//               onChange={(e) => setChatInput(e.target.value)}
//               placeholder={item ? `Ask about this ${item.type}...` : 'Ask about this item...'}
//               className={`flex-1 ${
//                 darkMode
//                   ? 'bg-gray-700 text-gray-200 placeholder-gray-400'
//                   : 'bg-gray-100 text-gray-800 placeholder-gray-500'
//               } px-6 py-4 focus:outline-none rounded-l-full`}
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter') handleSendMessage();
//               }}
//               disabled={isLoading}
//             />
//             <button
//               onClick={handleSendMessage}
//               disabled={isLoading}
//               className={`${
//                 darkMode ? 'bg-blue-600' : 'bg-blue-600'
//               } text-white px-6 py-4 hover:bg-blue-700 transition flex items-center justify-center ${
//                 isLoading ? 'opacity-70 cursor-not-allowed' : ''
//               }`}
//             >
//               <Send size={18} className={isLoading ? 'animate-pulse' : ''} />
//             </button>
//           </div>
//           <div className="text-xs text-center mt-2 text-gray-500">
//             {footerMessage}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, X, MessageSquare, Upload } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source to the local pdfjs-dist worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.mjs';

export default function ChatbotAds({ item, darkMode, setActiveFeature }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      inputRef.current?.focus();
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!item) {
      setChatMessages([{ sender: 'bot', text: 'Sorry, no item data is available. Please try again.' }]);
      return;
    }

    let initialMessage = 'Hi! I’m your assistant. Ask me anything about this item.';
    if (item.type === 'news') {
      initialMessage = `Hi! I'm your news assistant. Ask me anything about this article: "${item.title || 'Untitled'}".`;
    } else if (item.type === 'job') {
      initialMessage = `Hi! I'm your job assistant. Ask me anything about this job opportunity: "${item.title || 'Untitled'}" at ${item.company_name || 'the company'}. You can also upload your resume for a personalized analysis!`;
    } else if (item.type === 'product') {
      initialMessage = `Hi! I'm your product assistant. Ask me anything about this product: "${item.title || 'Untitled'}" from ${item.brand || 'the brand'}.`;
    }

    setChatMessages([{ sender: 'bot', text: initialMessage }]);
  }, [item]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Please upload a valid PDF file.' },
      ]);
      return;
    }

    setUploadedFile(file);
    setIsLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      let extractedText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(' ');
        extractedText += pageText + ' ';
      }

      if (!extractedText.trim()) {
        throw new Error('No text could be extracted from the PDF.');
      }

      setResumeText(extractedText);
      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: `Resume uploaded successfully! I’ve extracted the content. Ask me to analyze it or ask questions about the job.` },
      ]);
    } catch (error) {
      console.error('Error parsing PDF:', error);
      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: `Sorry, I couldn’t process the PDF: ${error.message}. Please try uploading again.` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSuccessRate = (resumeText, jobDescription) => {
    if (!resumeText || !jobDescription) return 0;

    const resumeWords = resumeText.toLowerCase().split(/\s+/);
    const jobWords = jobDescription.toLowerCase().split(/\s+/);
    const commonWords = resumeWords.filter((word) => jobWords.includes(word));

    const uniqueJobWords = new Set(jobWords);
    const matchRatio = commonWords.length / uniqueJobWords.size;

    return Math.min(Math.round(matchRatio * 100), 100);
  };

  const generateChatResponse = async (question) => {
    setIsLoading(true);
    try {
      if (!item) {
        return 'No item data is available. Please try again.';
      }

      let prompt = `You are a helpful assistant. Answer this question about the item: ${question}`;
      if (item.type === 'news') {
        prompt = `You are a helpful news assistant. Answer this question about the article titled "${item.title || 'Untitled'}"${
          item.author ? ` by ${item.author}` : ''
        }${
          item.timestamp ? `, published ${item.timestamp}` : ''
        }${
          item.category ? ` in category ${item.category}` : ''
        }${
          item.isVerified ? '. The article is verified by fact-checkers.' : '. The article is not yet verified.'
        }: ${question}`;
      } else if (item.type === 'job') {
        const jobDescription = item.description || 'No description provided';
        prompt = `You are a helpful job assistant. Answer this question about the job opportunity titled "${item.title || 'Untitled'}" at ${item.company_name || 'the company'}${
          item.location ? ` in ${item.location}` : ''
        }${
          item.schedule_type ? `, schedule: ${item.schedule_type}` : ''
        }${
          item.work_from_home === "TRUE" ? ', remote work available' : ', on-site work'
        }${
          item.salary ? `, salary: ${item.salary}` : ''
        }. Job Description: ${jobDescription}.`;

        if (resumeText && (question.toLowerCase().includes('resume') || question.toLowerCase().includes('success rate'))) {
          const successRate = calculateSuccessRate(resumeText, jobDescription);
          prompt += `\nThe user has uploaded a resume with the following content: "${resumeText.slice(0, 1000)}..." (truncated for brevity). Analyze the resume against the job description and provide a success rate for the user's application. Quote relevant parts of the resume in your response. The calculated keyword-based success rate is ${successRate}%. Use this as a reference but provide a nuanced response. Question: ${question}`;
        } else {
          prompt += `\nQuestion: ${question}`;
        }
      } else if (item.type === 'product') {
        prompt = `You are a helpful product assistant. Answer this question about the product titled "${item.title || 'Untitled'}" from ${item.brand || 'the brand'}${
          item.sold_price ? `, sold for ₹${item.sold_price}` : ''
        }${
          item.actual_price ? `, original price ₹${item.actual_price}` : ''
        }. Description: ${item.description || 'No description provided'}: ${question}`;
      }

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'mistral',
          prompt,
          stream: false,
          max_tokens: 300,
          temperature: 0.7,
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

  const title = item
    ? item.type === 'news'
      ? item.title
      : item.type === 'job'
      ? `${item.title || 'Untitled'} at ${item.company_name || 'the company'}`
      : item.title || 'Untitled'
    : 'Item';

  const footerMessage = item
    ? item.type === 'news' && item.isVerified
      ? '✓ Article verified by fact-checkers'
      : item.type === 'news'
      ? 'Article not yet verified'
      : item.type === 'job' && resumeText
      ? 'Resume uploaded and analyzed'
      : 'Information based on ad content'
    : 'No item data available';

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
              <h2 className="font-semibold tracking-tight">{title}</h2>
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

        <div
          className={`p-4 ${
            darkMode
              ? 'bg-gray-800 border-t border-gray-700'
              : 'bg-white border-t border-gray-100'
          } shadow-lg`}
        >
          {item?.type === 'job' && (
            <div className="flex justify-start mb-3">
              <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                disabled={isLoading}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center px-4 py-2 rounded-full ${
                  darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'
                } hover:bg-opacity-80 transition ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                <Upload size={16} className="mr-2" />
                {uploadedFile ? 'Replace Resume' : 'Upload Resume (PDF)'}
              </button>
            </div>
          )}
          <div className="flex items-center bg-opacity-50 rounded-full overflow-hidden shadow-sm">
            <input
              ref={inputRef}
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={item ? `Ask about this ${item.type}...` : 'Ask about this item...'}
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
            {footerMessage}
          </div>
        </div>
      </div>
    </div>
  );
}