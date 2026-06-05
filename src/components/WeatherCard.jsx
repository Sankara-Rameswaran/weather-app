// components/WeatherCard.jsx
// Main card displaying current weather conditions

import { getIconUrl, } from '../services/weatherApi';
import { formatDateTime, formatWind, formatTemp, capitalize } from '../utils/weatherUtils';

const WeatherCard = ({ weather, unit, theme }) => {
  const {
    name,
    sys,
    main,
    weather: conditions,
    wind,
    visibility,
    dt,
    timezone,
  } = weather;

  const condition = conditions[0];
  const iconUrl = getIconUrl(condition.icon, '4x');
  const dateString = formatDateTime(dt, timezone);

  return (
    <div className="weather-card glass-card animate-in">
      {/* Header: location + date */}
      <div className="weather-header">
        <div className="location-info">
          <h1 className="city-name">
            <span className="location-pin">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7z" />
                <circle cx="12" cy="9" r="2.5" fill="white" />
              </svg>
            </span>
            {name}, {sys.country}
          </h1>
          <p className="date-time">{dateString}</p>
        </div>
      </div>

      {/* Main temperature display */}
      <div className="temp-section">
        <div className="weather-icon-wrap">
          <img
            src={iconUrl}
            alt={condition.description}
            className="weather-icon-main"
          />
        </div>
        <div className="temp-display">
          <span className="temperature">{formatTemp(main.temp, unit)}</span>
          <span className="condition-desc">{capitalize(condition.description)}</span>
          <span className="feels-like">Feels like {formatTemp(main.feels_like, unit)}</span>
        </div>
      </div>

      {/* Min / Max */}
      <div className="min-max-row">
        <span className="min-max-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
          Low {formatTemp(main.temp_min, unit)}
        </span>
        <span className="min-max-divider">·</span>
        <span className="min-max-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          High {formatTemp(main.temp_max, unit)}
        </span>
      </div>

      {/* Stats grid */}
      <div className="stats-grid">
        <StatItem
          icon={<HumidityIcon />}
          label="Humidity"
          value={`${main.humidity}%`}
        />
        <StatItem
          icon={<WindIcon />}
          label="Wind"
          value={formatWind(wind.speed, unit)}
        />
        <StatItem
          icon={<PressureIcon />}
          label="Pressure"
          value={`${main.pressure} hPa`}
        />
        <StatItem
          icon={<VisibilityIcon />}
          label="Visibility"
          value={visibility ? `${(visibility / 1000).toFixed(1)} km` : 'N/A'}
        />
      </div>
    </div>
  );
};

const StatItem = ({ icon, label, value }) => (
  <div className="stat-item glass-stat">
    <div className="stat-icon">{icon}</div>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
  </div>
);

const HumidityIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);

const WindIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
  </svg>
);

const PressureIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4l3 3" />
  </svg>
);

const VisibilityIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default WeatherCard;
