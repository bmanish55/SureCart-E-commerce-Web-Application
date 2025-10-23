import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ProductSearch.css';

const ProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Sample product suggestions (in a real app, this would come from an API)
  const productSuggestions = [
    'Wireless Headphones',
    'Smart Watch',
    'Running Shoes',
    'Coffee Maker',
    'Backpack',
    'Yoga Mat',
    'T-Shirt',
    'Wireless Mouse'
  ];

  useEffect(() => {
    // Get search term from URL when component mounts or location changes
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.search]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter suggestions based on input
    if (value.length > 0) {
      const filteredSuggestions = productSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    performSearch(suggestion);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    performSearch(searchTerm);
  };

  const performSearch = (term) => {
    if (term.trim()) {
      navigate(`/products?search=${encodeURIComponent(term.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    navigate('/products');
  };

  const handleInputFocus = () => {
    if (searchTerm.length > 0 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className="product-search">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className="search-input"
            aria-label="Search products"
          />
          
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
          
          <button
            type="submit"
            className="search-submit-btn"
            aria-label="Search"
          >
            <i className="fas fa-search"></i>
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseDown={(e) => e.preventDefault()} // Prevent input blur
              >
                <i className="fas fa-search suggestion-icon"></i>
                <span className="suggestion-text">{suggestion}</span>
              </div>
            ))}
          </div>
        )}

        {showSuggestions && searchTerm.length > 0 && suggestions.length === 0 && (
          <div className="search-suggestions">
            <div className="suggestion-item no-results">
              <i className="fas fa-search suggestion-icon"></i>
              <span className="suggestion-text">No products found</span>
            </div>
          </div>
        )}
      </form>

      {/* Popular Search Tags */}
      <div className="popular-searches">
        <span className="popular-label">Popular: </span>
        <div className="search-tags">
          {['Electronics', 'Clothing', 'Sports', 'Home'].map((tag, index) => (
            <button
              key={index}
              className="search-tag"
              onClick={() => {
                setSearchTerm(tag);
                performSearch(tag);
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSearch;