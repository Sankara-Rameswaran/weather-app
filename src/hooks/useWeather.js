// hooks/useWeather.js
// Custom hook encapsulating all weather data logic

import { useState, useCallback } from 'react';
import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
  fetchForecastByCity,
  fetchForecastByCoords,
  processDailyForecast,
} from '../services/weatherApi';

const HISTORY_KEY = 'weather_search_history';
const MAX_HISTORY = 8;

export const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric'); // 'metric' | 'imperial'

  // Load search history from localStorage
  const getHistory = () => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch {
      return [];
    }
  };

  const [searchHistory, setSearchHistory] = useState(getHistory);

  // Save a city to search history
  const saveToHistory = useCallback((cityName) => {
    const history = getHistory();
    const filtered = history.filter((c) => c.toLowerCase() !== cityName.toLowerCase());
    const updated = [cityName, ...filtered].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    setSearchHistory(updated);
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    localStorage.removeItem(HISTORY_KEY);
    setSearchHistory([]);
  }, []);

  // Search by city name
  const searchByCity = useCallback(async (city) => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchWeatherByCity(city, unit),
        fetchForecastByCity(city, unit),
      ]);
      setWeather(weatherData);
      setForecast(processDailyForecast(forecastData));
      saveToHistory(weatherData.name);
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }, [unit, saveToHistory]);

  // Search by geolocation coordinates
  const searchByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchWeatherByCoords(lat, lon, unit),
        fetchForecastByCoords(lat, lon, unit),
      ]);
      setWeather(weatherData);
      setForecast(processDailyForecast(forecastData));
      saveToHistory(weatherData.name);
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }, [unit, saveToHistory]);

  // Toggle between Celsius and Fahrenheit — re-fetch with new unit
  const toggleUnit = useCallback(() => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);

    // Re-fetch current data with new unit if we have weather loaded
    if (weather) {
      setLoading(true);
      setError(null);
      Promise.all([
        fetchWeatherByCity(weather.name, newUnit),
        fetchForecastByCity(weather.name, newUnit),
      ])
        .then(([weatherData, forecastData]) => {
          setWeather(weatherData);
          setForecast(processDailyForecast(forecastData));
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [unit, weather]);

  return {
    weather,
    forecast,
    loading,
    error,
    unit,
    searchHistory,
    searchByCity,
    searchByCoords,
    toggleUnit,
    clearHistory,
  };
};
