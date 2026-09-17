import React, { useState } from 'react';
import { PhoneCall, HeartHandshake, ShieldAlert, UserCheck, AlertTriangle, X } from 'lucide-react';
import { locales } from '../locales/strings';
import { logger } from '../utils/logger';

export default function EscalationButton({ 
  lang, 
  salience = 'large', // 'hidden', 'small', 'large'
  framing = 'equal' // 'parent_first', 'equal'
}) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const t = locales[lang] || locales.en;

  if (salience === 'hidden') return null;

  const handleOpen = () => {
    logger.log('escalation_button_clicked', { salience, framing, lang });
    setOpenModal(true);
  };

  const handleSelectOption = (optionKey, details) => {
    setSelectedAction(optionKey);
    logger.log('escalation_option_selected', { optionKey, details, framing, lang });
  };

  const isSmall = salience === 'small';

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleOpen}
        className={`flex items-center justify-center gap-2 rounded-2xl font-bold shadow-lg transition-all active:scale-95 select-none ${
          isSmall
            ? 'p-2 bg-rose-600 hover:bg-rose-700 text-white text-xs'
            : 'w-full py-3.5 px-4 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-sm tracking-wide shadow-rose-200 border border-rose-400/30'
        }`}
      >
        <PhoneCall className={isSmall ? "w-4 h-4" : "w-5 h-5 animate-bounce"} />
        <span>{t.escalateBtn}</span>
      </button>

      {/* Escalation Resources Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-100 flex flex-col gap-4 relative">
            <button 
              onClick={() => setOpenModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b pb-3 border-slate-100">
              <div className="p-2.5 bg-rose-100 rounded-xl text-rose-700">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{t.escalateTitle}</h3>
                <p className="text-xs text-slate-500">{t.escalateSubtitle}</p>
              </div>
            </div>

            {selectedAction ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-emerald-900 text-sm">Action Initiated</h4>
                <p className="text-xs text-emerald-700">
                  {selectedAction === 'parent' && "Remember, talking to a parent or trusted adult at home is safe."}
                  {selectedAction === 'childline' && "Connecting to Childline 1098 helpline for children."}
                  {selectedAction === 'icall' && "iCall counselling helpline info: 022-25521111."}
                  {selectedAction === 'vandrevala' && "Vandrevala Foundation Helpline: 9999 666 555."}
                  {selectedAction === 'flag' && "This AI turn has been logged and sent for review."}
                </p>
                <button
                  onClick={() => setSelectedAction(null)}
                  className="mt-2 text-xs font-semibold text-emerald-800 underline"
                >
                  Choose another option
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {/* Parent Option */}
                <button
                  onClick={() => handleSelectOption('parent', 'Parent/Grown-up')}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all hover:bg-indigo-50 hover:border-indigo-300 ${
                    framing === 'parent_first' ? 'bg-indigo-50 border-indigo-300 font-bold' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{t.optParent}</p>
                    <p className="text-[11px] text-slate-500">Trusted family member or guardian</p>
                  </div>
                </button>

                {/* Childline 1098 */}
                <button
                  onClick={() => handleSelectOption('childline', 'Childline 1098')}
                  className="w-full p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-left flex items-center gap-3 transition-all"
                >
                  <div className="p-2 bg-rose-600 text-white rounded-lg">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-rose-950">{t.optChildline}</p>
                    <p className="text-[11px] text-rose-700">Govt of India helpline for children</p>
                  </div>
                </button>

                {/* iCall */}
                <button
                  onClick={() => handleSelectOption('icall', 'iCall Helpline')}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left flex items-center gap-3 transition-all"
                >
                  <div className="p-2 bg-teal-100 text-teal-800 rounded-lg">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{t.optICall}</p>
                    <p className="text-[11px] text-slate-500">TISS psychological support</p>
                  </div>
                </button>

                {/* Vandrevala Foundation */}
                <button
                  onClick={() => handleSelectOption('vandrevala', 'Vandrevala Foundation')}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left flex items-center gap-3 transition-all"
                >
                  <div className="p-2 bg-purple-100 text-purple-800 rounded-lg">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{t.optVandrevala}</p>
                    <p className="text-[11px] text-slate-500">24/7 mental health crisis line</p>
                  </div>
                </button>

                {/* Report AI Output */}
                <button
                  onClick={() => handleSelectOption('flag', 'Report AI Response')}
                  className="w-full p-2.5 rounded-xl text-left flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs transition-colors"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>{t.optSomethingWrong}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
