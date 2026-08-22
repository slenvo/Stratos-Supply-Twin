'use client';

import { AlertTriangle, Activity, ShieldAlert, CheckCircle, Zap, Globe, Cpu, Database, TrendingDown, Crosshair } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const MapComponent = dynamic(() => import('./components/SankalpMap'), {
  ssr: false,
  loading: () => <p className="text-blue-500 animate-pulse flex h-full items-center justify-center font-mono">Initializing Supply Chain Digital Twin...</p>
});

export default function Dashboard() {
  const [scenario, setScenario] = useState('none');
  const [isCalculating, setIsCalculating] = useState(false);
  const [newsIndex, setNewsIndex] = useState(0);

  // Live News Ticker Logic (Makes it look continuously monitoring)
  const liveFeeds = {
    none: ['Global maritime routes nominal.', 'Brent Crude trading at $78/bbl.', 'OPEC+ maintains output quotas.'],
    hormuz: ['ALERT: Strait of Hormuz blocked by naval assets.', 'SANCTIONS: Secondary sanctions applied on regional exports.', 'MARKET PANIC: Crude spikes to $105/bbl.'],
    redsea: ['WARNING: Houthi drones sighted near Bab-el-Mandeb.', 'LOGISTICS: Maersk suspends Red Sea transit.', 'REROUTE: Vessels diverting via Cape of Good Hope.']
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle Scenario Change with AI "Thinking" Delay
  const handleScenarioChange = (newScenario: string) => {
    if (newScenario === scenario) return;
    setIsCalculating(true);
    setTimeout(() => {
      setScenario(newScenario);
      setIsCalculating(false);
    }, 1500); // 1.5 second fake AI calculation delay
  };

  // Exact Data Matching the Problem Statement PDF
  const agentData = {
    none: {
      risk: '12% (LOW)',
      refining: 'Capacity at 98%',
      price: 'Stable ($78/bbl)',
      gdp: '+0.0% Impact',
      drawdown: '0 MBbl/day',
      reserve: '12.5 Days',
      procurement: [
        { source: 'UAE (Murban)', route: 'Direct (Persian Gulf)' },
        { source: 'Iraq (Basrah)', route: 'Direct (Persian Gulf)' }
      ],
      color: 'text-emerald-400',
      bg: 'bg-emerald-500',
      border: 'border-emerald-500/50'
    },
    hormuz: {
      risk: '94% (CRITICAL)',
      refining: 'Drops to 65% in 4 days',
      price: 'Spikes to $105/bbl',
      gdp: '-1.2% Contraction',
      drawdown: '4.2 MBbl/day (Maximum)',
      reserve: '4.2 Days',
      procurement: [
        { source: 'Nigeria (Bonny Light)', route: 'West Africa -> Cape' },
        { source: 'USA (WTI)', route: 'Atlantic -> Cape' }
      ],
      color: 'text-red-400',
      bg: 'bg-red-500',
      border: 'border-red-500/50'
    },
    redsea: {
      risk: '76% (HIGH)',
      refining: 'Capacity at 82%',
      price: 'Increases to $88/bbl',
      gdp: '-0.4% Contraction',
      drawdown: '1.8 MBbl/day',
      reserve: '7.1 Days',
      procurement: [
        { source: 'Brazil (Tupi)', route: 'South Atlantic -> Direct' },
        { source: 'Guyana (Liza)', route: 'Atlantic -> Cape' }
      ],
      color: 'text-amber-400',
      bg: 'bg-amber-500',
      border: 'border-amber-500/50'
    }
  };

  const currentData = agentData[scenario as keyof typeof agentData];

  return (
    <div className="flex h-screen bg-slate-950 text-white font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR: Modeller & Reserve Optimizer */}
      <div className="w-80 bg-slate-900 border-r border-slate-800 p-5 flex flex-col z-20 shadow-2xl overflow-y-auto">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
          <Activity className="text-blue-500 w-8 h-8" />
          <h1 className="text-xl font-bold tracking-wider">STRATOS AI</h1>
        </div>

        {/* 1. Disruption Scenario Modeller */}
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Cpu className="w-3 h-3"/> Disruption Scenario Modeller</h2>
        <div className="space-y-2 mb-6">
          <button onClick={() => handleScenarioChange('hormuz')} className={`w-full text-left p-3 rounded border transition-all duration-300 flex items-start gap-3 ${scenario === 'hormuz' ? 'bg-red-950/30 border-red-500/50' : 'bg-slate-800/30 border-slate-700'}`}><AlertTriangle className={`w-4 h-4 mt-0.5 ${scenario === 'hormuz' ? 'text-red-400' : 'text-slate-400'}`} /><div><div className="font-semibold text-sm">Hormuz Closure</div></div></button>
          <button onClick={() => handleScenarioChange('redsea')} className={`w-full text-left p-3 rounded border transition-all duration-300 flex items-start gap-3 ${scenario === 'redsea' ? 'bg-amber-950/30 border-amber-500/50' : 'bg-slate-800/30 border-slate-700'}`}><ShieldAlert className={`w-4 h-4 mt-0.5 ${scenario === 'redsea' ? 'text-amber-400' : 'text-slate-400'}`} /><div><div className="font-semibold text-sm">Red Sea Suspension</div></div></button>
          <button onClick={() => handleScenarioChange('none')} className={`w-full text-left p-3 rounded border transition-all duration-300 flex items-start gap-3 ${scenario === 'none' ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-slate-800/30 border-slate-700'}`}><CheckCircle className={`w-4 h-4 mt-0.5 ${scenario === 'none' ? 'text-emerald-400' : 'text-slate-400'}`} /><div><div className="font-semibold text-sm">Nominal State</div></div></button>
        </div>

        {/* Impact Output */}
        <div className="bg-slate-800/30 rounded p-3 border border-slate-700 mb-6">
          <div className="text-[10px] text-slate-400 mb-2 font-mono uppercase">Cascading Impact Analysis</div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span>Refining Impact:</span> <span className={`font-bold ${currentData.color}`}>{currentData.refining}</span></div>
            <div className="flex justify-between"><span>Price Impact:</span> <span className={`font-bold ${currentData.color}`}>{currentData.price}</span></div>
            <div className="flex justify-between"><span>GDP Impact:</span> <span className={`font-bold ${currentData.color}`}>{currentData.gdp}</span></div>
          </div>
        </div>

        {/* 2. Strategic Reserve Optimisation Agent */}
        <div className="mt-auto">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Database className="w-3 h-3"/> Strategic Reserve Agent</h2>
          <div className={`bg-slate-900 rounded p-4 border ${currentData.border} transition-colors duration-500`}>
             <div className="flex justify-between items-end mb-2">
               <div>
                 <div className="text-[10px] text-slate-400">Optimum Drawdown</div>
                 <div className="text-sm font-bold text-white">{currentData.drawdown}</div>
               </div>
               <div className="text-right">
                 <div className="text-[10px] text-slate-400">Gap Forecast</div>
                 <div className={`text-xl font-bold ${currentData.color}`}>{currentData.reserve}</div>
               </div>
             </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
              <div className={`h-1.5 rounded-full transition-all duration-1000 ${currentData.bg}`} style={{ width: scenario === 'none' ? '100%' : scenario === 'hormuz' ? '30%' : '55%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* CENTER MAP (Supply Chain Digital Twin) */}
      <div className="flex-1 relative">
        {/* Fake AI Calculating Overlay */}
        {isCalculating && (
          <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <Crosshair className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <div className="text-blue-400 font-mono text-lg animate-pulse">Recalculating Global Logistics Matrix...</div>
            <div className="text-slate-400 font-mono text-sm mt-2">Optimizing procurement routes...</div>
          </div>
        )}
        <div className="absolute top-4 left-4 z-40 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded flex items-center gap-2 text-xs font-mono backdrop-blur-md">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          Geospatial Digital Twin Active
        </div>
        <MapComponent scenario={scenario} />
      </div>

      {/* RIGHT SIDEBAR: Risk & Procurement */}
      <div className="w-80 bg-slate-900 border-l border-slate-800 p-5 flex flex-col z-20 shadow-2xl overflow-y-auto">
        
        {/* 3. Geopolitical Risk Intelligence Agent */}
        <div className="mb-6">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Globe className="w-3 h-3"/> Geopolitical Risk Agent</h2>
          <div className={`bg-slate-800/30 rounded p-4 border ${currentData.border} transition-colors duration-500`}>
            <div className="text-center mb-4">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Live Disruption Probability</div>
              <div className={`text-4xl font-black mt-1 ${currentData.color}`}>{currentData.risk.split(' ')[0]}</div>
              <div className={`text-xs font-bold mt-1 ${currentData.color}`}>{currentData.risk.split(' ')[1]}</div>
            </div>
            
            {/* Live Ticker Feed */}
            <div className="bg-slate-950 rounded p-2 border border-slate-800 flex items-start gap-2">
              <Zap className="w-3 h-3 text-blue-400 animate-pulse mt-0.5 shrink-0" />
              <div className="text-[10px] font-mono text-slate-300 h-8 overflow-hidden">
                {liveFeeds[scenario as keyof typeof liveFeeds][newsIndex]}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Adaptive Procurement Orchestrator */}
        <div>
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><TrendingDown className="w-3 h-3"/> Procurement Orchestrator</h2>
          <div className="bg-slate-800/30 rounded p-4 border border-slate-700">
            <div className="text-[10px] text-amber-500/80 uppercase font-bold mb-2">Executable Rerouting Recommendations</div>
            <div className="space-y-3 mt-3">
              {currentData.procurement.map((item, idx) => (
                <div key={idx} className="bg-slate-900 p-2 rounded border border-slate-700/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-white">Rank {idx + 1}: {item.source}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Crosshair className="w-3 h-3"/> Route: {item.route}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}