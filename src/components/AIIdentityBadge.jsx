import React, { useState } from 'react';
import { Bot, HelpCircle, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { locales } from '../locales/strings';
import { logger } from '../utils/logger';

export default function AIIdentityBadge({ lang, onCompleteOnboarding }) {
  const t = locales[lang] || locales.en;
  const [showModal, setShowModal] = useState(false);
  const [answersChecked, setAnswersChecked] = useState({ q1: false, q2: false, q3: false });

  const handleOpenOnboarding = () => {
    logger.log('onboarding_modal_opened', { lang });
    setShowModal(true);
  };

  const handleToggleAnswer = (key) => {
    const updated = { ...answersChecked, [key]: !answersChecked[key] };
    setAnswersChecked(updated);
    logger.log('onboarding_question_toggled', { question: key, value: updated[key] });
  };

  const allChecked = answersChecked.q1 && answersChecked.q2 && answersChecked.q3;

  const handleFinish = () => {
    if (allChecked) {
      setShowModal(false);
      logger.log('onboarding_completed', { lang });
      if (onCompleteOnboarding) onCompleteOnboarding();
    }
  };

  return (
    <>
      {/* Persistent Badge Header */}
      <div 
        onClick={handleOpenOnboarding}
        className="flex items-center gap-2 bg-indigo-900/90 hover:bg-indigo-800 text-indigo-100 px-3 py-1.5 rounded-full border border-indigo-500/40 shadow-sm cursor-pointer transition-all select-none"
        title="Click to check AI Reality Facts"
      >
        <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-teal-500 text-slate-950 font-bold">
          <Bot className="w-4 h-4 text-slate-900 animate-pulse-slow" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-teal-300 rounded-full animate-ping"></span>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-semibold tracking-wide text-teal-200 flex items-center gap-1">
            {t.botLabel}
            <Sparkles className="w-3 h-3 text-amber-300" />
          </span>
        </div>
        <HelpCircle className="w-4 h-4 text-indigo-300 ml-1 hover:text-white" />
      </div>

      {/* Onboarding Comprehension Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-indigo-100 flex flex-col gap-4">
            <div className="flex items-center gap-3 border-b pb-3 border-slate-100">
              <div className="p-2.5 bg-teal-100 rounded-xl text-teal-800">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{t.onboardingTitle}</h3>
                <p className="text-xs text-slate-500">{t.onboardingSubtitle}</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Question 1 */}
              <div 
                onClick={() => handleToggleAnswer('q1')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${answersChecked.q1 ? 'bg-teal-50 border-teal-300' : 'bg-slate-50 border-slate-200'}`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${answersChecked.q1 ? 'bg-teal-600 text-white' : 'border-2 border-slate-300'}`}>
                  {answersChecked.q1 && <CheckCircle className="w-4 h-4" />}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-slate-800">1. {t.q1}</p>
                  <p className="text-xs text-slate-600 mt-1">{t.a1}</p>
                </div>
              </div>

              {/* Question 2 */}
              <div 
                onClick={() => handleToggleAnswer('q2')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${answersChecked.q2 ? 'bg-teal-50 border-teal-300' : 'bg-slate-50 border-slate-200'}`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${answersChecked.q2 ? 'bg-teal-600 text-white' : 'border-2 border-slate-300'}`}>
                  {answersChecked.q2 && <CheckCircle className="w-4 h-4" />}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-slate-800">2. {t.q2}</p>
                  <p className="text-xs text-slate-600 mt-1">{t.a2}</p>
                </div>
              </div>

              {/* Question 3 */}
              <div 
                onClick={() => handleToggleAnswer('q3')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${answersChecked.q3 ? 'bg-teal-50 border-teal-300' : 'bg-slate-50 border-slate-200'}`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${answersChecked.q3 ? 'bg-teal-600 text-white' : 'border-2 border-slate-300'}`}>
                  {answersChecked.q3 && <CheckCircle className="w-4 h-4" />}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-slate-800">3. {t.q3}</p>
                  <p className="text-xs text-slate-600 mt-1">{t.a3}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleFinish}
              disabled={!allChecked}
              className={`w-full py-3 rounded-xl font-bold text-sm shadow-md transition-all ${
                allChecked 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-indigo-200' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {t.understood}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
