import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  ExternalLink,
  Bot,
  User as UserIcon,
  RefreshCw,
  Info,
  Globe,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sendChatMessage } from '../services/api';
import { ChatMessage } from '../types';
import { Language } from '../i18n/translations';

export const AIFoodChatPage: React.FC = () => {
  const {
    language,
    setLanguage,
    currentProductContext,
    speak,
    stopSpeaking,
    isSpeaking
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'assistant',
      text:
        language === 'hi'
          ? `नमस्ते! मैं LifeLens AI हूँ। मैं '${currentProductContext.product_name}' की सामग्री, INS एडिटिव्स, और सुरक्षा विवरणों को स्पष्ट करने में आपकी सहायता कर सकता हूँ। आप क्या जानना चाहते हैं?`
          : language === 'te'
          ? `నమస్కారం! నేను LifeLens AI. '${currentProductContext.product_name}' సంబంధించి పదార్థాలు, సంకలనాలు మరియు ఆహార భద్రత గురించి వివరించగలను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?`
          : `Hello! I am LifeLens AI. I can explain the functional additives, safety research, and nutrition facts for '${currentProductContext.product_name}'. What would you like to know?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggested_followups: [
        'What is INS 621?',
        'Why is this ingredient added?',
        'What does this chemical do?',
        'What does research say about its safety?',
        'Explain all ingredients simply.'
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [responseLength, setResponseLength] = useState<'quick' | 'detailed'>('quick');
  const [isLoading, setIsLoading] = useState(false);

  // Speech Recognition (STT) state
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Voice recognition setup
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Speech recognition is not supported in this browser. Please type your question.');
      return;
    }

    setSpeechError(null);
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    const langCodes = { en: 'en-US', hi: 'hi-IN', te: 'te-IN' };
    recognition.lang = langCodes[language] || 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognition.onerror = (e: any) => {
      console.warn('Speech recognition error', e);
      setIsListening(false);
      setSpeechError('Microphone audio was interrupted or not recognized. Try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.sender,
        content: m.text
      }));

      const res = await sendChatMessage(
        textToSend,
        currentProductContext,
        historyPayload,
        language,
        responseLength
      );

      const aiMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: res.answer,
        sources: res.sources,
        suggested_followups: res.suggested_followups || [
          'Why is this additive used?',
          'What are the limitations?',
          'Are there any allergen concerns?'
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'I encountered an issue retrieving the scientific response. Please ensure the backend server is running.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const samplePrompts = [
    'What is INS 621?',
    'Why is this ingredient added?',
    'What does this chemical do?',
    'What does research say about its safety?',
    'Explain all ingredients simply.',
    'Compare these two products.'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in flex flex-col h-[calc(100vh-140px)] min-h-[620px]">
      
      {/* 7. AI FOOD ASSISTANT HEADER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6E7E0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5 shrink-0">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-[#EEF8DC] px-3.5 py-1 rounded-full text-xs font-bold text-[#174B38] border border-[#D7EDB2]">
            <Sparkles className="w-3.5 h-3.5 text-[#174B38]" />
            <span>AI Food Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif] text-[#174B38] tracking-tight">
            Ask anything about your food.
          </h1>
          <p className="text-xs sm:text-sm text-[#78837B]">
            Your personal ingredient expert, available in three languages.
          </p>
          <div className="pt-1">
            <span className="text-[11px] font-bold bg-[#F8F8F2] text-[#174B38] px-2.5 py-0.5 rounded-md border border-[#E6E7E0]">
              Active Context: {currentProductContext.product_name}
            </span>
          </div>
        </div>

        {/* Controls: Language & Concise/In-Depth Toggle */}
        <div className="flex flex-col sm:items-end gap-2 self-start sm:self-center">
          {/* Language selector: English | हिंदी | తెలుగు */}
          <div className="flex items-center bg-[#F8F8F2] p-1 rounded-xl border border-[#E6E7E0] text-xs">
            {(['en', 'hi', 'te'] as Language[]).map((langCode) => (
              <button
                key={langCode}
                onClick={() => setLanguage(langCode)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  language === langCode
                    ? 'bg-[#174B38] text-white'
                    : 'text-[#78837B] hover:text-[#202923]'
                }`}
              >
                {langCode === 'en' ? 'English' : langCode === 'hi' ? 'हिंदी' : 'తెలుగు'}
              </button>
            ))}
          </div>

          {/* Quick vs Detailed Toggle */}
          <div className="flex items-center bg-[#F8F8F2] p-1 rounded-xl border border-[#E6E7E0] text-xs gap-1">
            <button
              onClick={() => setResponseLength('quick')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                responseLength === 'quick'
                  ? 'bg-[#174B38] text-white'
                  : 'text-[#78837B] hover:text-[#202923]'
              }`}
            >
              Concise
            </button>
            <button
              onClick={() => setResponseLength('detailed')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                responseLength === 'detailed'
                  ? 'bg-[#174B38] text-white'
                  : 'text-[#78837B] hover:text-[#202923]'
              }`}
            >
              In-Depth
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 text-xs">
        <span className="text-[10px] font-bold text-[#78837B] uppercase tracking-wider pl-1 shrink-0">
          Suggested:
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white hover:bg-[#EEF8DC] hover:text-[#174B38] text-[#78837B] font-semibold border border-[#E6E7E0] transition-all card-hover cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 p-5 sm:p-6 bg-white rounded-3xl border border-[#E6E7E0] shadow-xs custom-scrollbar">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                  isUser
                    ? 'bg-[#174B38] text-white'
                    : 'bg-[#EEF8DC] text-[#174B38] border border-[#D7EDB2]'
                }`}
              >
                {isUser ? <UserIcon className="w-4 h-4 shrink-0" /> : <Bot className="w-4 h-4 text-[#174B38] shrink-0" />}
              </div>

              {/* Message Content Bubble */}
              <div className="space-y-2">
                <div
                  className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-[#174B38] text-white rounded-tr-xs'
                      : 'bg-[#F8F8F2] border border-[#E6E7E0] text-[#202923] rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Sources Footnote */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="pt-3 mt-3 border-t border-[#E6E7E0] space-y-1">
                      <span className="text-[10px] font-bold text-[#78837B] uppercase tracking-wider block">
                        Scientific Sources:
                      </span>
                      {m.sources.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#174B38]">
                          <span>• {s.title} ({s.publisher || 'FSSAI/WHO'})</span>
                          {s.url && (
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline inline-flex items-center text-[#64A77A]"
                            >
                              <ExternalLink className="w-3 h-3 shrink-0 ml-1" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sub-actions */}
                <div className={`flex items-center gap-2 text-[10px] text-[#78837B] ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <span>{m.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => speak(m.text)}
                      className="hover:text-[#174B38] p-1 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                      title="Read this answer aloud"
                    >
                      <Volume2 className="w-3 h-3 text-[#174B38]" />
                      <span>Read Aloud</span>
                    </button>
                  )}
                </div>

                {/* Suggested Follow-up Prompts */}
                {m.suggested_followups && m.suggested_followups.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.suggested_followups.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(chip)}
                        className="text-[11px] bg-[#EEF8DC] hover:bg-[#174B38] hover:text-white text-[#174B38] font-semibold px-3 py-1.5 rounded-xl border border-[#D7EDB2] transition-all card-hover cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-[80%] mr-auto items-center">
            <div className="w-9 h-9 rounded-2xl bg-[#EEF8DC] text-[#174B38] flex items-center justify-center border border-[#D7EDB2]">
              <Sparkles className="w-4 h-4 text-[#174B38] animate-spin" />
            </div>
            <div className="bg-[#F8F8F2] p-4 rounded-3xl border border-[#E6E7E0] flex items-center gap-2 text-xs text-[#78837B]">
              <span className="w-2 h-2 rounded-full bg-[#174B38] animate-ping" />
              <span>Grounded scientific retrieval in progress...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Voice Error Notice */}
      {speechError && (
        <div className="bg-[#FDF3F2] border border-[#F8CAC7] text-[#9B2C26] p-3 rounded-2xl text-xs flex items-center gap-2 shrink-0">
          <Info className="w-4 h-4 shrink-0 text-[#D95C55]" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Large Message Input Bar with Microphone & Send */}
      <form onSubmit={onSubmit} className="relative shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === 'hi'
                ? `'${currentProductContext.product_name}' के बारे में कोई भी प्रश्न पूछें...`
                : language === 'te'
                ? `'${currentProductContext.product_name}' గురించి ఏమైనా అడగండి...`
                : `Ask any question about '${currentProductContext.product_name}'...`
            }
            className="w-full pl-5 pr-28 py-4 text-xs sm:text-sm rounded-2xl border border-[#E6E7E0] bg-white focus:outline-none focus:border-[#174B38] shadow-xs"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            {/* Microphone STT Trigger */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                isListening
                  ? 'bg-[#D95C55] text-white animate-pulse shadow-md'
                  : 'bg-[#F8F8F2] hover:bg-[#EEF8DC] text-[#78837B]'
              }`}
              title="Speak question"
            >
              {isListening ? <MicOff className="w-4 h-4 shrink-0" /> : <Mic className="w-4 h-4 shrink-0" />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#174B38] hover:bg-[#0F3527] disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
              title="Send question"
            >
              <Send className="w-4 h-4 shrink-0 text-[#D7EDB2]" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
