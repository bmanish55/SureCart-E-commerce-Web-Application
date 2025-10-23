import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import ProductGrid from '../components/products/ProductGrid';
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
    // Handle URL parameters for search and category
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const categoryParam = params.get('category');

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

    setFilteredProducts(filtered);
  }, [location.search, products]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="container">
      <div className="products-page">
        <div className="page-header">
          <h1>Our Products</h1>
          <p>Discover our wide range of quality products</p>
        </div>

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
            </div>

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