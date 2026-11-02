/**
 * NCEA Level 2 (Year 12) Exam Vocabulary & Context Database
 * Specifically designed for NZ Year 12 students to decode exam prompts
 * and write Achieved / Merit / Excellence responses across subjects.
 */

window.NCEA_VOCAB_CATEGORIES = [
  {
    id: 'command',
    name: 'Command Words',
    nameJa: '試験指示語・問題文の罠',
    icon: '🎯',
    color: '#f59e0b',
    desc: '問題文で「何をすべきか」「何をしてはいけないか」を決める最優先ワード'
  },
  {
    id: 'connectors',
    name: 'Answer & Essay',
    nameJa: '論述・回答フレーズ',
    icon: '✍️',
    color: '#10b981',
    desc: 'Merit・Excellence の論理展開（理由・結果・対比・評価）を作る必須表現'
  },
  {
    id: 'physics',
    name: 'Physics L2',
    nameJa: '物理 (AS 91171/91173)',
    icon: '⚡',
    color: '#38bdf8',
    desc: '問題文の隠れた条件（v=0, F=0, 比例・反比例など）を見抜く物理頻出語'
  },
  {
    id: 'math',
    name: 'Math & Stats L2',
    nameJa: '数学・統計 (AS 91267)',
    icon: '📐',
    color: '#6366f1',
    desc: '確率の範囲（以上・超える・条件付き）や分布の形を正確に読み取る語彙'
  },
  {
    id: 'psychology',
    name: 'Psychology L2',
    nameJa: '心理学 (AS 91847)',
    icon: '🧠',
    color: '#a855f7',
    desc: '傍観者効果・援助行動・実験の妥当性を専門的に論述するためのキーワード'
  },
  {
    id: 'english',
    name: 'English L2',
    nameJa: '英語・読解 (AS 91098/91100)',
    icon: '📖',
    color: '#f43f5e',
    desc: 'Unfamiliar Texts やエッセイで筆者の意図・技法・テーマを分析する語彙'
  }
];

