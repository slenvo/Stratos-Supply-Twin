import { MapContainer, TileLayer, Polyline, Marker, CircleMarker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons issue in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

// Helper Function: Creates perfectly centered, pulsing ship icons based on scenario color
const createShipIcon = (color: string) => L.divIcon({ 
  html: `
    <div style="
      width: 36px; 
      height: 36px; 
      background: ${color}33; 
      border: 3px solid ${color}; 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-size: 18px; 
      box-shadow: 0 0 15px ${color}, inset 0 0 10px ${color};
      animation: shipPulse 1.5s infinite ease-in-out;
      margin: 0;
      padding: 0;
      line-height: 1;
    ">
      🚢
    </div>
  `,
  className: 'custom-ship-wrapper', // Overrides Leaflet's default white box background
  iconSize: [36, 36], 
  iconAnchor: [18, 18] // THIS FIXES ALIGNMENT: Places the exact center of the 36x36 circle on the line
});

// Create different colored ships for different scenarios
const shipIconBlue = createShipIcon('#3b82f6');
const shipIconRed = createShipIcon('#ef4444');
const shipIconAmber = createShipIcon('#f59e0b');

export default function SankalpMap({ scenario = 'none', source = 'ras_tanura', destination = 'jamnagar' }: { scenario?: string, source?: string, destination?: string }) {
  
  // All Global & Indian Ports Coordinates
  const allPorts: Record<string, { coords: [number, number], name: string, color: string }> = {
    jamnagar: { coords: [22.4, 70.0], name: 'Jamnagar Refinery', color: '#10b981' },
    mangalore: { coords: [12.9, 74.8], name: 'Mangalore Port', color: '#10b981' },
    kochi: { coords: [9.9, 76.2], name: 'Kochi Terminal', color: '#10b981' },
    ras_tanura: { coords: [26.8, 50.1], name: 'Ras Tanura (Saudi Arabia)', color: '#3b82f6' },
    basrah: { coords: [29.9, 48.2], name: 'Basrah (Iraq)', color: '#3b82f6' },
    bonny_light: { coords: [4.4, 7.1], name: 'Bonny Terminal (Nigeria)', color: '#3b82f6' },
    houston: { coords: [29.7, -95.3], name: 'Houston Port (USA)', color: '#3b82f6' },
    suez: { coords: [30.0, 32.5], name: 'Suez Canal', color: '#f59e0b' },
    cape: { coords: [-34.3, 18.4], name: 'Cape of Good Hope', color: '#f59e0b' }, 
    hormuz_wp: { coords: [26.2, 56.5], name: 'Strait of Hormuz', color: '#f59e0b' } 
  };

  // Macro Scenarios Routes
  const primaryRoute = [allPorts.ras_tanura.coords, allPorts.hormuz_wp.coords, allPorts.jamnagar.coords];
  const redSeaRoute = [allPorts.suez.coords, allPorts.jamnagar.coords];
  const capeRoute = [allPorts.suez.coords, allPorts.cape.coords, allPorts.jamnagar.coords];

  // Smart Routing Engine for Custom Dropdowns
  const customSrc = allPorts[source]?.coords || [0,0];
  const customDest = allPorts[destination]?.coords || [0,0];
  let customRoute: [number, number][] = [];

  if (source === 'ras_tanura' || source === 'basrah') {
    customRoute = [customSrc, allPorts.hormuz_wp.coords, customDest];
  } else if (source === 'bonny_light' || source === 'houston') {
    customRoute = [customSrc, allPorts.cape.coords, customDest];
  } else {
    customRoute = [customSrc, customDest];
  }
  
  // Dynamic Ship Positioning (Exactly on the line intersections)
  const shipPosition = customRoute.length === 3 ? customRoute[1] : [
    (customSrc[0] + customDest[0]) / 2,
    (customSrc[1] + customDest[1]) / 2
  ];

  return (
    <>
      {/* CSS Animation injected safely inside the component */}
      <style>{`
        @keyframes shipPulse {
          0% { transform: scale(0.85); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(0.85); opacity: 0.8; }
        }
        .custom-ship-wrapper { background: transparent !important; border: none !important; }
      `}</style>

      <MapContainer center={[20, 50]} zoom={3.5} className="w-full h-full rounded-xl z-10" style={{ background: '#090d16' }}>
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Render all solid dots */}
        {Object.values(allPorts).map((port, idx) => (
          <CircleMarker key={idx} center={port.coords} radius={6} pathOptions={{ color: port.color, fillColor: port.color, fillOpacity: 1, weight: 2 }}>
            <Tooltip direction="top" offset={[0, -10]} opacity={1} className="font-bold text-slate-800">{port.name}</Tooltip>
          </CircleMarker>
        ))}

        {/* MACRO SCENARIOS */}
        {scenario !== 'custom' && (
           <>
             <Polyline positions={primaryRoute} color={scenario === 'hormuz' ? "#ef4444" : "#3b82f6"} weight={3} dashArray="5, 10" className="flowing-route" />
             <Marker position={allPorts.hormuz_wp.coords} icon={scenario === 'hormuz' ? shipIconRed : shipIconBlue} />
             
             {scenario !== 'redsea' && (
               <>
                 <Polyline positions={redSeaRoute} color="#3b82f6" weight={3} dashArray="5, 10" className="flowing-route" />
                 {/* Midpoint of Suez and Jamnagar guarantees exact alignment */}
                 <Marker position={[26.2, 51.25]} icon={shipIconBlue} />
               </>
             )}
             {scenario === 'redsea' && (
               <>
                 <Polyline positions={capeRoute} color="#f59e0b" weight={3} dashArray="5, 10" className="flowing-route" />
                 <Marker position={allPorts.cape.coords} icon={shipIconAmber} />
               </>
             )}
           </>
        )}

        {/* CUSTOM DYNAMIC SCENARIO */}
        {scenario === 'custom' && (
          <>
             <Polyline positions={customRoute} color="#8b5cf6" weight={3} dashArray="5, 10" className="flowing-route" />
             <Marker position={shipPosition as [number, number]} icon={createShipIcon('#8b5cf6')} />
          </>
        )}
      </MapContainer>
    </>
  );
}