import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const { orderId, orderTotal } = location.state || {};

  return (
    <div className="container">
      <div className="order-success-page">
        <div className="success-card">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h1>Thank you for your order!</h1>
          {orderId ? (
            <p className="success-message">Your order <strong>#{orderId}</strong> has been placed successfully.</p>
          ) : (
            <p className="success-message">Your order has been placed successfully.</p>
          )}

          {orderTotal !== undefined && (
            <p className="order-total">Order Total: <strong>{typeof orderTotal === 'number' ? `₹${orderTotal.toFixed(2)}` : orderTotal}</strong></p>
          )}

          <div className="success-actions">
            <Link to="/orders" className="btn btn-outline">View Orders</Link>
            <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
          </div>

          <div className="support-note">
            <p>If you have any questions about your order, contact us at <a href="mailto:support@estore.example">tanvid.mca_iom@bkc.met.edu</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
