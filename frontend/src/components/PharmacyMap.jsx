import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default marker icon path issue with bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function PharmacyMap({ center, radiusKm = 5, pharmacies = [] }) {
  return (
    <div className="map-wrap">
      <MapContainer center={[center.lat, center.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle
          center={[center.lat, center.lng]}
          radius={radiusKm * 1000}
          pathOptions={{ color: '#0f9d78', fillOpacity: 0.08 }}
        />
        <Marker position={[center.lat, center.lng]}>
          <Popup>You are here</Popup>
        </Marker>
        {pharmacies.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]}>
            <Popup>
              <strong>{p.name}</strong>
              <br />
              {p.address}
              {p.distanceKm != null && (
                <>
                  <br />
                  {p.distanceKm.toFixed(1)} km away
                </>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