window.NCEA_VOCAB_WORDS = [
  // ============================================================
  // 1. COMMAND WORDS & EXAM PROMPT TRAPS (20 words)
  // ============================================================
  {
    id: 'cmd_hence',
    word: 'hence',
    pos: 'adv.',
    pronunciation: '/hens/',
    category: 'command',
    grade: 'Merit',
    meaningJa: 'したがって、前の結果を使って',
    trapJa: '【超重要】問題文に "Hence, calculate..." とあったら「直前の小問(a)で出した答えを使って計算せよ」という合図！ゼロから考え直す必要はありません。',
    examExampleEn: 'Hence, or otherwise, calculate the magnitude of the magnetic force acting on the rod.',
    examExampleJa: 'したがって（直前の結果を用いて）、またはその他の方法で、棒に働く磁力の大きさを計算しなさい。',
    answerTipEn: 'Using the current I = 2.5 A found in part (a), hence F = BIL = ...',
    answerTipJa: '(a)で求めた電流 I = 2.5 A を用いて、したがって F = BIL = ...',
    synonyms: ['therefore', 'consequently', 'thus']
  },
  {
    id: 'cmd_justify',
    word: 'justify',
    pos: 'v.',
    pronunciation: '/ˈdʒʌstɪfaɪ/',
    category: 'command',
    grade: 'Excellence',
    meaningJa: '根拠（公式・数値・理論）を挙げて正当化する',
    trapJa: '単に「Aになる」と結論だけ書いても加点されません。「どの法則・計算結果からそう言えるのか」の証拠（Evidence）をセットで書く指示語です。',
    examExampleEn: 'Justify your choice of distribution model using features of the sample graph.',
    examExampleJa: '標本グラフの特徴を用いて、あなたが選んだ分布モデルが適切である根拠を説明しなさい。',
    answerTipEn: 'This is justified because the histogram is bell-shaped, symmetrical, and unimodal.',
    answerTipJa: 'ヒストグラムが釣鐘型で左右対称かつ単峰性であるため、これは正当化される。',
    synonyms: ['prove', 'substantiate', 'validate']
  },
  {
    id: 'cmd_show_that',
    word: 'show that',
    pos: 'phrase',
    pronunciation: '/ʃəʊ ðæt/',
    category: 'command',
    grade: 'Achieved',
    meaningJa: '〜であることを（途中式をすべて書いて）示せ',
    trapJa: '答えの数値が問題文に書いてあるラッキー問題ですが、「使う公式 → 代入した式 → 計算結果」の途中過程を省略すると0点になります！次の小問でこの数値を使ってよいという救済措置でもあります。',
    examExampleEn: 'Show that the total resistance of the circuit is 12.5 Ω.',
    examExampleJa: '回路全体の合成抵抗が 12.5 Ω であることを示しなさい。',
    answerTipEn: 'R_total = R1 + R2 = 4.5 + 8.0 = 12.5 Ω (as required).',
    answerTipJa: '公式と数値代入を明記し、最後に問題文の数値と一致することを示す。',
    synonyms: ['demonstrate that', 'prove that']
  },
  {
    id: 'cmd_state',
    word: 'state',
    pos: 'v.',
    pronunciation: '/steɪt/',
    category: 'command',
    grade: 'Achieved',
    meaningJa: '（理由や計算なしで）簡潔に述べる・答える',
    trapJa: '"State" の問題で長々と段落を書くのは時間の無駄！1文または単語・数値・向きだけでスパッと答えて次の長文問題に時間を残しましょう。',
    examExampleEn: 'State the direction of the magnetic field between the poles.',
    examExampleJa: '磁極間の磁場の向きを答えなさい。',
    answerTipEn: 'From North to South (or Downwards / Into the page).',
    answerTipJa: 'N極からS極へ（または下向き／紙面奥向き）。',
    synonyms: ['name', 'specify', 'give']
  },
  {
    id: 'cmd_evaluate',
    word: 'evaluate',
    pos: 'v.',
    pronunciation: '/ɪˈvæljueɪt/',
    category: 'command',
    grade: 'Excellence',
    meaningJa: '（長所と短所・限界を比較して）妥当性や価値を評価する',
    trapJa: 'Excellenceの最頻出指示語！「良い点（Strengths）」と「限界・問題点（Limitations）」の両方を挙げた上で、最終的な結論を下す必要があります。',
    examExampleEn: 'Evaluate the validity of applying laboratory findings to real-life emergencies.',
    examExampleJa: '実験室での発見を現実の緊急事態に適用することの妥当性を評価しなさい。',
    answerTipEn: 'While the lab setting allows high control of variables, it lacks ecological validity because...',
    answerTipJa: '実験室環境は変数の高い統制を可能にする一方で、〜のため生態学的妥当性に欠ける。',
    synonyms: ['assess', 'appraise', 'weigh up']
  },
  {
    id: 'cmd_respectively',
    word: 'respectively',
    pos: 'adv.',
    pronunciation: '/rɪˈspektɪvli/',
    category: 'command',
    grade: 'Achieved',
    meaningJa: 'それぞれ（前に挙げた順番通りに）',
    trapJa: '数値の取り違え原因No.1！"R1 and R2 are 4 Ω and 6 Ω respectively" なら、1番目(R1)が4Ω、2番目(R2)が6Ωです。',
    examExampleEn: 'The mean and standard deviation are 150 g and 12 g respectively.',
    examExampleJa: '平均と標準偏差はそれぞれ 150 g と 12 g である（平均=150g、標準偏差=12g）。',
    answerTipEn: 'Here, μ = 150 g and σ = 12 g.',
    answerTipJa: '順番通りに1つ目の変数が1つ目の数値に対応する。',
    synonyms: ['in that order', 'correspondingly']
  },
  {
    id: 'cmd_negligible',
    word: 'negligible',
    pos: 'adj.',
    pronunciation: '/ˈneɡlɪdʒəbl/',
    category: 'command',
    grade: 'Achieved',
    meaningJa: '無視できるほど小さい（＝0とみなしてよい）',
    trapJa: '問題文で "Air resistance is negligible" や "The internal resistance is negligible" と出たら、「計算に入れなくてよい（0として扱え）」というボーナス条件です！',
    examExampleEn: 'Assume the mass of theconnecting wires and friction are negligible.',
    examExampleJa: '導線の質量および摩擦は無視できるほど小さいと仮定せよ。',
    answerTipEn: 'Since energy loss due to friction is negligible, all gravitational potential energy converts to kinetic energy.',
    answerTipJa: '摩擦によるエネルギー損失は無視できるため、すべての位置エネルギーが運動エネルギーに変換される。',
    synonyms: ['insignificant', 'minimal', 'zero']
  },
  {
    id: 'cmd_determine',
    word: 'determine',
    pos: 'v.',
    pronunciation: '/dɪˈtɜːmɪn/',
    category: 'command',
    grade: 'Merit',
    meaningJa: '（計算やグラフの読み取りによって）決定する・求める',
    trapJa: 'ただ当て推量で書くのではなく、グラフの傾きや表の値、公式を使って論理的に特定・導出することを求める指示語です。',
    examExampleEn: 'Using the graph, determine the voltage across the lamp when the current is 0.40 A.',
    examExampleJa: 'グラフを用いて、電流が 0.40 A のときのランプ両端の電圧を求めなさい。',
    answerTipEn: 'From the graph at I = 0.40 A, the corresponding voltage is determined to be 6.0 V.',
    answerTipJa: 'グラフの I = 0.40 A の点から、対応する電圧は 6.0 V と求められる。',
    synonyms: ['find', 'calculate', 'ascertain']
  },
  {
    id: 'cmd_compare_contrast',
    word: 'compare and contrast',
    pos: 'phrase',
    pronunciation: '/kəmˈpeə ænd ˈkɒntrɑːst/',
    category: 'command',
    grade: 'Merit',
    meaningJa: '共通点（Compare）と相違点（Contrast）の両方を述べる',
    trapJa: '違いだけ書いて共通点を忘れるとMerit/Excellenceを逃します！「Both A and B...（共通点）」と「However, whereas A..., B...（相違点）」の両方を書きましょう。',
    examExampleEn: 'Compare and contrast the two distributions of reaction times.',
    examExampleJa: '反応時間の2つの分布の共通点と相違点を比較しなさい。',
    answerTipEn: 'Both distributions are right-skewed; however, Group A has a higher median than Group B.',
    answerTipJa: '両方の分布とも右に歪んでいるという共通点がある一方、グループAはグループBより中央値が高い。',
    synonyms: ['differentiate', 'liken and distinguish']
  },
  {
    id: 'cmd_discuss',
    word: 'discuss',
    pos: 'v.',
    pronunciation: '/dɪˈskʌs/',
    category: 'command',
    grade: 'Excellence',
    meaningJa: '複数の要因・理由・結果を結びつけて深く論じる',
    trapJa: 'NCEAで "Discuss" が出たら「原因 → メカニズム（公式や理論） → 結果 → 条件や例外」まで一連のチェーンで説明する合図です。箇条書きより因果関係の接続詞が鍵！',
    examExampleEn: 'Discuss how closing the switch affects the brightness of Lamp A and Lamp B.',
    examExampleJa: 'スイッチを閉じることがランプAとランプBの明るさにどう影響するか論じなさい。',
    answerTipEn: 'When the switch closes, total resistance decreases. Consequently, total current increases, which means...',
    answerTipJa: 'スイッチを閉じると全抵抗が減少する。その結果、全電流が増加し、つまり...',
    synonyms: ['examine in detail', 'analyse', 'elaborate on']
  },
  {
    id: 'cmd_subsequent',
    word: 'subsequent',
    pos: 'adj.',
    pronunciation: '/ˈsʌbsɪkwənt/',
    category: 'command',
    grade: 'Merit',
    meaningJa: 'その後の、続いて起こる',
    trapJa: '"initial（最初の）" の反対として問題文に頻出します。"Describe the subsequent motion" は「その後に起こる運動を説明せよ」という意味です。',
    examExampleEn: 'Describe the subsequent motion of the electron after it enters the magnetic field.',
    examExampleJa: '電子が磁場に入った後の（続いて起こる）運動を説明しなさい。',
    answerTipEn: 'Subsequently, the electron experiences a constant centripetal force and moves in a circular path.',
    answerTipJa: 'その後、電子は一定の向心力を受け、円軌道を描いて運動する。',
    synonyms: ['following', 'ensuing', 'later']
  },
  {
    id: 'cmd_initial',
    word: 'initial',
    pos: 'adj.',
    pronunciation: '/ɪˈnɪʃl/',
    category: 'command',
    grade: 'Achieved',
    meaningJa: '初期の、最初の（↔ final 最終の）',
    trapJa: '"initially at rest" は「最初は静止している（初速度 v_i = 0）」という超重要ヒントです！',
    examExampleEn: 'An oil drop is initially stationary between two horizontal plates.',
    examExampleJa: '油滴は最初、2枚の水平な極板間で静止している。',
    answerTipEn: 'Since the particle is initially at rest, its initial velocity u = 0 m/s.',
    answerTipJa: '粒子は最初静止しているため、初速度 u = 0 m/s である。',
    synonyms: ['starting', 'original', 'first']
  },
  {
    id: 'cmd_assumption',
    word: 'assumption',
    pos: 'n.',
    pronunciation: '/əˈsʌmpʃn/',
    category: 'command',
    grade: 'Excellence',
    meaningJa: '仮定、前提条件',
    trapJa: '物理や統計の最後によく出る "State one assumption made in your calculation" は「あなたの計算が成り立つために暗黙のうちに置いた前提（例：熱損失がない、試行が独立である）を1つ挙げよ」という意味です。',
    examExampleEn: 'State one assumption you made when calculating the probability of both trains being late.',
    examExampleJa: '両方の電車が遅れる確率を計算する際に置いた「仮定（前提条件）」を1つ述べなさい。',
    answerTipEn: 'I made the assumption that the delays of the two trains are statistically independent.',
    answerTipJa: '2本の電車の遅延が統計的に独立であるという仮定を置いた。',
    synonyms: ['premise', 'presupposition', 'condition']
  },
  {
    id: 'cmd_implication',
    word: 'implication',
    pos: 'n.',
    pronunciation: '/ˌɪmplɪˈkeɪʃn/',
    category: 'command',
    grade: 'Excellence',
    meaningJa: '（結果として生じる）影響、示唆、現実社会での意味合い',
    trapJa: 'PsychologyやEnglish、統計のExcellenceで「実社会への影響（real-world implications）」を問うときに必ず出てきます。',
    examExampleEn: 'Discuss the real-world implications of Darley and Latané’s findings for emergency training.',
    examExampleJa: 'ダーリーとラタネの発見が緊急時トレーニングに与える実社会での示唆（影響）を論じなさい。',
    answerTipEn: 'A key implication is that victims should single out one specific person in a crowd to break diffusion of responsibility.',
    answerTipJa: '重要な示唆は、責任の分散を打破するために群衆の中の特定の一人を名指しすべきだということだ。',
    synonyms: ['consequence', 'ramification', 'significance']
  },
  {
    id: 'cmd_account_for',
    word: 'account for',
    pos: 'phr. v.',
    pronunciation: '/əˈkaʊnt fɔː/',
    category: 'command',
    grade: 'Merit',
    meaningJa: '①〜の理由を説明する ②（割合・部分を）占める',
    trapJa: '文脈で2つの意味があります！問題文の先頭で "Account for the difference..." なら「違いの理由を説明せよ」、統計で "accounts for 35%" なら「35%を占める」です。',
    examExampleEn: 'Account for the decrease in terminal voltage when the current increases.',
    examExampleJa: '電流が増加したときに端子電圧が減少する理由を説明しなさい。',
    answerTipEn: 'This decrease is accounted for by the increasing lost volts across the internal resistance (V_lost = Ir).',
    answerTipJa: 'この減少は、内部抵抗での電圧降下（V_lost = Ir）が増加することによって説明される。',
    synonyms: ['explain the reason for', 'make up']
  },
  {
    id: 'cmd_extent',
    word: 'to what extent',
    pos: 'phrase',
    pronunciation: '/tuː wɒt ɪkˈstent/',
    category: 'command',
    grade: 'Excellence',
    meaningJa: 'どの程度〜か（賛成度合いと条件・限界を論じる）',
    trapJa: 'Yes/Noの二択ではなく、「かなりの程度当てはまるが（To a large extent...）、〜という条件下では例外がある（however, this is limited when...）」と書くのがExcellenceの黄金パターンです。',
    examExampleEn: 'To what extent do you agree that the protagonist is entirely responsible for his downfall?',
    examExampleJa: '主人公の破滅は完全に彼自身の責任であるという意見に、あなたはどの程度同意しますか？',
    answerTipEn: 'To a significant extent, the protagonist causes his own downfall; however, societal pressures also play a crucial role.',
    answerTipJa: 'かなりの程度、主人公自身が破滅を招いているが、一方で社会的圧力も決定的な役割を果たしている。',
    synonyms: ['how far', 'to what degree']
  },

  // ============================================================
  // 2. ANSWER & ESSAY CONNECTORS (16 words)
  // ============================================================
  {
    id: 'con_consequently',
    word: 'consequently',
    pos: 'adv.',
    pronunciation: '/ˈkɒnsɪkwəntli/',
    category: 'connectors',
    grade: 'Merit',
    meaningJa: 'その結果として、したがって',
    trapJa: '物理の三段論法（Rが増える → Consequently Iが減る → したがってPが減る）や心理学の因果関係をつなぐ最強の接続副詞です。',
    examExampleEn: 'The total resistance increases; consequently, the current drawn from the battery decreases.',
    examExampleJa: '回路全体の抵抗が増加し、その結果として電池から流れる電流が減少する。',
    answerTipEn: 'Consequently, less power is dissipated in the lamp, making it dimmer.',
    answerTipJa: 'その結果として、ランプで消費される電力が減り、暗くなる。',
    synonyms: ['therefore', 'as a result', 'thus']
  },
  {
    id: 'con_furthermore',
    word: 'furthermore',
    pos: 'adv.',
    pronunciation: '/ˌfɜːðəˈmɔː/',
    category: 'connectors',
    grade: 'Excellence',
    meaningJa: 'さらに、その上（第2の根拠を追加する）',
    trapJa: '"Also" よりもアカデミックで説得力が高く、エッセイや論述で2つ目の根拠・視点を重ねてExcellenceを狙うときに最適です。',
    examExampleEn: 'Furthermore, the author uses stark imagery to reinforce the sense of isolation.',
    examExampleJa: 'さらに、筆者は孤独感を強めるために鮮烈なイメージ表現を用いている。',
    answerTipEn: 'Furthermore, this finding is supported by empirical data from field experiments.',
    answerTipJa: 'さらに、この発見はフィールド実験の実証データによって裏付けられている。',
    synonyms: ['moreover', 'in addition', 'additionally']
  },
  {
    id: 'con_whereas',
    word: 'whereas',
    pos: 'conj.',
    pronunciation: '/weərˈæz/',
    category: 'connectors',
    grade: 'Merit',
    meaningJa: '〜であるのに対して、一方で（対比）',
    trapJa: '2つの回路・2つの統計グラフ・2つの心理学研究を1文で鮮やかに対比できる接続詞です。Compare & Contrast 問題で必須！',
    examExampleEn: 'In a series circuit current is constant throughout, whereas in a parallel circuit current splits between branches.',
    examExampleJa: '直列回路では電流はどこでも一定であるのに対し、並列回路では電流は各枝に分岐する。',
    answerTipEn: 'Piliavin conducted a field experiment in a subway, whereas Darley and Latané used a controlled laboratory setting.',
    answerTipJa: 'ピリアヴィンが地下鉄でフィールド実験を行ったのに対し、ダーリーとラタネは統制された実験室環境を用いた。',
    synonyms: ['while', 'in contrast to', 'conversely']
  },
  {
    id: 'con_conversely',
    word: 'conversely',
    pos: 'adv.',
    pronunciation: '/ˈkɒnvɜːsli/',
    category: 'connectors',
    grade: 'Excellence',
    meaningJa: '逆に、反対に',
    trapJa: '逆のケース（「もし逆に〜だったらどうなるか」）を論じると理解の深さ（Excellence）を採点官に強くアピールできます。',
    examExampleEn: 'Conversely, if the magnetic field were reversed, the force would act downwards.',
    examExampleJa: '逆に、もし磁場の向きを反転させれば、力は下向きに働くことになる。',
    answerTipEn: 'Conversely, when bystanders know each other well, the helping rate increases significantly.',
    answerTipJa: '逆に、傍観者同士がよく知り合いである場合、援助率は大幅に上昇する。',
    synonyms: ['on the other hand', 'inversely', 'contrarily']
  },
  {
    id: 'con_reinforce',
    word: 'reinforce',
    pos: 'v.',
    pronunciation: '/ˌriːɪnˈfɔːs/',
    category: 'connectors',
    grade: 'Excellence',
    meaningJa: '（テーマ・効果・主張を）強化する、裏付ける',
    trapJa: 'EnglishのUnfamiliar Textsやエッセイで `"shows"` ばかり使う代わりに `"reinforces the idea that..."` と書くと一気にExcellenceの文章になります！',
    examExampleEn: 'The repetition of harsh plosive sounds reinforces the speaker’s frustration.',
    examExampleJa: '激しい破裂音の繰り返しが、語り手の苛立ちを強化している（際立たせている）。',
    answerTipEn: 'This metaphor reinforces the central theme that human connection is fragile.',
    answerTipJa: 'この隠喩は、人間のつながりは脆いという中心テーマを強化している。',
    synonyms: ['strengthen', 'bolster', 'emphasise']
  },
  {
    id: 'con_undermine',
    word: 'undermine',
    pos: 'v.',
    pronunciation: '/ˌʌndəˈmaɪn/',
    category: 'connectors',
    grade: 'Excellence',
    meaningJa: '（信頼性・妥当性・主張を徐々に）損なう、弱める',
    trapJa: '心理学の実験評価や統計のサンプリング批判で「〜という偏りが結果の妥当性を損なう（undermines the validity）」と使うと非常に高評価です。',
    examExampleEn: 'The small, gender-biased sample size undermines the generalisability of the study.',
    examExampleJa: '小さく性別に偏りがあるサンプルサイズが、この研究の一般化可能性を損なっている。',
    answerTipEn: 'Uncontrolled confounding variables can undermine the internal validity of the experiment.',
    answerTipJa: '統制されていない交絡変数は、実験の内的妥当性を損なう可能性がある。',
    synonyms: ['weaken', 'compromise', 'erode']
  },
  {
    id: 'con_attribute',
    word: 'attribute to',
    pos: 'phr. v.',
    pronunciation: '/əˈtrɪbjuːt tuː/',
    category: 'connectors',
    grade: 'Excellence',
    meaningJa: '（結果の原因を）〜に帰する、〜のおかげ/せいだとする',
    trapJa: '受動態 "can be attributed to..."（〜が原因であると考えられる）の形で、現象の背後にあるメカニズムを説明するときに使います。',
    examExampleEn: 'The lower helping rate in large groups can be attributed to diffusion of responsibility.',
    examExampleJa: '大人数の集団で援助率が下がることは、責任の分散が原因であると考えられる。',
    answerTipEn: 'The outlier at 450 ms may be attributed to a momentary lapse in concentration.',
    answerTipJa: '450 ms における外れ値は、一時的な集中力の途切れに起因すると考えられる。',
    synonyms: ['ascribe to', 'credit to', 'explain by']
  },
  {
    id: 'con_simultaneously',
    word: 'simultaneously',
    pos: 'adv.',
    pronunciation: '/ˌsɪmlˈteɪniəsli/',
    category: 'connectors',
    grade: 'Merit',
    meaningJa: '同時に',
    trapJa: '物理で「電場と磁場が同時に働く」ときや、英語で「2つの相反する感情を同時に抱く」ときに頻出します。',
    examExampleEn: 'Both switches are closed simultaneously, allowing current to flow through both branches.',
    examExampleJa: '両方のスイッチが同時に閉じられ、両方の枝に電流が流れる。',
    answerTipEn: 'The protagonist feels simultaneously liberated and terrified by his newfound freedom.',
    answerTipJa: '主人公は新たに得た自由に対して、解放感と恐怖を同時に感じている。',
    synonyms: ['at the same time', 'concurrently']
  },
  {
    id: 'con_predominantly',
    word: 'predominantly',
    pos: 'adv.',
    pronunciation: '/prɪˈdɒmɪnəntli/',
    category: 'connectors',
    grade: 'Excellence',
    meaningJa: '主に、大部分は（mostly の高得点表現）',
    trapJa: '統計データの傾向や、心理学の被験者構成（「主に大学生で構成されていた」など）を正確に表現するときに重宝します。',
    examExampleEn: 'Because the participants were predominantly university students, the findings may not apply to children.',
    examExampleJa: '参加者は主に大学生であったため、この発見は子どもには当てはまらない可能性がある。',
    answerTipEn: 'The energy is predominantly dissipated as thermal energy rather than light.',
    answerTipJa: 'エネルギーは光としてではなく、主に熱エネルギーとして散逸する。',
    synonyms: ['mainly', 'chiefly', 'primarily']
  },
  {
    id: 'con_explicitly',
    word: 'explicitly',
    pos: 'adv.',
    pronunciation: '/ɪkˈsplɪsɪtli/',
    category: 'connectors',
    grade: 'Merit',
    meaningJa: '明示的に、はっきりとと言葉や数値で（↔ implicitly 暗黙的に）',
    trapJa: '問題文で "State explicitly..." とあったら「曖昧にせず単位や向きまでハッキリ書け」という意味です。',
    examExampleEn: 'You must state explicitly whether the force acts into or out of the page.',
    examExampleJa: '力が紙面の奥向きに働くか手前向きに働くかを明示的に述べなければならない。',
    answerTipEn: 'Although not stated explicitly, the writer implies that childhood innocence has been lost.',
    answerTipJa: '明示的には述べられていないものの、筆者は幼少期の無垢さが失われたことをほのめかしている。',
    synonyms: ['clearly', 'expressly', 'directly']
  },

  // ============================================================
  // 3. PHYSICS L2 VOCABULARY (16 words)
  // ============================================================
  {
    id: 'phy_uniform',
    word: 'uniform',
    pos: 'adj.',
    pronunciation: '/ˈjuːnɪfɔːm/',
    category: 'physics',
    grade: 'Achieved',
    meaningJa: '一様な、一定の（どこでも同じ強さ・向き、または速度が一定）',
    trapJa: '「制服」ではありません！"uniform magnetic field" は「どこでも強さと向きが同じ一様な磁場」、"uniform velocity" は「等速（＝加速度0、合力が釣り合っている）」という超重要ヒントです！',
    examExampleEn: 'A proton enters a region of uniform magnetic field of strength 0.25 T.',
    examExampleJa: '陽子が強さ 0.25 T の「一様な磁場」の領域に入る。',
    answerTipEn: 'Because the electric field between parallel plates is uniform, the electric force F = Eq is constant everywhere.',
    answerTipJa: '平行極板間の電場は一様であるため、電気力 F = Eq は場所によらず一定である。',
    synonyms: ['constant', 'even', 'homogeneous']
  },
  {
    id: 'phy_perpendicular',
    word: 'perpendicular',
    pos: 'adj.',
    pronunciation: '/ˌpɜːpənˈdɪkjələ/',
    category: 'physics',
    grade: 'Achieved',
    meaningJa: '垂直な、直角（90°）の',
    trapJa: 'ローレンツ力 F = BIL や F = Bqv、誘導起電力 V = BvL が最大になる条件です！"perpendicular to the magnetic field" ＝ 磁場に対して90°（磁力線を横切る向き）。',
    examExampleEn: 'The metal rod moves at 4.0 m/s perpendicular to the magnetic field lines.',
    examExampleJa: '金属棒が磁力線に対して垂直に 4.0 m/s で運動する。',
    answerTipEn: 'Since the magnetic force always acts perpendicular to the velocity, the particle moves in a circular path at constant speed.',
    answerTipJa: '磁力は常に速度に対して垂直に働くため、粒子は一定の速さで円運動をする。',
    synonyms: ['at right angles', 'orthogonal', '90 degrees']
  },
  {
    id: 'phy_parallel',
    word: 'parallel',
    pos: 'adj.',
    pronunciation: '/ˈpærəlel/',
    category: 'physics',
    grade: 'Merit',
    meaningJa: '平行な（0°または180°）、並列の',
    trapJa: '回路なら「並列回路（電圧が同じ）」ですが、磁気分野で "moves parallel to the magnetic field" と出たら「磁力線と平行に動く＝磁力線を切らないので F = 0（力を受けない）、V = 0（誘導電圧ゼロ）」という定番の引っかけ問題です！',
    examExampleEn: 'Explain why no voltage is induced when the wire moves parallel to the magnetic field.',
    examExampleJa: '導線が磁場に対して平行に動くとき、なぜ電圧が誘導されないのか説明しなさい。',
    answerTipEn: 'Because the wire moves parallel to the magnetic field lines, no field lines are cut, so the magnetic force on charges is zero.',
    answerTipJa: '導線が磁力線と平行に動くため磁力線を横切らず、電荷に働く磁力はゼロになるから。',
    synonyms: ['side by side', 'aligned with']
  },
  {
    id: 'phy_stationary',
    word: 'stationary',
    pos: 'adj.',
    pronunciation: '/ˈsteɪʃənri/',
    category: 'physics',
    grade: 'Achieved',
    meaningJa: '静止している（速さ v = 0、合力 F_net = 0）',
    trapJa: '"e" の stationery（文房具）と混同注意！物理で "remains stationary" と出たら ①速さ v = 0 ②上向きの力と下向きの力が完全に釣り合っている（Balanced forces）という式を立てる合図です。',
    examExampleEn: 'The negatively charged oil drop is held stationary between the plates.',
    examExampleJa: '負に帯電した油滴が極板間で静止して保たれている。',
    answerTipEn: 'For the drop to remain stationary, the upward electric force must equal the downward weight force (F_e = F_g).',
    answerTipJa: '油滴が静止し続けるためには、上向きの電気力と下向きの重力が等しくなければならない（F_e = F_g）。',
    synonyms: ['at rest', 'motionless', 'suspended']
  },
  {
    id: 'phy_suspended',
    word: 'suspended',
    pos: 'adj.',
    pronunciation: '/səˈspendɪd/',
    category: 'physics',
    grade: 'Merit',
    meaningJa: '空中に浮いて静止している、吊り下げられた',
    trapJa: 'ミリカンの油滴実験で超頻出！"suspended in mid-air" は「落下も上昇もせず空中でピタッと止まっている＝重力 mg と電気力 Eq が釣り合っている」という意味です。',
    examExampleEn: 'Calculate the voltage required to keep the charged particle suspended.',
    examExampleJa: '荷電粒子を空中に静止させておくために必要な電圧を計算しなさい。',
    answerTipEn: 'Since the particle is suspended, net force is zero, so Eq = mg and Vq/d = mg.',
    answerTipJa: '粒子は空中に浮いて静止しているため合力はゼロであり、Eq = mg すなわち Vq/d = mg となる。',
    synonyms: ['floating stationary', 'balanced in air']
  },
  {
    id: 'phy_deflect',
    word: 'deflect',
    pos: 'v.',
    pronunciation: '/dɪˈflekt/',
    category: 'physics',
    grade: 'Merit',
    meaningJa: '（粒子の進路が力によって）曲がる、偏向する',
    trapJa: '"In which direction is the electron deflected?" は「電子はどちら向きに曲がるか（＝ローレンツ力がどちら向きに働くか）？」という質問です。',
    examExampleEn: 'Explain why the alpha particle is deflected less than the beta particle in the same field.',
    examExampleJa: '同じ磁場の中で、なぜアルファ粒子はベータ粒子よりも進路の曲がり方（偏向）が小さいのか説明しなさい。',
    answerTipEn: 'Because the alpha particle has a much larger mass, it experiences a smaller acceleration and is deflected into a larger radius.',
    answerTipJa: 'アルファ粒子ははるかに質量が大きいため加速度が小さくなり、より大きな半径で緩やかに曲がる。',
    synonyms: ['bend', 'curve', 'deviate']
  },
  {
    id: 'phy_proportional',
    word: 'proportional',
    pos: 'adj.',
    pronunciation: '/prəˈpɔːʃənl/',
    category: 'physics',
    grade: 'Merit',
    meaningJa: '比例する（directly proportional＝正比例 / inversely proportional＝反比例）',
    trapJa: '公式の関係性を英語で説明するときの必須ワード！V = IR において電圧が一定なら、電流 I は抵抗 R に反比例（inversely proportional）します。',
    examExampleEn: 'Since voltage is constant across parallel branches, current is inversely proportional to resistance.',
    examExampleJa: '並列の枝では電圧が一定であるため、電流は抵抗に反比例する。',
    answerTipEn: 'Induced voltage V = BvL is directly proportional to the speed v of the wing.',
    answerTipJa: '誘導電圧 V = BvL は翼の速さ v に正比例する。',
    synonyms: ['commensurate', 'scaled with']
  },
  {
    id: 'phy_dissipate',
    word: 'dissipate',
    pos: 'v.',
    pronunciation: '/ˈdɪsɪpeɪt/',
    category: 'physics',
    grade: 'Merit',
    meaningJa: '（電気エネルギーが熱や光として）消費される、散逸する',
    trapJa: '"Calculate the power dissipated in the resistor" はシンプルに「抵抗で消費される電力 P（ワット W）を計算せよ」という意味です！難しい単語に見えて P = VI や P = I²R を使うだけです。',
    examExampleEn: 'Calculate the thermal energy dissipated by the 8.0 Ω resistor in 2 minutes.',
    examExampleJa: '8.0 Ω の抵抗によって2分間に消費（放出）される熱エネルギーを計算しなさい。',
    answerTipEn: 'The lamp with higher power dissipation glows brighter because more electrical energy is converted to heat and light per second.',
    answerTipJa: '消費電力が大きいランプほど、1秒あたりに熱や光に変換される電気エネルギーが多いため明るく光る。',
    synonyms: ['convert to heat', 'consume', 'release']
  },
  {
    id: 'phy_induce',
    word: 'induce',
    pos: 'v.',
    pronunciation: '/ɪnˈdjuːs/',
    category: 'physics',
    grade: 'Merit',
    meaningJa: '（電圧や電流を）電磁誘導によって生じさせる',
    trapJa: '電池がないのに磁場中で導体を動かすと電圧が生まれる現象が "induced voltage (誘導起電力)" です。回路が閉じている（closed loop）ときだけ "induced current (誘導電流)" が流れます！',
    examExampleEn: 'A voltage is induced across the aircraft wings as it flies through the Earth’s magnetic field.',
    examExampleJa: '航空機が地球の磁場の中を飛行するとき、主翼の両端に電圧が誘導される。',
    answerTipEn: 'Although a voltage is induced across the rod, no current is induced unless there is a complete closed circuit.',
    answerTipJa: '棒の両端に電圧は誘導されるが、閉じた回路がない限り誘導電流は流れない。',
    synonyms: ['generate', 'produce magnetically']
  },
  {
    id: 'phy_magnitude',
    word: 'magnitude',
    pos: 'n.',
    pronunciation: '/ˈmæɡnɪtjuːd/',
    category: 'physics',
    grade: 'Achieved',
    meaningJa: '（向きを除いた数値の）大きさ、絶対値',
    trapJa: '"State the magnitude and direction" と聞かれたら、「大きさ（数値＋単位）」と「向き（右・上・紙面奥など）」の2つを必ずセットで答えましょう！',
    examExampleEn: 'State the magnitude and direction of the electric field between the plates.',
    examExampleJa: '極板間の電場の「大きさ」と「向き」を答えなさい。',
    answerTipEn: 'The forces on the two charges have equal magnitude but opposite direction.',
    answerTipJa: '2つの電荷に働く力は、大きさは等しいが向きは反対である。',
    synonyms: ['size', 'strength', 'amount']
  },

  // ============================================================
  // 4. MATH & STATISTICS L2 VOCABULARY (16 words)
  // ============================================================
  {
    id: 'math_exceed',
    word: 'exceed',
    pos: 'v.',
    pronunciation: '/ɪkˈsiːd/',
    category: 'math',
    grade: 'Achieved',
    meaningJa: '〜を超える、〜より大きい（P(X > x)）',
    trapJa: '確率問題で "probability that the weight exceeds 250 g" と出たら「250gより大きい（右側の上位面積 P(X > 250)）」を求める合図です！ベルカーブの右端を塗りましょう。',
    examExampleEn: 'Calculate the probability that a randomly selected apple exceeds 185 g in weight.',
    examExampleJa: '無作為に選ばれたリンゴの重さが 185 g を超える確率を計算しなさい。',
    answerTipEn: 'We need P(X > 185). Since μ = 170, the target region is in the right tail.',
    answerTipJa: '求めるのは P(X > 185)。平均 μ = 170 なので、対象領域は右側の裾になる。',
    synonyms: ['be greater than', 'surpass', 'more than']
  },
  {
    id: 'math_at_least',
    word: 'at least',
    pos: 'phrase',
    pronunciation: '/æt liːst/',
    category: 'math',
    grade: 'Achieved',
    meaningJa: '少なくとも〜、〜以上（P(X ≥ x)）',
    trapJa: '"at least" に "least（最小）" が入っているので「以下」と勘違いする人が続出します！「最低でも80点（＝80点以上 X ≥ 80）」なので右側（大きい方）の確率です！',
    examExampleEn: 'Find the probability that a student scores at least 75 marks in the test.',
    examExampleJa: '生徒がテストで少なくとも75点（75点以上）を取る確率を求めなさい。',
    answerTipEn: '“At least 75” means X ≥ 75 (75 or more).',
    answerTipJa: '「at least 75」は X ≥ 75（75以上）を意味する。',
    synonyms: ['no less than', 'minimum of', 'or more']
  },
  {
    id: 'math_at_most',
    word: 'at most',
    pos: 'phrase',
    pronunciation: '/æt məʊst/',
    category: 'math',
    grade: 'Achieved',
    meaningJa: '多くとも〜、最大でも〜以下（P(X ≤ x)）',
    trapJa: '"at least" の逆！"most（最大）" が入っていますが、「最大でも3個まで（＝3個以下 X ≤ 3）」なので左側（小さい方）の確率です！',
    examExampleEn: 'What is the probability that the waiting time is at most 10 minutes?',
    examExampleJa: '待ち時間が多くとも10分（10分以下）である確率はいくらですか？',
    answerTipEn: '“At most 10” means X ≤ 10 (10 or less).',
    answerTipJa: '「at most 10」は X ≤ 10（10以下）を意味する。',
    synonyms: ['no more than', 'maximum of', 'or less']
  },
  {
    id: 'math_given_that',
    word: 'given that',
    pos: 'phrase',
    pronunciation: '/ˈɡɪvn ðæt/',
    category: 'math',
    grade: 'Merit',
    meaningJa: '〜という条件のもとで（条件付き確率 P(A|B) の合図！）',
    trapJa: '確率問題で "Given that..." または "If it is known that..." と出たら、全体の分母（Denominator）が「全体」ではなく「Given that の後ろのグループだけ」に変わります！',
    examExampleEn: 'Given that a battery lasts more than 10 hours, find the probability that it lasts more than 15 hours.',
    examExampleJa: '電池が10時間以上持つという条件のもとで、15時間以上持つ確率を求めなさい。',
    answerTipEn: 'This is a conditional probability: P(X > 15 | X > 10) = P(X > 15) / P(X > 10).',
    answerTipJa: 'これは条件付き確率であり、分母を P(X > 10) に縮小して計算する。',
    synonyms: ['assuming that', 'on the condition that', 'among those who']
  },
  {
    id: 'math_skewed',
    word: 'skewed',
    pos: 'adj.',
    pronunciation: '/skjuːd/',
    category: 'math',
    grade: 'Merit',
    meaningJa: '（分布が左右どちらかに）歪んだ、裾が伸びた',
    trapJa: '山がある側ではなく「長い裾（しっぽ・外れ値）が伸びている側」で呼びます！右に裾が長ければ "right-skewed (positively skewed)" で、平均値(mean)が中央値(median)より右に引っ張られます。',
    examExampleEn: 'Explain why the normal distribution model is inappropriate for this strongly right-skewed dataset.',
    examExampleJa: 'なぜこの強く右に歪んだデータセットに対して正規分布モデルが不適切なのか説明しなさい。',
    answerTipEn: 'The data is right-skewed with a long tail towards higher values, whereas a normal distribution must be symmetrical.',
    answerTipJa: 'データは高い値に向かって長い裾を持つ右歪みであるのに対し、正規分布は左右対称でなければならない。',
    synonyms: ['asymmetrical', 'lopsided']
  },
  {
    id: 'math_symmetrical',
    word: 'symmetrical',
    pos: 'adj.',
    pronunciation: '/sɪˈmetrɪkl/',
    category: 'math',
    grade: 'Achieved',
    meaningJa: '左右対称な',
    trapJa: '正規分布（Normal Distribution）を正当化するときの3大キーワードは "bell-shaped（釣鐘型）", "symmetrical about the mean（平均を中心に左右対称）", "unimodal（山が1つ）" です！',
    examExampleEn: 'Since the normal distribution is symmetrical, 50% of values lie above the mean.',
    examExampleJa: '正規分布は左右対称であるため、値の50%は平均より上にある。',
    answerTipEn: 'The histogram is roughly symmetrical around the centre of 165 cm.',
    answerTipJa: 'ヒストグラムは中心の 165 cm の周りでほぼ左右対称である。',
    synonyms: ['balanced', 'even-sided']
  },
  {
    id: 'math_proportion',
    word: 'proportion',
    pos: 'n.',
    pronunciation: '/prəˈpɔːʃn/',
    category: 'math',
    grade: 'Achieved',
    meaningJa: '割合、比率（0〜1の小数または%）',
    trapJa: '"What proportion of..." と聞かれたら、確率（Probability）と同じように面積（0.xxx または xx%）を求めればOKです！"How many..."（個数・人数）と聞かれたときだけ最後に全体の数 N を掛けます。',
    examExampleEn: 'Estimate the proportion of zucchini marrows that weigh between 1.2 kg and 1.8 kg.',
    examExampleJa: '重さが 1.2 kg から 1.8 kg の間にあるズッキーニマロウの割合を推定しなさい。',
    answerTipEn: 'The proportion of marrows in this range is 0.6826 (or 68.3%).',
    answerTipJa: 'この範囲に入るマロウの割合は 0.6826（または 68.3%）である。',
    synonyms: ['fraction', 'percentage', 'share']
  },
  {
    id: 'math_independent',
    word: 'independent',
    pos: 'adj.',
    pronunciation: '/ˌɪndɪˈpendənt/',
    category: 'math',
    grade: 'Excellence',
    meaningJa: '（統計的に）独立した（一方の結果が他方の確率に影響しない）',
    trapJa: '2つの確率を掛け算 P(A ∩ B) = P(A) × P(B) してよいのは、AとBが「独立（independent）」のときだけです！試験の最後のExcellence問題で「この掛け算の前提条件は？」「なぜ独立とは言えないか？」が必ず問われます。',
    examExampleEn: 'Discuss whether it is reasonable to assume that two trees in the same orchard are independent.',
    examExampleJa: '同じ果樹園にある2本の木が統計的に独立であると仮定することが妥当かどうか論じなさい。',
    answerTipEn: 'This assumption may not be valid because trees in the same orchard share the same soil and weather, so their yields are not independent.',
    answerTipJa: '同じ果樹園の木は同じ土壌や天候を共有するため収穫量は独立ではなく、この仮定は妥当ではない可能性がある。',
    synonyms: ['uncorrelated', 'unrelated']
  },
  {
    id: 'math_inclusive',
    word: 'inclusive',
    pos: 'adj.',
    pronunciation: '/ɪnˈkluːsɪv/',
    category: 'math',
    grade: 'Achieved',
    meaningJa: '（両端の数値を）含めて',
    trapJa: '"between 3 and 6 inclusive" は「3と6の両方を含めて（3, 4, 5, 6）」という意味です。離散データの個数を数えるときに端を含めるかどうかで答えが変わります！',
    examExampleEn: 'Calculate the probability of obtaining between 2 and 5 heads inclusive.',
    examExampleJa: '表が2回から5回まで（2回と5回を含めて）出る確率を計算しなさい。',
    answerTipEn: 'Including the endpoints 2 and 5, the favourable outcomes are 2, 3, 4, and 5.',
    answerTipJa: '両端の2と5を含めると、該当する結果は 2, 3, 4, 5 である。',
    synonyms: ['including endpoints']
  },
  {
    id: 'math_outlier',
    word: 'outlier',
    pos: 'n.',
    pronunciation: '/ˈaʊtlaɪə/',
    category: 'math',
    grade: 'Merit',
    meaningJa: '外れ値（他のデータから極端に離れた値）',
    trapJa: '外れ値（outlier）があると、平均値（mean）と標準偏差（SD）は大きく引っ張られますが、中央値（median）はほとんど影響を受けません（Distribution Dojoの鉄則！）。',
    examExampleEn: 'Explain how removing the outlier at 980 g affects the mean and the median.',
    examExampleJa: '980 g にある外れ値を除外することが、平均値と中央値にどう影響するか説明しなさい。',
    answerTipEn: 'Removing the high outlier decreases the mean significantly, whereas the median remains largely unchanged.',
    answerTipJa: '高い外れ値を除くと平均値は大きく下がるが、中央値はほとんど変化しない。',
    synonyms: ['anomaly', 'extreme value']
  },

  // ============================================================
  // 5. PSYCHOLOGY L2 VOCABULARY (16 words)
  // ============================================================
  {
    id: 'psy_diffusion',
    word: 'diffusion of responsibility',
    pos: 'n. phrase',
    pronunciation: '/dɪˈfjuːʒn ɒv rɪˌspɒnsəˈbɪləti/',
    category: 'psychology',
    grade: 'Achieved',
    meaningJa: '責任の分散（周囲に人が多いほど「誰かが助けるだろう」と個人の責任感が薄れる現象）',
    trapJa: 'AS 91847（Helping Behaviours）の最重要キーワード！Darley & Latané (1968) の研究とセットで、なぜ集団が大きいと援助率が下がるのかを説明する核になります。',
    examExampleEn: 'Explain how diffusion of responsibility reduces the likelihood of bystanders intervening.',
    examExampleJa: '責任の分散が、傍観者が介入する（助けに入る）可能性をどのように低下させるか説明しなさい。',
    answerTipEn: 'When multiple bystanders are present, responsibility is psychologically shared among the group, reducing individual guilt for not acting.',
    answerTipJa: '複数の傍観者がいると責任が心理的に集団内で共有され、行動しないことへの個人の罪悪感が薄れる。',
    synonyms: ['shared responsibility']
  },
  {
    id: 'psy_intervene',
    word: 'intervene',
    pos: 'v.',
    pronunciation: '/ˌɪntəˈviːn/',
    category: 'psychology',
    grade: 'Achieved',
    meaningJa: '（緊急事態などに）介入する、助けに入る',
    trapJa: '"help" の代わりに "intervene in an emergency"（緊急事態に介入する）を使うと心理学らしい専門的な文章になります。名詞形は "intervention" です。',
    examExampleEn: 'Participants were less likely to intervene when they believed other witnesses were present.',
    examExampleJa: '参加者は他の目撃者がいると信じていたとき、助けに入る可能性が低くなった。',
    answerTipEn: 'Direct eye contact and personal requests significantly increase the rate at which bystanders intervene.',
    answerTipJa: '直接のアイコンタクトや個人への指名依頼は、傍観者が介入する割合を大幅に高める。',
    synonyms: ['step in', 'assist', 'take action']
  },
  {
    id: 'psy_ambiguous',
    word: 'ambiguous',
    pos: 'adj.',
    pronunciation: '/æmˈbɪɡjuəs/',
    category: 'psychology',
    grade: 'Merit',
    meaningJa: '曖昧な、緊急事態かどうか判断しにくい',
    trapJa: '例えば「ドアの隙間から煙が出る」「道で人が座り込んでいる（酔っているだけ？急病？）」のように状況が曖昧（ambiguous）なときほど、人は周囲の顔色をうかがって行動が遅れます。',
    examExampleEn: 'Bystanders are much slower to respond when the emergency situation is ambiguous.',
    examExampleJa: '緊急事態が曖昧（判断しにくい）であるとき、傍観者の反応ははるかに遅くなる。',
    answerTipEn: 'In an ambiguous situation, individuals look to others for cues on how to interpret the event.',
    answerTipJa: '曖昧な状況では、人はその出来事をどう解釈すべきかの手がかりを求めて他者の様子をうかがう。',
    synonyms: ['unclear', 'uncertain', 'vague']
  },
  {
    id: 'psy_pluralistic',
    word: 'pluralistic ignorance',
    pos: 'n. phrase',
    pronunciation: '/ˌplʊərəˈlɪstɪk ˈɪɡnərəns/',
    category: 'psychology',
    grade: 'Excellence',
    meaningJa: '多元的無知（全員が内心不安なのに、周囲が冷静に見えるため「大したことない」と誤解し合う現象）',
    trapJa: '「責任の分散」と使い分けるとExcellence確定！状況が曖昧なときに「誰も騒いでいない＝緊急事態ではない」と解釈してしまう認知プロセスです。',
    examExampleEn: 'Distinguish between pluralistic ignorance and diffusion of responsibility in bystander apathy.',
    examExampleJa: '傍観者の無関心における「多元的無知」と「責任の分散」の違いを区別しなさい。',
    answerTipEn: 'Pluralistic ignorance occurs when bystanders misinterpret others’ calm reactions as meaning no emergency exists.',
    answerTipJa: '多元的無知は、他者の冷静な反応を見て「緊急事態ではない」と傍観者たちが誤解するときに起こる。',
    synonyms: ['collective misinterpretation']
  },
  {
    id: 'psy_ecological',
    word: 'ecological validity',
    pos: 'n. phrase',
    pronunciation: '/ˌiːkəˈlɒdʒɪkl vəˈlɪdəti/',
    category: 'psychology',
    grade: 'Excellence',
    meaningJa: '生態学的妥当性（実験の結果が現実世界の日常生活にもそのまま当てはまる度合い）',
    trapJa: 'Piliavin (1969) の地下鉄実験は現実の地下鉄で行われたため "high ecological validity（生態学的妥当性が高い）"、Darley & Latané (1968) のインターホン実験は人工的な環境なので "low ecological validity" と対比できます！',
    examExampleEn: 'Piliavin’s subway study has high ecological validity because participants were unaware they were in an experiment.',
    examExampleJa: 'ピリアヴィンの地下鉄研究は、参加者が実験中だと気づいていなかったため、高い生態学的妥当性を持っている。',
    answerTipEn: 'While laboratory experiments allow strict control of variables, they often suffer from low ecological validity.',
    answerTipJa: '実験室実験は変数の厳密な統制が可能である一方、生態学的妥当性が低くなりがちである。',
    synonyms: ['real-world realism', 'mundane realism']
  },
  {
    id: 'psy_confounding',
    word: 'confounding variable',
    pos: 'n. phrase',
    pronunciation: '/kənˈfaʊndɪŋ ˈveəriəbl/',
    category: 'psychology',
    grade: 'Merit',
    meaningJa: '交絡変数（実験者が意図せず結果に影響を与えてしまう邪魔な要因）',
    trapJa: 'フィールド実験（現実の街中など）では、天気・時間帯・通行人の気分などの交絡変数（confounding variables）をコントロールしにくいのが弱点です。',
    examExampleEn: 'Identify one potential confounding variable in Johansson’s field study on helping behaviour.',
    examExampleJa: '援助行動に関するヨハンソンのフィールド研究における潜在的な交絡変数を1つ特定しなさい。',
    answerTipEn: 'Uncontrolled confounding variables, such as time pressure or weather conditions, may have influenced helping rates.',
    answerTipJa: '時間の焦りや天候条件など、統制されていない交絡変数が援助率に影響した可能性がある。',
    synonyms: ['extraneous variable', 'uncontrolled factor']
  },
  {
    id: 'psy_altruism',
    word: 'altruism',
    pos: 'n.',
    pronunciation: '/ˈæltruɪzəm/',
    category: 'psychology',
    grade: 'Merit',
    meaningJa: '利他主義（自分の利益や見返りを求めず、純粋に他者の幸福のために助けること）',
    trapJa: '反対語は "egoism（利己主義：自分の不快感を消すため・褒められるために助ける）" です。なぜ人は助けるのかの動機分析で必須！',
    examExampleEn: 'Discuss whether helping in Piliavin’s study was motivated by pure altruism or egoistic cost reduction.',
    examExampleJa: 'ピリアヴィンの研究における援助行動が、純粋な利他主義によるものか、利己的なコスト低減によるものか論じなさい。',
    answerTipEn: 'According to the empathy-altruism hypothesis, genuine empathy leads to altruistic helping regardless of personal cost.',
    answerTipJa: '共感―利他性仮説によれば、純粋な共感は個人のコストに関わらず利他的な援助行動につながる。',
    synonyms: ['selflessness', 'prosocial motivation']
  },
  {
    id: 'psy_reluctant',
    word: 'reluctant',
    pos: 'adj.',
    pronunciation: '/rɪˈlʌktənt/',
    category: 'psychology',
    grade: 'Achieved',
    meaningJa: 'ためらう、気が進まない、消極的な',
    trapJa: '"Bystanders are reluctant to help when..."（〜のとき傍観者は助けるのをためらう）という形で、援助の障壁（恐怖・恥ずかしさ・高コスト）を説明するのにぴったりの形容詞です。',
    examExampleEn: 'Bystanders were more reluctant to help the drunk victim than the cane victim due to higher perceived costs.',
    examExampleJa: '傍観者は、知覚されるコストが高いため、杖の被害者よりも酔っ払いの被害者を助けることをためらった。',
    answerTipEn: 'People are often reluctant to intervene if they fear social embarrassment from misinterpreting the situation.',
    answerTipJa: '状況を誤解して社会的に恥をかくことを恐れると、人は介入するのをためらいがちになる。',
    synonyms: ['hesitant', 'unwilling', 'disinclined']
  },
  {
    id: 'psy_holistic',
    word: 'holistic',
    pos: 'adj.',
    pronunciation: '/həˈlɪstɪk/',
    category: 'psychology',
    grade: 'Excellence',
    meaningJa: '全体論的な、包括的な（身体・心・精神・家族のつながり全体を見る）',
    trapJa: 'ニュージーランド特有の Te Whare Tapa Whā モデル（4つの壁：身体・精神・心・家族）を西洋の個人主義的な心理学モデルと比較するときに、必ず使うExcellenceワードです！',
    examExampleEn: 'Te Whare Tapa Whā provides a holistic perspective on wellbeing and helping within a community.',
    examExampleJa: 'Te Whare Tapa Whā は、コミュニティ内でのウェルビーイングと助け合いに関する全体論的な（包括的な）視点を提供する。',
    answerTipEn: 'Unlike individualistic Western models, Māori perspectives emphasise holistic wellbeing and collective whānau responsibility.',
    answerTipJa: '個人主義的な西洋モデルとは異なり、マオリの視点は包括的なウェルビーイングとファナウ（家族・集団）の共同責任を重視する。',
    synonyms: ['comprehensive', 'integrated', 'whole-person']
  },

  // ============================================================
  // 6. ENGLISH L2 & UNFAMILIAR TEXTS VOCABULARY (16 words)
  // ============================================================
  {
    id: 'eng_convey',
    word: 'convey',
    pos: 'v.',
    pronunciation: '/kənˈveɪ/',
    category: 'english',
    grade: 'Achieved',
    meaningJa: '（感情・考え・メッセージを）伝える、表現する',
    trapJa: '問題文で "Explain how the writer conveys..." と毎回のようにお目にかかります。回答でも `"shows"` の代わりに `"conveys a sense of..."` と書くと表現力が上がります！',
    examExampleEn: 'Analyse how the writer uses language features to convey the harshness of the landscape.',
    examExampleJa: '筆者が風景の過酷さを「伝える」ためにどのように言語技法を使っているか分析しなさい。',
    answerTipEn: 'The director uses low-key lighting to convey the protagonist’s inner turmoil.',
    answerTipJa: '監督は主人公の内面の葛藤を伝えるためにローキー照明を用いている。',
    synonyms: ['communicate', 'express', 'portray']
  },
  {
    id: 'eng_evoke',
    word: 'evoke',
    pos: 'v.',
    pronunciation: '/ɪˈvəʊk/',
    category: 'english',
    grade: 'Merit',
    meaningJa: '（読者の心に感情・記憶・イメージを）呼び起こす、喚起する',
    trapJa: '読者への効果（Effect on the reader）を書くときの最強動詞！`"This makes the reader feel sad"` ではなく `"This evokes empathy and sorrow in the reader"` と書きましょう。',
    examExampleEn: 'Discuss how the poet evokes nostalgia for childhood throughout the stanza.',
    examExampleJa: '詩人が連全体を通してどのように幼少期への郷愁を呼び起こしているか論じなさい。',
    answerTipEn: 'The sensory imagery of warm rain evokes a comforting feeling of belonging.',
    answerTipJa: '温かい雨の感覚的なイメージ表現が、居場所があるという心地よい感覚を呼び起こす。',
    synonyms: ['elicit', 'arouse', 'awaken']
  },
  {
    id: 'eng_juxtaposition',
    word: 'juxtaposition',
    pos: 'n.',
    pronunciation: '/ˌdʒʌkstəpəˈzɪʃn/',
    category: 'english',
    grade: 'Excellence',
    meaningJa: '並置、対比（正反対の2つのイメージや概念を隣り合わせに置いて際立たせる技法）',
    trapJa: 'Unfamiliar Texts や映画・小説エッセイで「光と闇」「裕福さと貧困」「自然と人工物」が並んでいる箇所を見つけたら、"The juxtaposition of A and B highlights..." でExcellenceに直結します！',
    examExampleEn: 'The juxtaposition of the vibrant garden and the sterile hospital room highlights the loss of vitality.',
    examExampleJa: '生き生きとした庭と無機質な病室の対比（並置）が、生命力の喪失を際立たせている。',
    answerTipEn: 'By juxtaposing youthful optimism with war’s brutality, the author exposes the tragedy of lost innocence.',
    answerTipJa: '若者の楽観主義と戦争の残酷さを並置することで、筆者は失われた無垢さの悲劇を浮き彫りにしている。',
    synonyms: ['stark contrast', 'side-by-side comparison']
  },
  {
    id: 'eng_connotation',
    word: 'connotation',
    pos: 'n.',
    pronunciation: '/ˌkɒnəˈteɪʃn/',
    category: 'english',
    grade: 'Merit',
    meaningJa: '言外の意味、含み、連想されるニュアンス',
    trapJa: '単語選び（Diction / Word choice）を分析するときは、「辞書的な意味（denotation）」ではなく「その単語が持つプラス／マイナスの響き・連想（connotation）」を説明するのがNCEAの採点基準です！',
    examExampleEn: 'The word “shackled” carries strong connotations of imprisonment and powerlessness.',
    examExampleJa: '「鎖につながれた（shackled）」という語は、投獄や無力感という強い言外のニュアンス（含み）を持っている。',
    answerTipEn: 'Through words with predatory connotations, the writer portrays corporate greed as dangerous.',
    answerTipJa: '捕食を連想させるニュアンスを持つ語彙を通して、筆者は企業の強欲さを危険なものとして描いている。',
    synonyms: ['implication', 'undertone', 'association']
  },
  {
    id: 'eng_catalyst',
    word: 'catalyst',
    pos: 'n.',
    pronunciation: '/ˈkætəlɪst/',
    category: 'english',
    grade: 'Excellence',
    meaningJa: 'きっかけ、触媒（キャラクターの成長や物語の転換を引き起こす出来事・人物）',
    trapJa: '元々化学の「触媒」ですが、Englishのエッセイで「主人公が変化するきっかけ（serves as a catalyst for change）」として使うと構成力が際立ちます！',
    examExampleEn: 'Analyse how a pivotal event acts as a catalyst for a character’s transformation.',
    examExampleJa: '重要な出来事が、登場人物の変容の「きっかけ（触媒）」としてどのように機能するか分析しなさい。',
    answerTipEn: 'The tragic loss of his mentor serves as the catalyst that forces the protagonist to confront his fears.',
    answerTipJa: '師の悲劇的な喪失が、主人公に自らの恐怖と向き合わせるきっかけ（触媒）として働く。',
    synonyms: ['spark', 'trigger', 'turning point']
  },
  {
    id: 'eng_resilience',
    word: 'resilience',
    pos: 'n.',
    pronunciation: '/rɪˈzɪliəns/',
    category: 'english',
    grade: 'Excellence',
    meaningJa: '逆境から立ち直る力、精神的な回復力・強靭さ',
    trapJa: 'NCEAのエッセイで最も扱いやすい普遍的テーマ（Human nature / Theme）の1つ！「困難に直面しても折れずに成長する人間の強さ（human resilience in the face of adversity）」としてどんな作品にも応用できます。',
    examExampleEn: 'Through the protagonist’s journey, the director celebrates the resilience of the human spirit.',
    examExampleJa: '主人公の旅路を通して、監督は人間の精神が持つ「逆境から立ち直る強さ（レジリエンス）」を称えている。',
    answerTipEn: 'Ultimately, the text teaches us that true resilience comes from community support rather than isolation.',
    answerTipJa: '最終的にこの作品は、真の回復力（強さ）は孤立ではなく周囲との支え合いから生まれることを教えてくれる。',
    synonyms: ['fortitude', 'perseverance', 'grit']
  },
  {
    id: 'eng_marginalise',
    word: 'marginalise',
    pos: 'v.',
    pronunciation: '/ˈmɑːdʒɪnəlaɪz/',
    category: 'english',
    grade: 'Excellence',
    meaningJa: '（少数派や弱者を社会の）隅に追いやる、軽視する、疎外する',
    trapJa: '社会問題・差別・偏見を扱う小説や映画（Written/Visual Texts）で、「社会へのメッセージ（Wider societal relevance）」を書くときに絶大な威力を発揮する動詞です。',
    examExampleEn: 'Discuss how the text critiques a society that marginalises those who do not conform.',
    examExampleJa: '同調しない人々を社会の隅に追いやる（疎外する）社会を、作品がどのように批判しているか論じなさい。',
    answerTipEn: 'By giving voice to marginalised characters, the author challenges readers to question their own prejudices.',
    answerTipJa: '疎外された登場人物たちに声を与えることで、筆者は読者自身の偏見を問い直すよう促している。',
    synonyms: ['alienate', 'exclude', 'disempower']
  },
  {
    id: 'eng_pervasive',
    word: 'pervasive',
    pos: 'adj.',
    pronunciation: '/pəˈveɪsɪv/',
    category: 'english',
    grade: 'Excellence',
    meaningJa: '（雰囲気や影響が）隅々まで浸透している、蔓延している',
    trapJa: '作品の雰囲気（Atmosphere / Mood）や社会的なプレッシャーが「どこにでも広がっている」ことを表す高難度形容詞です。',
    examExampleEn: 'A pervasive sense of dread hangs over the opening scene of the film.',
    examExampleJa: '映画の冒頭シーンには、隅々まで張り詰めた（蔓延する）恐怖感が漂っている。',
    answerTipEn: 'The motif of surveillance symbolises the pervasive control of the totalitarian state.',
    answerTipJa: '監視のモチーフは、全体主義国家の隅々まで浸透した支配を象徴している。',
    synonyms: ['omnipresent', 'widespread', 'inescapable']
  }
];

