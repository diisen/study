/**
 * A3 Digital Planning Sheet Engine for AS 91847
 * Provides interactive bullet-point planning, auto-save to localStorage,
 * bullet-point validation (preventing full paragraphs for Exam.net compliance),
 * and A3 print/export formatting.
 */

class PlannerEngine {
  constructor() {
    this.storageKey = 'psychology_as91847_planner_data';
    this.data = this.loadSavedData();
    this.activeField = 'clinical'; // 'clinical' | 'social'
  }

  getDefaultData() {
    return {
      studentName: '',
      studentId: '',
      disorderChoice: 'Stress / Occupational Burnout',
      clinicalTheory: 'Workload Control & Autonomy Theory (Johansson et al., 1978) vs Te Whare Tapa Whā',
      socialTheory: 'Bystander Effect & Diffusion of Responsibility (Darley & Latané, 1968 / Piliavin, 1969)',
      sections: {
        intro: `• Topic: How psychological theory is applied in Clinical and Social fields to help people
• Field 1 (Clinical): Workload control theory to manage and treat chronic stress disorder
• Field 2 (Social): Bystander Effect and Diffusion of Responsibility to structure emergency helping interventions`,
        clinical_desc: `• Clinical Psychology: Assesses, diagnoses, prevents, and treats mental health disorders (improves individual well-being)
• Focuses on client-psychologist therapeutic relationship, cognitive restructuring, and environmental adjustments`,
        clinical_explain: `• Theory: Lack of job control + high demands = chronic stress (Karasek model)
• Why useful: Identifies environmental triggers of stress rather than blaming individual weakness
• Practice application: Psychologists help clients design time-management schedules, set boundaries with employers, and regain perceived control`,
        clinical_evidence: `• Study: Johansson et al. (1978) Swedish sawmill workers
• High-risk group (sawyers/finishers): Machine-paced, repetitive, isolated, zero control over speed -> High adrenaline, 2x illness rate
• Low-risk group (maintenance): High autonomy -> Lower physiological stress
• Supports theory: Directly proves that low control causes neuroendocrine stress response`,
        clinical_eval: `• Strengths: High ecological validity (real workplace); clear actionable workplace/personal interventions
• Weaknesses/Limitations: Reductionist (ignores holistic health, personality Type A, genetics)
• Comparison: Sir Mason Durie's Te Whare Tapa Whā (1994) - Health requires balance across all 4 walls (Taha Tinana, Taha Hinengaro, Taha Wairua, Taha Whānau), not just cognitive control
• Justification: Still used because perceived autonomy remains a core pillar of Cognitive Behavioural Therapy (CBT)`,
        clinical_future: `• Implications: Empowers workers; shifts legal responsibility onto corporations/schools to avoid toxic over-pacing
• Looking Ahead (Excellence): Future clinical practice will integrate real-time biofeedback wearable sensors with holistic Māori healthcare frameworks (Bio-Psycho-Social-Cultural model)`,
        social_desc: `• Social Psychology: Examines how presence of others influences thoughts, emotions, and prosocial helping behaviours`,
        social_explain: `• Theory: Bystander Effect - Increased number of bystanders decreases individual likelihood and speed of helping
• Mechanisms: Diffusion of Responsibility (someone else will do it) + Pluralistic Ignorance (no one is reacting, so it must not be serious)
• Practice application: First aid and public emergency training (instructing leaders to single out specific helpers: "You in the blue cap, call 111!")`,
        social_evidence: `• Study: Darley & Latané (1968) Intercom seizure experiment
• Alone: 85% helped in 52 seconds
• 3-person group: 62% helped in 93 seconds
• 6-person group: Only 31% helped in 166 seconds
• Supports theory: Shows unambiguous statistical decline in prosocial response as group size increases`,
        social_eval: `• Strengths: High internal laboratory control; measurable latency; robust replication
• Weaknesses/Limitations: Low ecological validity (intercom audio, no visual cues); ethical issues (deception, distress)
• Counter-evidence: Piliavin et al. (1969) Subway study showed in real-world high-stakes emergencies with physical proximity (Cost-Reward model), 93% received immediate spontaneous help`,
        social_future: `• Implications: Eliminates bystander apathy in community policing, anti-bullying programs, and public transport design
• Looking Ahead (Excellence): Future evolution must address "Digital Bystander Effect" on social media / cyberbullying (anonymity + infinite virtual bystanders require algorithmic reporting prompts)`,
        conclusion: `• Both fields successfully use empirical theories to enhance human well-being
• Clinical empowers individual agency and stress resilience
• Social designs structural protocols to overcome human cognitive biases in emergency situations`,
        references: `• Darley, J. M., & Latané, B. (1968). Bystander intervention in emergencies. JPSP, 8(4), 377–383.
• Durie, M. (1994). Whaiora: Māori health development. Oxford University Press.
• Johansson, G., et al. (1978). Neuroendocrine stress reactions in highly mechanised work. Ergonomics, 21(8), 583–599.
• Piliavin, I. M., et al. (1969). Good samaritanism: An underground phenomenon? JPSP, 13(4), 289–299.`
      }
    };
  }

  loadSavedData() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not load from localStorage', e);
    }
    return this.getDefaultData();
  }

  saveData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }

  updateField(key, value) {
    this.data.sections[key] = value;
    this.saveData();
  }

  resetToTemplate() {
    this.data = this.getDefaultData();
    this.saveData();
  }

  // Validates if text follows bullet points constraint (preventing whole prose paragraphs for Exam.net compliance)
  validateBulletCompliance(text) {
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    const nonBulletLines = lines.filter(l => !l.trim().startsWith('•') && !l.trim().startsWith('-') && !l.trim().startsWith('*'));
    return {
      isCompliant: nonBulletLines.length === 0,
      totalBullets: lines.length,
      warning: nonBulletLines.length > 0 ? `⚠️ ${nonBulletLines.length}行が箇条書き記号（•）で始まっていません。AI生成疑いを防ぐため、各行の先頭に「•」をつけてください。` : '✅ 箇条書きルール準拠 (Exam.net OK)'
    };
  }

  exportPlainText() {
    const d = this.data;
    const s = d.sections;
    return `=====================================================
LONG BAY COLLEGE - AS 91847 PSYCHOLOGY A3 PLANNING SHEET
Topic: Helping Behaviours (Clinical & Social Practice)
Student Name: ${d.studentName || '[Student Name]'}
Disorder: ${d.disorderChoice}
=====================================================

1. INTRODUCTION
${s.intro}

2. FIELD 1: CLINICAL PSYCHOLOGY
[Describe Field]
${s.clinical_desc}

[Explain Theory & Practice]
${s.clinical_explain}

[Support with Evidence: Johansson et al. (1978)]
${s.clinical_evidence}

[Evaluate Theory: Strengths, Weaknesses, Te Whare Tapa Whā]
${s.clinical_eval}

[Looking Ahead: Future Evolution & Technology (Excellence)]
${s.clinical_future}

3. FIELD 2: SOCIAL PSYCHOLOGY
[Describe Field]
${s.social_desc}

[Explain Theory & Practice: Bystander Effect & Diffusion of Responsibility]
${s.social_explain}

[Support with Evidence: Darley & Latané (1968)]
${s.social_evidence}

[Evaluate Theory: Piliavin (1969) & Cost-Reward Model]
${s.social_eval}

[Looking Ahead: Cyberbullying & Digital Bystander Effect (Excellence)]
${s.social_future}

4. CONCLUSION
${s.conclusion}

5. REFERENCE LIST (APA 7th)
${s.references}
=====================================================`;
  }
}

window.PlannerEngine = PlannerEngine;
