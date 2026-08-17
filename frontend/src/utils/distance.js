// Haversine formula — distance between two lat/lng points in kilometers
export function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Filter + sort pharmacies within a radius (default 5km), nearest & cheapest first
export function nearbyWithinRadius(pharmacies, userLat, userLng, radiusKm = 5) {
  return pharmacies
    .map((p) => ({
      ...p,
      distanceKm: getDistanceKm(userLat, userLng, p.lat, p.lng),
    }))
    .filter((p) => p.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
}
