// components/Loader.jsx
export const Loader = () => (
  <div className="loader-container animate-fade">
    <div className="loader-ring">
      <div></div><div></div><div></div><div></div>
    </div>
    <p className="loader-text">Fetching weather data...</p>
  </div>
);

// components/ErrorMessage.jsx — exported separately but kept in same file for brevity
import { getErrorMessage } from '../utils/weatherUtils';

export const ErrorMessage = ({ errorCode, onRetry }) => {
  const { title, message, icon } = getErrorMessage(errorCode);

  return (
    <div className="error-container glass-card animate-in">
      <div className="error-icon">{icon}</div>
      <h3 className="error-title">{title}</h3>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};
