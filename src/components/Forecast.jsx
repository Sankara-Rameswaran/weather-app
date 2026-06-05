// components/Forecast.jsx
// 5-day weather forecast display

import { getIconUrl } from '../services/weatherApi';
import { formatTemp, capitalize } from '../utils/weatherUtils';

const Forecast = ({ forecast, unit }) => {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="forecast-section animate-in-delayed">
      <h2 className="forecast-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        5-Day Forecast
      </h2>

      <div className="forecast-grid">
        {forecast.map((day, index) => (
          <ForecastCard key={day.dt} day={day} unit={unit} index={index} />
        ))}
      </div>
    </div>
  );
};

const ForecastCard = ({ day, unit, index }) => {
  const iconUrl = getIconUrl(day.icon, '2x');

  return (
    <div
      className="forecast-card glass-card"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="forecast-day">{day.date.split(',')[0]}</div>
      <div className="forecast-date">{day.date.split(', ')[1]}</div>

      <img
        src={iconUrl}
        alt={day.description}
        className="forecast-icon"
      />

      <div className="forecast-desc">{capitalize(day.description)}</div>

      <div className="forecast-temps">
        <span className="forecast-high">{formatTemp(day.tempMax, unit)}</span>
        <span className="forecast-temp-divider">/</span>
        <span className="forecast-low">{formatTemp(day.tempMin, unit)}</span>
      </div>

      <div className="forecast-meta">
        <span title="Humidity">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
          {day.humidity}%
        </span>
        <span title="Wind">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9.59 4.59A2 2 0 1 1 11 8H2" />
          </svg>
          {day.wind} {unit === 'metric' ? 'm/s' : 'mph'}
        </span>
      </div>
    </div>
  );
};

export default Forecast;
