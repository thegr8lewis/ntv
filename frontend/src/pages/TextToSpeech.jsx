
// import { useState, useEffect } from 'react';
// import { Volume2, Pause, Play, X } from 'lucide-react';

// export default function TextToSpeech({ text, darkMode, setActiveFeature }) {
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [voices, setVoices] = useState([]);
//   const [selectedVoice, setSelectedVoice] = useState(null);
//   const [speechInstance, setSpeechInstance] = useState(null);

//   useEffect(() => {
//     const loadVoices = () => {
//       const availableVoices = window.speechSynthesis.getVoices();
//       setVoices(availableVoices);
//       if (availableVoices.length > 0 && !selectedVoice) {
//         setSelectedVoice(availableVoices[0]);
//       }
//     };

//     loadVoices();
//     window.speechSynthesis.onvoiceschanged = loadVoices;

//     return () => {
//       window.speechSynthesis.cancel();
//     };
//   }, [selectedVoice]);

//   const handleSpeak = () => {
//     if (isSpeaking) {
//       window.speechSynthesis.pause();
//       setIsSpeaking(false);
//       return;
//     }

//     if (speechInstance && window.speechSynthesis.paused) {
//       window.speechSynthesis.resume();
//       setIsSpeaking(true);
//       return;
//     }

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.voice = selectedVoice;
//     utterance.onend = () => {
//       setIsSpeaking(false);
//       setSpeechInstance(null);
//       setActiveFeature(null);
//     };

//     window.speechSynthesis.speak(utterance);
//     setSpeechInstance(utterance);
//     setIsSpeaking(true);
//   };

//   const handleStop = () => {
//     window.speechSynthesis.cancel();
//     setIsSpeaking(false);
//     setSpeechInstance(null);
//     setActiveFeature(null);
//   };

//   return (
//     <div
//       className={`p-4 rounded-lg shadow-md mb-6 ${
//         darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
//       }`}
//     >
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-semibold">Read Aloud</h3>
//         <button
//           onClick={handleStop}
//           className={`p-2 rounded-full ${
//             darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
//           }`}
//         >
//           <X size={18} />
//         </button>
//       </div>
//       <div className="flex flex-col sm:flex-row gap-4 items-center">
//         <select
//           value={selectedVoice ? selectedVoice.name : ''}
//           onChange={(e) => {
//             const voice = voices.find((v) => v.name === e.target.value);
//             setSelectedVoice(voice);
//           }}
//           className={`w-full sm:w-64 p-2 rounded-lg ${
//             darkMode
//               ? 'bg-gray-700 text-gray-100 border-gray-600'
//               : 'bg-gray-100 text-gray-800 border-gray-200'
//           } border focus:outline-none`}
//           disabled={isSpeaking}
//         >
//           {voices.map((voice) => (
//             <option key={voice.name} value={voice.name}>
//               {voice.name} ({voice.lang})
//             </option>
//           ))}
//         </select>
//         <button
//           onClick={handleSpeak}
//           className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
//             darkMode
//               ? 'bg-blue-700 hover:bg-blue-600'
//               : 'bg-blue-600 hover:bg-blue-700'
//           } text-white transition-colors`}
//         >
//           {isSpeaking ? (
//             <>
//               <Pause size={16} /> Pause
//             </>
//           ) : (
//             <>
//               <Play size={16} /> {speechInstance ? 'Resume' : 'Play'}
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect, useRef } from 'react';
import { Volume2, Pause, Play, X, Rewind, FastForward } from 'lucide-react';

