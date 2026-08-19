/**
 * Formula Magic Triangle & Interactive Calculator Engine
 * Handles dynamic formula rearrangement, step-by-step working, and live recalculations.
 */

class FormulaEngine {
  constructor() {
    this.currentFormulaId = 'v_eq_de_q';
    this.targetVariable = 'deltaE'; // default target
    
    // Formula definitions
    this.formulas = {
      'v_eq_de_q': {
        id: 'v_eq_de_q',
        name: 'Voltage & Energy Definition',
        nameJa: '電圧とエネルギーの定義公式',
        triangle: {
          top: { key: 'deltaE', label: 'ΔE', fullLabel: 'Energy (ΔE)', unit: 'J', min: 1, max: 200, default: 24, step: 1 },
          bottomLeft: { key: 'v', label: 'V', fullLabel: 'Voltage (V)', unit: 'V', min: 1, max: 50, default: 12, step: 1 },
          bottomRight: { key: 'q', label: 'q', fullLabel: 'Charge (q)', unit: 'C', min: 0.1, max: 20, default: 2, step: 0.1 }
        },
        solve: {
          deltaE: {
            eqLatex: '\\Delta E = V \\times q',
            eqText: 'ΔE = V × q',
            calc: (vals) => vals.v * vals.q,
            unit: 'J (Joules)',
            stepsJa: (vals, res) => `位置エネルギー変化量 \\(\\Delta E\\) = 電圧 \\(V\\) × 電荷 \\(q\\)\n= ${vals.v} V × ${vals.q} C = **${res.toFixed(2)} J**`,
            stepsEn: (vals, res) => `Change in Energy \\(\\Delta E\\) = Voltage \\(V\\) × Charge \\(q\\)\n= ${vals.v} V × ${vals.q} C = **${res.toFixed(2)} J**`
          },
          v: {
            eqLatex: 'V = \\frac{\\Delta E}{q}',
            eqText: 'V = ΔE / q',
            calc: (vals) => vals.q > 0 ? vals.deltaE / vals.q : 0,
            unit: 'V (Volts = J/C)',
            stepsJa: (vals, res) => `電圧 \\(V\\) = エネルギー \\(\\Delta E\\) ÷ 電荷 \\(q\\)\n= ${vals.deltaE} J ÷ ${vals.q} C = **${res.toFixed(2)} V**`,
            stepsEn: (vals, res) => `Voltage \\(V\\) = Energy \\(\\Delta E\\) ÷ Charge \\(q\\)\n= ${vals.deltaE} J ÷ ${vals.q} C = **${res.toFixed(2)} V**`
          },
          q: {
            eqLatex: 'q = \\frac{\\Delta E}{V}',
            eqText: 'q = ΔE / V',
            calc: (vals) => vals.v > 0 ? vals.deltaE / vals.v : 0,
            unit: 'C (Coulombs)',
            stepsJa: (vals, res) => `電荷量 \\(q\\) = エネルギー \\(\\Delta E\\) ÷ 電圧 \\(V\\)\n= ${vals.deltaE} J ÷ ${vals.v} V = **${res.toFixed(2)} C**`,
            stepsEn: (vals, res) => `Charge \\(q\\) = Energy \\(\\Delta E\\) ÷ Voltage \\(V\\)\n= ${vals.deltaE} J ÷ ${vals.v} V = **${res.toFixed(2)} C**`
          }
        }
      },
      'i_eq_q_t': {
        id: 'i_eq_q_t',
        name: 'Current & Rate of Flow of Charge',
        nameJa: '電流と電荷の流量公式',
        triangle: {
          top: { key: 'q', label: 'q', fullLabel: 'Charge (q)', unit: 'C', min: 1, max: 1000, default: 240, step: 10 },
          bottomLeft: { key: 'i', label: 'I', fullLabel: 'Current (I)', unit: 'A', min: 0.1, max: 20, default: 4, step: 0.1 },
          bottomRight: { key: 't', label: 't', fullLabel: 'Time (t)', unit: 's', min: 1, max: 3600, default: 60, step: 5 }
        },
        solve: {
          q: {
            eqLatex: 'q = I \\times t',
            eqText: 'q = I × t',
            calc: (vals) => vals.i * vals.t,
            unit: 'C (Coulombs)',
            stepsJa: (vals, res) => `通過した電荷量 \\(q\\) = 電流 \\(I\\) × 時間 \\(t\\)\n= ${vals.i} A × ${vals.t} s = **${res.toFixed(1)} C**`,
            stepsEn: (vals, res) => `Charge \\(q\\) = Current \\(I\\) × Time \\(t\\)\n= ${vals.i} A × ${vals.t} s = **${res.toFixed(1)} C**`
          },
          i: {
            eqLatex: 'I = \\frac{q}{t}',
            eqText: 'I = q / t',
            calc: (vals) => vals.t > 0 ? vals.q / vals.t : 0,
            unit: 'A (Amperes = C/s)',
            stepsJa: (vals, res) => `電流 \\(I\\) = 電荷量 \\(q\\) ÷ 時間 \\(t\\)\n= ${vals.q} C ÷ ${vals.t} s = **${res.toFixed(2)} A**`,
            stepsEn: (vals, res) => `Current \\(I\\) = Charge \\(q\\) ÷ Time \\(t\\)\n= ${vals.q} C ÷ ${vals.t} s = **${res.toFixed(2)} A**`
          },
          t: {
            eqLatex: 't = \\frac{q}{I}',
            eqText: 't = q / I',
            calc: (vals) => vals.i > 0 ? vals.q / vals.i : 0,
            unit: 's (Seconds)',
            stepsJa: (vals, res) => `所要時間 \\(t\\) = 電荷量 \\(q\\) ÷ 電流 \\(I\\)\n= ${vals.q} C ÷ ${vals.i} A = **${res.toFixed(2)} s** (${(res/60).toFixed(2)} min)`,
            stepsEn: (vals, res) => `Time \\(t\\) = Charge \\(q\\) ÷ Current \\(I\\)\n= ${vals.q} C ÷ ${vals.i} A = **${res.toFixed(2)} s** (${(res/60).toFixed(2)} min)`
          }
        }
      },
      'v_eq_ir': {
        id: 'v_eq_ir',
        name: "Ohm's Law",
        nameJa: "オームの法則",
        triangle: {
          top: { key: 'v', label: 'V', fullLabel: 'Voltage (V)', unit: 'V', min: 1, max: 100, default: 24, step: 1 },
          bottomLeft: { key: 'i', label: 'I', fullLabel: 'Current (I)', unit: 'A', min: 0.1, max: 20, default: 3, step: 0.1 },
          bottomRight: { key: 'r', label: 'R', fullLabel: 'Resistance (R)', unit: 'Ω', min: 0.5, max: 50, default: 8, step: 0.5 }
        },
        solve: {
          v: {
            eqLatex: 'V = I \\times R',
            eqText: 'V = I × R',
            calc: (vals) => vals.i * vals.r,
            unit: 'V (Volts)',
            stepsJa: (vals, res) => `電圧 \\(V\\) = 電流 \\(I\\) × 抵抗 \\(R\\)\n= ${vals.i} A × ${vals.r} Ω = **${res.toFixed(2)} V**`,
            stepsEn: (vals, res) => `Voltage \\(V\\) = Current \\(I\\) × Resistance \\(R\\)\n= ${vals.i} A × ${vals.r} Ω = **${res.toFixed(2)} V**`
          },
          i: {
            eqLatex: 'I = \\frac{V}{R}',
            eqText: 'I = V / R',
            calc: (vals) => vals.r > 0 ? vals.v / vals.r : 0,
            unit: 'A (Amperes)',
            stepsJa: (vals, res) => `電流 \\(I\\) = 電圧 \\(V\\) ÷ 抵抗 \\(R\\)\n= ${vals.v} V ÷ ${vals.r} Ω = **${res.toFixed(2)} A**`,
            stepsEn: (vals, res) => `Current \\(I\\) = Voltage \\(V\\) ÷ Resistance \\(R\\)\n= ${vals.v} V ÷ ${vals.r} Ω = **${res.toFixed(2)} A**`
          },
          r: {
            eqLatex: 'R = \\frac{V}{I}',
            eqText: 'R = V / I',
            calc: (vals) => vals.i > 0 ? vals.v / vals.i : 0,
            unit: 'Ω (Ohms)',
            stepsJa: (vals, res) => `抵抗 \\(R\\) = 電圧 \\(V\\) ÷ 電流 \\(I\\)\n= ${vals.v} V ÷ ${vals.i} A = **${res.toFixed(2)} Ω**`,
            stepsEn: (vals, res) => `Resistance \\(R\\) = Voltage \\(V\\) ÷ Current \\(I\\)\n= ${vals.v} V ÷ ${vals.i} A = **${res.toFixed(2)} Ω**`
          }
        }
      },
      'f_eq_bqv': {
        id: 'f_eq_bqv',
        name: 'Lorentz Force on Charged Particles',
        nameJa: '荷電粒子に働くローレンツ力',
        triangle: {
          top: { key: 'f_lor', label: 'F', fullLabel: 'Force (F)', unit: 'N', min: 0.1, max: 20, default: 3.2, step: 0.1 },
          bottomLeft: { key: 'b_mag', label: 'B', fullLabel: 'Magnetic Field (B)', unit: 'T', min: 0.1, max: 10, default: 0.60, step: 0.05 },
          bottomRight: { key: 'qv_prod', label: 'q × v', fullLabel: 'q × v Product', unit: 'C·m/s', min: 1, max: 2000, default: 250, step: 10 }
        },
        solve: {
          f_lor: {
            eqLatex: 'F = B \\times q \\times v',
            eqText: 'F = B × q × v',
            calc: (vals) => vals.b_mag * (vals.q_lor || 1.6e-19) * (vals.v_vel || 250),
            unit: 'N (Newtons)',
            stepsJa: (vals, res) => `ローレンツ力 \\(F\\) = 磁場 \\(B\\) × 電荷 \\(q\\) × 速度 \\(v\\)\n= ${vals.b_mag} T × (${(vals.q_lor || 1.6e-19).toExponential(2)} C) × ${vals.v_vel || 250} m/s\n= **${res.toExponential(3)} N**`,
            stepsEn: (vals, res) => `Lorentz Force \\(F\\) = Magnetic Field \\(B\\) × Charge \\(q\\) × Velocity \\(v\\)\n= ${vals.b_mag} T × (${(vals.q_lor || 1.6e-19).toExponential(2)} C) × ${vals.v_vel || 250} m/s\n= **${res.toExponential(3)} N**`
          },
          b_mag: {
            eqLatex: 'B = \\frac{F}{q \\times v}',
            eqText: 'B = F / (q × v)',
            calc: (vals) => ((vals.q_lor || 1.6e-19) * (vals.v_vel || 250)) > 0 ? (vals.f_lor || 3.2) / ((vals.q_lor || 1.6e-19) * (vals.v_vel || 250)) : 0,
            unit: 'T (Tesla)',
            stepsJa: (vals, res) => `磁場 \\(B\\) = 力 \\(F\\) ÷ (電荷 \\(q\\) × 速度 \\(v\\))\n= **${res.toFixed(2)} T**`,
            stepsEn: (vals, res) => `Magnetic Field \\(B\\) = Force \\(F\\) ÷ (Charge \\(q\\) × Velocity \\(v\\))\n= **${res.toFixed(2)} T**`
          },
          qv_prod: {
            eqLatex: 'q = \\frac{F}{B \\times v}',
            eqText: 'q = F / (B × v)',
            calc: (vals) => (vals.b_mag * (vals.v_vel || 200)) > 0 ? (vals.f_lor || 3.2) / (vals.b_mag * (vals.v_vel || 200)) : 0,
            unit: 'C (Coulombs)',
            stepsJa: (vals, res) => `電荷 \\(q\\) = 力 \\(F\\) ÷ (磁場 \\(B\\) × 速度 \\(v\\)) [SciPad p.318 Q3]\n= ${vals.f_lor || 3.2} N ÷ (${vals.b_mag} T × ${vals.v_vel || 200} m/s)\n= **${res.toExponential(2)} C** (${(res * 1000).toFixed(1)} mC)`,
            stepsEn: (vals, res) => `Charge \\(q\\) = Force \\(F\\) ÷ (B × v) [SciPad p.318 Q3]\n= ${vals.f_lor || 3.2} N ÷ (${vals.b_mag} T × ${vals.v_vel || 200} m/s)\n= **${res.toExponential(2)} C** (${(res * 1000).toFixed(1)} mC)`
          }
        }
      }
    };

    // Current input values store
    this.values = {
      deltaE: 24,
      v: 12,
      q: 2,
      i: 4,
      t: 60,
      r: 8,
      f_lor: 3.2,
      b_mag: 0.60,
      qv_prod: 250,
      q_lor: 1.6e-19,
      v_vel: 250
    };
  }

  setFormula(formulaId) {
    if (this.formulas[formulaId]) {
      this.currentFormulaId = formulaId;
      const f = this.formulas[formulaId];
      // Default target to top variable
      this.targetVariable = f.triangle.top.key;
    }
  }

  setTargetVariable(varKey) {
    const f = this.formulas[this.currentFormulaId];
    if (f && f.solve[varKey]) {
      this.targetVariable = varKey;
    }
  }

  setValue(varKey, val) {
    this.values[varKey] = parseFloat(val);
  }

  calculate() {
    const f = this.formulas[this.currentFormulaId];
    const solver = f.solve[this.targetVariable];
    if (!solver) return null;

    const result = solver.calc(this.values);
    return {
      formulaNameJa: f.nameJa,
      formulaNameEn: f.name,
      targetKey: this.targetVariable,
      eqText: solver.eqText,
      eqLatex: solver.eqLatex,
      resultValue: result,
      unit: solver.unit,
      stepsJa: solver.stepsJa(this.values, result),
      stepsEn: solver.stepsEn(this.values, result),
      triangle: f.triangle,
      currentValues: this.values
    };
  }
}

window.FormulaEngine = FormulaEngine;
