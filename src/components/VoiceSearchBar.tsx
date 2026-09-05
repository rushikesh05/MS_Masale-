import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Search, X, Sparkles, Volume2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isMarathi?: boolean;
  totalResultsCount?: number;
  onClear?: () => void;
}

// Interface for Web Speech API
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
      length: number;
    };
    length: number;
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: () => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export const VoiceSearchBar: React.FC<VoiceSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  isMarathi = false,
  totalResultsCount,
  onClear
}) => {
  const [isListening, setIsListening] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState<'mr-IN' | 'en-IN'>('mr-IN');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Marathi Quick Voice Search Suggestions
  const marathiSuggestions = [
    { label: 'शेंगदाणा चटणी', query: 'शेंगदाणा' },
    { label: 'कोल्हापुरी ठेचा', query: 'ठेचा' },
    { label: 'कांदा-लसूण मसाला', query: 'कांदा लसूण' },
    { label: 'वडापाव लाल चटणी', query: 'खोबरे लसूण' },
    { label: 'तिळाची चटणी', query: 'तीळ' },
    { label: 'जवस चटणी', query: 'जवस' },
    { label: 'काळा मसाला', query: 'काळा मसाला' }
  ];

  const englishSuggestions = [
    { label: 'Peanut Chutney', query: 'peanut' },
    { label: 'Kolhapuri Thecha', query: 'thecha' },
    { label: 'Kanda Lasun', query: 'garlic' },
    { label: 'Vada Pav Red Chutney', query: 'coconut' },
    { label: 'Flaxseed / Javas', query: 'flaxseed' },
    { label: 'Sesame / Til', query: 'sesame' },
    { label: 'Kala Masala', query: 'kala masala' }
  ];

  const suggestions = isMarathi ? marathiSuggestions : englishSuggestions;

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const startListening = () => {
    setVoiceError(null);
    setInterimTranscript('');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError(
        isMarathi 
          ? 'तुमच्या ब्राउझरमध्ये व्हॉइस सर्च उपलब्ध नाही. कृपया Chrome किंवा Edge वापरा.' 
          : 'Voice search is not supported in this browser. Please use Chrome or Edge.'
      );
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = speechLanguage;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentInterim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            currentInterim += transcript;
          }
        }

        if (currentInterim) {
          setInterimTranscript(currentInterim);
        }

        if (finalTranscript) {
          const cleanedText = finalTranscript.trim();
          onSearchChange(cleanedText);
          setInterimTranscript('');
          setIsListening(false);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setVoiceError(
            isMarathi
              ? 'मायक्रोफोनची परवानगी नाकारली गेली. कृपया ब्राऊझर सेटिंग्जमध्ये मायक्रोफोन चालू करा.'
              : 'Microphone permission was denied. Please allow microphone access in browser settings.'
          );
        } else if (event.error === 'no-speech') {
          setVoiceError(
            isMarathi
              ? 'काहीही ऐकू आले नाही. कृपया पुन्हा माइक बटण दाबून स्पष्ट बोला.'
              : 'No speech detected. Please tap the mic and speak clearly.'
          );
        } else {
          setVoiceError(
            isMarathi
              ? `व्हॉइस सर्च त्रुटी (${event.error}). पुन्हा प्रयत्न करा.`
              : `Voice error (${event.error}). Please try again.`
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      setVoiceError(
        isMarathi 
          ? 'मायक्रोफोन सुरू करता आला नाही.' 
          : 'Could not access the microphone.'
      );
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleClear = () => {
    onSearchChange('');
    setInterimTranscript('');
    setVoiceError(null);
    if (onClear) onClear();
  };

  return (
    <div className="w-full space-y-3">
      {/* Search Input Container with Voice Mic */}
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-4 pointer-events-none text-stone-400">
          <Search className="w-5 h-5" />
        </div>

        {/* Text Input */}
        <input
          id="voice-search-input"
          type="text"
          value={isListening && interimTranscript ? interimTranscript : searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={
            isMarathi
              ? 'चटणी किंवा मसाला शोधा... (उदा. "शेंगदाणा", "ठेचा", "लसूण" किंवा माइकवर बोला)'
              : 'Search chutneys & spices... (e.g. "Peanut", "Thecha", "Garlic" or speak)'
          }
          className={`w-full pl-11 pr-28 sm:pr-32 py-3.5 sm:py-4 rounded-2xl bg-white border text-sm sm:text-base font-medium shadow-xs transition-all outline-none focus:ring-2 ${
            isListening 
              ? 'border-red-500 ring-2 ring-red-400/30 bg-red-50/20' 
              : 'border-[#E5DDD4] focus:border-[#C84B31] focus:ring-[#C84B31]/20 text-[#2D2424]'
          }`}
        />

        {/* Right Action Icons: Clear & Microphone Voice Search */}
        <div className="absolute right-3 flex items-center gap-1.5">
          {/* Clear Search Button */}
          {searchQuery && (
            <button
              id="btn-clear-search"
              type="button"
              onClick={handleClear}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              title={isMarathi ? 'शोध साफ करा' : 'Clear search'}
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Language Toggle for Voice: Marathi / English */}
          <button
            type="button"
            onClick={() => setSpeechLanguage(speechLanguage === 'mr-IN' ? 'en-IN' : 'mr-IN')}
            className="hidden sm:inline-flex px-2 py-1 rounded-lg text-[10px] font-extrabold border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 cursor-pointer transition-colors"
            title="Switch Voice Recognition Language (Marathi / English)"
          >
            {speechLanguage === 'mr-IN' ? 'मराठी (mr)' : 'English (en)'}
          </button>

          {/* Microphone Voice Search Button */}
          <button
            id="btn-voice-search-mic"
            type="button"
            onClick={toggleListening}
            className={`relative p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-xs ${
              isListening
                ? 'bg-red-600 text-white animate-pulse shadow-md shadow-red-500/40 ring-4 ring-red-400/30 scale-105'
                : 'bg-[#C84B31] hover:bg-[#A83B23] text-white'
            }`}
            title={
              isListening
                ? isMarathi ? 'ऐकणे थांबवा' : 'Stop listening'
                : isMarathi ? 'मराठी व्हॉइस सर्च (माइकवर बोला)' : 'Marathi Voice Search (Speak)'
            }
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}

            {/* Ripple Pulse Rings while listening */}
            {isListening && (
              <span className="absolute -inset-1 rounded-xl bg-red-400 opacity-75 animate-ping pointer-events-none" />
            )}
          </button>
        </div>
      </div>

      {/* Voice Status & Live Feedback Banner */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-3 rounded-xl bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 border border-red-200 flex items-center justify-between gap-3 text-xs shadow-xs"
          >
            <div className="flex items-center gap-2 text-red-900 font-semibold">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
              <span>
                {isMarathi
                  ? '🎙️ अस्सल मराठीत बोला... (उदा. "शेंगदाणा चटणी", "लसूण", "ठेचा")'
                  : '🎙️ Listening in Marathi (mr-IN)... Speak now!'}
              </span>
            </div>

            {interimTranscript && (
              <span className="bg-white/80 px-2 py-0.5 rounded border border-red-200 text-stone-900 font-mono italic truncate max-w-[200px]">
                "{interimTranscript}"
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Error Alert */}
      <AnimatePresence>
        {voiceError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{voiceError}</span>
            </div>
            <button
              onClick={() => setVoiceError(null)}
              className="text-red-700 hover:text-red-900 text-[11px] font-bold underline cursor-pointer"
            >
              {isMarathi ? 'बंद करा' : 'Dismiss'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Search Marathi Suggestion Chips & Results Count */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-stone-500 font-medium flex items-center gap-1 text-[11px]">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{isMarathi ? 'पटकन शोधा:' : 'Quick Voice Search:'}</span>
          </span>

          {suggestions.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onSearchChange(item.query)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                searchQuery.toLowerCase().includes(item.query.toLowerCase())
                  ? 'bg-[#C84B31] text-white border-[#C84B31] shadow-2xs'
                  : 'bg-white hover:bg-[#FFF2EE] text-stone-700 border-stone-200 hover:border-[#F5C2B8]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Results Counter if searching */}
        {searchQuery && typeof totalResultsCount === 'number' && (
          <div className="text-[11px] font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg">
            {isMarathi 
              ? `सापडलेली उत्पादने: ${totalResultsCount}` 
              : `Matches Found: ${totalResultsCount}`}
          </div>
        )}
      </div>
    </div>
  );
};
