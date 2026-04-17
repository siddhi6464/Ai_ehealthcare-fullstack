import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import './HealthReminders.css';

const HealthReminders = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    menstrual: {
      enabled: false,
      cycleLength: 28,
      lastDate: ''
    },
    bloodPressure: {
      enabled: false,
      frequency: 7,
      lastChecked: ''
    },
    bloodSugar: {
      enabled: false,
      frequency: 7,
      lastChecked: ''
    }
  });

  useEffect(() => {
    fetchUserProfile();
    fetchNotifications();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      const user = response.data;
      
      setSettings({
        menstrual: {
          enabled: user.healthReminders?.menstrualCycle?.enabled || false,
          cycleLength: user.healthReminders?.menstrualCycle?.cycleLength || 28,
          lastDate: user.healthReminders?.menstrualCycle?.lastDate ? user.healthReminders.menstrualCycle.lastDate.split('T')[0] : ''
        },
        bloodPressure: {
          enabled: user.healthReminders?.bloodPressure?.enabled || false,
          frequency: user.healthReminders?.bloodPressure?.frequency || 7,
          lastChecked: user.healthReminders?.bloodPressure?.lastChecked || ''
        },
        bloodSugar: {
          enabled: user.healthReminders?.bloodSugar?.enabled || false,
          frequency: user.healthReminders?.bloodSugar?.frequency || 7,
          lastChecked: user.healthReminders?.bloodSugar?.lastChecked || ''
        }
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleToggle = (type) => {
    setSettings(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        enabled: !prev[type].enabled
      }
    }));
  };

  const handleChange = (type, field, value) => {
    setSettings(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/notifications/health-reminders', {
        menstrualCycle: {
          enabled: settings.menstrual.enabled,
          cycleLength: parseInt(settings.menstrual.cycleLength),
          lastDate: settings.menstrual.lastDate
        },
        bloodPressure: {
          enabled: settings.bloodPressure.enabled,
          frequency: parseInt(settings.bloodPressure.frequency),
          lastChecked: settings.bloodPressure.lastChecked
        },
        bloodSugar: {
          enabled: settings.bloodSugar.enabled,
          frequency: parseInt(settings.bloodSugar.frequency),
          lastChecked: settings.bloodSugar.lastChecked
        }
      });
      toast.success('Health reminder settings saved successfully!');
      fetchNotifications();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleTriggerReminders = async () => {
    try {
      await api.post('/notifications/health-reminders/trigger');
      toast.info('System Background Checks executed.');
      fetchNotifications();
    } catch (error) {
      console.error('Error triggering rules:', error);
      toast.error('Could not run system checks.');
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page health-reminders-page">
      <div className="container">
        <div className="page-header">
          <h1>🔔 Health Reminders</h1>
          <p>Configure your wellness notifications and tracking</p>
        </div>

        {/* Reminder Settings */}
        <div className="settings-grid">
          {/* Menstrual Cycle Tracking */}
          <div className="reminder-card">
            <div className="card-header">
              <div className="header-left">
                <div className="icon-circle menstrual">🩸</div>
                <div>
                  <h3>Menstrual Cycle Tracking</h3>
                  <p>Get reminders for your monthly cycle</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.menstrual.enabled}
                  onChange={() => handleToggle('menstrual')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {settings.menstrual.enabled && (
              <div className="card-body">
                <div className="form-group">
                  <label>Cycle Length (days)</label>
                  <input
                    type="number"
                    min="21"
                    max="35"
                    value={settings.menstrual.cycleLength}
                    onChange={(e) => handleChange('menstrual', 'cycleLength', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Last Period Date</label>
                  <input
                    type="date"
                    value={settings.menstrual.lastDate}
                    onChange={(e) => handleChange('menstrual', 'lastDate', e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Blood Pressure Monitoring */}
          <div className="reminder-card">
            <div className="card-header">
              <div className="header-left">
                <div className="icon-circle bp">💓</div>
                <div>
                  <h3>Blood Pressure Monitoring</h3>
                  <p>Regular BP check reminders</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.bloodPressure.enabled}
                  onChange={() => handleToggle('bloodPressure')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {settings.bloodPressure.enabled && (
              <div className="card-body">
                <div className="form-group">
                  <label>Check Frequency</label>
                  <select
                    value={settings.bloodPressure.frequency}
                    onChange={(e) => handleChange('bloodPressure', 'frequency', e.target.value)}
                    className="form-control"
                  >
                    <option value="3">Every 3 days</option>
                    <option value="7">Weekly</option>
                    <option value="14">Bi-weekly</option>
                    <option value="30">Monthly</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Last Checked Date</label>
                  <input
                    type="date"
                    value={settings.bloodPressure.lastChecked}
                    onChange={(e) => handleChange('bloodPressure', 'lastChecked', e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Blood Sugar Monitoring */}
          <div className="reminder-card">
            <div className="card-header">
              <div className="header-left">
                <div className="icon-circle sugar">🩸</div>
                <div>
                  <h3>Blood Sugar Monitoring</h3>
                  <p>Regular glucose check reminders</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.bloodSugar.enabled}
                  onChange={() => handleToggle('bloodSugar')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {settings.bloodSugar.enabled && (
              <div className="card-body">
                <div className="form-group">
                  <label>Check Frequency</label>
                  <select
                    value={settings.bloodSugar.frequency}
                    onChange={(e) => handleChange('bloodSugar', 'frequency', e.target.value)}
                    className="form-control"
                  >
                    <option value="1">Daily</option>
                    <option value="3">Every 3 days</option>
                    <option value="7">Weekly</option>
                    <option value="14">Bi-weekly</option>
                    <option value="30">Monthly</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Last Checked Date</label>
                  <input
                    type="date"
                    value={settings.bloodSugar.lastChecked}
                    onChange={(e) => handleChange('bloodSugar', 'lastChecked', e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="save-actions" style={{ display: 'flex', gap: '15px' }}>
          <button
            className="btn btn-primary btn-save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : '✓ Save Settings'}
          </button>
          
          <button
            className="btn btn-secondary btn-trigger"
            onClick={handleTriggerReminders}
            title="Manual override to trigger background cron jobs that calculate daily alerts."
          >
            🔄 Run System Checks Now
          </button>
        </div>

        {/* Recent Notifications */}
        <div className="notifications-section">
          <h2>📬 Recent Health Notifications</h2>
          {notifications.length === 0 ? (
            <div className="empty-notifications">
              <p>No health notifications yet. Enable reminders above to start tracking!</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map(notification => (
                <div
                  key={notification._id}
                  className={`notification-item ${notification.status === 'read' ? 'read' : 'unread'}`}
                >
                  <div className="notification-icon">
                    {notification.subType === 'menstrual_cycle' && '🩸'}
                    {notification.subType === 'blood_pressure' && '💓'}
                    {notification.subType === 'blood_sugar' && '🩸'}
                  </div>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {notification.status !== 'read' && (
                    <button
                      className="btn-mark-read"
                      onClick={() => markAsRead(notification._id)}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthReminders;