// ============================================================
// EXAM CONTEXT DECODER SCENARIOS (試験問題文の読解・攻略クエスト)
// ============================================================
window.NCEA_CONTEXT_QUESTS = [
  {
    id: 'cq_phys_1',
    subject: 'Physics AS 91173',
    badgeColor: '#38bdf8',
    promptEn: 'A metal rod moves at a constant speed of 3.5 m/s <mark>parallel</mark> to a <mark>uniform</mark> magnetic field of 0.80 T. <mark>State</mark> the induced voltage across the rod.',
    promptJa: '金属棒が 0.80 T の一様な磁場に対して平行に 3.5 m/s の一定の速さで動く。棒の両端の誘導電圧を答えなさい。',
    question: 'この問題文のキーワードから判断して、正解とすべき行動はどれ？',
    options: [
      { text: '「parallel（磁場と平行）」なので磁力線を横切らず、計算なしで「0 V」と即答する', correct: true },
      { text: 'V = BvL に数値を代入して誘導電圧を計算し、詳しい理由を3文以上で書く', correct: false },
      { text: '「uniform（等加速度）」という意味なので運動方程式 F = ma を使う', correct: false },
      { text: '「State」は計算過程をすべて示せという意味なので途中式を詳しく書く', correct: false }
    ],
    explanation: '💡 <strong>2つの重要単語のコンボ！</strong><br>① <code>parallel</code>（磁場と平行）＝磁力線を切らないので誘導電圧は <strong>0 V</strong>（計算したら罠にはまります！）。<br>② <code>State</code>（簡潔に述べよ）なので「0 V」と一言答えるだけで満点です！'
  },
  {
    id: 'cq_phys_2',
    subject: 'Physics AS 91173',
    badgeColor: '#38bdf8',
    promptEn: 'In part (a), you found the current is 1.5 A. <mark>Hence</mark>, calculate the thermal energy <mark>dissipated</mark> in the 6.0 Ω resistor in 10 seconds, assuming heat loss to the surroundings is <mark>negligible</mark>.',
    promptJa: '(a)で電流が 1.5 A と求まった。したがって、周囲への熱損失が無視できると仮定し、10秒間に 6.0 Ω の抵抗で消費される熱エネルギーを計算しなさい。',
    question: 'この問題文の3つのハイライト単語の正しい読み取り方は？',
    options: [
      { text: '(a)の 1.5 A をそのまま使い（Hence）、消費エネルギー E = I²Rt を計算し（dissipated）、空気中への熱逃げは0としてよい（negligible）', correct: true },
      { text: '(a)の答えは使わずに別解法で解き（Hence）、失われた電圧を引き算する（negligible）', correct: false },
      { text: 'dissipated は「保存される」という意味なのでエネルギー変化を0とする', correct: false },
      { text: 'negligible は「非常に大きい」という意味なので熱損失の理由を論述する', correct: false }
    ],
    explanation: '💡 <strong>問題文がそのままヒントに変わる！</strong><br>・<code>Hence</code> ＝ 直前の 1.5 A をそのまま代入せよ！<br>・<code>dissipated</code> ＝ 抵抗で消費・放出される（E = P×t = I²Rt）。<br>・<code>negligible</code> ＝ 無視できるほど小さい（余計な補正計算は不要）。'
  },
  {
    id: 'cq_math_1',
    subject: 'Math & Stats AS 91267',
    badgeColor: '#6366f1',
    promptEn: 'The mean and standard deviation are 200 ml and 15 ml <mark>respectively</mark>. <mark>Given that</mark> a cup contains <mark>at least</mark> 185 ml, calculate the probability that it <mark>exceeds</mark> 215 ml.',
    promptJa: '平均と標準偏差はそれぞれ 200 ml と 15 ml である。カップに少なくとも 185 ml 入っているという条件のもとで、215 ml を超える確率を計算しなさい。',
    question: 'この統計問題文を数式に翻訳したとき、正しいものはどれ？',
    options: [
      { text: 'μ = 200, σ = 15 とし、条件付き確率 P(X > 215) ÷ P(X ≥ 185) を計算する', correct: true },
      { text: 'μ = 15, σ = 200 とし、P(185 ≤ X ≤ 215) の引き算をする', correct: false },
      { text: 'at least 185 は「185以下」なので P(X ≤ 185) を分母にする', correct: false },
      { text: 'exceeds 215 は「215未満」なので P(X < 215) を求める', correct: false }
    ],
    explanation: '💡 <strong>統計の4大キーワードが勢揃い！</strong><br>・<code>respectively</code> ＝ 順番通り（μ=200, σ=15）<br>・<code>Given that</code> ＝ 条件付き確率（後ろの条件が分母になる）<br>・<code>at least 185</code> ＝ 少なくとも185（X ≥ 185）<br>・<code>exceeds 215</code> ＝ 215を超える（X > 215）'
  },
  {
    id: 'cq_math_2',
    subject: 'Math & Stats AS 91267',
    badgeColor: '#6366f1',
    promptEn: '<mark>Compare and contrast</mark> the sample distribution with the normal model, and <mark>justify</mark> why the normal model may not be valid due to <mark>skewed</mark> data and <mark>outliers</mark>.',
    promptJa: '標本分布と正規分布モデルの共通点と相違点を比較し、歪んだデータと外れ値のせいで正規分布モデルが妥当でない可能性がある根拠を説明しなさい。',
    question: 'Excellenceを取るために回答に必ず含めるべき構成は？',
    options: [
      { text: '正規分布との「共通点」と「相違点」の両方を述べ、右/左への裾の歪み（skewed）や外れ値（outliers）というグラフの具体的な証拠（justify）を挙げる', correct: true },
      { text: '違いだけを1つ箇条書きにし、自分の感想を書く', correct: false },
      { text: '計算式だけを書いてグラフの形状には触れない', correct: false },
      { text: 'skewed は「左右対称」という意味なので正規分布が完璧に当てはまると主張する', correct: false }
    ],
    explanation: '💡 <strong>記述問題の採点チェックリスト！</strong><br>・<code>Compare and contrast</code> ＝ 共通点（Similarities）と相違点（Differences）の<strong>両方</strong>が必要。<br>・<code>Justify</code> ＝ グラフから読み取れる数値や特徴（歪み・外れ値）を根拠として明記する。'
  },
  {
    id: 'cq_psy_1',
    subject: 'Psychology AS 91847',
    badgeColor: '#a855f7',
    promptEn: '<mark>Evaluate</mark> the <mark>ecological validity</mark> of Darley and Latané’s (1968) seizure study, and discuss the real-world <mark>implications</mark> of <mark>diffusion of responsibility</mark>.',
    promptJa: 'ダーリーとラタネ(1968)の発作実験の生態学的妥当性を評価し、責任の分散が持つ実社会への示唆（影響）を論じなさい。',
    question: 'この心理学レポート課題で求められている内容は？',
    options: [
      { text: '実験室環境の「長所（統制）」と「短所（現実世界とのズレ＝生態学的妥当性の低さ）」を評価し、現実の緊急時に特定の人を指名すべきといった実用的な示唆を論じる', correct: true },
      { text: '実験の手順だけを最初から最後まであらすじとして要約する', correct: false },
      { text: 'ecological validity は「環境に優しい実験か」という意味なのでゴミの量を調べる', correct: false },
      { text: 'diffusion of responsibility は「1人のときほど助けなくなる」という意味として説明する', correct: false }
    ],
    explanation: '💡 <strong>AS 91847 Excellence 必須セット！</strong><br>・<code>Evaluate</code> ＝ 強み（変数の統制）と限界（現実味のなさ）の両面から評価。<br>・<code>ecological validity</code> ＝ 実験室の結果が現実の日常に当てはまるか。<br>・<code>implications</code> ＝ 実社会でどう活かせるか（緊急時は「そこの青い服のあなた！」と指名する等）。'
  },
  {
    id: 'cq_eng_1',
    subject: 'English AS 91100',
    badgeColor: '#f43f5e',
    promptEn: 'Analyse how the writer uses <mark>juxtaposition</mark> and word choices with negative <mark>connotations</mark> to <mark>convey</mark> the protagonist’s <mark>resilience</mark>.',
    promptJa: '筆者が主人公の逆境から立ち直る強さ（レジリエンス）を伝えるために、並置（対比）とマイナスの含みを持つ語彙選択をどのように使っているか分析しなさい。',
    question: 'この Unfamiliar Texts の問題で分析すべきポイントは？',
    options: [
      { text: '対照的な2つの描写の並び（juxtaposition）と、単語が持つ暗い連想（connotations）を引用し、それらがどう主人公の「折れない強さ（resilience）」を伝えているか説明する', correct: true },
      { text: '物語のあらすじだけを要約し、技法（手法）には触れない', correct: false },
      { text: 'connotations は「辞書通りの発音」という意味なので韻（rhyme）だけを探す', correct: false },
      { text: 'resilience は「絶望して諦めること」という意味として結論づける', correct: false }
    ],
    explanation: '💡 <strong>English 初見読解の黄金パターン！</strong><br>・<code>juxtaposition</code> ＝ 対照的なイメージの並置。<br>・<code>connotations</code> ＝ 単語が持つ言外の連想・ニュアンス。<br>・<code>convey</code> ＝ 伝える。<br>・<code>resilience</code> ＝ 困難に負けない精神的な強さ・回復力。'
  }
];

