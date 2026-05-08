/**
 * TRUE LLM AI ENGINE (Google Gemini)
 * Analyzes symptoms natively via NLP and Generative AI.
 * (Legacy rules are kept for hardcoded frontend initialization endpoints)
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Medical Knowledge Base - Symptom Rules
const symptomRules = {
  // Respiratory Issues
  fever: {
    severity: 'medium',
    relatedSymptoms: ['cough', 'headache', 'body_ache', 'chills'],
    possibleConditions: ['Viral Fever', 'Flu', 'Common Cold', 'Infection'],
    recommendations: [
      'Take paracetamol (500mg) for fever above 100°F',
      'Rest adequately for 6-8 hours',
      'Drink plenty of fluids (8-10 glasses of water)',
      'Monitor temperature every 4 hours'
    ],
    precautions: [
      'Avoid cold beverages',
      'Stay in a well-ventilated room',
      'If fever persists for more than 3 days, consult a doctor immediately'
    ],
    urgency: 'Consult doctor if fever > 102°F or persists beyond 3 days'
  },
  
  cough: {
    severity: 'low',
    relatedSymptoms: ['fever', 'throat_pain', 'breathing_difficulty'],
    possibleConditions: ['Common Cold', 'Bronchitis', 'Allergic Reaction'],
    recommendations: [
      'Take cough syrup as per age-appropriate dosage',
      'Drink warm water with honey and ginger',
      'Use steam inhalation twice daily',
      'Avoid smoking and dust'
    ],
    precautions: [
      'Cover mouth while coughing',
      'Avoid cold and spicy foods',
      'If cough persists for more than 2 weeks, get chest X-ray'
    ],
    urgency: 'Immediate attention if blood in cough or severe breathing difficulty'
  },

  headache: {
    severity: 'medium',
    relatedSymptoms: ['fever', 'nausea', 'vision_problems', 'neck_stiffness'],
    possibleConditions: ['Tension Headache', 'Migraine', 'Sinusitis', 'Dehydration'],
    recommendations: [
      'Take pain reliever (ibuprofen 400mg or paracetamol 500mg)',
      'Rest in a dark, quiet room',
      'Apply cold compress on forehead',
      'Stay hydrated - drink water regularly'
    ],
    precautions: [
      'Avoid screen time for 2-3 hours',
      'Maintain regular sleep schedule',
      'Reduce caffeine intake'
    ],
    urgency: 'Seek immediate help if sudden severe headache with vomiting or loss of consciousness'
  },

  chest_pain: {
    severity: 'high',
    relatedSymptoms: ['breathing_difficulty', 'sweating', 'nausea', 'arm_pain'],
    possibleConditions: ['Cardiac Issue', 'Anxiety', 'Muscle Strain', 'Gastric Problem'],
    recommendations: [
      'Stop all physical activity immediately',
      'Sit or lie down in a comfortable position',
      'If pain persists, call emergency services'
    ],
    precautions: [
      'Do not ignore chest pain',
      'Monitor blood pressure if available',
      'Keep emergency contacts handy'
    ],
    urgency: '⚠️ EMERGENCY - Seek immediate medical attention'
  },

  stomach_pain: {
    severity: 'medium',
    relatedSymptoms: ['nausea', 'vomiting', 'diarrhea', 'fever'],
    possibleConditions: ['Gastritis', 'Food Poisoning', 'Indigestion', 'Appendicitis'],
    recommendations: [
      'Avoid solid food for 3-4 hours',
      'Drink ORS or electrolyte solution',
      'Take antacid if acidity is suspected',
      'Rest and avoid stress'
    ],
    precautions: [
      'Eat bland, easily digestible food',
      'Avoid spicy and oily foods',
      'If pain is severe or localized to lower right abdomen, consult doctor immediately'
    ],
    urgency: 'Immediate attention if severe pain with vomiting or blood in stool'
  },

  dizziness: {
    severity: 'medium',
    relatedSymptoms: ['nausea', 'vision_problems', 'weakness', 'headache'],
    possibleConditions: ['Low Blood Pressure', 'Dehydration', 'Vertigo', 'Anemia'],
    recommendations: [
      'Sit or lie down immediately',
      'Drink water or juice with salt',
      'Avoid sudden movements',
      'Check blood pressure and sugar levels'
    ],
    precautions: [
      'Avoid driving or operating machinery',
      'Do not stand up quickly',
      'Eat regular meals'
    ],
    urgency: 'Consult doctor if dizziness is recurrent or accompanied by fainting'
  },

  body_ache: {
    severity: 'low',
    relatedSymptoms: ['fever', 'weakness', 'headache', 'chills'],
    possibleConditions: ['Viral Infection', 'Flu', 'Fatigue', 'Muscle Strain'],
    recommendations: [
      'Take pain reliever (paracetamol 500mg)',
      'Rest adequately',
      'Apply warm compress to painful areas',
      'Stay hydrated'
    ],
    precautions: [
      'Avoid heavy physical activity',
      'Maintain good posture',
      'Do gentle stretching exercises'
    ],
    urgency: 'Consult doctor if body ache persists for more than 5 days'
  },

  breathing_difficulty: {
    severity: 'high',
    relatedSymptoms: ['chest_pain', 'cough', 'wheezing', 'fever'],
    possibleConditions: ['Asthma', 'Pneumonia', 'Allergic Reaction', 'Cardiac Issue'],
    recommendations: [
      'Sit upright in a comfortable position',
      'Use inhaler if prescribed',
      'Stay calm and breathe slowly',
      'Call for emergency help if severe'
    ],
    precautions: [
      'Avoid allergens and pollutants',
      'Do not lie flat',
      'Keep emergency medications handy'
    ],
    urgency: '⚠️ EMERGENCY - Seek immediate medical attention if breathing is severely compromised'
  },

  nausea: {
    severity: 'low',
    relatedSymptoms: ['vomiting', 'stomach_pain', 'headache', 'dizziness'],
    possibleConditions: ['Food Poisoning', 'Motion Sickness', 'Gastritis', 'Pregnancy'],
    recommendations: [
      'Sip clear fluids like water or ginger tea',
      'Eat small, frequent meals',
      'Take anti-nausea medication if prescribed',
      'Rest in a comfortable position'
    ],
    precautions: [
      'Avoid strong odors',
      'Eat bland foods (rice, toast, bananas)',
      'Avoid oily and spicy foods'
    ],
    urgency: 'Consult doctor if nausea persists for more than 24 hours or with severe vomiting'
  }
};

// Specialization mapping based on symptoms
const specialistMapping = {
  cardiac: ['chest_pain', 'breathing_difficulty', 'arm_pain', 'sweating'],
  respiratory: ['cough', 'breathing_difficulty', 'wheezing'],
  neurological: ['headache', 'dizziness', 'vision_problems', 'neck_stiffness'],
  gastroenterology: ['stomach_pain', 'nausea', 'vomiting', 'diarrhea'],
  general: ['fever', 'body_ache', 'weakness', 'chills']
};

/**
 * Main AI Analysis Function
 */
