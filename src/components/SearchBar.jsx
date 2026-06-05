// components/SearchBar.jsx
// Search input with autocomplete suggestions, geolocation, and history dropdown

import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchCitySuggestions } from '../services/weatherApi';

const SearchBar = ({
  onSearch,
  onGeolocate,
  searchHistory,
  onClearHistory,
  theme,
  isLoading,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounced suggestion fetching
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    clearTimeout(debounceRef.current);
    setIsFetchingSuggestions(true);
    debounceRef.current = setTimeout(async () => {
      const results = await fetchCitySuggestions(query);
      setSuggestions(results);
      setIsFetchingSuggestions(false);
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowDropdown(false);
      setSuggestions([]);
    }
  };

  const handleSelect = (cityName) => {
    setQuery(cityName);
    onSearch(cityName);
    setShowDropdown(false);
    setSuggestions([]);
    setActiveSuggestion(-1);
  };

  const handleKeyDown = (e) => {
    const items = suggestions.length > 0 ? suggestions : [];
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion((prev) => Math.min(prev + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && activeSuggestion >= 0) {
      e.preventDefault();
      const s = items[activeSuggestion];
      handleSelect(`${s.name}${s.state ? ', ' + s.state : ''}, ${s.country}`);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const showSuggestions = suggestions.length > 0;
  const showHistory = !showSuggestions && query.length === 0 && searchHistory.length > 0;
  const dropdownVisible = showDropdown && (showSuggestions || showHistory);

  return (
    <div className="search-container" ref={dropdownRef}>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          {/* Search icon */}
          <span className="search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>

          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search city..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
              setActiveSuggestion(-1);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            autoComplete="off"
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => { setQuery(''); setSuggestions([]); inputRef.current?.focus(); }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Search button */}
        <button type="submit" className="search-btn" disabled={isLoading || !query.trim()}>
          Search
        </button>

        {/* Geolocation button */}
        <button
          type="button"
          className="geo-btn"
          onClick={onGeolocate}
          disabled={isLoading}
          title="Use my location"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
        </button>
      </form>

      {/* Dropdown: suggestions or history */}
      {dropdownVisible && (
        <div className="search-dropdown">
          {showSuggestions && (
            <>
              <div className="dropdown-label">Suggestions</div>
              {suggestions.map((s, i) => (
                <button
                  key={`${s.lat}-${s.lon}`}
                  className={`dropdown-item ${i === activeSuggestion ? 'active' : ''}`}
                  onClick={() => handleSelect(`${s.name}${s.state ? ', ' + s.state : ''}, ${s.country}`)}
                >
                  <span className="dropdown-icon">📍</span>
                  <span>
                    <span className="dropdown-city">{s.name}</span>
                    {s.state && <span className="dropdown-region">, {s.state}</span>}
                    <span className="dropdown-country"> — {s.country}</span>
                  </span>
                </button>
              ))}
            </>
          )}

          {showHistory && (
            <>
              <div className="dropdown-label">
                Recent Searches
                <button className="clear-history-btn" onClick={onClearHistory}>Clear</button>
              </div>
              {searchHistory.map((city) => (
                <button
                  key={city}
                  className="dropdown-item"
                  onClick={() => handleSelect(city)}
                >
                  <span className="dropdown-icon">🕐</span>
                  <span className="dropdown-city">{city}</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