// ============================================================
// ANSWER UPGRADE CHALLENGES (Achieved → Excellence 回答アップグレード)
// ============================================================
window.NCEA_UPGRADE_CHALLENGES = [
  {
    id: 'upg_1',
    subject: '⚡ Physics (回路と電力)',
    contextJa: '並列回路に抵抗を追加したとき、電池から流れる全電流と内部抵抗での電圧降下がどうなるかを説明する場面',
    basicEn: 'When another branch is added, total resistance goes down, so total current goes up, and more voltage is lost inside the battery.',
    basicGrade: 'Achieved (日常英語でやや幼い表現)',
    targetEn: 'When another branch is added in <mark>[ 1 ]</mark>, total resistance decreases. <mark>[ 2 ]</mark>, the total current drawn from the source increases, which <mark>[ 3 ]</mark> increases the energy <mark>[ 4 ]</mark> across the internal resistance.',
    targetJa: '並列に別の枝が追加されると全抵抗は減少する。その結果として電源から流れる全電流が増加し、それに伴い内部抵抗で消費（散逸）されるエネルギーが増加する。',
    blanks: [
      { index: 1, answer: 'parallel', choices: ['parallel', 'perpendicular', 'uniform', 'stationary'] },
      { index: 2, answer: 'Consequently', choices: ['Consequently', 'Whereas', 'Conversely', 'Respectively'] },
      { index: 3, answer: 'subsequently', choices: ['subsequently', 'negligibly', 'initially', 'ambiguous'] },
      { index: 4, answer: 'dissipated', choices: ['dissipated', 'suspended', 'deflected', 'skewed'] }
    ]
  },
  {
    id: 'upg_2',
    subject: '🧠 Psychology (傍観者効果の論述)',
    contextJa: 'なぜ大人数の前かつ曖昧な状況では人が助けに入るのをためらうのかを説明する場面',
    basicEn: 'People do not want to help in a big group because everyone thinks someone else will do it, and it is hard to tell if it is really an emergency.',
    basicGrade: 'Achieved (専門用語が使えていない)',
    targetEn: 'Bystanders are often <mark>[ 1 ]</mark> to <mark>[ 2 ]</mark> in large groups because this can be <mark>[ 3 ]</mark> to <mark>[ 4 ]</mark> and the <mark>[ 5 ]</mark> nature of the emergency.',
    targetJa: '傍観者が大きな集団の中で介入する（助けに入る）のをためらいがちなのは、責任の分散および緊急事態の曖昧な性質が原因であると考えられるからだ。',
    blanks: [
      { index: 1, answer: 'reluctant', choices: ['reluctant', 'uniform', 'symmetrical', 'inclusive'] },
      { index: 2, answer: 'intervene', choices: ['intervene', 'dissipate', 'exceed', 'deflect'] },
      { index: 3, answer: 'attributed', choices: ['attributed', 'undermined', 'juxtaposed', 'induced'] },
      { index: 4, answer: 'diffusion of responsibility', choices: ['diffusion of responsibility', 'ecological validity', 'confounding variable', 'mutual exclusivity'] },
      { index: 5, answer: 'ambiguous', choices: ['ambiguous', 'negligible', 'proportional', 'holistic'] }
    ]
  },
  {
    id: 'upg_3',
    subject: '📐 Mathematics (正規分布の妥当性評価)',
    contextJa: '標本ヒストグラムと正規分布モデルを比較し、なぜ正規分布が不適切かを根拠づける場面',
    basicEn: 'A normal model is even on both sides, but this graph leans to the right and has a weird big number, so the model is not good.',
    basicGrade: 'Achieved (統計用語が不足)',
    targetEn: 'A normal distribution is <mark>[ 1 ]</mark> about the mean, <mark>[ 2 ]</mark> this sample distribution is strongly <mark>[ 3 ]</mark> to the right and contains an extreme <mark>[ 4 ]</mark>, which <mark>[ 5 ]</mark> the validity of the model.',
    targetJa: '正規分布は平均を中心に左右対称であるのに対し、この標本分布は右に強く歪んでおり極端な外れ値を含んでいるため、モデルの妥当性が損なわれている。',
    blanks: [
      { index: 1, answer: 'symmetrical', choices: ['symmetrical', 'perpendicular', 'stationary', 'altruistic'] },
      { index: 2, answer: 'whereas', choices: ['whereas', 'hence', 'respectively', 'simultaneously'] },
      { index: 3, answer: 'skewed', choices: ['skewed', 'suspended', 'marginalised', 'induced'] },
      { index: 4, answer: 'outlier', choices: ['outlier', 'catalyst', 'magnitude', 'connotation'] },
      { index: 5, answer: 'undermines', choices: ['undermines', 'reinforces', 'conveys', 'evokes'] }
    ]
  },
  {
    id: 'upg_4',
    subject: '📖 English (エッセイ・技法分析)',
    contextJa: '作者が対比と単語のニュアンスを使って、主人公の立ち直る強さと読者の共感を呼び起こす場面',
    basicEn: 'By putting dark and bright things next to each other and using strong words, the writer shows the character is strong and makes the reader feel something.',
    basicGrade: 'Achieved ("shows" と "makes the reader feel" ばかり)',
    targetEn: 'Through the <mark>[ 1 ]</mark> of light and shadow and words with bleak <mark>[ 2 ]</mark>, the author <mark>[ 3 ]</mark> the protagonist’s <mark>[ 4 ]</mark> and <mark>[ 5 ]</mark> deep empathy in the reader.',
    targetJa: '光と影の並置（対比）と荒涼としたニュアンスを持つ語彙を通して、筆者は主人公の逆境から立ち直る強さを伝え、読者に深い共感を呼び起こしている。',
    blanks: [
      { index: 1, answer: 'juxtaposition', choices: ['juxtaposition', 'diffusion', 'proportion', 'deviation'] },
      { index: 2, answer: 'connotations', choices: ['connotations', 'assumptions', 'magnitudes', 'components'] },
      { index: 3, answer: 'conveys', choices: ['conveys', 'exceeds', 'dissipates', 'deflects'] },
      { index: 4, answer: 'resilience', choices: ['resilience', 'conformity', 'pluralistic ignorance', 'outlier'] },
      { index: 5, answer: 'evokes', choices: ['evokes', 'undermines', 'opposes', 'approximates'] }
    ]
  }
];

