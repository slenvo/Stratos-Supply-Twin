import { MapContainer, TileLayer, Polyline, Marker, CircleMarker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

const shipIcon = (color: string) =>
  L.divIcon({
    html: `<div class="ship-pin" style="--pin-color:${color}"><span>🚢</span></div>`,
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });

export default function SankalpMap({ scenario = 'none' }: { scenario?: string }) {
  const ports = {
    jamnagar: { coords: [22.4, 70.0] as [number, number], name: 'Jamnagar Refinery (India)', role: 'destination' },
    rasTanura: { coords: [26.8, 50.1] as [number, number], name: 'Ras Tanura Port (Saudi Arabia)', role: 'source' },
    suez: { coords: [30.0, 32.5] as [number, number], name: 'Suez Canal (Egypt)', role: 'chokepoint' },
    cape: { coords: [-34.3, 18.4] as [number, number], name: 'Cape of Good Hope (South Africa)', role: 'waypoint' },
  };

  // Map each port's role to a color + "alert" state based on the active scenario
  const portStatus = (role: string) => {
    if (scenario === 'hormuz' && (role === 'source' || role === 'destination')) {
      return { color: '#ef4444', alert: true };   // stranded fleet zone
    }
    if (scenario === 'redsea' && role === 'chokepoint') {
      return { color: '#ef4444', alert: true };   // Suez blocked
    }
    if (scenario === 'redsea' && role === 'waypoint') {
      return { color: '#f59e0b', alert: true };   // Cape reroute active
    }
    if (role === 'destination') return { color: '#10b981', alert: false };
    if (role === 'source') return { color: '#3b82f6', alert: false };
    if (role === 'chokepoint') return { color: '#3b82f6', alert: false };
    return { color: '#64748b', alert: false };     // idle waypoint
  };

  const primaryRoute = [ports.rasTanura.coords, ports.jamnagar.coords];
  const redSeaRoute = [ports.suez.coords, ports.jamnagar.coords];
  const capeRoute = [ports.suez.coords, ports.cape.coords, ports.jamnagar.coords];

  const routeColor = scenario === 'hormuz' ? '#ef4444' : scenario === 'redsea' ? '#f59e0b' : '#3b82f6';

  return (
    <MapContainer
      center={[18, 55]}
      zoom={3.5}
      zoomSnap={0.5}
      minZoom={3}
      maxBounds={[[-60, -40], [70, 140]]}
      maxBoundsViscosity={0.8}
      className="w-full h-full z-10"
      style={{ background: '#0f172a' }}
      attributionControl={false}
    >
      <TileLayer
  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  subdomains={['a', 'b', 'c', 'd']}
  attribution='&copy; CARTO &copy; OpenStreetMap'
/>

      {Object.values(ports).map((port, idx) => {
        const { color, alert } = portStatus(port.role);
        return (
          <div key={idx}>
            {alert && (
              <CircleMarker
                center={port.coords}
                radius={16}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.15, weight: 1, opacity: 0.5 }}
                className="pulse-ring"
              />
            )}
            <CircleMarker
              center={port.coords}
              radius={7}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.9, weight: 2 }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <span className="font-semibold text-slate-800">{port.name}</span>
              </Tooltip>
            </CircleMarker>
          </div>
        );
      })}

      {/* Primary Hormuz corridor */}
      <Polyline positions={primaryRoute} color={routeColor} weight={3} dashArray="6, 8" className="flowing-route" />
      <Marker position={[24.6, 60.05]} icon={shipIcon(routeColor)} />

      {/* Red Sea corridor (hidden when rerouted) */}
      {scenario !== 'redsea' && (
        <>
          <Polyline positions={redSeaRoute} color="#3b82f6" weight={3} dashArray="6, 8" className="flowing-route" />
          <Marker position={[26.2, 51.25]} icon={shipIcon('#3b82f6')} />
        </>
      )}

      {/* Cape reroute */}
      {scenario === 'redsea' && (
        <>
          <Polyline positions={capeRoute} color="#f59e0b" weight={3} dashArray="6, 8" className="flowing-route" />
          <Marker position={[-2.15, 25.45]} icon={shipIcon('#f59e0b')} />
          <Marker position={[-5.95, 44.2]} icon={shipIcon('#f59e0b')} />
        </>
      )}
    </MapContainer>
  );
}