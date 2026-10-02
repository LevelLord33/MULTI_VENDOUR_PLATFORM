/**
 * Frontend Geospatial & Delivery Radius Utilities for Indian Cities & Coordinates
 */

export const MAJOR_CITIES_COORDINATES = {
  'new delhi': { lat: 28.6139, lng: 77.2090, state: 'Delhi' },
  'delhi': { lat: 28.6139, lng: 77.2090, state: 'Delhi' },
  'mumbai': { lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
  'bengaluru': { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  'bangalore': { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  'kolkata': { lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
  'chennai': { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
  'hyderabad': { lat: 17.3850, lng: 78.4867, state: 'Telangana' },
  'pune': { lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  'jaipur': { lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
  'kochi': { lat: 9.9312, lng: 76.2673, state: 'Kerala' },
  'cochin': { lat: 9.9312, lng: 76.2673, state: 'Kerala' },
  'chandigarh': { lat: 30.7333, lng: 76.7794, state: 'Punjab' },
  'ahmedabad': { lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
  'lucknow': { lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh' },
  'indore': { lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh' },
  'surat': { lat: 21.1702, lng: 72.8311, state: 'Gujarat' },
  'bhopal': { lat: 23.2599, lng: 77.4126, state: 'Madhya Pradesh' },
  'patna': { lat: 25.5941, lng: 85.1376, state: 'Bihar' },
  'gurgaon': { lat: 28.4595, lng: 77.0266, state: 'Haryana' },
  'noida': { lat: 28.5355, lng: 77.3910, state: 'Uttar Pradesh' }
};

export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;

  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

export const getCoordinatesForLocation = (locationStr = '') => {
  if (!locationStr) return null;
  const lower = locationStr.toLowerCase();
  for (const [cityName, coords] of Object.entries(MAJOR_CITIES_COORDINATES)) {
    if (lower.includes(cityName)) {
      return { lat: coords.lat, lng: coords.lng, city: cityName, state: coords.state };
    }
  }
  return null;
};

export const checkDeliveryCoverage = (vendor, customerLoc = {}) => {
  const safeLoc = typeof customerLoc === 'string'
    ? { address: customerLoc, city: customerLoc, location: customerLoc }
    : (customerLoc || {});

  const scope = vendor?.deliveryScope || 'pan_india';
  const radius = Number(vendor?.deliveryRadiusKm) || 25;

  if (scope === 'pan_india') {
    return {
      delivers: true,
      scope: 'pan_india',
      distanceKm: null,
      message: 'Pan-India Delivery'
    };
  }

  let vLat = vendor?.latitude;
  let vLng = vendor?.longitude;
  if (!vLat || !vLng) {
    const inferred = getCoordinatesForLocation(vendor?.location || vendor?.businessAddress);
    if (inferred) {
      vLat = inferred.lat;
      vLng = inferred.lng;
    }
  }

  let cLat = safeLoc.latitude;
  let cLng = safeLoc.longitude;
  if (!cLat || !cLng) {
    const inferredCust = getCoordinatesForLocation(safeLoc.city || safeLoc.location || safeLoc.address);
    if (inferredCust) {
      cLat = inferredCust.lat;
      cLng = inferredCust.lng;
    }
  }

  if (vLat && vLng && cLat && cLng) {
    const distanceKm = calculateDistanceKm(vLat, vLng, cLat, cLng);
    const withinRadius = distanceKm <= radius;
    return {
      delivers: withinRadius,
      scope,
      radiusKm: radius,
      distanceKm,
      message: withinRadius
        ? `Delivers to your area (${distanceKm} km away)`
        : `Outside delivery radius (${distanceKm} km > ${radius} km)`
    };
  }

  const vLoc = (vendor?.location || vendor?.businessAddress || '').toLowerCase();
  const cLoc = (safeLoc.city || safeLoc.location || safeLoc.address || '').toLowerCase();

  if (vLoc && cLoc) {
    const isSameCity =
      vLoc.includes(cLoc) ||
      cLoc.includes(vLoc) ||
      Object.keys(MAJOR_CITIES_COORDINATES).some((city) => vLoc.includes(city) && cLoc.includes(city));

    if (isSameCity) {
      return {
        delivers: true,
        scope,
        radiusKm: radius,
        distanceKm: 5,
        message: 'Same-City Local Delivery'
      };
    }
  }

  return {
    delivers: scope !== 'local',
    scope,
    radiusKm: radius,
    distanceKm: null,
    message: scope === 'local' ? `Local delivery only (within ${radius} km)` : 'Regional courier delivery'
  };
};
