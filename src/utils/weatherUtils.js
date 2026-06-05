// utils/weatherUtils.js

/**
 * Determine the dynamic background theme based on weather condition and time
 */
export const getWeatherTheme = (weather) => {
  if (!weather) return 'default';

  const conditionId = weather.weather[0].id;
  const icon = weather.weather[0].icon;
  const isNight = icon.endsWith('n');

  if (isNight) return 'night';

  // Thunderstorm
  if (conditionId >= 200 && conditionId < 300) return 'storm';
  // Drizzle / Rain
  if (conditionId >= 300 && conditionId < 600) return 'rainy';
  // Snow
  if (conditionId >= 600 && conditionId < 700) return 'snow';
  // Atmosphere (fog, haze, etc.)
  if (conditionId >= 700 && conditionId < 800) return 'foggy';
  // Clear sky
  if (conditionId === 800) return 'sunny';
  // Clouds
  if (conditionId > 800) return 'cloudy';

  return 'default';
};

/**
 * Theme definitions: gradients, accent colors, glass tint
 */
export const themes = {
  sunny: {
    gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 40%, #f7971e 100%)',
    accent: '#f7971e',
    cardBg: 'rgba(255, 255, 255, 0.18)',
    textColor: '#1a1200',
    subTextColor: 'rgba(30,20,0,0.65)',
    label: 'Sunny',
  },
  cloudy: {
    gradient: 'linear-gradient(135deg, #536976 0%, #292e49 100%)',
    accent: '#8fafc9',
    cardBg: 'rgba(255, 255, 255, 0.10)',
    textColor: '#e8edf2',
    subTextColor: 'rgba(232,237,242,0.6)',
    label: 'Cloudy',
  },
  rainy: {
    gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    accent: '#4fc3f7',
    cardBg: 'rgba(255,255,255,0.08)',
    textColor: '#e0f4ff',
    subTextColor: 'rgba(224,244,255,0.55)',
    label: 'Rainy',
  },
  storm: {
    gradient: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 50%, #16213e 100%)',
    accent: '#9c27b0',
    cardBg: 'rgba(156,39,176,0.12)',
    textColor: '#f3e5f5',
    subTextColor: 'rgba(243,229,245,0.55)',
    label: 'Stormy',
  },
  snow: {
    gradient: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
    accent: '#5c9bd6',
    cardBg: 'rgba(255,255,255,0.35)',
    textColor: '#1a3a5c',
    subTextColor: 'rgba(26,58,92,0.6)',
    label: 'Snowy',
  },
  foggy: {
    gradient: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
    accent: '#95a5a6',
    cardBg: 'rgba(255,255,255,0.12)',
    textColor: '#ecf0f1',
    subTextColor: 'rgba(236,240,241,0.6)',
    label: 'Foggy',
  },
  night: {
    gradient: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #0d1b2a 100%)',
    accent: '#7c83fd',
    cardBg: 'rgba(124,131,253,0.10)',
    textColor: '#e8e8ff',
    subTextColor: 'rgba(232,232,255,0.55)',
    label: 'Night',
  },
  default: {
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    accent: '#7c83fd',
    cardBg: 'rgba(255,255,255,0.10)',
    textColor: '#e8e8ff',
    subTextColor: 'rgba(232,232,255,0.55)',
    label: '',
  },
};

/**
 * Format Unix timestamp to readable date/time
 */
export const formatDateTime = (dt, timezone = 0) => {
  const localTime = new Date((dt + timezone) * 1000);
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  };
  return localTime.toLocaleDateString('en-US', options);
};

/**
 * Format wind speed with correct unit label
 */
export const formatWind = (speed, unit) =>
  unit === 'metric' ? `${speed} m/s` : `${speed} mph`;

/**
 * Format temperature with degree symbol
 */
export const formatTemp = (temp, unit) =>
  `${Math.round(temp)}°${unit === 'metric' ? 'C' : 'F'}`;

/**
 * Get user-friendly error messages
 */
export const getErrorMessage = (errorCode) => {
  const messages = {
    CITY_NOT_FOUND: {
      title: 'City Not Found',
      message: 'We couldn\'t find that city. Check the spelling and try again.',
      icon: '🔍',
    },
    INVALID_API_KEY: {
      title: 'API Key Error',
      message: 'Invalid API key. Please check your .env configuration.',
      icon: '🔑',
    },
    NO_INTERNET: {
      title: 'No Connection',
      message: 'You appear to be offline. Check your internet connection.',
      icon: '📡',
    },
    RATE_LIMITED: {
      title: 'Too Many Requests',
      message: 'API rate limit reached. Please wait a moment and try again.',
      icon: '⏱️',
    },
    GEOLOCATION_DENIED: {
      title: 'Location Access Denied',
      message: 'Please allow location access or search for a city manually.',
      icon: '📍',
    },
    GEOLOCATION_UNAVAILABLE: {
      title: 'Location Unavailable',
      message: 'Your browser doesn\'t support geolocation. Search manually.',
      icon: '📍',
    },
    API_ERROR: {
      title: 'Something Went Wrong',
      message: 'An unexpected error occurred. Please try again.',
      icon: '⚠️',
    },
  };
  return messages[errorCode] || messages.API_ERROR;
};

/**
 * Capitalize first letter of each word
 */
export const capitalize = (str) =>
  str.replace(/\b\w/g, (l) => l.toUpperCase());
