/**
 * Walker Maths Page 38, 39, 40 Problem Sets & Step-by-Step Data
 */

window.MATH_PROBLEMS_DATA = {
  // Page 38: 10 Z-Lookup Quick Drills
  page38Drills: [
    { id: 1, p: 0.4922, ansZ: 2.418, hint: "表の .4922 は z=2.41 の .4920 に差分 +2 (列8)" },
    { id: 2, p: 0.0636, ansZ: 0.160, hint: "表の z=0.1, 列6 にそのまま .0636 があります" },
    { id: 3, p: 0.4987, ansZ: 3.012, hint: "表の z=3.0, 列0 が .4987 です" },
    { id: 4, p: 0.3425, ansZ: 1.005, hint: "z=1.00 の .3413 に差分 +12 (列5)" },
    { id: 5, p: 0.4753, ansZ: 1.965, hint: "z=1.96 の .4750 に差分 +3 (列5)" },
    { id: 6, p: 0.2085, ansZ: 0.549, hint: "z=0.54 の .2054 に差分 +31 (列9)" },
    { id: 7, p: 0.4606, ansZ: 1.757, hint: "z=1.75 の .4599 に差分 +7 (列7)" },
    { id: 8, p: 0.4840, ansZ: 2.144, hint: "z=2.14 の .4838 に差分 +2 (列4)" },
    { id: 9, p: 0.0434, ansZ: 0.109, hint: "z=0.10 の .0398 に差分 +36 (列9)" },
    { id: 10, p: 0.4914, ansZ: 2.382, hint: "z=2.38 の .4913 に差分 +1 (列2)" }
  ],

  // Page 39-40: 5-Step Comprehensive Word Problems
  wordProblems: [
    {
      id: "prob_1",
      page: 39,
      number: 1,
      title: "Problem 1: School Long-Jump Competition",
      titleJa: "問題1：学校の走り幅跳び大会（ボーナスポイント基準）",
      questionEn: "The distances jumped in a school long-jump competition have a mean of 170 cm with a standard deviation of 15 cm. The top 20% of competitors will get a bonus point for their house. What is the minimum distance jumped that will earn a bonus point?",
      questionJa: "ある学校の走り幅跳び大会における跳躍距離は、平均 170 cm、標準偏差 15 cm の正規分布に従います。上位 20% の選手にはハウスのボーナスポイントが与えられます。ボーナスポイントを獲得するために必要な最小の跳躍距離は何 cm ですか？",
      params: { mean: 170, sd: 15, tailProb: 0.20, tailType: "upper", unit: "cm" },
      steps: {
        step1: {
          titleJa: "Step 1: 正規分布の図を描く (Draw the picture)",
          descJa: "平均 μ = 170 cm を中心に描き、上位 20%（右側の裾野）を塗ります。正規分布表で使う「平均から境界線までの確率」は 0.5 - 0.20 = 0.3000 となります。",
          tailArea: 0.20,
          tableArea: 0.3000
        },
        step2: {
          titleJa: "Step 2: Z値を表から逆引きする (Look up Z value)",
          descJa: "P(170 < x < d) = 0.3000 を表で探すと、0.2996 (z=0.84) に差分 +4 (列1) を加えて Z = 0.841 となります。",
          targetP: 0.3000,
          zValue: 0.841
        },
        step3: {
          titleJa: "Step 3: 公式を使って実測値 x を計算する (Calculate x)",
          formula: "x = \\mu + Z \\times \\sigma",
          calculation: "x = 170 + (0.841 \\times 15) = 170 + 12.615 = 182.615\\text{ cm}",
          ansValue: 182.615,
          ansRounded: "182.6 cm"
        },
        step4: {
          titleJa: "Step 4: 文脈に沿った英語の完全な文章で解答する (Write in context)",
          sentenceEn: "The minimum distance jumped that will earn a bonus point is 182.6 cm (or twenty per cent of competitors jumped more than 182.6 cm).",
          sentenceJa: "ボーナスポイントを獲得するための最小跳躍距離は 182.6 cm です。"
        },
        step5: {
          titleJa: "Step 5: 答えの妥当性を確認する (Does my answer make sense?)",
          checkJa: "はい。上位20%は平均より優れている必要があるため、計算結果 182.6 cm が平均 170 cm を上回っているのは極めて妥当です。"
        }
      }
    },
    {
      id: "prob_2",
      page: 40,
      number: 2,
      title: "Problem 2: Apple Orchard Harvest & Upper Quartile",
      titleJa: "問題2：果樹園のリンゴ収穫量と第3四分位数 (Upper Quartile)",
      questionEn: "It is known that weights of apples produced per tree in an orchard are normally distributed with a mean of 120 kg, and the standard deviation is 23 kg. Calculate the upper quartile (above which 25% of values lie).",
      questionJa: "ある果樹園の木1本当たりから収穫されるリンゴの重量は、平均 120 kg、標準偏差 23 kg の正規分布に従います。Upper Quartile（第3四分位数：これを超える値が上位25%となる境界値）を計算してください。",
      params: { mean: 120, sd: 23, tailProb: 0.25, tailType: "upper", unit: "kg" },
      steps: {
        step1: {
          titleJa: "Step 1: 正規分布の図を描く (Draw the picture)",
          descJa: "Upper Quartile (Q3) は上位 25% (0.25) の値です。表で引く中心からの確率は 0.5 - 0.25 = 0.2500 となります。",
          tailArea: 0.25,
          tableArea: 0.2500
        },
        step2: {
          titleJa: "Step 2: Z値を表から逆引きする (Look up Z value)",
          descJa: "P(120 < x < Q3) = 0.2500 を表で探すと、0.2486 (z=0.67) に差分 +14 (列4) を加えて Z = 0.674 となります。",
          targetP: 0.2500,
          zValue: 0.674
        },
        step3: {
          titleJa: "Step 3: 公式を使って実測値 x を計算する (Calculate x)",
          formula: "Q_3 = \\mu + Z \\times \\sigma",
          calculation: "Q_3 = 120 + (0.674 \\times 23) = 120 + 15.502 = 135.502\\text{ kg}",
          ansValue: 135.502,
          ansRounded: "135.5 kg"
        },
        step4: {
          titleJa: "Step 4: 文脈に沿った英語の完全な文章で解答する (Write in context)",
          sentenceEn: "The upper quartile of apple weights produced per tree is 135.5 kg (25% of trees produce more than 135.5 kg of apples).",
          sentenceJa: "木1本当たりのリンゴ収穫量の第3四分位数は 135.5 kg です。"
        },
        step5: {
          titleJa: "Step 5: 答えの妥当性を確認する (Does my answer make sense?)",
          checkJa: "はい。Upper Quartile は中央値（平均 120 kg）よりも大きくなるため、135.5 kg は妥当です。"
        }
      }
    },
    {
      id: "prob_3",
      page: 40,
      number: 3,
      title: "Problem 3: Music Examination Distinction",
      titleJa: "問題3：音楽試験のDistinction（優秀賞・上位5%）境界点",
      questionEn: "A music examination is marked out of 150. The marks are normally distributed with a mean of 95 and a standard deviation of 15. The top 5% of students are awarded distinction. Calculate the lowest mark that would qualify for distinction.",
      questionJa: "150点満点の音楽の試験があり、得点は平均 95点、標準偏差 15点の正規分布に従います。上位 5% の生徒に Distinction（優秀賞）が授与されます。Distinction を獲得するために必要な最低得点を求めてください。",
      params: { mean: 95, sd: 15, tailProb: 0.05, tailType: "upper", unit: "marks" },
      steps: {
        step1: {
          titleJa: "Step 1: 正規分布の図を描く (Draw the picture)",
          descJa: "上位 5%（右裾 0.05）の境界点を求めます。表で引く中心からの確率は 0.5 - 0.05 = 0.4500 となります。",
          tailArea: 0.05,
          tableArea: 0.4500
        },
        step2: {
          titleJa: "Step 2: Z値を表から逆引きする (Look up Z value)",
          descJa: "P(95 < x < mark) = 0.4500 を表で探すと、0.4495 (z=1.64) に差分 +5 (列5) を加えて Z = 1.645 となります。",
          targetP: 0.4500,
          zValue: 1.645
        },
        step3: {
          titleJa: "Step 3: 公式を使って実測値 x を計算する (Calculate x)",
          formula: "x = \\mu + Z \\times \\sigma",
          calculation: "x = 95 + (1.645 \\times 15) = 95 + 24.675 = 119.675\\text{ marks}",
          ansValue: 119.675,
          ansRounded: "119.7 marks (or 120 marks)"
        },
        step4: {
          titleJa: "Step 4: 文脈に沿った英語の完全な文章で解答する (Write in context)",
          sentenceEn: "The lowest mark that would qualify for distinction is 119.7 (or 120) marks out of 150.",
          sentenceJa: "Distinction を獲得するための最低得点は 119.7点（または120点）です。"
        },
        step5: {
          titleJa: "Step 5: 答えの妥当性を確認する (Does my answer make sense?)",
          checkJa: "はい。満点150点のうち、上位5%の難関基準として平均95点を大幅に上回る 119.7点は非常に妥当です。"
        }
      }
    },
    {
      id: "prob_4",
      page: 40,
      number: 4,
      title: "Problem 4: Farmer's Courgettes and Marrows Classification",
      titleJa: "問題4：ズッキーニとマロウ（巨大カボチャ類・上位5%）の選別重量",
      questionEn: "A farmer harvests his courgettes when their mean weight is 150 g, with a standard deviation of 55 g. Assume that the distribution of the courgette weights is normal. The largest courgettes return a much lower price because they are classified as marrows. If 5% of his crop consists of marrows, calculate the minimum weight for a courgette to be classified as a marrow.",
      questionJa: "ある農家が収穫するズッキーニの重量は、平均 150 g、標準偏差 55 g の正規分布に従います。最も重いズッキーニは「マロウ」として分類され、取引価格が大幅に下がってしまいます。収穫量の 5% がマロウとして分類される場合、マロウと見なされる最小の重量は何 g ですか？",
      params: { mean: 150, sd: 55, tailProb: 0.05, tailType: "upper", unit: "g" },
      steps: {
        step1: {
          titleJa: "Step 1: 正規分布の図を描く (Draw the picture)",
          descJa: "最も重い 5%（上位 0.05）がマロウです。表で引く中心からの確率は 0.5 - 0.05 = 0.4500 となります。",
          tailArea: 0.05,
          tableArea: 0.4500
        },
        step2: {
          titleJa: "Step 2: Z値を表から逆引きする (Look up Z value)",
          descJa: "P(150 < x < weight) = 0.4500 より、Z = 1.645 となります（問題3と同様）。",
          targetP: 0.4500,
          zValue: 1.645
        },
        step3: {
          titleJa: "Step 3: 公式を使って実測値 x を計算する (Calculate x)",
          formula: "x = \\mu + Z \\times \\sigma",
          calculation: "x = 150 + (1.645 \\times 55) = 150 + 90.475 = 240.475\\text{ g}",
          ansValue: 240.475,
          ansRounded: "240.5 g"
        },
        step4: {
          titleJa: "Step 4: 文脈に沿った英語の完全な文章で解答する (Write in context)",
          sentenceEn: "The minimum weight for a courgette to be classified as a marrow is 240.5 g.",
          sentenceJa: "マロウとして分類される最小の重量は 240.5 g です。"
        },
        step5: {
          titleJa: "Step 5: 答えの妥当性を確認する (Does my answer make sense?)",
          checkJa: "はい。240.5 g は平均 150 g よりもかなり重く、最重量5%のマロウの閾値として適切です。"
        }
      }
    }
  ]
};
