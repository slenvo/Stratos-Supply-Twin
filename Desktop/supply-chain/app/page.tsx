'use client';

import { AlertTriangle, Activity, ShieldAlert, CheckCircle, Globe, Cpu, Database, TrendingDown, Crosshair, MapPin, Mail, Headset } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const MapComponent = dynamic(() => import('./components/SankalpMap'), {
  ssr: false,
  loading: () => <p className="text-blue-500 animate-pulse flex h-full items-center justify-center font-mono">Initializing Geospatial Engine...</p>
});

export default function Dashboard() {
  const [scenario, setScenario] = useState('none');
  const [isCalculating, setIsCalculating] = useState(false);
  
  const [source, setSource] = useState('ras_tanura');
  const [destination, setDestination] = useState('jamnagar');
  const [customRisk, setCustomRisk] = useState<any>(null);

  const handleScenarioChange = (newScenario: string) => {
    if (newScenario === scenario) return;
    setIsCalculating(true);
    setCustomRisk(null);
    setTimeout(() => {
      setScenario(newScenario);
      setIsCalculating(false);
    }, 1500); 
  };

  const handleCustomAnalysis = () => {
    setIsCalculating(true);
    setScenario('custom');
    
    setTimeout(() => {
      let riskScore = 15;
      let status = "LOW";
      let color = "text-emerald-400";
      
      if (source === 'ras_tanura' || source === 'basrah') { riskScore = 88; status = "CRITICAL"; color = "text-red-400"; }
      else if (source === 'bonny_light') { riskScore = 45; status = "MODERATE"; color = "text-amber-400"; }
      else if (source === 'houston') { riskScore = 22; status = "ELEVATED"; color = "text-blue-400"; }

      setCustomRisk({
        risk: `${riskScore}% (${status})`,
        color: color,
        route: `${source.replace('_', ' ').toUpperCase()} ➔ ${destination.toUpperCase()}`
      });
      setIsCalculating(false);
    }, 1200);
  };

  const agentData = {
    none: { risk: '12% (LOW)', refining: 'Capacity at 98%', price: 'Stable ($78/bbl)', gdp: '+0.0% Impact', insurance: 'Standard Premium', drawdown: '0 MBbl/day', reserve: '12.5 Days', color: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500/50' },
    hormuz: { risk: '94% (CRITICAL)', refining: 'Drops to 65% in 4 days', price: 'Spikes to $105/bbl', gdp: '-1.2% Contraction', insurance: '+300% War Risk Premium', drawdown: '4.2 MBbl/day', reserve: '4.2 Days', color: 'text-red-400', bg: 'bg-red-500', border: 'border-red-500/50' },
    redsea: { risk: '76% (HIGH)', refining: 'Capacity at 82%', price: 'Increases to $88/bbl', gdp: '-0.4% Contraction', insurance: '+150% Transit Premium', drawdown: '1.8 MBbl/day', reserve: '7.1 Days', color: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500/50' },
    custom: { risk: customRisk?.risk || 'Calculating...', refining: 'Variable Capacity', price: 'Market Dependent', gdp: 'Pending Analysis', insurance: 'Calculating Premium', drawdown: 'Dynamic', reserve: 'Analyzing Buffer', color: customRisk?.color || 'text-blue-400', bg: 'bg-blue-500', border: 'border-blue-500/50' }
  };

  const currentData = agentData[scenario as keyof typeof agentData];

  return (
    <div className="flex h-screen bg-slate-950 text-white font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR */}
      <div className="w-80 bg-slate-900 border-r border-slate-800 p-5 flex flex-col z-20 shadow-2xl overflow-y-auto">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
          <Activity className="text-blue-500 w-8 h-8" />
          <h1 className="text-xl font-bold tracking-wider">STRATOS AI</h1>
        </div>

        {/* Custom Route Intelligence */}
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><MapPin className="w-3 h-3"/> Custom Route Analysis</h2>
        <div className="bg-slate-800/30 rounded p-3 border border-slate-700 mb-6 space-y-3">
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block">Source Origin</label>
            <select value={source} onChange={(e) => setSource(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs focus:outline-none focus:border-blue-500">
              <option value="ras_tanura">Ras Tanura (Saudi Arabia)</option>
              <option value="basrah">Basrah (Iraq)</option>
              <option value="bonny_light">Bonny Terminal (Nigeria)</option>
              <option value="houston">Houston Port (USA)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block">Destination Port</label>
            <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs focus:outline-none focus:border-blue-500">
              <option value="jamnagar">Jamnagar Refinery (India)</option>
              <option value="mangalore">Mangalore Port (India)</option>
              <option value="kochi">Kochi Terminal (India)</option>
            </select>
          </div>
          <button onClick={handleCustomAnalysis} className="w-full bg-slate-700 hover:bg-blue-600 text-white text-xs font-bold py-2 rounded transition-colors">
            ANALYZE RISK
          </button>
        </div>

        {/* Economic Impact Tracker */}
        <div className="bg-slate-900 rounded p-4 border border-slate-700 mb-6 shadow-lg">
          <div className="text-[10px] text-slate-400 mb-3 font-mono uppercase flex items-center gap-2 border-b border-slate-700/50 pb-2">
            <TrendingDown className="w-3 h-3"/> Economic Impact Tracker
          </div>
          <div className="space-y-3 text-xs font-semibold">
            <div className="flex justify-between items-center"><span className="text-slate-300">Refining Output:</span> <span className={`text-right ${currentData.color}`}>{currentData.refining}</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-300">Crude Price:</span> <span className={`text-right ${currentData.color}`}>{currentData.price}</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-300">GDP Impact:</span> <span className={`text-right ${currentData.color}`}>{currentData.gdp}</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-300">Freight Insurance:</span> <span className={`text-right ${currentData.color}`}>{currentData.insurance}</span></div>
          </div>
        </div>

        {/* Macro Crisis Models */}
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Cpu className="w-3 h-3"/> Macro Crisis Models</h2>
        <div className="space-y-2 mb-6">
          <button onClick={() => handleScenarioChange('hormuz')} className={`w-full text-left p-3 rounded border transition-all duration-300 flex items-start gap-3 ${scenario === 'hormuz' ? 'bg-red-950/30 border-red-500/50' : 'bg-slate-800/30 border-slate-700'}`}><AlertTriangle className={`w-4 h-4 mt-0.5 ${scenario === 'hormuz' ? 'text-red-400' : 'text-slate-400'}`} /><div><div className="font-semibold text-sm">Hormuz Closure</div></div></button>
          <button onClick={() => handleScenarioChange('redsea')} className={`w-full text-left p-3 rounded border transition-all duration-300 flex items-start gap-3 ${scenario === 'redsea' ? 'bg-amber-950/30 border-amber-500/50' : 'bg-slate-800/30 border-slate-700'}`}><ShieldAlert className={`w-4 h-4 mt-0.5 ${scenario === 'redsea' ? 'text-amber-400' : 'text-slate-400'}`} /><div><div className="font-semibold text-sm">Red Sea Suspension</div></div></button>
          <button onClick={() => handleScenarioChange('none')} className={`w-full text-left p-3 rounded border transition-all duration-300 flex items-start gap-3 ${scenario === 'none' ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-slate-800/30 border-slate-700'}`}><CheckCircle className={`w-4 h-4 mt-0.5 ${scenario === 'none' ? 'text-emerald-400' : 'text-slate-400'}`} /><div><div className="font-semibold text-sm">Nominal State</div></div></button>
        </div>
      </div>

      {/* CENTER MAP */}
      <div className="flex-1 relative">
        {isCalculating && (
          <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <Crosshair className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <div className="text-blue-400 font-mono text-lg animate-pulse">Running Monte Carlo Simulations...</div>
          </div>
        )}
        <MapComponent scenario={scenario} source={source} destination={destination} />
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-80 bg-slate-900 border-l border-slate-800 p-5 flex flex-col z-20 shadow-2xl overflow-y-auto">
        
        {/* Risk Agent Output */}
        <div className="mb-6">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Globe className="w-3 h-3"/> Geopolitical Risk Agent</h2>
          <div className={`bg-slate-800/30 rounded p-4 border ${currentData.border} transition-colors duration-500`}>
            {scenario === 'custom' && customRisk ? (
              <div className="text-center mb-4">
                 <div className="text-[10px] text-slate-400 uppercase font-mono">Custom Route Analysis</div>
                 <div className={`text-xs font-bold mt-2 text-white`}>{customRisk.route}</div>
                 <div className={`text-3xl font-black mt-2 ${customRisk.color}`}>{customRisk.risk.split(' ')[0]}</div>
                 <div className={`text-xs font-bold mt-1 ${customRisk.color}`}>{customRisk.risk.split(' ')[1]}</div>
              </div>
            ) : (
              <div className="text-center mb-4">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Macro Disruption Probability</div>
                <div className={`text-4xl font-black mt-1 ${currentData.color}`}>{currentData.risk.split(' ')[0]}</div>
                <div className={`text-xs font-bold mt-1 ${currentData.color}`}>{currentData.risk.split(' ')[1]}</div>
              </div>
            )}
          </div>
        </div>

        {/* NEW HELPDESK / SUPPORT SECTION (Fills the gap) */}
        <div className="mb-6">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Headset className="w-3 h-3"/> Helpdesk & Comm Link</h2>
          <div className="bg-slate-800/30 rounded p-4 border border-slate-700 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-3 border border-slate-700 shadow-inner">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-xs text-slate-200 mb-1 font-bold">Stratos Command Center</div>
            <div className="text-[10px] text-slate-500 mb-4">Need manual override or expert analyst support? Contact us immediately.</div>
            
            {/* The actual mailto link action button */}
            <a 
              href="mailto:stratos.helpdesk@gmail.com?subject=Emergency%20Override%20Request%20-%20Stratos%20Dashboard" 
              className="w-full bg-slate-700 hover:bg-blue-600 text-white text-xs font-bold py-2.5 rounded transition-colors flex justify-center items-center gap-2"
            >
              <Mail className="w-3 h-3"/> SEND SECURE COMM
            </a>
          </div>
        </div>
        
        {/* Strategic Reserve Agent (Bottom aligned) */}
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
    </div>
  );
}