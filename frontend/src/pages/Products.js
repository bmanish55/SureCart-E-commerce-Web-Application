import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import ProductGrid from '../components/products/ProductGrid';
import SubCategoryFilter from '../components/products/SubCategoryFilter';
import CategoryFilter from '../components/common/CategoryFilter';
import SearchBar from '../components/common/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Handle URL parameters for search, category, and subcategory
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const categoryParam = params.get('category');
    const subcategoryParam = params.get('subcategory');

    let filtered = products;

    if (searchParam) {
      setSearchTerm(searchParam);
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchParam.toLowerCase()) ||
        product.description.toLowerCase().includes(searchParam.toLowerCase())
      );
    }

    if (categoryParam && categoryParam !== 'All') {
      filtered = filtered.filter(product =>
        product.category === categoryParam
      );
    }

    if (subcategoryParam) {
      filtered = filtered.filter(product =>
        product.subcategory === subcategoryParam
      );
    }

    // Apply sorting
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'stock') {
      filtered.sort((a, b) => b.stock_quantity - a.stock_quantity);
    }

    setFilteredProducts(filtered);
  }, [location.search, products, sortBy]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const getActiveFilters = () => {
    const params = new URLSearchParams(location.search);
    const filters = [];
    
    if (params.get('search')) {
      filters.push({
        type: 'search',
        label: `Search: ${params.get('search')}`,
        param: 'search'
      });
    }
    if (params.get('category') && params.get('category') !== 'All') {
      filters.push({
        type: 'category',
        label: `Category: ${params.get('category')}`,
        param: 'category'
      });
    }
    if (params.get('subcategory')) {
      filters.push({
        type: 'subcategory',
        label: `Subcategory: ${params.get('subcategory')}`,
        param: 'subcategory'
      });
    }
    
    return filters;
  };

  const removeFilter = (paramName) => {
    const params = new URLSearchParams(location.search);
    params.delete(paramName);
    const newSearch = params.toString();
    window.location.search = newSearch;
  };

  const clearAllFilters = () => {
    window.location.search = '';
  };

  return (
    <div className="container">
      <div className="products-page">
        <div className="page-header">
          <h1>Our Products</h1>
          <p>Discover our wide range of quality products</p>
        </div>

        {/* Sub-Category Filter */}
        <SubCategoryFilter />

        <div className="products-layout">
          {/* Sidebar */}
          <aside className="products-sidebar">
            <div className="sidebar-sticky">
              <div className="search-section">
                <SearchBar />
              </div>
              <CategoryFilter />
            </div>
          </aside>

          {/* Main Content */}
          <main className="products-main">
            <div className="products-header">
              <div className="results-info">
                <h2>
                  {searchTerm ? `Search results for "${searchTerm}"` : 'All Products'}
                </h2>
                <span className="results-count">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                </span>
              </div>
              
              <div className="sort-options">
                <label htmlFor="sort-select">Sort by:</label>
                <select 
                  id="sort-select"
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="stock">Most Popular (Stock)</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {getActiveFilters().length > 0 && (
              <div className="active-filters">
                <div className="active-filters-container">
                  <span className="filters-label">Active Filters:</span>
                  <div className="filters-chips">
                    {getActiveFilters().map((filter, idx) => (
                      <div key={idx} className="filter-chip">
                        <span>{filter.label}</span>
                        <button 
                          className="chip-remove"
                          onClick={() => removeFilter(filter.param)}
                          aria-label={`Remove ${filter.label} filter`}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  <button 
                    className="clear-all-btn"
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            <ProductGrid 
              products={filteredProducts}
              loading={loading}
              error={error}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;