// ============================================================
// COMMAND WORD MATRIX FOR TAB 3 (指示語完全解剖データ)
// ============================================================
window.NCEA_COMMAND_MATRIX = [
  {
    grade: 'Achieved',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.12)',
    words: [
      {
        cmd: 'State / Give / Name',
        meaning: '（理由・計算なしで）簡潔に述べる',
        whatToDo: '1文または単語・数値＋単位・向きだけで即答する。長い説明は書かない（時間の節約！）。',
        starter: 'The direction of the magnetic field is [into the page / from North to South].'
      },
      {
        cmd: 'Calculate / Find',
        meaning: '数値を計算して求める',
        whatToDo: '使う公式 → 数値の代入 → 単位付きの答えを書く。有効数字（通常2〜3桁）と単位を忘れない。',
        starter: 'Using V = BvL = (0.50)(12)(0.25) = 1.5 V.'
      },
      {
        cmd: 'Show that',
        meaning: '〜であることを（途中式を示して）証明する',
        whatToDo: '答えの数値は問題文に書いてあるので、そこに至る「公式と代入の途中過程」を1ステップも飛ばさずに書く。',
        starter: 'R_total = R_1 + R_2 = 4.0 + 8.0 = 12.0 Ω (as required).'
      },
      {
        cmd: 'Describe',
        meaning: '何が起きるか（特徴や変化）を描写する',
        whatToDo: '「なぜそうなるか（Because）」の前に、「何がどう変化するか（増える・減る・曲がる・右に歪む）」を正確に書く。',
        starter: 'As the resistance increases, the brightness of the lamp decreases and the particle curves upwards.'
      }
    ]
  },
  {
    grade: 'Merit',
    color: '#fbbf24',
    bg: 'rgba(251, 191, 36, 0.12)',
    words: [
      {
        cmd: 'Explain (why / how)',
        meaning: '原因と結果のつながり（Because / Therefore）を論理的に説明する',
        whatToDo: '現象の背後にある法則・公式・メカニズムを使って「AだからBになり、その結果Cになる」と2〜3ステップをつなげる。',
        starter: 'Because [cause/formula], [intermediate effect]. Consequently, [final result].'
      },
      {
        cmd: 'Hence (calculate / explain)',
        meaning: '直前の結果を使って（導け）',
        whatToDo: '1つ前の設問で求めた数値や結論をそのまま出発点として使う。ゼロから別ルートで解こうとしない！',
        starter: 'From part (a), I = 2.4 A. Hence, P = I²R = (2.4)² × 5.0 = 28.8 W.'
      },
      {
        cmd: 'Compare and contrast',
        meaning: '共通点（Compare）と相違点（Contrast）の両方を述べる',
        whatToDo: '「Both A and B...（共通点）」を1文、「However, whereas A..., B...（相違点）」を1〜2文、必ず両方セットで書く。',
        starter: 'Both distributions are unimodal; however, Group A is symmetrical whereas Group B is right-skewed.'
      },
      {
        cmd: 'Account for',
        meaning: '〜が生じる理由・原因を説明する',
        whatToDo: '観察された違いや変化が「何によって引き起こされたのか」を理論や公式を根拠に説明する。',
        starter: 'This difference can be accounted for by the internal resistance of the battery causing lost volts.'
      }
    ]
  },
  {
    grade: 'Excellence',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    words: [
      {
        cmd: 'Justify',
        meaning: '具体的な証拠（数値・グラフ・法則）を挙げて結論の正しさを証明する',
        whatToDo: '自分の選んだ結論（Yes/Noやモデル選択）に対して、グラフの数値・計算結果・物理法則を直接引用して裏付ける。',
        starter: 'This choice is justified because [specific evidence/data], which demonstrates that [conclusion].'
      },
      {
        cmd: 'Discuss',
        meaning: '複数の要因・条件・影響を統合して深く論じる',
        whatToDo: '「原因 → メカニズム → 結果」に加え、「もし逆だったら（Conversely）」「前提条件（Assumption）」まで踏み込んで書く。',
        starter: 'When [condition], [mechanism] occurs. Consequently, [result]. Furthermore, if [alternative], then...'
      },
      {
        cmd: 'Evaluate',
        meaning: '長所（Strengths）と限界（Limitations）を比較して妥当性を評価する',
        whatToDo: '片方だけでなく「良い点」と「問題点・限界（交絡変数や前提の崩れ）」の両方を挙げ、最終的な判断を下す。',
        starter: 'While [strength], its validity is limited because [limitation/confounding factor]. Overall, ...'
      },
      {
        cmd: 'To what extent',
        meaning: 'どの程度〜か（程度と条件を論じる）',
        whatToDo: '「かなりの程度当てはまる（To a large extent）が、〜という状況下では例外・限界がある（however, ...）」と条件付きで論じる。',
        starter: 'To a significant extent, [main argument]; however, this is undermined when [exception/counterpoint].'
      }
    ]
  }
];

