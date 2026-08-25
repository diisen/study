/**
 * NCEA Level 2 Physics (AS 91173) 2022 Formative Exam Data & Interactive Solutions
 * Full solutions with formulas, diagrams, and Excellence explanations in JP/EN.
 */

window.EXAM_2022_DATA = {
  title: "Level 2 Physics, 2022 Formative Exam (AS 91173)",
  credits: 6,
  timeAllowed: "60 minutes",
  
  questions: [
    {
      id: "q1",
      number: "QUESTION ONE",
      title: "Circuits and Lamps (回路と電球・LED)",
      parts: [
        {
          id: "q1_a",
          part: "a",
          level: "Achieved",
          diagram: "assets/physics/assessments/exam_images/image3.png",
          questionEn: "A green LED operates at its maximum brightness when it is supplied with a voltage of 2.0V and draws a maximum current of 0.03A. Show that the resistance of the LED is 67Ω.",
          questionJa: "緑色LEDは、電圧 2.0V が供給され、最大電流 0.03A が流れるときに最大輝度で動作します。このLEDの抵抗が 67Ω であることを示しなさい。",
          formula: "R = \\frac{V}{I}",
          working: "R = \\frac{2.0\\text{ V}}{0.03\\text{ A}} = 66.67\\ \\Omega \\approx 67\\ \\Omega",
          answerEn: "Resistance of LED = 66.7 Ω ≈ 67 Ω (shown)",
          answerJa: "LEDの抵抗 R = 2.0 / 0.03 = 66.67 Ω ≒ 67 Ω",
          hintJa: "オームの法則 V = IR を変形して R = V / I に数値を代入します。"
        },
        {
          id: "q1_b",
          part: "b",
          level: "Merit",
          diagram: "assets/physics/assessments/exam_images/image3.png",
          questionEn: "A 150 ohm resistor was placed in the circuit with a 12V supply to limit the current to the LED. Calculate the total circuit current and the voltages across the resistor and LED. Would this value of resistor protect the LED from damage? Explain your reasoning.",
          questionJa: "12V電源の回路でLEDへの電流を制限するため、150Ωの抵抗を直列に接続しました。回路全体の電流、および抵抗とLEDにかかる電圧を計算しなさい。この150Ωの抵抗でLEDを破損から保護できますか？理由を説明しなさい。",
          formula: "R_T = R_1 + R_2, \\quad I = \\frac{V_T}{R_T}, \\quad V = IR",
          working: "Total Resistance: R_T = 150 + 66.67 = 216.67\\ \\Omega\nCircuit Current: I = \\frac{12\\text{ V}}{216.67\\ \\Omega} = 0.0554\\text{ A} (55.4\\text{ mA})\nVoltage across 150Ω Resistor: V_R = 0.0554 \\times 150 = 8.31\\text{ V}\nVoltage across LED: V_{LED} = 12 - 8.31 = 3.69\\text{ V} (\\text{or } 0.0554 \\times 66.67 = 3.69\\text{ V})",
          answerEn: "No, this resistor will NOT protect the LED.\nThe resulting current (0.0554 A) exceeds the maximum safe current of 0.03 A, and the voltage across the LED (3.69 V) exceeds the maximum safe voltage of 2.0 V. The LED will overheat and burn out.\n(A minimum resistance of R = (12 - 2) / 0.03 = 333 Ω is required).",
          answerJa: "いいえ、保護できません。\n流れる電流（0.0554 A）は最大定格 0.03 A を超え、LEDにかかる電圧（3.69 V）も最大定格 2.0 V を大幅に超えるため、過電流・過電圧でLEDが焼き切れて破損します。\n（安全に保護するには、最低でも R = (12 - 2.0) / 0.03 = 333.3 Ω の抵抗が必要です）。",
          hintJa: "直列全体の合成抵抗から電流 I を求め、LEDの定格（2.0V, 0.03A）と比較します。"
        },
        {
          id: "q1_c",
          part: "c",
          level: "Achieved / Merit",
          diagram: "assets/physics/assessments/exam_images/image5.png",
          questionEn: "Two lamps with different resistances (25Ω and 50Ω) are connected in a series circuit with a 15V supply and a current of 0.20A. How much energy will be consumed by lamp 2 in ten minutes?",
          questionJa: "抵抗値の異なる2つの電球（25Ωと50Ω）が15V電源の直列回路に接続されており、0.20Aの電流が流れています。電球2（50Ω）が10分間に消費するエネルギーは何 J ですか？",
          formula: "P = I^2 R = VI, \\quad E = P \\times t",
          working: "Power of Lamp 2: P_2 = I^2 R_2 = (0.20\\text{ A})^2 \\times 50\\ \\Omega = 0.04 \\times 50 = 2.0\\text{ W}\nTime in seconds: t = 10\\text{ min} \\times 60\\text{ s/min} = 600\\text{ s}\nEnergy consumed: E = P \\times t = 2.0\\text{ W} \\times 600\\text{ s} = 1200\\text{ J} (1.2\\text{ kJ})",
          answerEn: "Energy consumed E = 1200 J (or 1.2 kJ)",
          answerJa: "消費エネルギー E = 1200 J（または 1.2 kJ）",
          hintJa: "時間は必ず「秒（seconds: 10分 = 600秒）」に直して E = P × t を計算します。"
        },
        {
          id: "q1_d",
          part: "d",
          level: "Excellence",
          diagram: "assets/physics/assessments/exam_images/image6.png",
          questionEn: "A third lamp (25Ω) is added in parallel with Lamp 1 (25Ω). Lamp 2 glows brighter than before whereas Lamp 1 becomes dimmer. Calculate the changes the added lamp makes to the circuit resistance and current, and explain the reasons for the changes in brightness of the lamps.",
          questionJa: "電球1（25Ω）と並列に3つ目の電球（25Ω）を追加しました。電球2は以前より明るくなり、電球1は暗くなりました。追加された電球が回路の合成抵抗と電流に与える変化を計算し、それぞれの電球の明るさが変化した理由を論理的に説明しなさい。",
          formula: "\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_3}, \\quad R_T = R_p + R_2, \\quad I_{total} = \\frac{V_T}{R_T}, \\quad P = I^2 R = VI",
          working: "1. Parallel branch resistance: 1/R_p = 1/25 + 1/25 = 2/25 => R_p = 12.5 Ω\n2. New total resistance: R_T = 12.5 + 50 = 62.5 Ω (decreased from 75 Ω)\n3. New total current: I_total = 15V / 62.5 Ω = 0.24 A (increased from 0.20 A)\n4. Lamp 2 (50Ω): Receives full 0.24 A. Voltage V_2 = 0.24 * 50 = 12 V. Power P_2 = (0.24)^2 * 50 = 2.88 W (increased from 2.0 W => glows brighter).\n5. Lamp 1 (25Ω): Voltage across parallel branch V_p = 15 - 12 = 3 V (decreased from 5 V). Current splits equally: I_1 = 0.24 / 2 = 0.12 A. Power P_1 = (0.12)^2 * 25 = 0.36 W (decreased from 1.0 W => becomes dimmer).",
          answerEn: "Excellence Explanation:\n• Adding Lamp 3 in parallel reduces the parallel branch resistance from 25Ω to 12.5Ω, decreasing total circuit resistance from 75Ω to 62.5Ω.\n• Since total resistance decreased with constant voltage (15V), total current increases from 0.20A to 0.24A.\n• Lamp 2 receives the full increased current (0.24A), so its power output increases from 2.0W to 2.88W, making it GLOW BRIGHTER.\n• The increased current causes a greater voltage drop across Lamp 2 (12V vs 10V), leaving only 3V across the parallel branch (down from 5V). Consequently, current through Lamp 1 drops to 0.12A and its power drops to 0.36W, making Lamp 1 BECOME DIMMER.",
          answerJa: "【Excellence 模範論述】\n1. 並列電球3の追加により、並列部の合成抵抗が 25Ω から 12.5Ω に半減し、回路全体の合成抵抗は 75Ω から 62.5Ω に減少します。\n2. 電源電圧（15V）が一定のもとで全体抵抗が減少するため、回路全体を流れる電流は 0.20A から 0.24A に増加します。\n3. 【電球2】：全体電流（0.24A）がそのまま流れるため、電圧降下が 10V から 12V に増え、消費電力が 2.0W から 2.88W に増加するため【より明るく点灯】します。\n4. 【電球1】：電球2の電圧降下が増えたため、並列部にかかる電圧は 5V から 3V に低下します。電流も 2つの電球に分流して 0.12A（元は0.20A）に減るため、消費電力は 1.0W から 0.36W に減少し【より暗く点灯】します。",
          hintJa: "Excellence を取るには、合成抵抗 ➔ 全体電流 ➔ 各電球の電圧・電流・電力（P = I²R）の変化を数値計算とともに論述します。"
        }
      ]
    },
    {
      id: "q2",
      number: "QUESTION TWO",
      title: "Electrostatic Fields & Millikan's Oil Drop (静電場とミリカン油滴実験)",
      parts: [
        {
          id: "q2_a",
          part: "a",
          level: "Achieved",
          diagram: "assets/physics/assessments/exam_images/image7.png",
          questionEn: "Draw lines on the diagram to show the direction of the electric field between the plates.",
          questionJa: "極板間の電場（電界）の向きを示す電気力線を作図しなさい。",
          formula: "\\text{Electric field points from } +V \\text{ to } 0\\text{ V}",
          working: "Uniform downward parallel lines with evenly spaced downward arrows from the top positive plate (+V) to the bottom plate (0V).",
          answerEn: "Uniform, parallel, evenly spaced lines pointing STRAIGHT DOWN from the +V plate to the 0V plate.",
          answerJa: "上の正極板（+V）から下の極板（0V）へ向かう、等間隔で均一な【下向きの平行矢印】を描く。",
          hintJa: "電場の向きは「正電荷が受ける力の向き（+から-へ）」です。"
        },
        {
          id: "q2_b",
          part: "b",
          level: "Merit",
          diagram: "assets/physics/assessments/exam_images/image7.png",
          questionEn: "The two plates are 0.022m apart. An oil drop with a mass of 1.5 x 10^-15 kg is held in a stationary position suspended between the plates. Describe two conditions needed to keep the oil drop suspended between the plates.",
          questionJa: "2枚の極板間隔は 0.022m です。質量 1.5 × 10^-15 kg の油滴が極板間で静止して浮遊しています。油滴が空中で静止し続けるために必要な 2つの条件を記述しなさい。",
          formula: "F_{net} = 0 \\iff F_e = F_g, \\quad F_g = mg \\downarrow, \\quad F_e = Eq \\uparrow",
          working: "1. Upward electric force must equal downward gravitational force in magnitude: F_e = F_g\n2. The charge on the oil drop must be NEGATIVE so that it is attracted upwards to the positive (+V) plate.",
          answerEn: "Two required conditions:\n1. The magnitude of the upward electrostatic force must be exactly equal to the downward gravitational force (Fe = Fg, net force = 0).\n2. The oil drop must have a NEGATIVE charge so that the electric force acts upwards towards the positive (+V) top plate.",
          answerJa: "【必要な2つの条件】\n1. 上向きの静電気力（Fe = Eq）の大きさが、下向きの重力（Fg = mg）の大きさと等しいこと（合力 Fnet = 0）。\n2. 油滴が【負の電荷（マイナス）】を帯びていること（上側の正極板 +V に引きつけられて上向きの力を受けるため）。",
          hintJa: "浮遊（静止）するには「力のつり合い（合力ゼロ）」と「力の向き（負電荷であること）」が必要です。"
        },
        {
          id: "q2_c",
          part: "c",
          level: "Merit / Excellence",
          diagram: "assets/physics/assessments/exam_images/image7.png",
          questionEn: "To keep the drop suspended the voltage on the plates is set at exactly 101V. Calculate the total charge on the drop and find number of fundamental particle charges (electrons) this represents. (Use g = 9.8 N/kg, e = 1.60 x 10^-19 C).",
          questionJa: "油滴を静止させるため、極板間電圧は正確に 101V に設定されました。油滴の総電荷量を計算し、これが素電荷（電子）何個分に相当するかを求めなさい。（g = 9.8 N/kg, e = 1.60 × 10^-19 C を使用）。",
          formula: "F_g = mg, \\quad E = \\frac{V}{d}, \\quad F_e = Eq = F_g \\implies q = \\frac{mgd}{V}, \\quad n = \\frac{q}{e}",
          working: "1. Gravitational Force: F_g = (1.5 \\times 10^{-15}\\text{ kg}) \\times 9.8\\text{ N/kg} = 1.47 \\times 10^{-14}\\text{ N}\n2. Electric Field Strength: E = \\frac{101\\text{ V}}{0.022\\text{ m}} = 4590.91\\text{ V/m}\n3. Charge on Drop: q = \\frac{F_g}{E} = \\frac{1.47 \\times 10^{-14}\\text{ N}}{4590.91\\text{ V/m}} = 3.202 \\times 10^{-18}\\text{ C}\n4. Number of Electrons: n = \\frac{3.202 \\times 10^{-18}\\text{ C}}{1.60 \\times 10^{-19}\\text{ C}} = 20.01 \\approx 20\\text{ electrons}",
          answerEn: "Total charge on drop q = 3.20 × 10^-18 C\nNumber of fundamental charges n = 20 electrons",
          answerJa: "総電荷量 q = 3.20 × 10^-18 C\n電子の個数 n = 20 個",
          hintJa: "重力 Fg = mg を求めてから、電場 E = V/d を使って q = Fg/E を導出します。"
        },
        {
          id: "q2_d",
          part: "d",
          level: "Merit",
          diagram: "assets/physics/assessments/exam_images/image7.png",
          questionEn: "Describe what would happen to this oil drop if the voltage between the plates decreased to 100V. Give reasons for your answer. No calculations are required.",
          questionJa: "極板間の電圧が 100V に減少した場合、この油滴に何が起こるか記述しなさい。理由も述べなさい。（計算は不要です）",
          formula: "E = \\frac{V}{d} \\downarrow \\implies F_e = Eq \\downarrow, \\quad F_g \\text{ is constant} \\implies F_{net} = F_g - F_e > 0 \\downarrow",
          working: "When V decreases, E = V/d decreases, reducing upward Fe = Eq. Since downward Fg remains unchanged, Fe < Fg, producing a net downward force. The drop accelerates downwards.",
          answerEn: "The oil drop will accelerate downwards.\nReason: When voltage decreases, the electric field strength (E = V/d) decreases, which reduces the upward electrostatic force (Fe = Eq). Since the downward gravitational force (Fg) remains constant, Fe < Fg, creating an unbalanced net force downwards, causing the drop to accelerate downwards towards the bottom plate.",
          answerJa: "油滴は【下向きに加速しながら落下】します。\n【理由】：電圧が低下すると電場強度（E = V/d）が弱まり、上向きの静電気力（Fe = Eq）が減少します。下向きの重力（Fg）は変わらないため、下向きの合力（不均衡な力）が生じ、ニュートンの第2法則（F = ma）に従って油滴は下向きに加速します。",
          hintJa: "E = V/d が小さくなると上向きの力 Fe が弱くなり、重力 Fg が勝つため下向きに加速します。"
        }
      ]
    },
    {
      id: "q3",
      number: "QUESTION THREE",
      title: "Magnetism, Induction & Lorentz Force (磁気・誘導起電力・ローレンツ力)",
      parts: [
        {
          id: "q3_a",
          part: "a",
          level: "Merit",
          diagram: "assets/physics/assessments/exam_images/image8.png",
          questionEn: "A metal toy car is placed in a strong magnetic field (0.25T, into the page) and connected in a circuit. When the switch is pressed, a current of 0.80A flows and a force of 6.0 x 10^-3 N acts on the car, accelerating it away from the magnet. Mark the direction of the force and calculate the distance across the width of the car.",
          questionJa: "金属製のミニカーが強い磁場（0.25T、紙面奥向き）の中に置かれ、回路に接続されています。スイッチを押すと 0.80A の電流が流れ、6.0 × 10^-3 N の力が車に働いて加速しました。力の向きを図示し、車の幅（導線の長さ L）を計算しなさい。",
          formula: "F = BIL \\implies L = \\frac{F}{BI}",
          working: "1. Direction of Force: Current flows upwards across the car axle, Magnetic field is INTO the page (X). By Right-Hand Slap Rule (Thumb up, Fingers into page), Palm pushes to the RIGHT (Forward).\n2. Width of car: L = \\frac{F}{BI} = \\frac{6.0 \\times 10^{-3}\\text{ N}}{0.25\\text{ T} \\times 0.80\\text{ A}} = \\frac{6.0 \\times 10^{-3}}{0.20} = 0.030\\text{ m} = 3.0\\text{ cm}",
          answerEn: "Direction of Force: To the RIGHT (away from the magnet)\nWidth of the car L = 0.030 m (3.0 cm)",
          answerJa: "力の向き: 【右向き（前進方向）】\n車の幅 L = 0.030 m（3.0 cm）",
          hintJa: "右手の法則（またはフレミング左手の法則）で力の向きを求め、F = BIL を L について解きます。"
        },
        {
          id: "q3_b",
          part: "b",
          level: "Achieved",
          diagram: "assets/physics/assessments/exam_images/image10.png",
          questionEn: "An A380 airliner with a wingspan of 80m flies close to one of the Earth's magnetic poles (B = 6.0 x 10^-5 T, into page) at a speed of 260 ms^-1. Calculate the voltage induced across the wingtips.",
          questionJa: "翼長 80m の A380 旅客機が、地球の磁極付近（磁場 6.0 × 10^-5 T、紙面奥向き）を 260 m/s の速度で飛行しています。翼端間に誘導される電圧（誘導起電力）を計算しなさい。",
          formula: "V = BvL",
          working: "V = (6.0 \\times 10^{-5}\\text{ T}) \\times 260\\text{ ms}^{-1} \\times 80\\text{ m} = 1.248\\text{ V} \\approx 1.25\\text{ V}",
          answerEn: "Induced Voltage V = 1.25 V (1.248 V)",
          answerJa: "誘導起電力 V = 1.248 V ≒ 1.25 V",
          hintJa: "導体が磁場を横切るときに発生する電圧の公式 V = BvL に代入します。"
        },
        {
          id: "q3_c",
          part: "c",
          level: "Merit / Excellence",
          diagram: "assets/physics/assessments/exam_images/image11.png",
          questionEn: "Explain why a voltage is induced across the wings and mark the diagram below to show what charge is induced on each wing tip.",
          questionJa: "なぜ翼の両端に電圧が誘導されるのか理由を説明し、各翼端にどのような電荷が誘導されるかを図示しなさい。",
          formula: "F = Bqv \\quad (\\text{Magnetic force on free electrons})",
          working: "As the metal plane moves right at speed v through magnetic field B (into page), free conduction electrons (charge -e) experience a magnetic Lorentz force.\nUsing the Right Hand Slap rule for positive charge gives force pointing UP, so NEGATIVE electrons experience force DOWNWARDS towards the starboard (bottom) wingtip.\nElectrons accumulate at the bottom wingtip (Negative -), leaving a deficit of electrons at the top wingtip (Positive +), creating a potential difference (voltage).",
          answerEn: "Why voltage is induced:\n• As the aircraft moves through the perpendicular magnetic field, free electrons in the metal wings experience a magnetic force (F = Bqv).\n• By the right-hand rule, positive charges would be pushed upwards, meaning negative electrons are pushed DOWNWARDS towards the lower (right/starboard) wingtip.\n• This accumulation of electrons makes the LOWER WINGTIP NEGATIVE (-), and the UPPER WINGTIP POSITIVE (+), creating a potential difference (voltage) across the wings.",
          answerJa: "【電圧が誘導される理由】\n1. 金属製の翼が磁場を横切って運動すると、翼内部の自由電子（負電荷）がローレンツ力（F = Bqv）を受けます。\n2. 右手の法則より、正電荷なら上向きに力を受けますが、電子は負電荷であるため【下側の翼端（右翼側）】に向かって押し出されます。\n3. この結果、下側翼端に電子が蓄積して【負（-）】に帯電し、上側翼端は電子不足により【正（+）】に帯電します。この電荷の偏りによって翼端間に電位差（電圧）が生じます。",
          hintJa: "金属内の自由電子が受けるローレンツ力（F = Bqv）の向きを考えます。電子（マイナス）は正電荷と逆向きに移動します。"
        },
        {
          id: "q3_d",
          part: "d",
          level: "Excellence",
          diagram: "assets/physics/assessments/exam_images/image12.png",
          questionEn: "A particle travelling at 2.5 x 10^7 ms^-1 with a charge of 4.8 x 10^-19 C moves through the Earth's magnetic field (6.0 x 10^-5 T, into page) following an upward curved path. Does the particle have a positive or negative charge? Calculate the force on the charge and explain why the path is curved.",
          questionJa: "速度 2.5 × 10^7 m/s、電荷量 4.8 × 10^-19 C の粒子が地磁気（6.0 × 10^-5 T、紙面奥向き）の中を進み、上向きに曲がる軌道を描きました。この粒子は正負どちらの電荷ですか？粒子に働く力を計算し、なぜ軌道が曲線になるのか理由を説明しなさい。",
          formula: "F = Bqv, \\quad F \\perp v \\implies \\text{Centripetal force}",
          working: "1. Charge Sign: Velocity is to the right, Magnetic field is into the page. The particle curves UPWARDS, meaning the magnetic force is directed UPWARDS (towards palm). Since the force matches the palm direction for the right-hand rule, the particle must be POSITIVELY CHARGED (+ve).\n2. Force Calculation: F = Bqv = (6.0 \\times 10^{-5}\\text{ T}) \\times (4.8 \\times 10^{-19}\\text{ C}) \\times (2.5 \\times 10^7\\text{ ms}^{-1}) = 7.2 \\times 10^{-16}\\text{ N}\n3. Why path is curved: The magnetic Lorentz force is always PERPENDICULAR to the instantaneous velocity vector (F ⊥ v). It does no work and does not change particle speed, but acts as a constant CENTRIPETAL FORCE, continuously changing the direction of velocity and forcing the particle into a circular curved path.",
          answerEn: "Excellence Response:\n1. Charge: POSITIVE (+ve)\n2. Force on charge: F = Bqv = 7.2 × 10^-16 N\n3. Reason for curved path:\n• The magnetic force F is always perpendicular (at 90°) to the particle's instantaneous velocity v (F ⊥ v).\n• Because the force is perpendicular, it does no work (speed remains constant) but acts as a CENTRIPETAL FORCE, continuously deflecting the direction of motion towards the center of curvature, creating a CIRCULAR CURVED PATH.",
          answerJa: "【Excellence 模範解答】\n1. 電荷の正負: 【正の電荷（Positive / +ve）】\n（速度が右向き・磁場が奥向きのとき上向きに曲がるため、右手の平の向きと一致）\n2. 粒子に働く力: F = Bqv = (6.0 × 10^-5) × (4.8 × 10^-19) × (2.5 × 10^7) = 7.2 × 10^-16 N\n3. 軌道が曲線になる理由:\n• ローレンツ力 F は常に粒子の進行方向（速度 v）に対して【垂直（perpendicular / 90°）】に働きます。\n• 垂直な力は仕事をしないため粒子の速さは変化しませんが、常に軌道の中心に向かう【向心力（Centripetal force）】として作用し、運動の向きだけを曲げ続けるため【円弧状の曲線軌道（Circular curved path）】を描きます。",
          hintJa: "正負判定（右手の法則）、力 F = Bqv の計算、そして「F が v に常に垂直 ➔ 向心力として働き円軌道になる」の3点を漏れなく記述します。"
        }
      ]
    }
  ]
};
