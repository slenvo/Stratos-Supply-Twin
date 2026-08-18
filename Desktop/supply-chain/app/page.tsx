import { AlertTriangle, Map, Activity, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-slate-950 text-white font-sans overflow-hidden">
      
      {/* SIDEBAR: Crisis Control Panel */}
      <div className="w-80 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <Activity className="text-blue-500 w-8 h-8" />
          <h1 className="text-2xl font-bold tracking-wider">SANKALP</h1>
        </div>
        
        <p className="text-slate-400 text-xs uppercase tracking-widest mb-4 font-semibold">Active Scenarios</p>
        
        <div className="flex flex-col gap-3">
          <button className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 p-4 rounded-lg border border-slate-700 transition-all text-left">
            <AlertTriangle className="text-yellow-500 w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Hormuz Standoff</p>
              <p className="text-xs text-slate-400 mt-1">Simulate naval blockade</p>
            </div>
          </button>

          <button className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 p-4 rounded-lg border border-slate-700 transition-all text-left">
            <ShieldAlert className="text-red-500 w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Red Sea Disruption</p>
              <p className="text-xs text-slate-400 mt-1">Reroute via Cape of Good Hope</p>
            </div>
          </button>
        </div>

        <div className="mt-auto">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 mb-1">Strategic Reserve Status</p>
            <p className="text-2xl font-bold text-green-400">9.5 Days</p>
            <div className="w-full bg-slate-700 h-2 mt-2 rounded-full overflow-hidden">
              <div className="bg-green-400 h-full w-[100%]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN AREA: Interactive Map Placeholder */}
      <div className="flex-1 relative bg-slate-950 flex items-center justify-center">
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle at center, #1e293b 2px, transparent 2px)', backgroundSize: '40px 40px' }}>
        </div>
        
        <div className="z-10 text-center">
          <Map className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-400">Geospatial Digital Twin Loading...</h2>
          <p className="text-sm text-slate-500 mt-2">Map interface will render here</p>
        </div>
      </div>

    </div>
  );
}