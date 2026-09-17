import React, { useState, useEffect, useRef } from 'react';
import AIIdentityBadge from './components/AIIdentityBadge';
import ProfileSwitcher, { PROFILES } from './components/ProfileSwitcher';
import ConfidenceTag from './components/ConfidenceTag';
import EscalationButton from './components/EscalationButton';
import FrictionDelay from './components/FrictionDelay';
import GuardianDashboard from './components/GuardianDashboard';
import LowBandwidthToggle from './components/LowBandwidthToggle';
import ExperimentControl from './components/ExperimentControl';
import { findScriptedResponse } from './data/scriptedResponses';
import { locales } from './locales/strings';
import { logger } from './utils/logger';
import { Send, Bot, User, Sparkles, Shield, AlertTriangle, RefreshCw, MessageSquare, HeartHandshake } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('en'); // 'en', 'hi', 'hinglish'
  const [activeProfile, setActiveProfile] = useState(PROFILES[1]); // Priya (15 yrs) default
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'guardian'
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  const [childPrivacyAlert, setChildPrivacyAlert] = useState(false);

  // Experiment Configuration state (IVs)
  const [experimentConfig, setExperimentConfig] = useState({
    tagsEnabled: true,
    frictionEnabled: true,
    buttonSalience: 'large', // 'large', 'small', 'hidden'
    optionFraming: 'equal'   // 'equal', 'parent_first'
  });

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Namaste! I am a computer AI program. Ask me school questions or learning topics!",
      tag: 'confident',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFriction, setShowFriction] = useState(false);
  const chatEndRef = useRef(null);

  const t = locales[lang] || locales.en;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, showFriction]);

  const handleUpdateExperimentConfig = (key, val) => {
    setExperimentConfig(prev => ({ ...prev, [key]: val }));
    logger.log('experiment_config_updated', { key, val });
  };

  const handleResetSession = () => {
    logger.clearLogs();
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: locales[lang]?.botLabel || "Namaste! I am a computer AI program.",
        tag: 'confident',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    logger.log('session_reset');
  };

  const handleSendMessage = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    logger.log('user_message_sent', { query, lang, profileId: activeProfile.id });

    // Look up scripted response
    const scripted = findScriptedResponse(query, lang);

    // Friction micro-delay check if category is sensitive / exam distress
    const isSensitive = scripted.category === 'exam_distress' || scripted.tag === 'grownUp';

    if (isSensitive && experimentConfig.frictionEnabled) {
      setShowFriction(true);
      logger.log('friction_delay_triggered', { category: scripted.category });
      setTimeout(() => {
        setShowFriction(false);
        deliverAiResponse(scripted);
      }, 2000);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        deliverAiResponse(scripted);
      }, 600);
    }
  };

  const deliverAiResponse = (scripted) => {
    const aiMsg = {
      id: Date.now(),
      sender: 'ai',
      text: scripted.text,
      tag: scripted.tag,
      isFalseAdvice: scripted.isFalseAdvice,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, aiMsg]);
    logger.log('ai_response_delivered', { 
      tag: scripted.tag, 
      isFalseAdvice: scripted.isFalseAdvice, 
      tagsEnabled: experimentConfig.tagsEnabled 
    });
  };

  const triggerChildPrivacyAlert = () => {
    setChildPrivacyAlert(true);
    setTimeout(() => setChildPrivacyAlert(false), 8000);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isLowBandwidth ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      
      {/* 1. Researcher Control Panel Header */}
      <ExperimentControl
        experimentConfig={experimentConfig}
        onUpdateConfig={handleUpdateExperimentConfig}
        onResetSession={handleResetSession}
      />

      {/* 2. Main Navigation & Status Header */}
      <header className={`px-4 py-3 border-b shadow-sm sticky top-0 z-30 transition-colors ${
        isLowBandwidth ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo & Identity Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center font-extrabold text-white shadow-md">
                R
              </div>
              <h1 className="text-lg font-bold text-white tracking-tight">{t.appTitle}</h1>
            </div>

            {/* Persistent Identity Signifier Component */}
            <AIIdentityBadge lang={lang} />
          </div>

          {/* Controls: Profile, Language, Low-Bandwidth */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Shared-Device Profile Switcher */}
            <ProfileSwitcher
              activeProfile={activeProfile}
              onSelectProfile={setActiveProfile}
              lang={lang}
            />

            {/* Language Selector */}
            <select
              value={lang}
              onChange={(e) => {
                setLang(e.target.value);
                logger.log('language_changed', { newLang: e.target.value });
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-2.5 py-1.5 rounded-full border border-slate-700 focus:outline-none"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="hinglish">Hinglish</option>
            </select>

            {/* Low Bandwidth Toggle */}
            <LowBandwidthToggle
              isLowBandwidth={isLowBandwidth}
              onToggle={setIsLowBandwidth}
              lang={lang}
            />
          </div>
        </div>

        {/* Tab Switcher: Child Chat vs Guardian Dashboard */}
        <div className="max-w-4xl mx-auto flex gap-2 mt-2 pt-2 border-t border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t.chatTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('guardian')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'guardian' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{t.guardianTab}</span>
          </button>
        </div>
      </header>

      {/* Child Privacy Alert Notification Banner */}
      {childPrivacyAlert && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 shadow-md animate-bounce">
          <Shield className="w-4 h-4" />
          <span>{t.privacyAlert}</span>
        </div>
      )}

      {/* 3. Main Content Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col justify-between">
        
        {activeTab === 'guardian' ? (
          <GuardianDashboard
            lang={lang}
            onTriggerChildPrivacyAlert={triggerChildPrivacyAlert}
          />
        ) : (
          <div className="flex-1 flex flex-col justify-between gap-4">
            
            {/* Quick Test Prompt Chips for Evaluation */}
            <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">Try Prompts:</span>
              <button
                onClick={() => handleSendMessage("What is photosynthesis?")}
                className="px-2.5 py-1 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 whitespace-nowrap"
              >
                🌱 Photosynthesis (Confident ✅)
              </button>
              <button
                onClick={() => handleSendMessage("Which stream after 10th grade is best?")}
                className="px-2.5 py-1 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 whitespace-nowrap"
              >
                📚 Stream Selection (Unsure 🤔)
              </button>
              <button
                onClick={() => handleSendMessage("I am feeling scared and overwhelmed by my board exam marks")}
                className="px-2.5 py-1 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 font-medium whitespace-nowrap"
              >
                💔 Exam Stress (Distress 🛑)
              </button>
              <button
                onClick={() => handleSendMessage("experiment_false_advice_1")}
                className="px-2.5 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium whitespace-nowrap"
              >
                🧪 False Advice Test (Compliance Exp)
              </button>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 space-y-4 my-2 overflow-y-auto max-h-[55vh] pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm border ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none'
                      : isLowBandwidth
                        ? 'bg-slate-800 text-slate-100 border-slate-700 rounded-tl-none'
                        : 'bg-white text-slate-800 border-slate-200 rounded-tl-none'
                  }`}>
                    {/* AI Header & Confidence Tag */}
                    {msg.sender === 'ai' && (
                      <div className="flex items-center justify-between gap-2 border-b pb-2 mb-2 border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                          <Bot className="w-3.5 h-3.5 text-teal-600" />
                          <span>RakshAI</span>
                        </div>
                        
                        {/* Confidence Tag Component */}
                        <ConfidenceTag
                          tag={msg.tag}
                          lang={lang}
                          isEnabled={experimentConfig.tagsEnabled}
                        />
                      </div>
                    )}

                    {/* Message Body */}
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                    
                    <span className="text-[10px] text-slate-400 self-end block mt-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {/* Friction Micro-delay Banner */}
              {showFriction && <FrictionDelay lang={lang} />}

              {/* Normal Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs w-fit">
                  <Bot className="w-4 h-4 text-teal-600 animate-spin" />
                  <span>Thinking safely...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="space-y-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.sendPlaceholder}
                  className={`flex-1 p-3.5 rounded-2xl border text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm ${
                    isLowBandwidth ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-2xl shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>

              {/* Feature 3: One-Tap India Escalation Footer Button */}
              <div className="pt-1">
                <EscalationButton
                  lang={lang}
                  salience={experimentConfig.buttonSalience}
                  framing={experimentConfig.optionFraming}
                />
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="py-2 text-center text-[11px] text-slate-400 border-t border-slate-200 bg-white">
        RakshAI HCI Safety Design • Indian Context Revision • DPDP Act & Multilingual Calibrated AI
      </footer>
    </div>
  );
}
