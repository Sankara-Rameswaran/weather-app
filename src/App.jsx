
import { useState, useCallback, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import { Loader, ErrorMessage } from './components/Loader';
import { useWeather } from './hooks/useWeather';
import { getWeatherTheme, themes } from './utils/weatherUtils';
import './App.css';

const App = () => {
  const {
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
  } = useWeather();

  const [darkMode, setDarkMode] = useState(false);
  const [geoError, setGeoError] = useState(null);

 
  const themeKey = weather ? getWeatherTheme(weather) : 'default';
  const theme = themes[themeKey];

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-gradient', theme.gradient);
    root.style.setProperty('--theme-accent', theme.accent);
    root.style.setProperty('--theme-card-bg', theme.cardBg);
    root.style.setProperty('--theme-text', theme.textColor);
    root.style.setProperty('--theme-subtext', theme.subTextColor);
  }, [theme]);

  
  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  
  const handleGeolocate = useCallback(() => {
    setGeoError(null);

    if (!navigator.geolocation) {
      setGeoError('GEOLOCATION_UNAVAILABLE');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        searchByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setGeoError('GEOLOCATION_DENIED');
      },
      { timeout: 10000 }
    );
  }, [searchByCoords]);

  const activeError = error || geoError;

  return (
    <div className="app" style={{ '--theme-gradient': theme.gradient }}>
      {/* Animated background */}
      <div className="bg-gradient" />
      <div className="bg-overlay" />

      {/* Floating particles */}
      <div className="particles" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`} />
        ))}
      </div>

      <div className="app-container">
        {/* Top bar */}
        <header className="app-header">
          <div className="app-logo">
            <span className="logo-icon">⛅</span>
            <span className="logo-text">SkyCast</span>
          </div>

          <div className="header-controls">
            {/* Unit toggle */}
            <button
              className="unit-toggle"
              onClick={toggleUnit}
              title="Toggle temperature unit"
            >
              <span className={unit === 'metric' ? 'unit-active' : ''}>°C</span>
              <span className="unit-sep">|</span>
              <span className={unit === 'imperial' ? 'unit-active' : ''}>°F</span>
            </button>

            {/* Dark/light mode toggle */}
            <button
              className="theme-toggle"
              onClick={() => setDarkMode((d) => !d)}
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* Search bar */}
        <SearchBar
          onSearch={searchByCity}
          onGeolocate={handleGeolocate}
          searchHistory={searchHistory}
          onClearHistory={clearHistory}
          theme={theme}
          isLoading={loading}
        />

        {/* Main content area */}
        <main className="main-content">
          {loading && <Loader />}

          {!loading && activeError && (
            <ErrorMessage
              errorCode={activeError}
              onRetry={() => {
                setGeoError(null);
                if (weather) searchByCity(weather.name);
              }}
            />
          )}

          {!loading && !activeError && weather && (
            <>
              <WeatherCard weather={weather} unit={unit} theme={theme} />
              <Forecast forecast={forecast} unit={unit} />
            </>
          )}

          {!loading && !activeError && !weather && (
            <div className="welcome-screen animate-in">
              <div className="welcome-emoji">🌤️</div>
              <h2 className="welcome-title">Welcome to SkyCast</h2>
              <p className="welcome-sub">
                Search for a city above or use your current location to get started.
              </p>
              <div className="welcome-tips">
                <span>🔍 Search any city worldwide</span>
                <span>📍 Use your GPS location</span>
                <span>🌡️ Toggle °C / °F</span>
                <span>📅 5-day forecast</span>
              </div>
            </div>
          )}
        </main>

        <footer className="app-footer">
          <p>Built with React</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
