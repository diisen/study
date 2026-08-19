/**
 * SciPad NCEA Level 2 Physics (AS 91173 / 2.6) - DC Electricity Data
 * Source: Workbook pages 266, 267, 268, 269
 */

window.SCIPAD_DATA = [
  {
    id: "page_266",
    pageNumber: 266,

    title: "Understanding Voltage (電圧の基礎理解)",
    subtitle: "Definition, Formula V = ΔE/q, and Current vs Voltage Comparison",
    theory: {
      en: "Voltage (or potential difference) is a measure of the amount of electrical energy changed (ΔE) to other forms of energy by one unit of charge (coulomb) as it moves between two positions.\n\nFormula: V = ΔE / q\n• V = Voltage (volts, V)\n• ΔE = Change in Potential Energy (joules, J)\n• q = Charge (coulombs, C)",
      ja: "電圧（電位差）とは、1単位の電荷（1クーロン）が2点間を移動するときに、他のエネルギー形態に変換される（または電池から供給される）電気エネルギーの量（ΔE）の尺度です。\n\n【重要公式】 V = ΔE / q\n• V : 電圧（単位: ボルト, V = J/C）\n• ΔE : 位置エネルギーの変化量・変換されたエネルギー（単位: ジュール, J）\n• q : 電荷量（単位: クーロン, C）"
    },
    exercises: [
      {
        id: "p266_q1_table",
        number: "1",
        titleEn: "Complete the Comparison Table: Current vs Voltage",
        titleJa: "電流（Current）と電圧（Voltage）の比較表を完成させよう",
        type: "table",
        columns: ["Property (項目)", "Current (電流)", "Voltage (電圧)"],
        rows: [
          {
            propertyEn: "Definition",
            propertyJa: "定義",
            currentEn: "The rate of flow of electric charge (electrons) around a circuit. (I = q / t)",
            currentJa: "回路を流れる電荷（電子）の移動する割合・流量 (1秒あたりに流れるクーロン数)。",
            voltageEn: "The electrical potential difference; the amount of electrical energy carried or transformed per coulomb of charge. (V = ΔE / q)",
            voltageJa: "電気的な電位差。電荷1クーロンあたりが運ぶ（または変換される）電気エネルギーの量。"
          },
          {
            propertyEn: "Symbol",
            propertyJa: "記号",
            currentEn: "I",
            currentJa: "I",
            voltageEn: "V",
            voltageJa: "V"
          },
          {
            propertyEn: "SI Unit",
            propertyJa: "SI単位",
            currentEn: "Amperes (A) [where 1 A = 1 C/s]",
            currentJa: "アンペア (A) [1 A = 1 C/s]",
            voltageEn: "Volts (V) [where 1 V = 1 J/C]",
            voltageJa: "ボルト (V) [1 V = 1 J/C]"
          },
          {
            propertyEn: "Measuring Instrument",
            propertyJa: "測定器",
            currentEn: "Ammeter",
            currentJa: "電流計 (Ammeter)",
            voltageEn: "Voltmeter",
            voltageJa: "電圧計 (Voltmeter)"
          },
          {
            propertyEn: "Measuring Instrument Connection",
            propertyJa: "測定器の接続方法",
            currentEn: "Series (in series with the component so all current flows through it)",
            currentJa: "直列 (Series) — すべての電流が測定器を通るように回路の途中に割り込ませる",
            voltageEn: "Parallel (in parallel across the component to measure the potential difference between two points)",
            voltageJa: "並列 (Parallel) — 2点間の電位差を測るために部品をまたぐように接続する"
          }
        ],
        excellenceTipJa: "【NCEA Point】なぜ電流計は直列、電圧計は並列につなぐのか？電流計は内部抵抗がほぼゼロで電流を妨げずに測るため直列に、電圧計は内部抵抗が非常に高く回路の電流を変えずに電位差を測るため並列につなぎます。"
      },
      {
        id: "p266_q2_rearrange",
        number: "2",
        titleEn: "Rearrange the formula V = ΔE / q to solve for:",
        titleJa: "公式 V = ΔE / q を変形して求めよう",
        type: "subquestions",
        sub: [
          {
            label: "(a)",
            questionEn: "Change in potential energy (ΔE):",
            questionJa: "位置エネルギーの変化量 (ΔE) を求める式:",
            answerEn: "ΔE = V × q  (or ΔE = Vq)",
            answerJa: "ΔE = V × q",
            explanationJa: "両辺に q をかけると、ΔE = V × q となります。エネルギー (J) = 電圧 (V) × 電荷 (C) です。"
          },
          {
            label: "(b)",
            questionEn: "Charge (q):",
            questionJa: "電荷 (q) を求める式:",
            answerEn: "q = ΔE / V",
            answerJa: "q = ΔE / V",
            explanationJa: "ΔE = V × q の両辺を V で割ると、q = ΔE / V となります。電荷 (C) = エネルギー (J) ÷ 電圧 (V) です。"
          }
        ]
      }
    ]
  },
  {
    id: "page_267",
    pageNumber: 267,

    title: "Investigating Voltage in Parallel and Series Circuits (直列・並列回路の電圧実験)",
    subtitle: "Circuit Rules for Voltage Behavior",
    theory: {
      en: "In a Parallel circuit, voltage across each branch is equal to the supply voltage.\nIn a Series circuit, supply voltage is shared/divided across all components in the loop.",
      ja: "並列回路では、どの枝（ブランチ）にかかる電圧も電源電圧と同じになります。\n直列回路では、電源電圧が回路内の各部品に分け合って分配されます。"
    },
    exercises: [
      {
        id: "p267_parallel_investigation",
        number: "Parallel Circuit",
        titleEn: "Investigating Voltage in a Parallel Circuit",
        titleJa: "並列回路における電圧の挙動と法則",
        circuitPreset: "p267_parallel",
        descriptionEn: "Aim: To investigate how voltage behaves in a parallel circuit.\nSetup: Power supply with V1, and 3 lamps connected in parallel with voltmeters V2, V3, V4 across each lamp.",
        descriptionJa: "【実験の目的】並列回路で電圧がどのように振る舞うかを調べる。\n【構成】電源電圧 V1 に対し、3個のランプが並列に接続され、それぞれの両端電圧 V2, V3, V4 を測定する。",
        results: {
          en: "Readings: V1 = V2 = V3 = V4 (e.g. if V1 = 12 V, then V2 = 12 V, V3 = 12 V, V4 = 12 V)",
          ja: "測定結果: V1 = V2 = V3 = V4 （例: 電源が12Vなら、どのランプもすべて12Vを示す）"
        },
        conclusionEn: "Rule for Voltage in a Parallel Circuit:\nThe voltage (potential difference) across each parallel branch is equal to the total supply voltage.\nV_total = V1 = V2 = V3 = ... = Vn",
        conclusionJa: "【並列回路における電圧の規則】\n並列回路の各分岐（ブランチ）にかかる電圧は、電源の全電圧と等しくなります。\nV_total = V1 = V2 = V3 = ... = Vn",
        excellenceTipJa: "【なぜそうなる？】並列の各経路は、電源のプラス極とマイナス極に直接つながっているため、1クーロンの電荷がどのルートを通っても、電源から得たエネルギーをその枝の部品で全て消費して戻ってくるからです。"
      },
      {
        id: "p267_series_investigation",
        number: "Series Circuit",
        titleEn: "Investigating Voltage in a Series Circuit",
        titleJa: "直列回路における電圧の挙動と法則",
        circuitPreset: "p267_series",
        descriptionEn: "Aim: To investigate how voltage behaves in a series circuit.\nSetup: Power supply with V1, and 3 lamps connected in series with voltmeters V2, V3, V4 across each lamp.",
        descriptionJa: "【実験の目的】直列回路で電圧がどのように振る舞うかを調べる。\n【構成】電源電圧 V1 に対し、3個のランプが1本のループ上に直列に接続され、それぞれの両端電圧 V2, V3, V4 を測定する。",
        results: {
          en: "Readings: V1 = V2 + V3 + V4 (e.g. if V1 = 12 V with identical lamps, V2 = 4 V, V3 = 4 V, V4 = 4 V)",
          ja: "測定結果: V1 = V2 + V3 + V4 （例: 12V電源で同じランプ3個なら、それぞれ4Vずつ分担し 4 + 4 + 4 = 12V となる）"
        },
        conclusionEn: "Rule for Voltage in a Series Circuit:\nThe sum of the voltages (potential differences) across each component in a series circuit is equal to the total supply voltage.\nV_supply = V1 + V2 + V3 + ... + Vn",
        conclusionJa: "【直列回路における電圧の規則】\n直列回路内の各部品にかかる電圧の合計は、電源の供給電圧と等しくなります。\nV_supply = V1 + V2 + V3 + ... + Vn",
        excellenceTipJa: "【エネルギー保存則】電荷が1周する間に電池から受け取る全エネルギー（V_supply）は、途中の各負荷で消費されるエネルギーの総和（V1 + V2 + V3）と必ず一致します（Kirchhoff's Voltage Law）。"
      }
    ]
  },
  {
    id: "page_268",
    pageNumber: 268,

    title: "Voltage and Current Problems: Series Circuit (直列回路の総合演習)",
    subtitle: "Circuit: 20V Supply, Resistor (5V), Lamp (V2), Resistor (7V), Current = 4A",
    circuitPreset: "p268_series",
    circuitSpecs: {
      type: "series",
      supplyVoltage: 20,
      knownCurrent: 4,
      resistor1Voltage: 5,
      resistor2Voltage: 7
    },
    exercises: [
      {
        id: "p268_q1",
        number: "1",
        questionEn: "Name the type of circuit that is shown in the circuit diagram, and describe the identifying feature of that type of circuit.",
        questionJa: "回路図に示されている回路の種類を答え、その回路の特徴（見分け方）を説明しなさい。",
        answerEn: "• Circuit Type: Series Circuit.\n• Identifying Feature: There is only one single continuous pathway/loop for the electric current (electrons) to flow through. All components are connected one after another.",
        answerJa: "• 回路の種類: 直列回路 (Series Circuit)\n• 特徴: 電流（電子）が流れる経路が枝分かれせず、ただ1つのループになっている。すべての部品が数珠つなぎに1列に接続されている。",
        keyTermsEn: ["Series Circuit", "single continuous pathway", "one loop", "unbroken path"],
        excellenceTipJa: "NCEAでは「only one single path for electrons to flow」と記述するのが確実な満点キーワードです。"
      },
      {
        id: "p268_q2",
        number: "2",
        questionEn: "Find the two unknown ammeter readings (A1 and A2). Justify your answers.",
        questionJa: "2つの未知の電流計の測定値（A1 と A2）を求めなさい。また、その理由を説明しなさい。",
        answerEn: "• Readings: A1 = 4 A,  A2 = 4 A.\n• Justification: In a series circuit, there is only one pathway for the charge to flow. Electric charge is conserved (electrons are neither created nor destroyed), so the rate of flow of charge (current) is the same at every point around the circuit.",
        answerJa: "• 測定値: A1 = 4 A, A2 = 4 A\n• 理由・根拠: 直列回路では電子が通る道が1本しかありません。電荷保存の法則により、電子は途中で消えたり増えたりしないため、回路のどの場所でも電流（単位時間あたりの電荷の流量）は同じ 4 A になります。",
        keyTermsEn: ["A1 = 4 A, A2 = 4 A", "single pathway", "conservation of charge", "current is constant/same everywhere"],
        excellenceTipJa: "「Current is the rate of flow of charge」という定義と「Conservation of charge」に言及するとExcellence評価になります。"
      },
      {
        id: "p268_q3",
        number: "3",
        questionEn: "Calculate how much charge passes through the lamp per minute.",
        questionJa: "1分間にランプを通過する電荷量（q）を計算しなさい。",
        answerEn: "• Working: \n  Formula: q = I × t\n  Given: I = 4 A,  t = 1 minute = 60 s\n  q = 4 A × 60 s = 240 C\n• Final Answer: 240 C (Coulombs)",
        answerJa: "• 計算過程:\n  公式: q = I × t\n  与えられた値: 電流 I = 4 A、 時間 t = 1分 = 60秒\n  q = 4 A × 60 s = 240 C\n• 答え: 240 C（クーロン）",
        keyTermsEn: ["q = I × t", "t = 60 s", "240 C"],
        excellenceTipJa: "時間の単位を「分 (min)」から「秒 (s)」に直す（1 min = 60 s）のがポイントです。SI単位で計算することを忘れずに！"
      },
      {
        id: "p268_q4",
        number: "4",
        questionEn: "Explain what will happen to the current passing through ammeters A1 and A2 if the lamp blows.",
        questionJa: "ランプのフィラメントが切れた（blows）場合、電流計 A1 と A2 を流れる電流はどうなるか説明しなさい。",
        answerEn: "• What happens: The current through both A1 and A2 will drop to 0 A (zero).\n• Explanation: In a series circuit, all components share a single continuous loop. If the lamp blows (filament breaks), it creates an open/broken circuit. Since there is no longer a complete conducting path for electrons to flow, no current can flow anywhere in the circuit.",
        answerJa: "• 結果: A1、A2 どちらの電流計も 0 A（ゼロ）になります。\n• 理由: 直列回路は一本道のため、電球が切れると回路が途切れて「開回路（Open circuit）」になります。電子が移動できる連続した導電経路がなくなるため、回路全体の電流が完全にストップします。",
        keyTermsEn: ["Current drops to 0 A", "open circuit / broken circuit", "no complete pathway for electrons"],
        excellenceTipJa: "「Open circuit（開回路）」および「No complete conducting path」という物理用語を使うと説得力が増します。"
      },
      {
        id: "p268_q5",
        number: "5",
        questionEn: "Calculate the voltage that the lamp is using (V2). Show your working.",
        questionJa: "ランプが使用している電圧（V2）を計算しなさい。途中式も示しなさい。",
        answerEn: "• Working:\n  Formula: V_supply = V_resistor1 + V_lamp + V_resistor2\n  20 V = 5 V + V2 + 7 V\n  20 V = 12 V + V2\n  V2 = 20 V - 12 V = 8 V\n• Final Answer: V2 = 8 V",
        answerJa: "• 途中式:\n  直列回路の電圧の和の法則: V_電源 = V_抵抗1 + V_ランプ(V2) + V_抵抗2\n  20 V = 5 V + V2 + 7 V\n  20 V = 12 V + V2\n  V2 = 20 V - 12 V = 8 V\n• 答え: V2 = 8 V",
        keyTermsEn: ["V_supply = Σ V_components", "20 = 5 + V2 + 7", "V2 = 8 V"],
        excellenceTipJa: "直列回路では「電源が供給したエネルギー（20V）＝各部品が消費したエネルギーの合計（5V + 8V + 7V）」が常に成立します。"
      },
      {
        id: "p268_q6",
        number: "6",
        questionEn: "State how much energy the battery is supplying to each coulomb of charge that is flowing around the circuit.",
        questionJa: "バッテリーは、回路を流れる1クーロンの電荷あたりに何ジュールのエネルギーを供給しているか答えなさい。",
        answerEn: "• Answer: 20 Joules (20 J per Coulomb).\n• Explanation: By definition, voltage is the amount of energy given to (or used by) each unit of charge (1 V = 1 Joule per Coulomb, V = ΔE / q). Since the battery voltage is 20 V, it supplies 20 J of electrical potential energy to every 1 C of charge that leaves it.",
        answerJa: "• 答え: 20 J（20 ジュール）\n• 解説: 電圧（V）の定義は「電荷1クーロンあたりに与えられる（または使われる）エネルギーの量（1 V = 1 J/C）」です。バッテリーの電圧が 20 V なので、1 クーロンの電荷ごとに 20 ジュールの電気エネルギーが供給されます。",
        keyTermsEn: ["20 Joules (20 J)", "1 V = 1 J per Coulomb", "V = ΔE / q"],
        excellenceTipJa: "「Voltage is Joules per Coulomb」という定義をしっかり答える問題です。1V = 1J/C という単位の成り立ちを覚えておきましょう。"
      }
    ]
  },
  {
    id: "page_269",
    pageNumber: 269,

    title: "Voltage and Current Problems: Parallel Circuit (並列回路の総合演習)",
    subtitle: "Circuit: 3 Parallel Branches (Branch 1: 2A, Branch 2: A2, Branch 3 Lamp: 24V, 5A), Supply Current = 8A",
    circuitPreset: "p269_parallel",
    circuitSpecs: {
      type: "parallel",
      supplyCurrent: 8,
      branch1Current: 2,
      branch3Voltage: 24,
      branch3Current: 5
    },
    exercises: [
      {
        id: "p269_qa",
        number: "(a)",
        questionEn: "Find the voltages, V1 and V2. Justify your answer.",
        questionJa: "電圧 V1 と V2 を求めなさい。またその理由を説明しなさい。",
        answerEn: "• Values: V1 = 24 V,  V2 = 24 V.\n• Justification: In a parallel circuit, each parallel branch is connected directly across the terminals of the power supply. Therefore, the voltage (potential difference) across every branch is identical, so V1 = V2 = 24 V.",
        answerJa: "• 値: V1 = 24 V, V2 = 24 V\n• 理由: 並列回路では、各枝（ブランチ）が電源のプラス極とマイナス極に直接並列につながっています。そのため、どの枝にかかる電圧（電位差）もすべて等しくなり、ランプの電圧（24V）と同じ 24 V になります。",
        keyTermsEn: ["V1 = 24 V, V2 = 24 V", "parallel branches receive full supply voltage", "voltage is equal across parallel branches"],
        excellenceTipJa: "「Branches are connected in parallel across the same potential difference」と記述しましょう。"
      },
      {
        id: "p269_qb",
        number: "(b)",
        questionEn: "Using the concept that V_used = V_supplied, find the voltage the power supply provides (V3). Explain your answer.",
        questionJa: "「V_used = V_supplied（消費電圧＝供給電圧）」の考え方を用いて、電源が供給する電圧（V3）を求め、説明しなさい。",
        answerEn: "• Value: V3 = 24 V.\n• Explanation: A coulomb of charge only travels through ONE of the parallel paths on its journey around the circuit. In that path, it uses 24 V (24 J/C) of energy. Since the energy supplied by the battery must equal the energy used in that complete loop (V_supplied = V_used), the power supply must provide 24 V.",
        answerJa: "• 値: V3 = 24 V\n• 説明: 1個の電荷（クーロン）は、回路を1周する間に並列に分かれたルートのうち「いずれか1本の枝」だけを通ります。その枝で 24 V（24 J/C）のエネルギーをすべて消費して戻るため、エネルギー保存（供給電圧＝消費電圧）より、電源電圧 V3 も 24 V になります。",
        keyTermsEn: ["V3 = 24 V", "each charge only travels through one branch", "V_supplied = V_used = 24 V"],
        excellenceTipJa: "直列と違って電圧を足し算しない理由（電荷は1本のブランチしか通らないこと）を明記するとExcellenceです。"
      },
      {
        id: "p269_qc",
        number: "(c)",
        questionEn: "State how much energy is used by each coulomb of charge as it passes through the lamp. Compare this to the amount of energy the power supply is providing.",
        questionJa: "ランプを通過する1クーロンの電荷が使用するエネルギー量を答えなさい。また、これを電源が供給するエネルギー量と比較しなさい。",
        answerEn: "• Energy used by lamp: 24 Joules per Coulomb (24 J/C).\n• Comparison: This is EXACTLY EQUAL to the 24 Joules of energy supplied to each coulomb by the power supply (24 J supplied = 24 J used).",
        answerJa: "• ランプで消費されるエネルギー: 1クーロンあたり 24 J（24 ジュール）\n• 電源のエネルギーとの比較: 電源が1クーロンあたりに供給する 24 J のエネルギーと「完全に等しい（同量）」です。",
        keyTermsEn: ["24 Joules (24 J)", "exactly equal to the energy supplied", "100% converted in the branch"],
        excellenceTipJa: "並列回路では1つの枝の部品で電源エネルギーの100%（24J/C）を使い切ります。"
      },
      {
        id: "p269_qd",
        number: "(d)",
        questionEn: "Describe what would happen to V1 and V2 if the lamp blew.",
        questionJa: "ランプが切れた場合、V1 と V2 の電圧はどうなるか記述しなさい。",
        answerEn: "• Answer: V1 and V2 will NOT CHANGE (they remain at 24 V).\n• Explanation: The other two branches are connected in parallel with the power supply independently. Breaking one branch does not affect the potential difference across the remaining intact branches.",
        answerJa: "• 結果: V1 と V2 の電圧は変化せず、どちらも 24 V のままです。\n• 理由: 他の2つの枝は電源に対して独立して並列に接続されているため、ランプの枝が断線しても、残りの枝にかかる電源電圧（24V）には何の影響もありません。",
        keyTermsEn: ["No change (remain 24 V)", "branches are independent", "still connected across supply"],
        excellenceTipJa: "「Parallel branches are independent of each other」は家庭用配線（1つの家電を切っても他が消えない）の超頻出重要論点です。"
      },
      {
        id: "p269_qe",
        number: "(e)",
        questionEn: "State the current flowing through ammeter A4.",
        questionJa: "電流計 A4 を流れる電流の値を答えなさい。",
        answerEn: "• Answer: A4 = 8 A.\n• Reason: Ammeter A4 is in the main line (return path to the negative terminal). Total current entering the junction must equal total current leaving. Since 8 A leaves the power supply, 8 A must return through A4 (Conservation of Charge).",
        answerJa: "• 答え: A4 = 8 A\n• 理由: A4 はすべての並列枝が合流した後の主導線（メインライン）にあります。電荷保存の法則により、電源から出た 8 A の電流は、合流して必ず同じ 8 A となって電源に戻ります。",
        keyTermsEn: ["A4 = 8 A", "main line total current", "conservation of charge"],
        excellenceTipJa: "分流した電流（2A + 1A + 5A）が合流して再び 8A になることを意識しましょう。"
      },
      {
        id: "p269_qf",
        number: "(f)",
        questionEn: "Find the current flowing through ammeter A2. Show your working.",
        questionJa: "電流計 A2 を流れる電流を求めなさい。途中式も示しなさい。",
        answerEn: "• Working:\n  Total Current I_total = I_branch1 + I_branch2 + I_branch3\n  8 A = 2 A + A2 + 5 A\n  8 A = 7 A + A2\n  A2 = 8 A - 7 A = 1 A\n• Final Answer: A2 = 1 A",
        answerJa: "• 途中式:\n  全電流 = 各ブランチの電流の和（キルヒホッフの電流則）\n  I_total = I_1 + I_2 + I_3\n  8 A = 2 A + A2 + 5 A\n  8 A = 7 A + A2\n  A2 = 8 A - 7 A = 1 A\n• 答え: A2 = 1 A",
        keyTermsEn: ["I_total = I1 + I2 + I3", "8 = 2 + A2 + 5", "A2 = 1 A"],
        excellenceTipJa: "並列回路の接点（Junction）では「入る電流の合計＝出る電流の合計」が成り立ちます。"
      },
      {
        id: "p269_qg",
        number: "(g)",
        questionEn: "If the lamp blew, the current flowing through the two other parallel components does not change. State what the new reading for A4 would be and justify your answer.",
        questionJa: "ランプが切れた場合でも、他の2つの部品を流れる電流は変化しません。このとき A4 の新しい測定値は何になるか答え、理由を説明しなさい。",
        answerEn: "• New Reading for A4: 3 A.\n• Justification: The lamp branch is broken, so its current becomes 0 A. The remaining two branches still draw 2 A and 1 A respectively. The new total current returning through A4 is the sum of the remaining branches: 2 A + 1 A = 3 A.",
        answerJa: "• A4 の新しい値: 3 A\n• 理由・根拠: ランプの枝が断線したため、ランプの枝を流れる 5 A の電流が 0 A になります。他の2つの枝には変わらず 2 A と 1 A が流れているため、合流する全電流は 2 A + 1 A = 3 A に減少します。",
        keyTermsEn: ["New A4 = 3 A", "lamp current becomes 0 A", "sum of remaining branches: 2 A + 1 A = 3 A"],
        excellenceTipJa: "「8A - 5A = 3A」または「2A + 1A = 3A」の論理を明確に記述すると高評価です。"
      },
      {
        id: "p269_qh",
        number: "(h)",
        questionEn: "Calculate the total charge that flows around the circuit in 1 hour after the change in (g) above.",
        questionJa: "(g) の変更後（ランプが切れた状態）、1時間で回路を流れる総電荷量（q）を計算しなさい。",
        answerEn: "• Working:\n  Formula: q = I × t\n  New total current I = 3 A\n  Time t = 1 hour = 60 × 60 s = 3600 s\n  q = 3 A × 3600 s = 10,800 C (or 1.08 × 10^4 C)\n• Final Answer: 10,800 C (Coulombs)",
        answerJa: "• 途中式:\n  公式: q = I × t\n  新しい全電流 I = 3 A\n  時間 t = 1 時間 = 60 分 × 60 秒 = 3600 秒\n  q = 3 A × 3600 s = 10,800 C（または 1.08 × 10⁴ C）\n• 答え: 10,800 C（クーロン）",
        keyTermsEn: ["q = I × t", "t = 3600 s", "q = 3 × 3600 = 10,800 C"],
        excellenceTipJa: "1時間 = 3600秒への変換をミスしないこと。有効数字（Significant figures）や指数表記（1.08 × 10⁴ C）にも慣れておくと完璧です。"
      }
    ]
  }
];
