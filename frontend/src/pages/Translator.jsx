import { useState } from 'react';
import { ChevronDown, XCircle } from 'lucide-react';

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

export default function Translator({ news, darkMode, setActiveFeature }) {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  return (
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
      
      <div className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} rounded-lg p-4 shadow-sm`}>
        <h4 className="font-medium mb-2">{mockTranslate(news.title, selectedLanguage)}</h4>
        <p className="text-sm">{mockTranslate(news.description, selectedLanguage)}</p>
      </div>
    </div>
  );
}