export default function TextToSpeech({ text, darkMode, setActiveFeature }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speechInstance, setSpeechInstance] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [words, setWords] = useState([]);
  const [showVoiceChangeMessage, setShowVoiceChangeMessage] = useState(false);
  const progressBarRef = useRef(null);

  // Constants
  const WORDS_PER_MINUTE = 150; // Average speaking rate
  const WORDS_PER_SECOND = WORDS_PER_MINUTE / 60; // ~2.5 words per second

  // Split text into words on mount
  useEffect(() => {
    const wordArray = text.split(/\s+/).filter((word) => word.length > 0);
    setWords(wordArray);
  }, [text]);

  // Load voices and handle voice changes
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis
        .getVoices()
        .filter((voice) => voice.lang.includes('en'));
      console.log(
        'Available voices:',
        availableVoices.map((v) => ({ name: v.name, lang: v.lang }))
      );
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [selectedVoice]);

  // Create a new utterance starting from a specific word index
  const createUtterance = (startIndex) => {
    const utteranceText = words.slice(startIndex).join(' ');
    const utterance = new SpeechSynthesisUtterance(utteranceText);
    utterance.voice = selectedVoice;

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex;
        let wordCount = 0;
        let currentChar = 0;
        for (let i = startIndex; i < words.length; i++) {
          currentChar += words[i].length + 1;
          if (currentChar > charIndex) {
            wordCount = i;
            break;
          }
        }
        setCurrentWordIndex(wordCount);
        setProgress((wordCount / words.length) * 100);
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeechInstance(null);
      setCurrentWordIndex(0);
      setProgress(0);
      setActiveFeature(null);
    };

    return utterance;
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
      return;
    }

    if (speechInstance && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsSpeaking(true);
      return;
    }

    const utterance = createUtterance(currentWordIndex);
    window.speechSynthesis.speak(utterance);
    setSpeechInstance(utterance);
    setIsSpeaking(true);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSpeechInstance(null);
    setCurrentWordIndex(0);
    setProgress(0);
    setActiveFeature(null);
  };

  const handleVoiceChange = (e) => {
    const voice = voices.find((v) => v.name === e.target.value);
    setSelectedVoice(voice);

    if (isSpeaking && speechInstance) {
      window.speechSynthesis.cancel();
      const utterance = createUtterance(currentWordIndex);
      window.speechSynthesis.speak(utterance);
      setSpeechInstance(utterance);
      setIsSpeaking(true);
    }
  };

  const handleVoiceChangeAttempt = () => {
    if (isSpeaking) {
      setShowVoiceChangeMessage(true);
      setTimeout(() => setShowVoiceChangeMessage(false), 3000);
    }
  };

  const handleSkip = (direction) => {
    const skipWords = Math.round(10 * WORDS_PER_SECOND);
    let newIndex = currentWordIndex + (direction === 'forward' ? skipWords : -skipWords);
    newIndex = Math.max(0, Math.min(newIndex, words.length - 1));

    setCurrentWordIndex(newIndex);
    setProgress((newIndex / words.length) * 100);

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      const utterance = createUtterance(newIndex);
      window.speechSynthesis.speak(utterance);
      setSpeechInstance(utterance);
      setIsSpeaking(true);
    }
  };

  const handleSeek = (e) => {
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressPercent = (clickX / rect.width) * 100;
    const newWordIndex = Math.round((progressPercent / 100) * words.length);
    setCurrentWordIndex(newWordIndex);
    setProgress(progressPercent);

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      const utterance = createUtterance(newWordIndex);
      window.speechSynthesis.speak(utterance);
      setSpeechInstance(utterance);
      setIsSpeaking(true);
    }
  };

  if (!window.speechSynthesis || voices.length === 0) {
    return (
      <div
        className={`p-2 rounded-lg shadow-md ${
          darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Read Aloud</h3>
          <button
            onClick={() => setActiveFeature(null)}
            className={`p-1 rounded-full ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X size={16} />
          </button>
        </div>
        <p className="text-xs text-red-600">
          Text-to-speech is not available.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`p-2 rounded-lg shadow-md ${
        darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Read Aloud</h3>
        <button
          onClick={handleStop}
          className={`p-1 rounded-full ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <X size={16} />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="relative">
          <select
            value={selectedVoice ? selectedVoice.name : ''}
            onChange={handleVoiceChange}
            onClick={handleVoiceChangeAttempt}
            disabled={isSpeaking}
            className={`w-full p-1 text-sm rounded ${
              darkMode
                ? 'bg-gray-700 text-gray-100 border-gray-600'
                : 'bg-gray-100 text-gray-800 border-gray-200'
            } border focus:outline-none focus:ring-1 focus:ring-blue-300 ${
              isSpeaking ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
          {showVoiceChangeMessage && (
            <p className="text-xs text-red-500 mt-1">
              Please pause the speech to change the voice.
            </p>
          )}
        </div>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => handleSkip('backward')}
            className={`p-2 rounded-full ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-200 hover:bg-gray-300'
            } transition-colors`}
            disabled={currentWordIndex === 0}
          >
            <Rewind size={20} />
          </button>
          <button
            onClick={handleSpeak}
            className={`p-2 rounded-full bg-blue-300 hover:bg-blue-400 transition-colors`}
          >
            {isSpeaking ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={() => handleSkip('forward')}
            className={`p-2 rounded-full ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-200 hover:bg-gray-300'
            } transition-colors`}
            disabled={currentWordIndex >= words.length - 1}
          >
            <FastForward size={20} />
          </button>
        </div>
        <div
          className="w-full h-1 bg-gray-300 rounded-full cursor-pointer relative"
          ref={progressBarRef}
          onClick={handleSeek}
        >
          <div
            className="h-full rounded-full bg-blue-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
