'use client';

import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map({ scenario = 'none' }: { scenario?: string }) {  
  const locations = {
    jamnagar: [22.3399, 69.9501] as [number, number],
    hormuz: [26.5667, 56.2500] as [number, number],
    suez: [30.5852, 32.2653] as [number, number],
    cape: [-34.3568, 18.4710] as [number, number]
  };

  // Main Default Shipping Route (Suez -> Hormuz -> India)
  const primaryRoute = [locations.suez, locations.hormuz, locations.jamnagar];

  return (
    <MapContainer 
      center={[20.0, 60.0]} 
      zoom={4} 
      style={{ height: '100%', width: '100%', zIndex: 0 }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; CARTO'
      />

      {/* Primary Route - Turns Red if Hormuz is blocked */}
      <Polyline 
        positions={primaryRoute} 
        color={scenario === 'hormuz' ? "#ef4444" : "#3b82f6"} 
        weight={3} 
        dashArray="5, 10"
        className="flowing-route"
      />

      {/* Alternate Route via Cape - Shows up if Red Sea is disrupted */}
      {scenario === 'redsea' && (
        <Polyline 
          positions={[locations.suez, locations.cape, locations.jamnagar]} 
          color="#f59e0b" 
          weight={3} 
          dashArray="5, 10" 
          className="flowing-route"
        />
      )}

      {/* Plot the Locations */}
      {Object.entries(locations).map(([name, coords]) => (
        <CircleMarker key={name} center={coords} radius={6} color="#10b981" fillColor="#10b981" fillOpacity={1}>
          <Tooltip direction="top" opacity={1}>
            <span className="capitalize font-bold text-slate-900">{name}</span>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}