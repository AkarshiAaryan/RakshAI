import React, { useState } from 'react';
import { User, Users, ChevronDown, Check } from 'lucide-react';
import { locales } from '../locales/strings';
import { logger } from '../utils/logger';

export const PROFILES = [
  { id: 'child_aarav', name: 'Aarav (9 yrs)', ageGroup: '9-11', avatarBg: 'bg-emerald-500' },
  { id: 'teen_priya', name: 'Priya (15 yrs)', ageGroup: '13-17', avatarBg: 'bg-purple-500' },
  { id: 'shared_family', name: 'Family Shared', ageGroup: 'all', avatarBg: 'bg-blue-500' }
];

export default function ProfileSwitcher({ activeProfile, onSelectProfile, lang }) {
  const [open, setOpen] = useState(false);
  const t = locales[lang] || locales.en;

  const handleSelect = (profile) => {
    onSelectProfile(profile);
    setOpen(false);
    logger.log('profile_switched', { newProfileId: profile.id, profileName: profile.name });
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-slate-100 px-3 py-1.5 rounded-full border border-slate-600/50 text-xs font-medium transition-all"
      >
        <div className={`w-5 h-5 rounded-full ${activeProfile.avatarBg} flex items-center justify-center text-white text-[10px] font-bold`}>
          {activeProfile.name[0]}
        </div>
        <span>{activeProfile.name}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40">
          <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {t.profileSwitch}
          </div>
          {PROFILES.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelect(p)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium hover:bg-slate-50 transition-colors ${
                activeProfile.id === p.id ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full ${p.avatarBg} flex items-center justify-center text-white text-[10px] font-bold`}>
                  {p.name[0]}
                </div>
                <span>{p.name}</span>
              </div>
              {activeProfile.id === p.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