function analyzeSymptoms(symptoms, medicalHistory = [], vitals = {}) {
  const analysis = {
    severity: 'low',
    possibleConditions: [],
    recommendations: [],
    precautions: [],
    urgency: null,
    suggestedSpecialist: 'General Physician',
    riskFactors: [],
    additionalTests: []
  };

  // Check for emergency symptoms
  const emergencySymptoms = ['chest_pain', 'breathing_difficulty'];
  const hasEmergency = symptoms.some(s => emergencySymptoms.includes(s));
  
  if (hasEmergency) {
    analysis.severity = 'high';
    analysis.urgency = '⚠️ EMERGENCY - Seek immediate medical attention';
    analysis.recommendations.unshift('Call emergency services or go to nearest hospital immediately');
  }

  // Determine actual fever severity based on temperature if provided
  const temp = vitals.temperature ? parseFloat(vitals.temperature) : null;
  let feverSeverityOverride = null;
  if (symptoms.includes('fever') && temp !== null) {
    if (temp < 99) {
      // Normal body temperature range — not actually a fever
      feverSeverityOverride = 'low';
    } else if (temp >= 99 && temp <= 102) {
      // Mild to moderate fever
      feverSeverityOverride = 'medium';
    } else {
      // High fever (> 102°F)
      feverSeverityOverride = 'high';
    }
  }

  // Analyze each symptom
  symptoms.forEach(symptom => {
    const rule = symptomRules[symptom];
    if (rule) {
      // Determine effective severity for this symptom
      let effectiveSeverity = rule.severity;
      if (symptom === 'fever' && feverSeverityOverride !== null) {
        effectiveSeverity = feverSeverityOverride;
      }

      // Update severity
      if (effectiveSeverity === 'high' && analysis.severity !== 'high') {
        analysis.severity = 'high';
      } else if (effectiveSeverity === 'medium' && analysis.severity === 'low') {
        analysis.severity = 'medium';
      }

      // Add conditions
      analysis.possibleConditions.push(...rule.possibleConditions);
      
      // Add recommendations
      analysis.recommendations.push(...rule.recommendations);
      
      // Add precautions
      analysis.precautions.push(...rule.precautions);
      
      // Set urgency (override for fever based on temperature)
      if (symptom === 'fever' && feverSeverityOverride !== null) {
        if (feverSeverityOverride === 'low') {
          // Normal temp — no urgency for fever
          analysis.urgency = analysis.urgency || null;
        } else if (feverSeverityOverride === 'medium') {
          if (!analysis.urgency) {
            analysis.urgency = 'Monitor temperature. Consult doctor if fever rises above 102°F or persists beyond 3 days';
          }
        } else {
          analysis.urgency = '⚠️ High fever detected - Seek medical attention immediately';
        }
      } else if (rule.urgency && !analysis.urgency) {
        analysis.urgency = rule.urgency;
      }
    }
  });

  // If fever is selected but temperature is normal, adjust severity down if no other serious symptoms
  if (symptoms.includes('fever') && feverSeverityOverride === 'low') {
    const nonFeverSymptoms = symptoms.filter(s => s !== 'fever');
    const hasHighSeveritySymptom = nonFeverSymptoms.some(s => {
      const rule = symptomRules[s];
      return rule && rule.severity === 'high';
    });
    if (!hasHighSeveritySymptom && analysis.severity !== 'high') {
      analysis.severity = 'low';
      if (!analysis.urgency) {
        analysis.urgency = 'Your temperature is within normal range. No immediate concern, but monitor for changes.';
      }
    }
  }

  // Determine suggested specialist
  analysis.suggestedSpecialist = determineSuggestedSpecialist(symptoms);

  // Check vitals for risk factors
  if (temp && temp > 102) {
    analysis.riskFactors.push('High fever detected');
    analysis.recommendations.unshift('Temperature is critically high - seek medical attention');
  }

  if (vitals.bloodPressure) {
    const [systolic] = vitals.bloodPressure.split('/').map(Number);
    if (systolic > 140) {
      analysis.riskFactors.push('Elevated blood pressure');
      analysis.additionalTests.push('Blood pressure monitoring');
    }
  }

  if (vitals.bloodSugar && vitals.bloodSugar > 200) {
    analysis.riskFactors.push('High blood sugar level');
    analysis.additionalTests.push('HbA1c test for diabetes screening');
  }

  // Check medical history for complications
  if (medicalHistory.length > 0) {
    analysis.riskFactors.push('Pre-existing medical conditions detected');
    analysis.recommendations.push('Inform doctor about your medical history during consultation');
  }

  // Remove duplicates
  analysis.possibleConditions = [...new Set(analysis.possibleConditions)];
  analysis.recommendations = [...new Set(analysis.recommendations)];
  analysis.precautions = [...new Set(analysis.precautions)];

  // Add general advice
  analysis.recommendations.push('Monitor your symptoms and keep a record');
  analysis.recommendations.push('Maintain adequate hydration throughout the day');
  
  return analysis;
}

