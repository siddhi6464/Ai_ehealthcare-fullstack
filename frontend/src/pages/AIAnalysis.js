import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { aiAPI, userAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaBrain, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import FloatingBrain from '../components/animations/FloatingBrain';
import FloatingHeart from '../components/animations/FloatingHeart';
import FloatingDNA from '../components/animations/FloatingDNA';
import './AIAnalysis.css';

const AIAnalysis = () => {
  const navigate = useNavigate();
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms
  ] = useState([]);
  const [vitals, setVitals] = useState({
    temperature: '',
    bloodPressure: '',
    bloodSugar: ''
  });
  const [customSymptom, setCustomSymptom] = useState('');
  const [medical, setMedical] = useState({
    diseases: '',
    allergies: ''
  });
  const [analysis, setAnalysis
  ] = useState(null);
  const [loading, setLoading
  ] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    loadSymptoms();
    loadDoctors();
    loadUserProfileHistory();
  }, []);

  const loadUserProfileHistory = async () => {
    try {
      const response = await userAPI.getMedicalHistory();
      const history = response.data.data;
      setMedical({
        diseases: history.medicalHistory?.map(m => m.condition).join(', ') || '',
        allergies: history.allergies?.join(', ') || ''
      });
    } catch (error) {
      console.error('Failed to fetch existing medical profile');
    }
  };

  const loadDoctors = async () => {
    try {
      const response = await api.get('/appointments/doctors');
      setAllDoctors(response.data.data.doctors);
    } catch (error) {
      console.error('Failed to load doctors');
    }
  };

  const loadSymptoms = async () => {
    try {
      const response = await aiAPI.getAllSymptoms();
      setAvailableSymptoms(response.data.data.symptoms);
    } catch (error) {
      toast.error('Failed to load symptoms');
    }
  };

  const handleSymptomToggle = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom
      ]);
    }
  };

  const handleVitalChange = (e) => {
    setVitals({ ...vitals, [e.target.name]: e.target.value });
  };

  const handleMedicalChange = (e) => {
    setMedical({ ...medical, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0 && customSymptom.trim() === '') {
      toast.warning('Please select at least one symptom or describe your condition');
      return;
    }

    setLoading(true);
    try {
      // 1. Invisible Autosave of Medical Records
      const diseasesArr = medical.diseases ? medical.diseases.split(',').map(d => ({ condition: d.trim() })) : [];
      const allergiesArr = medical.allergies ? medical.allergies.split(',').map(a => a.trim()) : [];
      
      userAPI.updateMedicalHistory({
        medicalHistory: diseasesArr,
        allergies: allergiesArr
      }).catch(() => console.error("Could not autosave medical history to database."));

      // 2. Submit payload to AI
      const historyArray = [];
      if (medical.diseases) historyArray.push(...medical.diseases.split(',').map(d => d.trim()));
      if (medical.allergies) historyArray.push(`Allergy: ${medical.allergies}`);

      const payloadSymptoms = [...selectedSymptoms];
      if (customSymptom.trim() !== '') {
        payloadSymptoms.push(`Patient describes condition as: ${customSymptom.trim()}`);
      }

      const requestData = {
        symptoms: payloadSymptoms,
        medicalHistory: historyArray,
        vitals: {
          ...(vitals.temperature && { temperature: parseFloat(vitals.temperature) }),
          ...(vitals.bloodPressure && { bloodPressure: vitals.bloodPressure }),
          ...(vitals.bloodSugar && { bloodSugar: parseFloat(vitals.bloodSugar) })
        }
      };

      const response = await aiAPI.analyzeSymptoms(requestData);
      setAnalysis(response.data.data);
      toast.success('Analysis completed!');
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#2ecc71';
      default: return '#3498db';
    }
  };

  const getMatchingDoctors = () => {
    if (!analysis || !analysis.analysis.suggestedSpecialist) return [];
    const specPieces = analysis.analysis.suggestedSpecialist.toLowerCase().replace(/[^a-z0-9]/gi, ' ').split(' ');
    
    return allDoctors.filter(doc => {
      const docSpec = doc.specialization.toLowerCase();
      // Match any keyword of the suggested specialist against the doctor's specialization
      return specPieces.some(piece => piece.length > 3 && docSpec.includes(piece)) || 
             docSpec.includes(analysis.analysis.suggestedSpecialist.toLowerCase());
    });
  };

  const handleBookDoctor = (doctorId) => {
    navigate('/book-appointment', { 
      state: { 
        doctorId, 
        symptoms: selectedSymptoms,
        reason: `AI Analysis suggests consultation for: ${analysis.analysis.possibleConditions.join(', ')}`
      } 
    });
  };

  return (
    <div className="page modern-ai-analysis">
      <div className="container">
        <div className="ai-header animate-fade-in">
          <div className="ai-header-content">
            <div className="ai-header-icon">
              <FaBrain />
            </div>
            <div className="ai-header-text">
              <h1>AI Health Check</h1>
              <p>Get intelligent, personalized health recommendations in seconds.</p>
            </div>
          </div>
        </div>

        <div className="modern-grid-2 animate-slide-up">
          { /* Input Section */}
          <div className="modern-card">
            <div className="modern-card-header">
              <h2>Select Your Symptoms</h2>
            </div>
            <div className="modern-card-body">
              <div className="symptoms-grid">
                {availableSymptoms.map(symptom => (
                  <div
                    key={symptom.value}
                    className={`symptom-chip ${selectedSymptoms.includes(symptom.value) ? 'selected' : ''}`}
                    onClick={() => handleSymptomToggle(symptom.value)}
                  >
                    {symptom.label}
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <h3 style={{ color: '#1b2559', fontSize: '1.2rem', marginBottom: '16px', fontWeight: '800' }}>Describe Your Condition</h3>
                <div className="modern-form-group">
                  <label>Other Symptoms (Optional)</label>
                  <textarea
                    className="modern-input"
                    rows="3"
                    placeholder="How are you feeling? E.g. feeling anxious, having trouble sleeping..."
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="mt-3">
                <h3 style={{ color: '#1b2559', fontSize: '1.2rem', marginBottom: '16px', fontWeight: '800' }}>Vitals (Optional)</h3>
                <div className="modern-form-group">
                  <label>Temperature (°F)</label>
                  <input
                    type="number"
                    name="temperature"
                    className="modern-input"
                    placeholder="e.g., 98.6"
                    value={vitals.temperature}
                    onChange={handleVitalChange}
                  />
                  {selectedSymptoms.includes('fever') && vitals.temperature && parseFloat(vitals.temperature) < 99 && (
                    <small style={{ color: '#2ecc71', fontWeight: '600', display: 'block', marginTop: '4px' }}>
                      Your fever is normal.
                    </small>
                  )}
                </div>

                <div className="modern-form-group">
                  <label>Blood Pressure</label>
                  <input
                    type="text"
                    name="bloodPressure"
                    className="modern-input"
                    placeholder="e.g., 120/80"
                    value={vitals.bloodPressure}
                    onChange={handleVitalChange}
                  />
                </div>

                <div className="modern-form-group">
                  <label>Blood Sugar (mg/dL)</label>
                  <input
                    type="number"
                    name="bloodSugar"
                    className="modern-input"
                    placeholder="e.g., 100"
                    value={vitals.bloodSugar}
                    onChange={handleVitalChange}
                  />
                </div>
              </div>

              <div className="mt-3">
                <h3 style={{ color: '#1b2559', fontSize: '1.2rem', marginBottom: '16px', fontWeight: '800' }}>Routine Checkup (Medical History)</h3>
                <div className="modern-form-group">
                  <label>Existing Diseases / Conditions</label>
                  <input
                    type="text"
                    name="diseases"
                    className="modern-input"
                    placeholder="e.g., Diabetes, Asthma (Comma separated)"
                    value={medical.diseases}
                    onChange={handleMedicalChange}
                  />
                </div>
                <div className="modern-form-group">
                  <label>Known Allergies ⚠️</label>
                  <input
                    type="text"
                    name="allergies"
                    className="modern-input"
                    placeholder="e.g., Penicillin, Peanuts"
                    value={medical.allergies}
                    onChange={handleMedicalChange}
                  />
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                className="modern-btn-primary mt-2"
                disabled={loading || (selectedSymptoms.length === 0 && customSymptom.trim() === '')}
              >
                {loading ? 'Analyzing...' : <><FaBrain /> Analyze Symptoms</>}
              </button>
            </div>
          </div>

          { /* Results Section */}
          <div 
            className="ai-results-panel"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Floating Background Layer */}
            <FloatingBrain isHovered={isHovered} isAnalyzing={loading} />
            <FloatingHeart isHovered={isHovered} isAnalyzing={loading} />
            <FloatingDNA isHovered={isHovered} isAnalyzing={loading} />

            {/* Content Layer */}
            <div className="ai-results-content">
              {analysis ? (
                <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  { /* Severity & Urgency */}
                  <div className="modern-card severity-card" style={{ borderLeftColor: getSeverityColor(analysis.analysis.severity) }}>
                    <div className="modern-card-body">
                      <div className="severity-badge" style={{ background: getSeverityColor(analysis.analysis.severity) }}>
                        Severity: {analysis.analysis.severity}
                      </div>
                      {analysis.analysis.urgency && (
                        <div className="modern-alert alert-danger">
                          <FaExclamationTriangle /> {analysis.analysis.urgency}
                        </div>
                      )}
                      <div className="mt-2" style={{ color: '#1b2559' }}>
                        <strong>Suggested Specialist:</strong>
                        <p style={{ color: '#a3aed1', fontWeight: '500', marginTop: '4px' }}>{analysis.analysis.suggestedSpecialist}</p>
                      </div>

                      {getMatchingDoctors().length > 0 && (
                        <div className="mt-3">
                          <hr style={{ border: 'none', borderTop: '1px solid #f4f7fe', margin: '16px 0' }} />
                          <strong style={{ color: '#1b2559', display: 'block', marginBottom: '12px' }}>👨‍⚕️ Available Matching Specialists:</strong>
                          <div>
                            {getMatchingDoctors().map(doc => (
                              <div key={doc._id} className="doctor-match-item">
                                <div className="doctor-match-info">
                                  <h4>Dr. {doc.name}</h4>
                                  <span>{doc.specialization} ({doc.experience} yrs)</span>
                                </div>
                                <button 
                                  className="btn-book" 
                                  onClick={() => handleBookDoctor(doc._id)}
                                >
                                  Book Now
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  { /* Possible Conditions */}
                  <div className="modern-card">
                    <div className="modern-card-header">
                      <h3>Possible Conditions</h3>
                    </div>
                    <div className="modern-card-body">
                      <ul className="modern-list">
                        {analysis.analysis.possibleConditions.map((condition, idx) => (
                          <li key={idx} className="condition-item">{condition}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  { /* Recommendations */}
                  <div className="modern-card">
                    <div className="modern-card-header">
                      <h3><FaCheckCircle color="#2ecc71" /> Recommendations</h3>
                    </div>
                    <div className="modern-card-body">
                      <ul className="modern-list">
                        {analysis.analysis.riskFactors && analysis.analysis.riskFactors.map((risk, idx) => (
                          <li key={`risk-${idx}`} style={{ color: '#e74c3c', borderLeftColor: '#e74c3c' }}>⚠️ {risk}</li>
                        ))}
                        {analysis.analysis.recommendations.map((rec, idx) => (
                          <li key={`rec-${idx}`} className="recommendation-item">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  { /* Precautions */}
                  <div className="modern-card">
                    <div className="modern-card-header">
                      <h3>⚠️ Precautions</h3>
                    </div>
                    <div className="modern-card-body">
                      <ul className="modern-list">
                        {analysis.analysis.precautions.map((prec, idx) => (
                          <li key={idx} className="precaution-item">{prec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  { /* AI Prescription */}
                  {analysis.prescription && analysis.prescription.medications.length > 0 && (
                    <div className="modern-card">
                      <div className="modern-card-header">
                        <h3>💊 AI-Generated Prescription</h3>
                      </div>
                      <div className="modern-card-body">
                        <ul className="modern-list">
                          {analysis.prescription.medications.map((med, idx) => (
                            <li key={idx} className="medication-item">
                              <div className="medication-header">
                                {med.medicine}
                                {med.requiresPrescription && (
                                  <span className="rx-badge">Rx Required</span>
                                )}
                              </div>
                              <div className="med-detail"><strong>Dosage:</strong> {med.dosage}</div>
                              <div className="med-detail"><strong>Frequency:</strong> {med.frequency}</div>
                              <div className="med-detail"><strong>Duration:</strong> {med.duration}</div>
                              <div className="med-detail"><strong>Instructions:</strong> {med.instructions}</div>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-2" style={{ background: '#f4f7fe', padding: '16px', borderRadius: '16px' }}>
                          <strong style={{ color: '#1b2559' }}>Follow-up:</strong>
                          <p style={{ margin: '4px 0 0 0', color: '#a3aed1', fontWeight: '500' }}>{analysis.prescription.followUp}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="modern-alert alert-info">
                    <span><strong>Note:</strong> This AI analysis is for informational purposes only. Please consult a qualified healthcare professional for proper diagnosis and treatment.</span>
                  </div>
                </div>
              ) : (
                <div className="modern-card animate-slide-up" style={{ animationDelay: '0.1s', height: '100%', position: 'relative', zIndex: 10 }}>
                  <div className="empty-state">
                    <img src="/assets/images/aicheck.png" alt="AI Analysis Ready" style={{ width: '220px', height: 'auto', marginBottom: '30px', filter: 'drop-shadow(0 20px 30px rgba(67, 24, 255, 0.15))' }} />
                    <h3>Ready for Analysis</h3>
                    <p>Select your symptoms on the left and click Analyze to receive intelligent, AI-powered health insights.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;
