import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductDetails from '../components/products/ProductDetails';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Product not found');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <LoadingSpinner text="Loading product..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container">
        <div className="error-page">
          <i className="fas fa-exclamation-triangle"></i>
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/products')}
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="product-detail-page">
        <nav className="breadcrumb">
          <button 
            className="breadcrumb-back"
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-arrow-left"></i>
            Back
          </button>
          <span className="breadcrumb-separator">/</span>
          <button 
            className="breadcrumb-link"
            onClick={() => navigate('/products')}
          >
            Products
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <ProductDetails product={product} />
      </div>
    </div>
  );
};

export default ProductDetail;