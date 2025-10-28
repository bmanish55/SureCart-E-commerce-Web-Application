import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (newPassword.length > 0 && newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    if (newPassword.length > 0 && newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Only support password update for now
    if (newPassword.length === 0) {
      setError('Nothing to update');
      return;
    }

    try {
      setSaving(true);
      // Call backend to update password
      await api.put('/auth/me', { password: newPassword });
      setMessage('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.message || err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <div className="profile-page">
        <h1>My Profile</h1>

        {!user ? (
          <p>Loading...</p>
        ) : (
          <div className="profile-card">
            <div className="profile-row">
              <label>Name</label>
              <div className="value">{user.name}</div>
            </div>
            <div className="profile-row">
              <label>Email</label>
              <div className="value">{user.email}</div>
            </div>

            <form className="profile-form" onSubmit={handleSubmit}>
              <h2>Change Password</h2>
              <div className="form-row">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div className="form-row">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>

              {error && <div className="error">{error}</div>}
              {message && <div className="message">{message}</div>}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