// ============================================================
// GAMIFICATION RANKS & ACHIEVEMENT BADGES
// ============================================================
window.NCEA_RANKS = [
  { level: 1, minXp: 0, title: 'NCEA Challenger', titleJa: 'NCEA チャレンジャー', icon: '🌱' },
  { level: 2, minXp: 100, title: 'Prompt Reader', titleJa: '問題文リーダー', icon: '🔍' },
  { level: 3, minXp: 250, title: 'Achieved Striker', titleJa: 'Achieved 突破者', icon: '⚡' },
  { level: 4, minXp: 450, title: 'Command Decoder', titleJa: '指示語デコーダー', icon: '🧭' },
  { level: 5, minXp: 700, title: 'Merit Contender', titleJa: 'Merit コンテンダー', icon: '🌟' },
  { level: 6, minXp: 1000, title: 'Context Tactician', titleJa: '文脈タクティシャン', icon: '🎯' },
  { level: 7, minXp: 1400, title: 'Excellence Writer', titleJa: 'Excellence ライター', icon: '✍️' },
  { level: 8, minXp: 1900, title: 'Kiwi Polymath', titleJa: 'NZ マルチ科目マスター', icon: '🥝' },
  { level: 9, minXp: 2500, title: 'NCEA L2 Grandmaster', titleJa: 'NCEA L2 グランドマスター', icon: '👑' },
  { level: 10, minXp: 3200, title: 'Aotearoa Legend', titleJa: 'アオテアロアの伝説', icon: '🏆' }
];

