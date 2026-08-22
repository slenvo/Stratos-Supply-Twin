'use client';

import { AlertTriangle, Activity, ShieldAlert, Clock, TrendingDown, Anchor, CheckCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamic import for the Map to prevent SSR errors
const MapComponent = dynamic(() => import('./components/SankalpMap'), {
  ssr: false,
  loading: () => <p className="text-slate-500 flex h-full items-center justify-center">Loading Digital Twin...</p>
});

export default function Dashboard() {
  const [scenario, setScenario] = useState('none');

  // Dynamic Stats Data based on scenario
  const stats = {
    none: { delay: '0 Days', cost: 'Stable', vessels: '42 Active', reserve: '12.5 Days', color: 'bg-emerald-500' },
    hormuz: { delay: '+14 Days', cost: '+$2.4M / day', vessels: '18 Stranded', reserve: '4.2 Days', color: 'bg-red-500' },
    redsea: { delay: '+21 Days', cost: '+$1.8M / day', vessels: '24 Rerouted', reserve: '7.1 Days', color: 'bg-amber-500' }
  };

  const currentStats = stats[scenario as keyof typeof stats];

  return (
    <div className="flex h-screen bg-slate-950 text-white font-sans overflow-hidden">
      
      {/* SIDEBAR: Crisis Control Panel */}
      <div className="w-80 bg-slate-900 border-r border-slate-800 p-6 flex flex-col z-20 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <Activity className="text-blue-500 w-8 h-8" />
          <h1 className="text-2xl font-bold tracking-wider">SANKALP</h1>
        </div>

        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Active Scenarios</h2>
        
        {/* Scenario Buttons */}
        <div className="space-y-3 mb-8">
          <button 
            onClick={() => setScenario('hormuz')}
            className={`w-full text-left p-4 rounded-lg border transition-all duration-300 flex items-start gap-3 ${scenario === 'hormuz' ? 'bg-red-950/30 border-red-500/50' : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'}`}
          >
            <AlertTriangle className={`w-5 h-5 mt-0.5 ${scenario === 'hormuz' ? 'text-red-400' : 'text-slate-400'}`} />
            <div>
              <div className="font-semibold text-sm">Hormuz Standoff</div>
              <div className="text-xs text-slate-400 mt-1">Simulate naval blockade</div>
            </div>
          </button>

          <button 
            onClick={() => setScenario('redsea')}
            className={`w-full text-left p-4 rounded-lg border transition-all duration-300 flex items-start gap-3 ${scenario === 'redsea' ? 'bg-amber-950/30 border-amber-500/50' : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'}`}
          >
            <ShieldAlert className={`w-5 h-5 mt-0.5 ${scenario === 'redsea' ? 'text-amber-400' : 'text-slate-400'}`} />
            <div>
              <div className="font-semibold text-sm">Red Sea Disruption</div>
              <div className="text-xs text-slate-400 mt-1">Reroute via Cape of Good Hope</div>
            </div>
          </button>

          <button 
            onClick={() => setScenario('none')}
            className={`w-full text-left p-4 rounded-lg border transition-all duration-300 flex items-start gap-3 ${scenario === 'none' ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'}`}
          >
            <CheckCircle className={`w-5 h-5 mt-0.5 ${scenario === 'none' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <div>
              <div className="font-semibold text-sm">Normal Operations</div>
              <div className="text-xs text-slate-400 mt-1">Reset all systems</div>
            </div>
          </button>
        </div>

        {/* Live Intel / Impact Analysis HUD */}
        <div className="mt-auto">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Live Impact Intel</h2>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 mb-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 flex items-center gap-2"><Clock className="w-3 h-3"/> Delay</span>
              <span className={`text-sm font-bold ${scenario !== 'none' ? 'text-red-400' : 'text-emerald-400'}`}>{currentStats.delay}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 flex items-center gap-2"><TrendingDown className="w-3 h-3"/> Cost Impact</span>
              <span className="text-sm font-bold">{currentStats.cost}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 flex items-center gap-2"><Anchor className="w-3 h-3"/> Fleet Status</span>
              <span className="text-sm font-bold">{currentStats.vessels}</span>
            </div>
          </div>

          {/* Strategic Reserve Status */}
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
            <div className="text-xs text-slate-400 mb-1">Strategic Reserve Status</div>
            <div className="text-2xl font-bold mb-2">{currentStats.reserve}</div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className={`h-2 rounded-full transition-all duration-1000 ${currentStats.color}`} style={{ width: scenario === 'none' ? '100%' : scenario === 'hormuz' ? '30%' : '55%' }}></div>
            </div>
          </div>
        </div>

      </div>

      {/* MAIN CONTENT: Map Area */}
      <div className="flex-1 relative">
        <MapComponent scenario={scenario} />
      </div>
    </div>
  );
}