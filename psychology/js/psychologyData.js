/**
 * NCEA Level 2 Psychology (AS 91847) Data Store
 * Contains Standards Criteria, Model Essays (A/M/E), Key Research Studies, and Te Whare Tapa Whā details.
 */

window.PSYCHOLOGY_DATA = {
  standard: {
    number: "AS 91847",
    level: 2,
    credits: 5,
    titleEn: "Examine how theory is used in fields of psychological practice",
    titleJa: "心理学の実践分野において理論がどのように応用されているかを検証する",
    resourceTitle: "Helping Behaviours (Psychology 2.4 Version 1)",
    school: "Long Bay College",
    examFormat: "Step 1: A3 Digital Planning Sheet (Bullet points only, Arial 12pt) -> Step 2: 4 periods on Exam.net"
  },

  rubric: {
    achieved: {
      grade: "Achieved (合格)",
      color: "#38bdf8",
      criteriaEn: [
        "Explain how two theories are used in two fields of psychological practice (One in Clinical, one in Social).",
        "Show an awareness of why the theories are used within each field."
      ],
      criteriaJa: [
        "2つの心理学実践分野（臨床心理学と社会心理学）において、それぞれ少なくとも1つの理論がどのように人を助けるために使われているかを説明する。",
        "なぜその理論がその分野で使われるのかの基本認識（awareness）を示す。"
      ],
      sampleText: `Research has found that having control over your workload is an important factor in whether you feel stressed. This theory comes from clinical psychology because it aims to explain why some people may suffer from the disorder of stress.

Knowing this theory can help you look at your own school work and see if there are ways to gain more control over your workload. You might like to use a wall planner to plan your deadlines, this will help you gain more control.`
    },
    merit: {
      grade: "Merit (良)",
      color: "#a855f7",
      criteriaEn: [
        "Providing a detailed explanation of how theory is used in fields of psychological practice.",
        "Identify strengths and weaknesses of the theories, and provide justification for why they are used.",
        "Include descriptions of, or references to, psychological theories or studies from published works."
      ],
      criteriaJa: [
        "心理学実践分野で理論がどう使われているかを詳細に説明する。",
        "各理論の【強み（Strengths）と弱み（Weaknesses）】を特定し、なぜその理論が使われるのかを正当化（Justification）する。",
        "出版された心理学研究論文（Published works / 例: Johansson et al. 1978）の具体的な引用と記述を含める。"
      ],
      sampleText: `Having control over your workload has been shown to be an important factor in whether you feel stressed. This theory comes from clinical psychology in that it aims to explain why some people may suffer from stress disorder. Research completed by Johansson et al. (1978) looked at the different types of jobs in a sawmill and how much control the different workers had over their workload. They found that high-demand, low-control workers had significantly higher adrenaline and stress-related illnesses.

Knowing this theory can help you look at your own school work and see if there are ways to gain more control over your workload. You might like to use a wall planner to plan your deadlines, this will help you gain more control and reduce the impact of stress.

The overall effectiveness of the theories used might be limited as it only deals with one aspect of what might be causing stress. Instead, by looking at the idea of hauora, it suggests that our well-being is due to a number of factors. Dr Mason Durie's whare tapa whā model (1994) compares hauora to the four walls of a whare, each wall influencing and supporting the others. This fits in with health psychology, with its Bio-Psycho-Social model.`
    },
    excellence: {
      grade: "Excellence (最高評価 🌟)",
      color: "#f59e0b",
      criteriaEn: [
        "Evaluate the theories used in the chosen fields comprehensively.",
        "Consider, in the evaluation, the implications of the theory on clients, psychologists, or society.",
        "Predict how the fields may evolve over time (e.g. biological impacts, technological integration, holistic approaches)."
      ],
      criteriaJa: [
        "選択した分野で使用される理論を多角的・批判的に包括評価（Evaluate）する。",
        "理論の実践応用がクライアント・心理士・社会全体に与える【波及効果・影響（Implications）】を深く考察する。",
        "今後その分野が【時代とともにどのように進化・発展していくか（Predict how the fields may evolve over time）】を論理的に予測する。"
      ],
      sampleText: `[EVALUATION & RESEARCH COMPARISON]
The overall effectiveness of the theories used might be limited as it only deals with one aspect of what might be causing stress. Dr Mason Durie's Whare Tapa Whā model (1994) compares hauora to the four walls of a whare (taha tinana, taha hinengaro, taha wairua, taha whānau). This fits with the Bio-Psycho-Social model of understanding health.

Research by Brady (1958) on 'executive monkeys' argued that having high responsibility and decision-making increased stress (ulcers). However, research by Johansson et al. (1978) has greater ecological validity as it examined real sawmill workers in their natural environment as opposed to an artificial animal laboratory. Johansson demonstrated that it is the lack of control combined with high machine pacing that triggers chronic stress.

[IMPLICATIONS & LOOKING AHEAD / FUTURE EVOLUTION]
It is likely that as further research is done within control and its biological effects on stress, we will understand the specific neurobiological impacts (such as cortisol and HPA axis regulation) that perceptions of control have.
As these fields develop further, there will be a greater need to explain the interaction between these multiple biological, psychological, and cultural factors. In the future, clinical practice will likely evolve by integrating real-time biofeedback wearable technology with culturally responsive holistic frameworks (like Te Whare Tapa Whā), leading to personalised preventative health interventions.`
    }
  },

  // Key Studies & Theoretical Evidence
  studies: [
    {
      id: "johansson_1978",
      field: "Clinical / Health Psychology",
      topic: "Workload Control, Stress & Physiological Health",
      researchers: "Johansson, Aronsson, & Lindström (1978)",
      titleJa: "スウェーデン製材所における仕事のコントロール感とストレス研究",
      aim: "To examine whether high work demands paired with low job control and machine-pacing leads to higher physiological stress and illness.",
      aimJa: "仕事の要求度が高く、自分のペースで作業を制御できない（低コントロール感）環境が、生理的ストレスや病気に繋がるかを検証する。",
      method: "Quasi-experiment comparing 14 high-risk sawmill 'cleaners/finishers' (repetitive, machine-paced, isolated, high responsibility) against 10 control workers (maintenance/repair with high autonomy). Measured urine levels of adrenaline and noradrenaline, blood pressure, and self-reported health records.",
      methodJa: "機械のペースに合わせて単調な作業を強いられるハイリスク群14名（製材作業員）と、自分で作業ペースを管理できる対照群10名（保全作業員）を比較。尿中アドレナリン・ノルアドレナリン濃度、血圧、病欠日数を測定。",
      findings: "High-risk group had significantly higher levels of adrenaline (especially at work start and throughout the day) and suffered far more gastrointestinal and cardiovascular illnesses than the control group.",
      findingsJa: "高リスク群は朝の出勤時からアドレナリン分泌量が極めて高く、消化器系や心疾患などのストレス性疾患や病欠が有意に多かった。",
      strengths: "High ecological validity (real-world workplace, natural setting). Objective biological measurements (adrenaline, noradrenaline).",
      strengthsJa: "現実の職場を対象とした高い生態学的妥当性（Ecological Validity）。ホルモン値という客観的生体データ。",
      limitations: "Small sample size (14 vs 10, all male). Confounding variables such as caffeine intake or personality types could not be fully controlled.",
      limitationsJa: "サンプル数が少ない（男性24名）。個人の性格特性（Type A）やカフェイン摂取などの交絡変数を完全には排除できない。",
      relevanceToAssessment: "Provides empirical evidence that increasing personal control (autonomy) in clinical interventions effectively reduces physiological stress."
    },
    {
      id: "darley_latane_1968",
      field: "Social Psychology",
      topic: "Bystander Effect & Diffusion of Responsibility",
      researchers: "Darley & Latané (1968)",
      titleJa: "ダーリー＆ラタネの傍観者効果・発作実験（Kitty Genovese 事件の検証）",
      aim: "To test whether the presence of other passive bystanders reduces an individual's likelihood and speed of helping in an emergency.",
      aimJa: "周囲に他者（傍観者）が存在することで、緊急時における援助行動の生起率および反応速度が低下するかを検証する。",
      method: "NYU students communicated via intercom in separate booths. A confederate staged a medical emergency (an epileptic seizure crying for help). Participants believed they were in: (1) 2-person group (alone with victim), (2) 3-person group, or (3) 6-person group.",
      methodJa: "個室でインターホン越しに会話中、仕掛け人がてんかん発作を起こして助けを求める。参加者は自分が「被害者と2人きり」「3人グループ」「6人グループ」のいずれかの状況に置かれた。",
      findings: "Alone: 85% helped within 52 seconds. 3-person group: 62% helped (avg 93s). 6-person group: Only 31% helped (avg 166s). Clear evidence of Diffusion of Responsibility and Pluralistic Ignorance.",
      findingsJa: "1対1の場合：85%が平均52秒で通報・救助。3人グループ：62%（93秒）。6人グループ：わずか31%（166秒）。「責任の分散」と「多元的無知」を実証。",
      strengths: "Strict lab control, high internal validity, precise measurement of response latency.",
      strengthsJa: "厳格な実験室統制による高い内的妥当性。反応時間の正確な定量的測定。",
      limitations: "Low ecological validity (intercom audio only), ethical concerns regarding participant distress and deception.",
      limitationsJa: "インターホン越しという人工的環境、被験者を騙すこと（Deception）や精神的苦痛に伴う倫理的課題。",
      relevanceToAssessment: "Social psychology uses this theory in practical training (e.g. CPR/first aid: pointing to a specific person 'You in the blue shirt, call 111!' to eliminate diffusion of responsibility)."
    },
    {
      id: "te_whare_tapa_wha",
      field: "Clinical / Health Psychology (Indigenous Model)",
      topic: "Holistic Health & Hauora Model",
      researchers: "Sir Mason Durie (1994)",
      titleJa: "テ・ワレ・タパ・ファ（マオリの伝統的ホリスティック健康モデル）",
      aim: "To provide a comprehensive, culturally responsive framework for understanding health and well-being (Hauora) beyond Western biomedical reductionism.",
      aimJa: "西洋医学的な還元主義を超え、多面的なウェルビーイング（Hauora）を捉える文化的に適応した健康モデルを提供する。",
      walls: [
        { nameEn: "Taha Tinana", nameJa: "身体的健康 (Physical Health)", desc: "Biological bodily functioning, sleep, nutrition, physical activity." },
        { nameEn: "Taha Hinengaro", nameJa: "精神・感情の健康 (Mental/Emotional)", desc: "Thoughts, feelings, emotional expression, cognitive patterns." },
        { nameEn: "Taha Wairua", nameJa: "霊性・アイデンティティ (Spiritual Health)", desc: "Sense of identity, core values, connection to purpose, environment and heritage." },
        { nameEn: "Taha Whānau", nameJa: "家族・社会的健康 (Family/Social)", desc: "Belonging, support networks, interpersonal relationships, community." }
      ],
      relevanceToAssessment: "Crucial for Merit/Excellence to evaluate Western stress theories against holistic, multi-dimensional models used in New Zealand healthcare."
    }
  ],

  // Report Section Prompts and Sentence Starters
  sections: [
    {
      id: "intro",
      title: "1. Introduction",
      titleJa: "1. 導入（Introduction）",
      guideJa: "扱う2つの心理学分野（Clinical & Social）と、それぞれの理論を1〜2文で簡潔に紹介します。",
      prompts: [
        "What are the two fields you will discuss? (Clinical Psychology & Social Psychology)",
        "What theory does each field use?",
        "Briefly explain what each theory is (1–2 sentences each)."
      ],
      starters: [
        "In this report, I will examine how psychological theory is applied in two distinct fields of practice: Clinical Psychology and Social Psychology...",
        "In Clinical Psychology, I will focus on the theory of [Workload Control / Cognitive Behavioural Therapy] to explain and treat stress disorder...",
        "In Social Psychology, I will examine the theory of the Bystander Effect and Diffusion of Responsibility to understand helping behaviours in emergencies..."
      ]
    },
    {
      id: "clinical",
      title: "2. Field 1: Clinical Psychology",
      titleJa: "2. 分野1：臨床心理学（Clinical Psychology）",
      subsections: [
        {
          name: "Describe the field",
          nameJa: "分野の説明",
          prompt: "What does Clinical Psychology do? How does it help people?",
          starters: ["Clinical psychology is the field of practice dedicated to assessing, diagnosing, preventing, and treating mental health disorders to improve individual psychological well-being..."]
        },
        {
          name: "Explain the theory",
          nameJa: "理論の解説と実践応用",
          prompt: "What is the theory? Why is it useful? How do psychologists use it in practice?",
          starters: ["The theory of job control posits that chronic stress occurs when high demand is paired with low perceived control over one's environment...", "Clinical psychologists apply this theory in practice by working with clients to restructure their environment, implementing time-management frameworks and autonomy-boosting strategies..."]
        },
        {
          name: "Support with evidence",
          nameJa: "研究エビデンス（Johansson et al. 1978 等）",
          prompt: "Describe one relevant published study. Explain how it supports the theory.",
          starters: ["This theory is empirically supported by the seminal research conducted by Johansson et al. (1978) on Swedish sawmill workers. The researchers found that...", "This directly demonstrates that lacking control causes physiological strain, supporting clinical interventions that target control..."]
        },
        {
          name: "Evaluate the theory",
          nameJa: "理論の評価（強み・弱み・他理論との比較）",
          prompt: "What are the strengths and limitations? Why is it still used?",
          starters: ["A significant strength of this theory is its practical applicability; however, its primary limitation is its reductionist nature, ignoring broader holistic factors...", "When evaluated against Sir Mason Durie's Te Whare Tapa Whā model (1994), it becomes clear that stress cannot be reduced solely to environmental control, but also involves Taha Hinengaro, Taha Tinana, Taha Wairua, and Taha Whānau..."]
        },
        {
          name: "Looking ahead (Excellence)",
          nameJa: "将来の発展・進化予測（Excellence）",
          prompt: "What are the implications for society? How might the field evolve in the future?",
          starters: ["In terms of future implications, as neuroimaging and biomarker technology advance, clinical practice will likely evolve to integrate real-time neurobiological monitoring (cortisol/HPA axis) with personalized cognitive strategies...", "Furthermore, clinical psychology will increasingly adopt culturally responsive, integrative care models..."]
        }
      ]
    },
    {
      id: "social",
      title: "3. Field 2: Social Psychology",
      titleJa: "3. 分野2：社会心理学（Social Psychology）",
      subsections: [
        {
          name: "Describe the field",
          nameJa: "分野の説明",
          prompt: "What does Social Psychology do? How does it help people?",
          starters: ["Social psychology investigates how individuals' thoughts, feelings, and behaviours are influenced by the actual, imagined, or implied presence of others..."]
        },
        {
          name: "Explain the theory",
          nameJa: "傍観者効果と責任の分散",
          prompt: "What is the Bystander Effect? What mechanisms drive it? How is it used in practice?",
          starters: ["The Bystander Effect theory states that an individual is less likely to offer help to a victim when other people are present, driven by Diffusion of Responsibility and Pluralistic Ignorance...", "Practitioners and educators use this theory to design emergency intervention protocols, teaching people to assign direct, individualized responsibility (e.g. 'You in the red jacket, call an ambulance!')..."]
        },
        {
          name: "Support with evidence",
          nameJa: "研究エビデンス（Darley & Latané 1968 等）",
          prompt: "Describe Darley & Latané (1968) or Piliavin (1969). How does it support the theory?",
          starters: ["Empirical evidence is provided by Darley and Latané's (1968) classic intercom seizure study, where helping rates dropped drastically from 85% when alone to only 31% in a 6-person group...", "This confirms that the perceived presence of others inhibits prosocial helping behaviour..."]
        },
        {
          name: "Evaluate the theory",
          nameJa: "理論の評価（内的妥当性・倫理・限界）",
          prompt: "What are the strengths and limitations of the theory? (e.g. Piliavin subway study cost-reward)",
          starters: ["While Darley and Latané demonstrated high experimental control, the theory was later expanded by Piliavin et al. (1969), who showed that in real-world high-stakes emergencies with physical proximity (cost-reward model), bystanders do intervene rapidly..."]
        },
        {
          name: "Looking ahead (Excellence)",
          nameJa: "将来の発展・デジタル社会における進化予測",
          prompt: "How does the theory apply to modern contexts (cyberbullying, online bystander effect)? Future evolution?",
          starters: ["Looking ahead, social psychological practice must evolve to address 'Digital Bystander Effect' in social media and cyberbullying contexts, where physical invisibility exacerbates diffusion of responsibility...", "Future public safety campaigns and AI-mediated alert platforms will incorporate these insights to proactively prompt bystander intervention."]
        }
      ]
    },
    {
      id: "conclusion",
      title: "4. Conclusion",
      titleJa: "4. 結論（Conclusion）",
      guideJa: "両分野の理論がどのように人を助けるために役立っているかをまとめます。",
      starters: [
        "In conclusion, psychological theories provide vital empirical foundations for both clinical and social practice...",
        "While Clinical Psychology applies theoretical models to alleviate individual distress and foster personal agency, Social Psychology harnesses behavioural insights to structure safer, more responsive communities..."
      ]
    },
    {
      id: "references",
      title: "5. Reference List (APA 7th Format)",
      titleJa: "5. 参考文献リスト（APA形式）",
      guideJa: "NCEA Assessmentで必須となるAPA参考文献リストの記載例です。",
      entries: [
        "Darley, J. M., & Latané, B. (1968). Bystander intervention in emergencies: Diffusion of responsibility. Journal of Personality and Social Psychology, 8(4), 377–383.",
        "Durie, M. (1994). Whaiora: Māori health development. Oxford University Press.",
        "Johansson, G., Aronsson, G., & Lindström, B. O. (1978). Social psychological and neuroendocrine stress reactions in highly mechanised work. Ergonomics, 21(8), 583–599.",
        "Piliavin, I. M., Rodin, J. A., & Piliavin, J. A. (1969). Good samaritanism: An underground phenomenon? Journal of Personality and Social Psychology, 13(4), 289–299."
      ]
    }
  ]
};