window.NCEA_BADGES = [
  {
    id: 'badge_first_step',
    name: 'First Step',
    nameJa: '最初の一歩',
    icon: '🚀',
    desc: '初めてクイズまたはカード学習を完了した',
    check: (s) => s.totalAnswered >= 1 || Object.keys(s.mastery).length >= 1
  },
  {
    id: 'badge_combo_5',
    name: 'Combo Striker',
    nameJa: '5連続コンボ達成',
    icon: '🔥',
    desc: 'ゲームモードで5問連続正解コンボを達成した',
    check: (s) => s.bestCombo >= 5
  },
  {
    id: 'badge_combo_10',
    name: 'Unstoppable 10',
    nameJa: '10連続コンボ無双',
    icon: '⚡',
    desc: 'ゲームモードで10問連続正解コンボを達成した',
    check: (s) => s.bestCombo >= 10
  },
  {
    id: 'badge_blitz_hero',
    name: 'Blitz Sprinter',
    nameJa: '60秒ブリッツの韋駄天',
    icon: '⏱️',
    desc: '60秒タイムアタックで 500 pts 以上を獲得した',
    check: (s) => s.bestBlitzScore >= 500
  },
  {
    id: 'badge_survival_ace',
    name: 'Survival Ace',
    nameJa: 'サバイバル・エース',
    icon: '❤️',
    desc: 'サバイバルモードで 800 pts 以上を獲得した',
    check: (s) => s.bestSurvivalScore >= 800
  },
  {
    id: 'badge_context_clear',
    name: 'Prompt Decoder',
    nameJa: '試験問題文デコーダー',
    icon: '🎯',
    desc: '「試験文脈バトル（Exam Prompt Decoder）」で5問以上正解した',
    check: (s) => s.contextCorrect >= 5
  },
  {
    id: 'badge_upgrader',
    name: 'Excellence Alchemist',
    nameJa: 'Excellence 錬金術師',
    icon: '✍️',
    desc: '「回答アップグレードパズル」でAchieved文をExcellence文に進化させた',
    check: (s) => s.upgradesCompleted >= 1
  },
  {
    id: 'badge_command_master',
    name: 'Command General',
    nameJa: '指示語マスター',
    icon: '🧭',
    desc: '「試験指示語（Command Words）」カテゴリの単語を10個以上マスター（🟢）にした',
    check: (s, words) => words.filter(w => w.category === 'command' && s.mastery[w.id] === 2).length >= 10
  },
  {
    id: 'badge_vocab_20',
    name: 'Word Collector 20',
    nameJa: '20単語マスター',
    icon: '📗',
    desc: '合計20個以上の英単語を「完璧に使える（🟢）」にした',
    check: (s) => Object.values(s.mastery).filter(v => v === 2).length >= 20
  },
  {
    id: 'badge_vocab_50',
    name: 'Lexicon Scholar 50',
    nameJa: '50単語マスター',
    icon: '📚',
    desc: '合計50個以上の英単語を「完璧に使える（🟢）」にした',
    check: (s) => Object.values(s.mastery).filter(v => v === 2).length >= 50
  },
  {
    id: 'badge_audio_listener',
    name: 'Kiwi Listener',
    nameJa: '発音リスナー',
    icon: '🔊',
    desc: 'ネイティブ発音読み上げ機能を5回以上使った',
    check: (s) => (s.audioPlays || 0) >= 5
  },
  {
    id: 'badge_level_5',
    name: 'Merit & Beyond',
    nameJa: 'レベル5到達',
    icon: '👑',
    desc: 'プレイヤーレベル 5（700 XP）以上に到達した',
    check: (s) => s.xp >= 700
  }
];
