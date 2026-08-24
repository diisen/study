/**
 * Walker Maths Official Normal Distribution Table Data (Inverse & Forward Z-Table)
 * Represents P(0 < Z < z) from mean to z.
 * Includes base matrix (columns 0-9) and Differences (columns 1-9).
 */

window.Z_TABLE_DATA = {
  // Table rows from z = 0.0 to 3.0
  rows: [
    { z: 0.0, base: [0, 40, 80, 120, 160, 199, 239, 279, 319, 359], diff: [4, 8, 12, 16, 20, 24, 28, 32, 36] },
    { z: 0.1, base: [398, 438, 478, 517, 557, 596, 636, 675, 714, 754], diff: [4, 8, 12, 16, 20, 24, 28, 32, 36] },
    { z: 0.2, base: [793, 832, 871, 910, 948, 987, 1026, 1064, 1103, 1141], diff: [4, 8, 12, 15, 19, 22, 27, 31, 35] },
    { z: 0.3, base: [1179, 1217, 1255, 1293, 1331, 1368, 1406, 1443, 1480, 1517], diff: [4, 8, 11, 15, 19, 22, 26, 30, 34] },
    { z: 0.4, base: [1551, 1591, 1628, 1664, 1700, 1736, 1772, 1808, 1844, 1879], diff: [4, 7, 11, 14, 18, 22, 25, 29, 32] },
    { z: 0.5, base: [1915, 1950, 1985, 2019, 2054, 2088, 2123, 2157, 2190, 2224], diff: [3, 7, 10, 14, 17, 21, 24, 27, 31] },
    { z: 0.6, base: [2258, 2291, 2324, 2357, 2389, 2422, 2454, 2486, 2518, 2549], diff: [3, 6, 10, 13, 16, 19, 23, 26, 29] },
    { z: 0.7, base: [2580, 2612, 2642, 2673, 2704, 2736, 2764, 2796, 2823, 2852], diff: [3, 6, 9, 12, 15, 18, 21, 24, 27] },
    { z: 0.8, base: [2881, 2910, 2939, 2967, 2996, 3023, 3051, 3078, 3106, 3133], diff: [3, 6, 8, 11, 14, 17, 19, 22, 25] },
    { z: 0.9, base: [3159, 3186, 3212, 3238, 3264, 3289, 3315, 3340, 3365, 3389], diff: [3, 5, 8, 10, 13, 15, 18, 20, 23] },
    { z: 1.0, base: [3413, 3438, 3461, 3485, 3508, 3531, 3554, 3577, 3599, 3621], diff: [2, 5, 7, 9, 12, 14, 16, 18, 21] },
    { z: 1.1, base: [3643, 3665, 3686, 3708, 3729, 3749, 3770, 3790, 3810, 3830], diff: [2, 4, 6, 8, 10, 12, 14, 16, 19] },
    { z: 1.2, base: [3849, 3869, 3888, 3907, 3925, 3944, 3962, 3980, 3997, 4015], diff: [2, 4, 5, 7, 9, 11, 13, 15, 16] },
    { z: 1.3, base: [4032, 4049, 4066, 4082, 4099, 4115, 4131, 4147, 4162, 4177], diff: [2, 3, 5, 6, 8, 10, 11, 13, 14] },
    { z: 1.4, base: [4192, 4207, 4222, 4236, 4251, 4265, 4279, 4292, 4306, 4319], diff: [1, 3, 4, 6, 7, 8, 10, 11, 13] },
    { z: 1.5, base: [4332, 4345, 4357, 4370, 4382, 4394, 4406, 4418, 4429, 4441], diff: [1, 2, 4, 5, 6, 7, 8, 10, 11] },
    { z: 1.6, base: [4452, 4463, 4474, 4484, 4495, 4505, 4515, 4525, 4535, 4545], diff: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
    { z: 1.7, base: [4554, 4564, 4573, 4582, 4591, 4599, 4608, 4616, 4625, 4633], diff: [1, 2, 3, 4, 4, 5, 6, 7, 8] },
    { z: 1.8, base: [4641, 4649, 4656, 4664, 4671, 4678, 4686, 4693, 4699, 4706], diff: [1, 1, 2, 3, 4, 4, 5, 6, 7] },
    { z: 1.9, base: [4713, 4719, 4726, 4732, 4738, 4744, 4750, 4756, 4761, 4767], diff: [1, 1, 2, 2, 3, 4, 4, 5, 6] },
    { z: 2.0, base: [4772, 4778, 4783, 4788, 4793, 4798, 4803, 4808, 4812, 4817], diff: [0, 1, 1, 2, 2, 3, 3, 4, 4] },
    { z: 2.1, base: [4821, 4826, 4830, 4834, 4838, 4842, 4846, 4850, 4854, 4857], diff: [0, 1, 1, 2, 2, 2, 3, 3, 4] },
    { z: 2.2, base: [4861, 4864, 4868, 4871, 4875, 4878, 4881, 4884, 4887, 4890], diff: [0, 1, 1, 1, 2, 2, 2, 3, 3] },
    { z: 2.3, base: [4893, 4896, 4898, 4901, 4904, 4906, 4909, 4911, 4913, 4916], diff: [0, 0, 1, 1, 1, 1, 2, 2, 2] },
    { z: 2.4, base: [4918, 4920, 4922, 4925, 4927, 4929, 4931, 4932, 4934, 4936], diff: [0, 0, 1, 1, 1, 1, 1, 2, 2] },
    { z: 2.5, base: [4938, 4940, 4941, 4943, 4945, 4946, 4948, 4949, 4951, 4952], diff: [0, 0, 0, 1, 1, 1, 1, 1, 1] },
    { z: 2.6, base: [4953, 4955, 4956, 4957, 4959, 4960, 4961, 4962, 4963, 4964], diff: [0, 0, 0, 0, 1, 1, 1, 1, 1] },
    { z: 2.7, base: [4965, 4966, 4967, 4968, 4969, 4970, 4971, 4972, 4973, 4974], diff: [0, 0, 0, 0, 0, 1, 1, 1, 1] },
    { z: 2.8, base: [4974, 4975, 4976, 4977, 4977, 4978, 4979, 4979, 4980, 4981], diff: [0, 0, 0, 0, 0, 0, 0, 1, 1] },
    { z: 2.9, base: [4981, 4982, 4982, 4983, 4984, 4984, 4985, 4985, 4986, 4986], diff: [0, 0, 0, 0, 0, 0, 0, 0, 1] },
    { z: 3.0, base: [4987, 4987, 4987, 4988, 4988, 4989, 4989, 4989, 4990, 4990], diff: [0, 0, 0, 0, 0, 0, 0, 0, 0] }
  ],

  /**
   * Look up Z value for a given probability P (0 < P < 0.5)
   * Returns exact lookup step-by-step info (Row z, Column col, Difference diff, final Z).
   */
  lookupZFromProbability: function(targetP) {
    const targetInt = Math.round(targetP * 10000); // e.g. 0.3991 -> 3991

    let bestRowIdx = 0;
    let bestColIdx = 0;
    let baseVal = 0;
    let maxBaseLessEqual = -1;

    // 1. Find the largest base value in the table <= targetInt
    for (let r = 0; r < this.rows.length; r++) {
      const row = this.rows[r];
      for (let c = 0; c < 10; c++) {
        const val = row.base[c];
        if (val <= targetInt && val > maxBaseLessEqual) {
          maxBaseLessEqual = val;
          bestRowIdx = r;
          bestColIdx = c;
          baseVal = val;
        }
      }
    }

    const rowObj = this.rows[bestRowIdx];
    const diffNeeded = targetInt - baseVal;
    let diffCol = 0;
    let actualDiffAdded = 0;

    // 2. Look in Differences column for the closest difference <= diffNeeded
    if (diffNeeded > 0 && rowObj.diff) {
      let closestDist = 9999;
      for (let d = 0; d < 9; d++) {
        const diffVal = rowObj.diff[d];
        const dist = Math.abs(diffVal - diffNeeded);
        if (dist < closestDist) {
          closestDist = dist;
          diffCol = d + 1; // 1-indexed (1 to 9)
          actualDiffAdded = diffVal;
        }
      }
    }

    const zBase = rowObj.z + (bestColIdx * 0.01);
    const zFinal = zBase + (diffCol * 0.001);

    return {
      targetP: targetP,
      targetInt: targetInt,
      rowZ: rowObj.z,
      rowIdx: bestRowIdx,
      colIdx: bestColIdx,
      baseVal: baseVal,
      diffNeeded: diffNeeded,
      diffCol: diffCol,
      actualDiffAdded: actualDiffAdded,
      zBase: parseFloat(zBase.toFixed(2)),
      zFinal: parseFloat(zFinal.toFixed(3)),
      explanationJa: `1. 表の主要部分から ${targetInt / 10000} 以下で最も近い値「.${baseVal.toString().padStart(4, '0')}」を探す ➔ Z = ${(rowObj.z + bestColIdx * 0.01).toFixed(2)}\n2. 残りの差分「+${diffNeeded}」を Differences（差分列）で探す ➔ 列 ${diffCol}（差分 +${actualDiffAdded}）\n3. 合わせると Z = ${zFinal.toFixed(3)}`
    };
  }
};
