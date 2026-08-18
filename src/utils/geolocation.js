/**
 * CivicPulse SDG 11 - Frontend Geolocation & Reverse Geocoding Utility
 * Powered by Browser Geolocation API & OpenStreetMap Nominatim (Free Reverse Geocoding)
 */

// List of major cities in Indonesia for manual dropdown selection & fallbacks
export const POPULAR_CITIES = [
  { name: 'Jakarta', fullName: 'DKI Jakarta' },
  { name: 'Malang', fullName: 'Kota Malang, Jawa Timur' },
  { name: 'Surabaya', fullName: 'Kota Surabaya, Jawa Timur' },
  { name: 'Bandung', fullName: 'Kota Bandung, Jawa Barat' },
  { name: 'Medan', fullName: 'Kota Medan, Sumatera Utara' },
  { name: 'Semarang', fullName: 'Kota Semarang, Jawa Tengah' },
  { name: 'Makassar', fullName: 'Kota Makassar, Sulawesi Selatan' },
  { name: 'Palembang', fullName: 'Kota Palembang, Sumatera Selatan' },
  { name: 'Yogyakarta', fullName: 'DI Yogyakarta' },
  { name: 'Denpasar', fullName: 'Kota Denpasar, Bali' },
  { name: 'Balikpapan', fullName: 'Kota Balikpapan, Kalimantan Timur' },
  { name: 'Bogor', fullName: 'Kota Bogor, Jawa Barat' }
];

export const DEFAULT_CITY = 'Jakarta';
export const DEFAULT_FULL_NAME = 'DKI Jakarta';

/**
 * Get user coordinates from browser Geolocation API
 */

export function getUserCoordinates(options = { timeout: 10000, maximumAge: 300000, enableHighAccuracy: true }) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Browser Anda tidak mendukung Geolocation API.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let msg = 'Gagal mengambil posisi lokasi.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'Izin akses lokasi ditolak oleh pengguna.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'Sinyal lokasi tidak tersedia.';
            break;
          case error.TIMEOUT:
            msg = 'Waktu permintaan lokasi habis (timeout).';
            break;
          default:
            msg = error.message || msg;
        }
        reject(new Error(msg));
      },
      options
    );
  });
}

/**
 * Reverse geocode latitude & longitude to City / Regency name using OpenStreetMap Nominatim
 */
export async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=id`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CivicPulse-SDG11-GeoNews/1.0'
      }
    });

    if (!res.ok) {
      throw new Error(`OpenStreetMap Nominatim HTTP ${res.status}`);
    }

    const data = await res.json();
    const address = data?.address || {};

    // Extract city/regency name from Nominatim response attributes
    let rawCity =
      address.city ||
      address.town ||
      address.municipality ||
      address.county ||
      address.state_district ||
      address.regency ||
      address.city_district ||
      address.suburb ||
      address.state ||
      DEFAULT_CITY;

    // Clean up Indonesian prefixes like "Kota ", "Kabupaten ", "Kab. "
    let cleanCity = rawCity
      .replace(/^(Kota|Kabupaten|Kab\.)\s+/i, '')
      .trim();

    let state = address.state || '';
    let fullName = rawCity;
    if (state && !rawCity.toLowerCase().includes(state.toLowerCase())) {
      fullName = `${rawCity}, ${state}`;
    }

    return {
      city: cleanCity || DEFAULT_CITY,
      rawCity: rawCity,
      fullName: fullName || `${cleanCity}, Indonesia`,
      lat,
      lon
    };
  } catch (err) {
    console.warn('Reverse geocoding with OpenStreetMap failed:', err.message);
    throw err;
  }
}

/**
 * High-level function to automatically detect user location with fallback
 */
export async function detectUserLocation() {
  try {
    const coords = await getUserCoordinates();
    const geoData = await reverseGeocode(coords.lat, coords.lon);

    return {
      success: true,
      city: geoData.city,
      fullName: geoData.fullName,
      coordinates: { lat: coords.lat, lon: coords.lon },
      isFallback: false
    };
  } catch (err) {
    console.warn('Auto location detection failed, using fallback:', err.message);
    return {
      success: false,
      city: DEFAULT_CITY,
      fullName: `${DEFAULT_FULL_NAME} (Default)`,
      coordinates: { lat: -6.2088, lon: 106.8456 },
      isFallback: true,
      error: err.message
    };
  }
}

/**
 * Format fallback object when user selects city manually from dropdown
 */
export function getCityFallback(cityName) {
  const matched = POPULAR_CITIES.find(
    (c) => c.name.toLowerCase() === cityName.toLowerCase()
  );
  return {
    success: true,
    city: matched ? matched.name : cityName,
    fullName: matched ? matched.fullName : `Kota ${cityName}`,
    coordinates: null,
    isFallback: true,
    isManualSelect: true
  };
}
