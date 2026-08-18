'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map() {
  return (
    <MapContainer 
      center={[20.5937, 78.9629]} // Centered on India
      zoom={4} 
      style={{ height: '100%', width: '100%', zIndex: 0 }}
    >
      {/* Dark mode map tiles to match our command center vibe */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
    </MapContainer>
  );
}