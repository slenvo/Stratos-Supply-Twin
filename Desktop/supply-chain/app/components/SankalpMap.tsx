import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons issue in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

// Create custom 🚢 DivIcon
const shipIconHormuz = L.divIcon({
  html: '<p>🚢</p>',
  className: 'custom-ship-icon',
  iconSize: [30, 30],
  iconAnchor: [15, 15] // centering
});

// Red Version for Hormuz Standoff
const shipIconRed = L.divIcon({
  html: '<p>🚢</p>',
  className: 'custom-ship-icon hormuz-active',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// Yellow Version for Red Sea Disruption
const shipIconRedSea = L.divIcon({
  html: '<p>🚢</p>',
  className: 'custom-ship-icon redsea-active', // Optional, will add pulse automatically
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

export default function SankalpMap({ scenario = 'none' }: { scenario?: string }) {
  // Defined locations
  const locations: Record<string, [number, number]> = {
    jamnagar: [22.4, 70.0],
    rasTanura: [26.8, 50.1],
    suez: [30.0, 32.5],
    cape: [34.3, 18.4], // Cape of Good Hope, South Africa
  };

  // Paths
  const primaryRoute = [locations.rasTanura, locations.jamnagar];
  const redSeaRoute = [locations.suez, locations.jamnagar];
  const capeRoute = [locations.suez, locations.cape, locations.jamnagar];

  return (
    <MapContainer center={[20, 50]} zoom={3.5} className="w-full h-full rounded-xl z-10" style={{ background: '#1e293b' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Primary Route */}
      <Polyline 
        positions={primaryRoute} 
        color={scenario === 'hormuz' ? "#ef4444" : "#3b82f6"} 
        weight={3} 
        dashArray="5, 10"
        className="flowing-route"
      />
      {/* Ship on Primary Route: Middle of Persian Gulf */}
      <Marker 
        position={[24.6, 60.0]} 
        icon={scenario === 'hormuz' ? shipIconRed : shipIconHormuz}
      />

      {/* Red Sea Route - Always Blue and Flowing */}
      {scenario !== 'redsea' && (
        <>
          <Polyline 
            positions={redSeaRoute} 
            color="#3b82f6" 
            weight={3} 
            dashArray="5, 10" 
            className="flowing-route"
          />
          {/* Ship on Red Sea Path: Middle of Arabian Sea */}
          <Marker position={[16.0, 55.0]} icon={shipIconHormuz} />
        </>
      )}

      {/* Alternate Route via Cape - Shows up if Red Sea is disrupted */}
      {scenario === 'redsea' && (
        <>
          <Polyline 
            positions={capeRoute} 
            color="#f59e0b" // yellow-500
            weight={3} 
            dashArray="5, 10" 
            className="flowing-route"
          />
          {/* Ship on Cape Path: South Atlantic */}
          <Marker position={[-20.0, 10.0]} icon={shipIconRedSea} />
          {/* Alternate marker in Mediterranean (Still connected via Suez) */}
          <Marker position={[35.0, 20.0]} icon={shipIconRedSea} />
        </>
      )}
    </MapContainer>
  );
}