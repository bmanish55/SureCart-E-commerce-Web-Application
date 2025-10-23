import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CategoryFilter.css';

const CategoryFilter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const categories = [
    'All',
    'Electronics',
    'Clothing', 
    'Home',
    'Sports',
    'Accessories'
  ];

  const getCurrentCategory = () => {
    const params = new URLSearchParams(location.search);
    return params.get('category') || 'All';
  };

  const handleCategoryChange = (category) => {
    if (category === 'All') {
      navigate('/products');
    } else {
      navigate(`/products?category=${encodeURIComponent(category)}`);
    }
  };

  const currentCategory = getCurrentCategory();

  return (
    <div className="category-filter">
      <h3 className="filter-title">Categories</h3>
      <div className="category-list">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${currentCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
            {currentCategory === category && (
              <i className="fas fa-check"></i>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;