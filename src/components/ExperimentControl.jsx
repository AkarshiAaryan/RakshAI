import React, { useState } from 'react';
import { Sliders, Download, RotateCcw, Shield, Layers, Eye } from 'lucide-react';
import { logger } from '../utils/logger';

export default function ExperimentControl({ 
  experimentConfig, 
  onUpdateConfig,
  onResetSession
}) {
  const [open, setOpen] = useState(false);

  const handleExport = () => {
    logger.exportLogsAsJSON();
  };

  return (
    <div className="bg-slate-900 text-slate-100 border-b border-slate-800 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-md">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 font-bold text-teal-400 uppercase tracking-wider text-[11px]">
          <Sliders className="w-3.5 h-3.5 text-teal-400" />
          HCI Experiment Control Panel
        </span>

        {/* Tagging IV Toggle */}
        <label className="flex items-center gap-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md border border-slate-700">
          <input 
            type="checkbox" 
            checked={experimentConfig.tagsEnabled} 
            onChange={(e) => onUpdateConfig('tagsEnabled', e.target.checked)}
            className="rounded text-indigo-500 focus:ring-0"
          />
          <span>Confidence Tags (IV1)</span>
        </label>

        {/* Friction IV Toggle */}
        <label className="flex items-center gap-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md border border-slate-700">
          <input 
            type="checkbox" 
            checked={experimentConfig.frictionEnabled} 
            onChange={(e) => onUpdateConfig('frictionEnabled', e.target.checked)}
            className="rounded text-indigo-500 focus:ring-0"
          />
          <span>Friction Pause (IV)</span>
        </label>

        {/* Button Salience */}
        <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
          <span className="text-slate-400 text-[10px]">Button Salience:</span>
          <select 
            value={experimentConfig.buttonSalience}
            onChange={(e) => onUpdateConfig('buttonSalience', e.target.value)}
            className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none"
          >
            <option value="large">Large Banner</option>
            <option value="small">Small Icon</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>

        {/* Option Framing */}
        <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
          <span className="text-slate-400 text-[10px]">Framing:</span>
          <select 
            value={experimentConfig.optionFraming}
            onChange={(e) => onUpdateConfig('optionFraming', e.target.value)}
            className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none"
          >
            <option value="equal">Equal (Parent + Helpline)</option>
            <option value="parent_first">Parent Default</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={handleExport}
          className="flex items-center gap-1 px-3 py-1 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded-md shadow-sm transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export JSON Event Logs</span>
        </button>

        <button 
          onClick={onResetSession}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-all"
          title="Reset experiment session"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
