import { useState, useEffect } from 'react';
import { ChevronDown, XCircle, Loader2, AlertCircle, Check, ChevronUp, ChevronRight } from 'lucide-react';

const languages = [
  { code: "en", name: "English 🇬🇧" },
  { code: "es", name: "Spanish 🇪🇸" },
  { code: "fr", name: "French 🇫🇷" },
  { code: "de", name: "German 🇩🇪" },
  { code: "it", name: "Italian 🇮🇹" },
  { code: "pt", name: "Portuguese 🇵🇹" },
  { code: "ru", name: "Russian 🇷🇺" },
  { code: "zh", name: "Chinese 🇨🇳" },
  { code: "ja", name: "Japanese 🇯🇵" },
  { code: "ar", name: "Arabic 🇸🇦" },
  { code: "hi", name: "Hindi 🇮🇳" }
];

const API_ENDPOINTS = [
  "https://libretranslate.de/translate",
  "https://translate.argosopentech.com/translate",
  "https://libretranslate.com/translate"
];

const cacheTranslation = (text, targetLang, translatedText) => {
  const cacheKey = `translation_${targetLang}_${hashString(text)}`;
  localStorage.setItem(cacheKey, translatedText);
};

const getCachedTranslation = (text, targetLang) => {
  const cacheKey = `translation_${targetLang}_${hashString(text)}`;
  return localStorage.getItem(cacheKey);
};

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
};

const translateTextWithFallback = async (text, sourceLang, targetLang) => {
  const cached = getCachedTranslation(text, targetLang);
  if (cached) return cached;

  for (const endpoint of API_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang
        }),
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const translated = data.translatedText;
      cacheTranslation(text, targetLang, translated);
      return translated;
    } catch (err) {
      console.warn(`Translation failed with ${endpoint}:`, err);
    }
  }

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
    );
    const data = await response.json();
    if (data.responseData?.translatedText) {
      const translated = data.responseData.translatedText;
      cacheTranslation(text, targetLang, translated);
      return translated;
    }
    throw new Error("No translation found in MyMemory response");
  } catch (err) {
    console.warn("MyMemory translation failed:", err);
    throw new Error("All translation services failed");
  }
};

export default function Translator({ news, darkMode, setActiveFeature }) {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [translatedText, setTranslatedText] = useState({
    title: news.title,
    description: news.description,
    content: news.content || ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const translateContent = async () => {
      if (selectedLanguage === "en") {
        setTranslatedText({
          title: news.title,
          description: news.description,
          content: news.content || ""
        });
        setSuccess(false);
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const [title, description, content] = await Promise.all([
          translateTextWithFallback(news.title, "en", selectedLanguage),
          translateTextWithFallback(news.description, "en", selectedLanguage),
          news.content ? translateTextWithFallback(news.content, "en", selectedLanguage) : Promise.resolve("")
        ]);

        setTranslatedText({ title, description, content });
        setSuccess(true);
      } catch (err) {
        console.error("Translation error:", err);
        setError("Translation service is currently unavailable. Showing original text with language indicator.");
        setTranslatedText({
          title: `[${selectedLanguage.toUpperCase()}] ${news.title}`,
          description: `[${selectedLanguage.toUpperCase()}] ${news.description}`,
          content: news.content ? `[${selectedLanguage.toUpperCase()}] ${news.content}` : ""
        });
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(translateContent, 300);
    return () => clearTimeout(timer);
  }, [selectedLanguage, news.title, news.description, news.content]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`mb-6 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg p-4 shadow-md transition-all duration-200`}>
      <div className={`flex justify-between items-center mb-4 border-b ${darkMode ? 'border-gray-600' : 'border-blue-100'} pb-2`}>
        <h3 className={`font-semibold flex items-center gap-2 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
          Translation
          {success && (
            <span className="flex items-center text-xs font-normal">
              <Check size={14} className="mr-1" />
              Success
            </span>
          )}
        </h3>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className={`${darkMode ? 'bg-gray-800 border-gray-600 hover:bg-gray-700' : 'bg-white border-gray-300 hover:bg-gray-50'} border rounded-md px-3 py-1.5 text-sm flex items-center shadow-sm transition-colors`}
              disabled={loading}
            >
              {languages.find(l => l.code === selectedLanguage)?.name || 'Select'}
              <ChevronDown size={16} className={`ml-1 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showLanguageDropdown && (
              <div className={`absolute right-0 mt-1 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} border rounded-md shadow-lg z-10 w-48 max-h-60 overflow-y-auto`}>
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    className={`block w-full text-left px-4 py-2 text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors ${selectedLanguage === lang.code ? (darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800') : ''}`}
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
            className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
            aria-label="Close translation"
            disabled={loading}
          >
            <XCircle size={20} />
          </button>
        </div>
      </div>
      
      {error && (
        <div className={`mb-4 p-3 rounded-md flex items-start gap-2 ${darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'} text-sm`}>
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      <div className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} rounded-lg p-4 shadow-sm transition-colors`}>
        {loading ? (
          <div className="flex items-center justify-center py-6 gap-2">
            <Loader2 className="animate-spin" size={18} />
            <span>Translating to {languages.find(l => l.code === selectedLanguage)?.name.split(' ')[0]}...</span>
          </div>
        ) : (
          <>
            <h4 className="font-medium mb-2 text-lg">{translatedText.title}</h4>
            <p className="text-sm whitespace-pre-line">{translatedText.description}</p>
            
            {translatedText.content && (
              <div className="mt-3">
                {expanded ? (
                  <div className="text-sm whitespace-pre-line border-t pt-3 mt-3">
                    {translatedText.content}
                  </div>
                ) : (
                  <button
                    onClick={toggleExpanded}
                    className={`mt-2 text-sm flex items-center gap-1 font-medium ${
                      darkMode 
                        ? 'text-blue-300 hover:text-blue-200' 
                        : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    <ChevronRight size={16} />
                    View Full Translation
                  </button>
                )}
                {expanded && (
                  <button
                    onClick={toggleExpanded}
                    className={`mt-2 text-sm flex items-center gap-1 font-medium ${
                      darkMode 
                        ? 'text-blue-300 hover:text-blue-200' 
                        : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    <ChevronUp size={16} />
                    View Less
                  </button>
                )}
              </div>
            )}
            
            {selectedLanguage !== "en" && (
              <div className={`mt-4 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-xs flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <span>Translated from English to {languages.find(l => l.code === selectedLanguage)?.name}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}