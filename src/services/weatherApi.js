// services/weatherApi.js
// Centralized API service for OpenWeatherMap calls

import axios from 'axios';

const API_KEY = "53eeac8a383461c30e92f19759621d34";
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  params: { appid: API_KEY },
});

/**
 * Fetch current weather data by city name
 * @param {string} city - City name to search
 * @param {string} units - 'metric' (°C) or 'imperial' (°F)
 */
export const fetchWeatherByCity = async (city, units = 'metric') => {
  try {
    const response = await apiClient.get('/weather', {
      params: { q: city, units },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Fetch current weather by geographic coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} units - 'metric' or 'imperial'
 */
export const fetchWeatherByCoords = async (lat, lon, units = 'metric') => {
  try {
    const response = await apiClient.get('/weather', {
      params: { lat, lon, units },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Fetch 5-day / 3-hour forecast by city name
 * @param {string} city - City name
 * @param {string} units - 'metric' or 'imperial'
 */
export const fetchForecastByCity = async (city, units = 'metric') => {
  try {
    const response = await apiClient.get('/forecast', {
      params: { q: city, units, cnt: 40 },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Fetch 5-day forecast by coordinates
 */
export const fetchForecastByCoords = async (lat, lon, units = 'metric') => {
  try {
    const response = await apiClient.get('/forecast', {
      params: { lat, lon, units, cnt: 40 },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Geocoding API: get city suggestions as user types
 * @param {string} query - Partial city name
 */
export const fetchCitySuggestions = async (query) => {
  try {
    const response = await axios.get(`${GEO_URL}/direct`, {
      params: { q: query, limit: 5, appid: API_KEY },
    });
    return response.data;
  } catch (error) {
    return [];
  }
};

/**
 * Normalize API errors into user-friendly messages
 */
const handleApiError = (error) => {
  if (!navigator.onLine) {
    return new Error('NO_INTERNET');
  }
  if (error.response) {
    const status = error.response.status;
    if (status === 404) return new Error('CITY_NOT_FOUND');
    if (status === 401) return new Error('INVALID_API_KEY');
    if (status === 429) return new Error('RATE_LIMITED');
    return new Error('API_ERROR');
  }
  if (error.request) {
    return new Error('NO_INTERNET');
  }
  return new Error('API_ERROR');
};

/**
 * Get OpenWeatherMap icon URL
 */
export const getIconUrl = (iconCode, size = '2x') =>
  `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;

/**
 * Process raw 5-day forecast into daily summaries (one entry per day)
 */
export const processDailyForecast = (forecastData) => {
  const dailyMap = {};

  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    if (!dailyMap[dayKey]) {
      dailyMap[dayKey] = {
        date: dayKey,
        dt: item.dt,
        temps: [],
        icons: {},
        descriptions: {},
        humidity: [],
        wind: [],
      };
    }

    dailyMap[dayKey].temps.push(item.main.temp);
    dailyMap[dayKey].humidity.push(item.main.humidity);
    dailyMap[dayKey].wind.push(item.wind.speed);

    const icon = item.weather[0].icon;
    const desc = item.weather[0].description;
    dailyMap[dayKey].icons[icon] = (dailyMap[dayKey].icons[icon] || 0) + 1;
    dailyMap[dayKey].descriptions[desc] = (dailyMap[dayKey].descriptions[desc] || 0) + 1;
  });

  // Convert to array, skip today, take next 5 days
  return Object.values(dailyMap)
    .slice(1, 6)
    .map((day) => ({
      date: day.date,
      dt: day.dt,
      tempMin: Math.round(Math.min(...day.temps)),
      tempMax: Math.round(Math.max(...day.temps)),
      humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
      wind: Math.round((day.wind.reduce((a, b) => a + b, 0) / day.wind.length) * 10) / 10,
      icon: Object.keys(day.icons).reduce((a, b) => day.icons[a] > day.icons[b] ? a : b),
      description: Object.keys(day.descriptions).reduce((a, b) => day.descriptions[a] > day.descriptions[b] ? a : b),
    }));
};