/**
 * Determine suggested specialist based on symptoms
 */
function determineSuggestedSpecialist(symptoms) {
  for (const [specialty, symptomList] of Object.entries(specialistMapping)) {
    if (symptoms.some(s => symptomList.includes(s))) {
      switch(specialty) {
        case 'cardiac':
          return 'Cardiologist';
        case 'respiratory':
          return 'Pulmonologist';
        case 'neurological':
          return 'Neurologist';
        case 'gastroenterology':
          return 'Gastroenterologist';
        default:
          return 'General Physician';
      }
    }
  }
  return 'General Physician';
}

const bannedMedicines = ['Ranitidine', 'Nimesulide'];

function isAllergic(medicine, medicalHistory) {
  if (!medicalHistory) return false;
  const historyString = medicalHistory.join(' ').toLowerCase();
  // Check if allergy input string contains part of the medicine name
  return historyString.includes(medicine.toLowerCase().slice(0, 5));
}

/**
 * Generate AI prescription based on analysis
 */
function generatePrescription(symptoms, analysis, medicalHistory = []) {
  const prescription = {
    medications: [],
    lifestyle: [],
    followUp: null
  };

  const addMedication = (med) => {
    const medBaseName = med.medicine.split(' ')[0];
    
    // Check if banned
    if (bannedMedicines.some(b => medBaseName.includes(b)) || medBaseName === 'Ranitidine') {
       return; // completely drop banned medicines
    }
    
    // Check allergy
    if (isAllergic(medBaseName, medicalHistory)) {
       prescription.lifestyle.push(`⚠️ WARNING: Patient reported allergy potentially related to ${medBaseName}. Alternative requested.`);
       return; // skip adding the medicine
    }

    prescription.medications.push(med);
  };

  // Common medications based on symptoms
  if (symptoms.includes('fever')) {
    addMedication({
      medicine: 'Paracetamol',
      dosage: '500mg',
      frequency: 'Every 6 hours',
      duration: '3-5 days',
      instructions: 'Take after meals',
      requiresPrescription: false
    });
  }

  if (symptoms.includes('cough')) {
    addMedication({
      medicine: 'Cough Syrup (Dextromethorphan)',
      dosage: '10ml',
      frequency: 'Twice daily',
      duration: '5-7 days',
      instructions: 'Take before bedtime',
      requiresPrescription: false
    });
  }

  if (symptoms.includes('headache')) {
    addMedication({
      medicine: 'Ibuprofen',
      dosage: '400mg',
      frequency: 'Every 8 hours as needed',
      duration: 'Up to 3 days',
      instructions: 'Take with food',
      requiresPrescription: false
    });
  }

  if (symptoms.includes('stomach_pain')) {
    // Replaced Ranitidine with Pantoprazole since Ranitidine is banned
    addMedication({
      medicine: 'Pantoprazole', // Replaced from banned Ranitidine
      dosage: '40mg',
      frequency: 'Once daily',
      duration: '5 days',
      instructions: 'Take 30 mins before breakfast',
      requiresPrescription: true
    });
  }

  // Example of prescription antibiotic
  if (symptoms.includes('fever') && symptoms.includes('cough') && analysis.severity === 'high') {
    addMedication({
      medicine: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Every 8 hours',
      duration: '7 days',
      instructions: 'Complete full course. Stop immediately if allergic reaction occurs.',
      requiresPrescription: true
    });
  }

  // Lifestyle recommendations
  prescription.lifestyle = [
    'Get adequate rest (7-8 hours of sleep)',
    'Maintain a balanced diet',
    'Stay hydrated - drink 8-10 glasses of water daily',
    'Avoid stress and practice relaxation techniques'
  ];

  // Follow-up recommendation
  if (analysis.severity === 'high') {
    prescription.followUp = '24-48 hours or immediately if symptoms worsen';
  } else if (analysis.severity === 'medium') {
    prescription.followUp = '3-5 days if symptoms persist';
  } else {
    prescription.followUp = '1 week if no improvement';
  }

  return prescription;
}

