import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { aiAPI, userAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaBrain, FaCheckCircle, FaExclamationTriangle
} from 'react-icons/fa';
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
  const [medical, setMedical] = useState({
    diseases: '',
    allergies: ''
  });
  const [analysis, setAnalysis
  ] = useState(null);
  const [loading, setLoading
  ] = useState(false);

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
    if (selectedSymptoms.length === 0) {
      toast.warning('Please select at least one symptom');
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

      const requestData = {
        symptoms: selectedSymptoms,
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
    <div className="page ai-analysis">
      <div className="container">
        <div className="page-header">
          <FaBrain style={
    { fontSize: '3rem'
    }
  } />
          <h1>AI Health Analysis</h1>
          <p>Get intelligent health recommendations based on your symptoms</p>
        </div>

        <div className="grid grid-2">
          { /* Input Section */}
          <div className="card">
            <div className="card-header">
              <h2>Select Your Symptoms</h2>
            </div>
            <div className="card-body">
              <div className="symptoms-grid">
                {availableSymptoms.map(symptom => (
                  <div
                    key={symptom.value
    }
                    className={`symptom-chip ${selectedSymptoms.includes(symptom.value) ? 'selected' : ''
      }`
    }
                    onClick={() => handleSymptomToggle(symptom.value)
    }
                  >
                    {symptom.label
    }
                  </div>
                ))
  }
              </div>

              <div className="mt-3">
                <h3>Vitals (Optional)</h3>
                <div className="form-group">
                  <label>Temperature (°F)</label>
                  <input
                    type="number"
                    name="temperature"
                    className="form-control"
                    placeholder="e.g., 98.6"
                    value={vitals.temperature
  }
                    onChange={handleVitalChange
  }
                  />
                </div>

                <div className="form-group">
                  <label>Blood Pressure</label>
                  <input
                    type="text"
                    name="bloodPressure"
                    className="form-control"
                    placeholder="e.g., 120/80"
                    value={vitals.bloodPressure
  }
                    onChange={handleVitalChange
  }
                  />
                </div>

                <div className="form-group">
                  <label>Blood Sugar (mg/dL)</label>
                  <input
                    type="number"
                    name="bloodSugar"
                    className="form-control"
                    placeholder="e.g., 100"
                    value={vitals.bloodSugar}
                    onChange={handleVitalChange}
                  />
                </div>
              </div>

              <div className="mt-3">
                <h3>Routine Checkup (Medical History)</h3>
                <div className="form-group">
                  <label>Existing Diseases / Conditions</label>
                  <input
                    type="text"
                    name="diseases"
                    className="form-control"
                    placeholder="e.g., Diabetes, Asthma (Comma separated)"
                    value={medical.diseases}
                    onChange={handleMedicalChange}
                  />
                </div>
                <div className="form-group">
                  <label>Known Allergies ⚠️</label>
                  <input
                    type="text"
                    name="allergies"
                    className="form-control"
                    placeholder="e.g., Penicillin, Peanuts"
                    value={medical.allergies}
                    onChange={handleMedicalChange}
                  />
                </div>
              </div>

              <button
                onClick={handleAnalyze
  }
                className="btn btn-primary btn-block mt-2"
                disabled={loading || selectedSymptoms.length === 0
  }
              >
                {loading ? 'Analyzing...' : '🧠 Analyze Symptoms'
  }
              </button>
            </div>
          </div>

          { /* Results Section */}
          <div>
            {analysis ? (
              <>
                { /* Severity & Urgency */}
                <div className="card" style={
      { borderLeft: `5px solid ${getSeverityColor(analysis.analysis.severity)
        }`
      }
    }>
                  <div className="card-body">
                    <div className="severity-badge" style={
      { background: getSeverityColor(analysis.analysis.severity)
      }
    }>
                      Severity: {analysis.analysis.severity.toUpperCase()
    }
                    </div>
                    {analysis.analysis.urgency && (
                      <div className="alert alert-danger mt-2">
                        <FaExclamationTriangle /> {analysis.analysis.urgency
      }
                      </div>
                    )
    }
                    <div className="mt-2">
                      <strong>Suggested Specialist:</strong>
                      <p>{analysis.analysis.suggestedSpecialist}</p>
                    </div>

                    {getMatchingDoctors().length > 0 && (
                      <div className="mt-3">
                        <hr />
                        <strong>👨‍⚕️ Available Matching Specialists:</strong>
                        <div className="matching-doctors-list mt-2">
                          {getMatchingDoctors().map(doc => (
                            <div key={doc._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', padding: '10px', borderRadius: '8px', marginBottom: '8px' }}>
                              <div>
                                <h4 style={{ margin: 0, fontSize: '1rem' }}>Dr. {doc.name}</h4>
                                <span style={{ fontSize: '0.85rem', color: '#666' }}>{doc.specialization} ({doc.experience} yrs)</span>
                              </div>
                              <button 
                                className="btn btn-primary" 
                                style={{ padding: '5px 12px', fontSize: '0.9rem' }}
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
                <div className="card mt-2">
                  <div className="card-header">
                    <h3>Possible Conditions</h3>
                  </div>
                  <div className="card-body">
                    <ul className="conditions-list">
                      {analysis.analysis.possibleConditions.map((condition, idx) => (
                        <li key={idx
      }>{condition
      }</li>
                      ))
    }
                    </ul>
                  </div>
                </div>

                { /* Recommendations */}
                <div className="card mt-2">
                  <div className="card-header">
                    <h3><FaCheckCircle /> Recommendations</h3>
                  </div>
                  <div className="card-body">
                    <ul className="recommendations-list">
                      {analysis.analysis.riskFactors && analysis.analysis.riskFactors.map((risk, idx) => (
                        <li key={`risk-${idx}`} style={{ color: '#d35400', fontWeight: 'bold' }}>⚠️ {risk}</li>
                      ))}
                      {analysis.analysis.recommendations.map((rec, idx) => (
                        <li key={`rec-${idx}`}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                { /* Precautions */}
                <div className="card mt-2">
                  <div className="card-header">
                    <h3>⚠️ Precautions</h3>
                  </div>
                  <div className="card-body">
                    <ul className="precautions-list">
                      {analysis.analysis.precautions.map((prec, idx) => (
                        <li key={idx
      }>{prec
      }</li>
                      ))
    }
                    </ul>
                  </div>
                </div>

                { /* AI Prescription */}
                {analysis.prescription && analysis.prescription.medications.length > 0 && (
                  <div className="card mt-2">
                    <div className="card-header">
                      <h3>💊 AI-Generated Prescription</h3>
                    </div>
                    <div className="card-body">
                      {analysis.prescription.medications.map((med, idx) => (
                        <div key={idx} className="medication-item">
                          <h4 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {med.medicine}
                            {med.requiresPrescription && (
                              <span style={{ fontSize: '0.7rem', background: '#dc3545', color: '#fff', padding: '4px 8px', borderRadius: '12px' }}>
                                Rx Required
                              </span>
                            )}
                          </h4>
                          <p><strong>Dosage:</strong> {med.dosage
        }</p>
                          <p><strong>Frequency:</strong> {med.frequency
        }</p>
                          <p><strong>Duration:</strong> {med.duration
        }</p>
                          <p><strong>Instructions:</strong> {med.instructions
        }</p>
                        </div>
                      ))
      }
                      <div className="mt-2">
                        <strong>Follow-up:</strong>
                        <p>{analysis.prescription.followUp
      }</p>
                      </div>
                    </div>
                  </div>
                )
    }

                <div className="alert alert-info mt-2">
                  <strong>Note:</strong> This AI analysis is for informational purposes only. 
                  Please consult a qualified healthcare professional for proper diagnosis and treatment.
                </div>
              </>
            ) : (
              <div className="card">
                <div className="card-body text-center">
                  <FaBrain style={
      { fontSize: '4rem', color: '#ddd', marginBottom: '20px'
      }
    } />
                  <h3>Select symptoms and click Analyze</h3>
                  <p>Our AI will provide intelligent health recommendations</p>
                </div>
              </div>
            )
  }
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;
