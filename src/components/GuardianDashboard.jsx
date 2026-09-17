import React, { useState } from 'react';
import { ShieldCheck, PhoneCall, MessageSquare, AlertCircle, Eye, UserPlus, Bell, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { locales } from '../locales/strings';
import { logger } from '../utils/logger';

export default function GuardianDashboard({ lang, onTriggerChildPrivacyAlert }) {
  const t = locales[lang] || locales.en;

  const [guardians, setGuardians] = useState([
    { id: 1, name: "Sunita Sharma", relation: "Mother", phone: "+91 98*** ***12", verified: true, method: "DigiLocker / Aadhaar Token" },
    { id: 2, name: "Ramesh Sharma", relation: "Grandparent", phone: "+91 94*** ***89", verified: true, method: "Non-Digital Anganwadi Attestation" }
  ]);

  const [newGuardianName, setNewGuardianName] = useState("");
  const [newGuardianRelation, setNewGuardianRelation] = useState("Father");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsSentNotice, setSmsSentNotice] = useState(false);

  const [flaggedMoments, setFlaggedMoments] = useState([
    { id: 101, child: "Priya (15 yrs)", topic: "Exam Stress & Academic Pressure", date: "Yesterday, 8:40 PM", text: "I feel overwhelmed by my board exam marks.", reviewed: false },
    { id: 102, child: "Aarav (9 yrs)", topic: "Risky Secret Query", date: "3 days ago", text: "Someone asked me to keep a secret from parents.", reviewed: true }
  ]);

  const handleReviewMoment = (id) => {
    setFlaggedMoments(prev => prev.map(m => m.id === id ? { ...m, reviewed: true } : m));
    logger.log('guardian_reviewed_flagged_moment', { momentId: id });
    if (onTriggerChildPrivacyAlert) {
      onTriggerChildPrivacyAlert();
    }
  };

  const handleAddGuardian = (e) => {
    e.preventDefault();
    if (!newGuardianName) return;
    const newG = {
      id: Date.now(),
      name: newGuardianName,
      relation: newGuardianRelation,
      phone: "+91 98*** ***00",
      verified: true,
      method: "Draft DPDP Guardian Consent Token"
    };
    setGuardians([...guardians, newG]);
    setNewGuardianName("");
    setShowAddModal(false);
    logger.log('guardian_added', { name: newGuardianName, relation: newGuardianRelation });
  };

  const handleSimulateSmsIvr = () => {
    setSmsSentNotice(true);
    logger.log('simulated_sms_ivr_sent', { guardiansCount: guardians.length, lang });
    setTimeout(() => setSmsSentNotice(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              DPDP Act 2023 Compliant
            </span>
            <h2 className="text-xl md:text-2xl font-bold">{t.guardianTitle}</h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1">{t.guardianSubtitle}</p>
          </div>
          <button 
            onClick={() => setShowSmsModal(true)}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all self-start md:self-auto"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t.smsIvrPreview}</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">This Week</p>
            <h4 className="text-2xl font-bold text-slate-800">2 Flagged</h4>
            <p className="text-xs text-amber-600 mt-1">1 Requires Review</p>
          </div>
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Registered Guardians</p>
            <h4 className="text-2xl font-bold text-slate-800">{guardians.length} Members</h4>
            <p className="text-xs text-teal-600 mt-1">Joint Family Support</p>
          </div>
          <div className="p-3 bg-teal-100 text-teal-800 rounded-xl">
            <UserPlus className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Helpline Safety</p>
            <h4 className="text-2xl font-bold text-slate-800">Childline 1098</h4>
            <p className="text-xs text-indigo-600 mt-1">Directly Accessible</p>
          </div>
          <div className="p-3 bg-indigo-100 text-indigo-800 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Flagged Moments Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            {t.flaggedMoments}
          </h3>
          <span className="text-xs text-slate-400">Privacy Preserving: Drills trigger child notification</span>
        </div>

        <div className="space-y-3">
          {flaggedMoments.map((moment) => (
            <div 
              key={moment.id}
              className={`p-4 rounded-xl border transition-all ${
                moment.reviewed ? 'bg-slate-50 border-slate-200' : 'bg-amber-50/50 border-amber-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800">{moment.child}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                      {moment.topic}
                    </span>
                    <span className="text-[11px] text-slate-400">{moment.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 italic">"{moment.text}"</p>
                </div>

                {!moment.reviewed ? (
                  <button
                    onClick={() => handleReviewMoment(moment.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Review Moment</span>
                  </button>
                ) : (
                  <span className="text-xs text-teal-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" /> Reviewed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Registered Guardians & DPDP Consent Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">{t.registeredGuardians}</h3>
            <p className="text-xs text-slate-500">Supports joint-family adults (parents, grandparents, elder siblings)</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t.addGuardian}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {guardians.map(g => (
            <div key={g.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">{g.name} <span className="text-indigo-600">({g.relation})</span></p>
                <p className="text-[11px] text-slate-500">{g.phone}</p>
                <p className="text-[10px] text-teal-700 font-medium mt-1">Verified: {g.method}</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
            </div>
          ))}
        </div>
      </div>

      {/* Feature Phone SMS / IVR Voice Digest Modal */}
      {showSmsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-indigo-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm">Feature Phone Voice & SMS Digest</h3>
              </div>
              <button onClick={() => setShowSmsModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              In households where guardians use feature phones without apps, RakshAI sends an automated local language SMS and schedules an IVR voice summary call.
            </p>

            <div className="p-3.5 bg-slate-900 text-teal-300 rounded-xl text-xs font-mono space-y-2 border border-slate-800">
              <p className="text-amber-400 font-bold">[SMS Preview - Hindi]</p>
              <p>"RakshAI ki taraf se suraksha update: Priya ne is saptah 1 exam stress ka sawal pucha. Childline 1098 support pradan kiya gaya. Sunne ke liye 1 dabayein."</p>
            </div>

            {smsSentNotice ? (
              <div className="p-3 bg-teal-100 text-teal-900 rounded-xl text-xs font-bold text-center">
                ✓ IVR Voice Call & Local SMS Simulated Successfully!
              </div>
            ) : (
              <button
                onClick={handleSimulateSmsIvr}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
              >
                {t.sendSmsBtn}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add Guardian Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <form onSubmit={handleAddGuardian} className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Add Family Guardian</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Guardian Full Name</label>
              <input 
                type="text" 
                value={newGuardianName} 
                onChange={e => setNewGuardianName(e.target.value)} 
                placeholder="e.g. Rajesh Sharma"
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship</label>
              <select 
                value={newGuardianRelation} 
                onChange={e => setNewGuardianRelation(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Grandparent">Grandparent</option>
                <option value="Elder Sibling">Elder Sibling</option>
                <option value="Guardian">Legal Guardian</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)} 
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Add Guardian
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