/**
 * Get symptom combinations for related conditions
 */
function getRelatedSymptoms(symptom) {
  const rule = symptomRules[symptom];
  return rule ? rule.relatedSymptoms : [];
}

/**
 * TRUE LLM AI ANALYSIS ENTRY POINT
 */
async function generateAIAnalysis(symptoms, medicalHistory = [], vitals = {}) {
  if (!symptoms || symptoms.length === 0) throw new Error("Symptoms are required");
  
  // Use dummy key if not present in env to prevent crash on boot, though it will fail on call
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_API_KEY');
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // Build temperature context for the prompt
  const tempValue = vitals.temperature ? parseFloat(vitals.temperature) : null;
  let temperatureContext = '';
  if (symptoms.some(s => s.toLowerCase().includes('fever'))) {
    if (tempValue !== null) {
      if (tempValue < 99) {
        temperatureContext = `\nIMPORTANT TEMPERATURE CONTEXT: The patient's temperature is ${tempValue}°F, which is within the NORMAL range (below 99°F). Even though "fever" was selected as a symptom, this is NOT an actual fever. Severity for this should be "low". Do NOT recommend visiting a doctor urgently for fever at this temperature.`;
      } else if (tempValue >= 99 && tempValue <= 102) {
        temperatureContext = `\nTEMPERATURE CONTEXT: The patient's temperature is ${tempValue}°F, which indicates a mild to moderate fever. Severity should be "medium" unless other serious symptoms are present.`;
      } else {
        temperatureContext = `\nTEMPERATURE CONTEXT: The patient's temperature is ${tempValue}°F, which is HIGH (above 102°F). This is a serious fever requiring urgent medical attention.`;
      }
    } else {
      temperatureContext = `\nTEMPERATURE CONTEXT: No temperature value was provided. Since fever is reported without a temperature reading, assume moderate concern and set severity to "medium" at most for fever alone.`;
    }
  }

  const prompt = `
You are a highly intelligent medical AI assistant.
Evaluate the following patient profile and return a JSON object exactly matching the requested schema. DO NOT include any markdown blocks (like \`\`\`json), just return the raw JSON object.

Patient Profile:
- Symptoms: ${symptoms.join(', ')}
- Vitals: ${JSON.stringify(vitals)}
- Medical History (Diseases/Allergies): ${medicalHistory.length > 0 ? medicalHistory.join(', ') : 'None'}
${temperatureContext}

CRITICAL MEDICAL RULES:
1. NEVER prescribe banned medications (e.g. Ranitidine, Nimesulide). If needed, substitute with safe modern OTCs (e.g. Pantoprazole).
2. If the user has a stated allergy in their medical history, DO NOT prescribe related medications. Note the allergy in the 'lifestyle' or 'precautions' lists.
3. If an antibiotic or heavy drug is required, set requiresPrescription to true. Otherwise false.
4. "severity" MUST be one of: "low", "medium", "high".
5. FEVER SEVERITY RULES (MUST FOLLOW):
   - Temperature below 99°F = NOT a real fever. Severity MUST be "low". Do NOT suggest urgently visiting a doctor.
   - Temperature 99°F to 102°F = Mild/moderate fever. Severity should be "medium" at most.
   - Temperature above 102°F = High fever. Severity can be "high".
   - If no temperature is provided with fever, default to "medium" severity at most.
   - Only escalate to "high" severity for fever when temperature exceeds 102°F or other emergency symptoms are present.

EXPECTED JSON SCHEMA:
{
  "analysis": {
    "severity": "low",
    "urgency": "Emergency text if high severity, else null",
    "suggestedSpecialist": "E.g., Cardiologist, General Physician",
    "possibleConditions": ["string"],
    "recommendations": ["string"],
    "precautions": ["string"],
    "riskFactors": ["string"]
  },
  "prescription": {
    "lifestyle": ["string"],
    "followUp": "string",
    "medications": [
      {
        "medicine": "Medicine Name",
        "dosage": "e.g. 500mg",
        "frequency": "e.g. Twice daily",
        "duration": "e.g. 5 days",
        "instructions": "e.g. After meals",
        "requiresPrescription": true
      }
    ]
  }
}
`;

  let retries = 3;
  let delay = 1000;

  while (retries > 0) {
    try {
      const result = await model.generateContent(prompt);
      let textResult = result.response.text().trim();
      
      // Clean up potential markdown formatting
      if (textResult.startsWith('\`\`\`json')) textResult = textResult.replace(/^\`\`\`json/, '');
      if (textResult.startsWith('\`\`\`')) textResult = textResult.replace(/^\`\`\`/, '');
      if (textResult.endsWith('\`\`\`')) textResult = textResult.replace(/\`\`\`$/, '');
      
      return JSON.parse(textResult.trim());
    } catch (error) {
      console.error(`LLM Generation Error (Retries left: ${retries - 1}):`, error.message);
      retries--;
      if (retries === 0) {
        console.warn("LLM Engine failed after retries. Falling back to rule-based system.");
        const analysis = analyzeSymptoms(symptoms, medicalHistory, vitals);
        const prescription = generatePrescription(symptoms, analysis, medicalHistory);
        return { analysis, prescription };
      }
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}

module.exports = {
  analyzeSymptoms,
  generatePrescription,
  getRelatedSymptoms,
  symptomRules,
  generateAIAnalysis
};
