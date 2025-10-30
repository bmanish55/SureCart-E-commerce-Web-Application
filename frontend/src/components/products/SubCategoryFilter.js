import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SubCategoryFilter.css';

const SubCategoryFilter = () => {
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState(null);

  const mainCategories = [
    {
      name: 'Electronics',
      icon: '📱',
      subcategories: ['Mobile And Tablets', 'Computer and Laptops', 'Audio and Wearables']
    },
    {
      name: 'Sports',
      icon: '⚽',
      subcategories: ['Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton']
    },
    {
      name: 'Clothing',
      icon: '👕',
      subcategories: ['Mens', 'Womens', 'Kids']
    }
  ];

  const handleCategoryClick = (category) => {
    // Toggle expanded state
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

  const handleSubcategoryClick = (category, subcategory) => {
    navigate(`/products?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`);
  };

  return (
    <div className="subcategory-filter">
      <div className="subcategory-container">
        {mainCategories.map(category => {
          const sanitized = category.name.replace(/\s+/g, '-').toLowerCase();
          const listId = `subs-${sanitized}`;
          const btnId = `cat-${sanitized}`;
          return (
            <div key={category.name} className="category-oval-wrapper">
              <button
                id={btnId}
                className={`category-oval ${expandedCategory === category.name ? 'expanded' : ''}`}
                onClick={() => handleCategoryClick(category.name)}
                title={`${expandedCategory === category.name ? 'Click to collapse' : 'Click to expand'}`}
                aria-expanded={expandedCategory === category.name}
                aria-controls={listId}
              >
                <span className="oval-icon">{category.icon}</span>
                <span className="oval-name">{category.name}</span>
              </button>
              {expandedCategory === category.name && (
                <div id={listId} className="subcategories-list expanded-show" role="region" aria-labelledby={btnId}>
                  {category.subcategories.map(sub => (
                    <button
                      key={sub}
                      className="subcategory-item"
                      onClick={() => handleSubcategoryClick(category.name, sub)}
                      title={sub}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubCategoryFilter;
