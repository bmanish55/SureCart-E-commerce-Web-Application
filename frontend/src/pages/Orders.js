import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Orders.css';

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/orders');
        setOrders(res.data || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
        setError(err.response?.data?.message || err.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (loading) return <div className="container">Loading orders...</div>;

  return (
    <div className="container">
      <div className="orders-page">
        <h1>Your Orders</h1>

        {error && <p className="error">{error}</p>}

        {orders && orders.length === 0 ? (
          <div className="empty-state">
            <p>No orders to show yet.</p>
            <p>
              <Link to="/products" className="btn btn-primary">Start Shopping</Link>
            </p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>Order #{order.id}</div>
                  <div>{new Date(order.created_at).toLocaleString()}</div>
                </div>
                <div className="order-body">
                  <div>Items: {order.items?.length || 0}</div>
                  <div>Total: {typeof order.total === 'number' ? `₹${order.total.toFixed(2)}` : order.total}</div>
                </div>
                <div className="order-actions">
                  <Link to={`/orders/${order.id}`} className="btn btn-outline">View</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
