const { analyzeSymptoms, generatePrescription, getRelatedSymptoms } = require('../services/aiEngine');

/**
 * Analyze symptoms using AI
 */
exports.analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms, vitals, medicalHistory } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide at least one symptom'
      });
    }

    // Call the TRUE LLM AI Engine instead of old hardcoded rules
    const { analysis, prescription } = await require('../services/aiEngine').generateAIAnalysis(
      symptoms, 
      medicalHistory || [], 
      vitals || {}
    );

    res.status(200).json({
      status: 'success',
      message: 'Symptom analysis completed',
      data: {
        analysis,
        prescription,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get AI health recommendations
 */
exports.getHealthRecommendations = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide symptoms'
      });
    }

    const analysis = analyzeSymptoms(symptoms);

    res.status(200).json({
      status: 'success',
      data: {
        recommendations: analysis.recommendations,
        precautions: analysis.precautions,
        urgency: analysis.urgency,
        suggestedSpecialist: analysis.suggestedSpecialist
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get related symptoms for a given symptom
 */
exports.getRelatedSymptoms = async (req, res) => {
  try {
    const { symptom } = req.params;

    const relatedSymptoms = getRelatedSymptoms(symptom);

    res.status(200).json({
      status: 'success',
      data: {
        symptom,
        relatedSymptoms
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get all available symptoms
 */
exports.getAllSymptoms = async (req, res) => {
  try {
    const { symptomRules } = require('../services/aiEngine');
    
    const symptoms = Object.keys(symptomRules).map(key => ({
      value: key,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      severity: symptomRules[key].severity
    }));

    res.status(200).json({
      status: 'success',
      data: { symptoms }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
