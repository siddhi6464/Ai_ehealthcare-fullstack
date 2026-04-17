import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import './DoctorProfile.css';

const DoctorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    qualification: '',
    experience: '',
    consultationFee: '',
    description: '',
    avatarUrl: '',
    achievements: []
  });

  const availableAvatars = [
    '/assets/images/doctor1.png',
    '/assets/images/doctor2.png',
    '/assets/images/doctor3.png'
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      const user = response.data.data.user;
      setProfile(user);
      setFormData({
        name: user.name || '',
        specialization: user.specialization || '',
        qualification: user.qualification || '',
        experience: user.experience || '',
        consultationFee: user.consultationFee || '',
        description: user.description || '',
        avatarUrl: user.avatarUrl || '/assets/images/doctor1.png',
        achievements: user.achievements || []
      });
    } catch (error) {
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAchievementChange = (index, value) => {
    const newAchievements = [...formData.achievements];
    newAchievements[index] = value;
    setFormData({ ...formData, achievements: newAchievements });
  };

  const addAchievement = () => {
    setFormData({ ...formData, achievements: [...formData.achievements, ''] });
  };

  const removeAchievement = (index) => {
    const newAchievements = formData.achievements.filter((_, i) => i !== index);
    setFormData({ ...formData, achievements: newAchievements });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        achievements: formData.achievements.filter(ach => ach.trim() !== '')
      };
      await api.patch('/auth/profile', payload);
      toast.success('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) return <div className="page loading-state"><div className="loading-spinner">Loading Profile...</div></div>;
  if (!profile) return <div className="page empty-state">Profile not found.</div>;

  return (
    <div className="page doctor-profile-page">
      <div className="container">
        
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-hero">
            <img src={editing ? formData.avatarUrl : profile.avatarUrl} alt="Doctor Avatar" className="profile-avatar-large" />
            
            <div className="profile-title-block">
              <h1>Dr. {editing ? formData.name : profile.name}</h1>
              <p className="profile-spec">{editing ? formData.specialization : profile.specialization}</p>
              {!editing && (
                 <button className="btn-edit-mode" onClick={() => setEditing(true)}>✎ Edit Profile</button>
              )}
            </div>
          </div>
          
          <div className="profile-quick-stats">
            <div className="stat-box">
              <span className="stat-value">{editing ? formData.experience : profile.experience} yrs</span>
              <span className="stat-label">Experience</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">${editing ? formData.consultationFee : profile.consultationFee}</span>
              <span className="stat-label">Consult Fee</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">⭐ 4.9</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        {!editing ? (
          <div className="profile-content-grid">
            <div className="profile-board profile-bio">
              <h2>About Me</h2>
              <p>{profile.description}</p>
              
              <div className="qualifications-block">
                <h3>Credentials</h3>
                <p><strong>Qualifications:</strong> {profile.qualification}</p>
              </div>
            </div>
            
            <div className="profile-board profile-achievements">
              <h2>Achievements & Honors</h2>
              {profile.achievements && profile.achievements.length > 0 ? (
                <ul className="achievement-list">
                  {profile.achievements.map((ach, idx) => (
                    <li key={idx}>🏆 {ach}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-light">No achievements listed yet.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="profile-editor-form">
            <form onSubmit={handleSave}>
              <div className="editor-grid">
                
                {/* Left Column Config */}
                <div className="form-column">
                  <h3>Avatar Selection</h3>
                  <div className="avatar-gallery">
                    {availableAvatars.map(url => (
                       <img 
                         key={url} 
                         src={url} 
                         alt="avatar option" 
                         className={`avatar-option ${formData.avatarUrl === url ? 'selected' : ''}`}
                         onClick={() => setFormData({...formData, avatarUrl: url})}
                       />
                    ))}
                  </div>

                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="form-control" />
                  </div>
                  
                  <div className="form-row split">
                    <div className="form-group">
                      <label>Specialization</label>
                      <input type="text" name="specialization" value={formData.specialization} onChange={handleInputChange} className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Qualifications</label>
                      <input type="text" name="qualification" value={formData.qualification} onChange={handleInputChange} className="form-control" />
                    </div>
                  </div>

                  <div className="form-row split">
                    <div className="form-group">
                      <label>Experience (Years)</label>
                      <input type="number" name="experience" value={formData.experience} onChange={handleInputChange} className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Consult Fee ($)</label>
                      <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleInputChange} className="form-control" />
                    </div>
                  </div>
                </div>

                {/* Right Column Config */}
                <div className="form-column">
                  <div className="form-group">
                    <label>Professional Biography</label>
                    <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleInputChange} 
                      rows="5" 
                      className="form-control"
                      placeholder="Tell your patients about your practice..."
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>Achievements & Honors</label>
                    {formData.achievements.map((ach, idx) => (
                      <div key={idx} className="achievement-input-row">
                        <input 
                          type="text" 
                          value={ach} 
                          onChange={(e) => handleAchievementChange(idx, e.target.value)} 
                          className="form-control"
                          placeholder="e.g. Voted Top Doctor 2023"
                        />
                        <button type="button" className="btn-remove" onClick={() => removeAchievement(idx)}>✖</button>
                      </div>
                    ))}
                    <button type="button" className="btn-add-achievement" onClick={addAchievement}>+ Add Achievement</button>
                  </div>
                </div>
              </div>

              <div className="editor-actions">
                <button type="button" className="btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
                <button type="submit" className="btn-save">Save Profile Details</button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default DoctorProfile;
