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

// Custom 🚢 DivIcons
const shipIconHormuz = L.divIcon({ html: '<p>🚢</p>', className: 'custom-ship-icon', iconSize: [30, 30], iconAnchor: [15, 15] });
const shipIconRed = L.divIcon({ html: '<p>🚢</p>', className: 'custom-ship-icon hormuz-active', iconSize: [30, 30], iconAnchor: [15, 15] });
const shipIconRedSea = L.divIcon({ html: '<p>🚢</p>', className: 'custom-ship-icon redsea-active', iconSize: [30, 30], iconAnchor: [15, 15] });

export default function SankalpMap({ scenario = 'none' }: { scenario?: string }) {
  
  // Interactive Port Locations with Names and Colors
  const ports = {
    jamnagar: { coords: [22.4, 70.0] as [number, number], name: 'Jamnagar Refinery (India)', color: '#10b981' }, // Green for Destination
    rasTanura: { coords: [26.8, 50.1] as [number, number], name: 'Ras Tanura Port (Saudi Arabia)', color: '#3b82f6' }, // Blue for Source
    suez: { coords: [30.0, 32.5] as [number, number], name: 'Suez Canal (Egypt)', color: '#3b82f6' },
    cape: { coords: [-34.3, 18.4] as [number, number], name: 'Cape of Good Hope (South Africa)', color: '#f59e0b' }, // Yellow for Waypoint
  };

  // Paths
  const primaryRoute = [ports.rasTanura.coords, ports.jamnagar.coords];
  const redSeaRoute = [ports.suez.coords, ports.jamnagar.coords];
  const capeRoute = [ports.suez.coords, ports.cape.coords, ports.jamnagar.coords];

  return (
    <MapContainer center={[20, 50]} zoom={3.5} className="w-full h-full rounded-xl z-10" style={{ background: '#1e293b' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* RENDER INTERACTIVE PORTS (Start & End Points) */}
      {Object.values(ports).map((port, idx) => (
        <CircleMarker
          key={idx}
          center={port.coords}
          radius={7}
          pathOptions={{ color: port.color, fillColor: port.color, fillOpacity: 0.9, weight: 2 }}
        >
          {/* Tooltip appears on hover */}
          <Tooltip direction="top" offset={[0, -10]} opacity={1} className="font-bold text-slate-800">
            {port.name}
          </Tooltip>
        </CircleMarker>
      ))}

      {/* Primary Route (Hormuz) */}
      <Polyline positions={primaryRoute} color={scenario === 'hormuz' ? "#ef4444" : "#3b82f6"} weight={3} dashArray="5, 10" className="flowing-route" />
      <Marker position={[24.6, 60.05]} icon={scenario === 'hormuz' ? shipIconRed : shipIconHormuz} />

      {/* Red Sea Route */}
      {scenario !== 'redsea' && (
        <>
          <Polyline positions={redSeaRoute} color="#3b82f6" weight={3} dashArray="5, 10" className="flowing-route" />
          <Marker position={[26.2, 51.25]} icon={shipIconHormuz} />
        </>
      )}

      {/* Alternate Route via Cape */}
      {scenario === 'redsea' && (
        <>
          <Polyline positions={capeRoute} color="#f59e0b" weight={3} dashArray="5, 10" className="flowing-route" />
          <Marker position={[-2.15, 25.45]} icon={shipIconRedSea} />
          <Marker position={[-5.95, 44.2]} icon={shipIconRedSea} />
        </>
      )}
    </MapContainer>
  );
}