import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <div className="container">Loading order...</div>;

  if (error) return (
    <div className="container">
      <div className="order-details-page">
        <p className="error">{error}</p>
        <p><Link to="/orders" className="btn btn-outline">Back to Orders</Link></p>
      </div>
    </div>
  );

  if (!order) return (
    <div className="container">
      <div className="order-details-page">
        <p>No order found.</p>
        <p><Link to="/orders" className="btn btn-outline">Back to Orders</Link></p>
      </div>
    </div>
  );

  // Try to get items array safely
  let items = order.items;
  try {
    if (!Array.isArray(items) && typeof items === 'string') {
      items = JSON.parse(items);
    }
  } catch (e) {
    // leave as-is
  }

  return (
    <div className="container">
      <div className="order-details-page">
        <h1>Order #{order.id}</h1>
        <div className="order-meta">
          <div>Placed: {order.created_at ? new Date(order.created_at).toLocaleString() : '—'}</div>
          <div>Status: {order.status || 'Pending'}</div>
          <div>Payment: {order.payment_method || order.paymentMethod || '—'}</div>
        </div>

        <div className="order-items">
          <h2>Items</h2>
          {(!items || items.length === 0) ? (
            <p>No items in this order.</p>
          ) : (
            <ul>
              {items.map((it, idx) => (
                <li key={it.id || idx} className="order-item">
                  <div className="item-left">
                    <div className="item-name">{it.name || it.title || 'Product'}</div>
                    <div className="item-qty">Qty: {it.quantity || it.qty || 1}</div>
                  </div>
                  <div className="item-right">{typeof it.price === 'number' ? `₹${it.price.toFixed(2)}` : it.price}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="order-summary">
          <div>Total: <strong>{typeof order.total === 'number' ? `₹${order.total.toFixed(2)}` : order.total}</strong></div>
          <div className="summary-actions">
            <Link to="/orders" className="btn btn-outline">Back to Orders</Link>
            <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
