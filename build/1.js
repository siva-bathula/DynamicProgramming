"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
//top-down approach
function leastCommonSubsequence(s1, s2, m, n, memo) {
    if (m === 0 || n === 0)
        return 0;
    // Already exists in the memo table
    if (memo[m][n] !== -1)
        return memo[m][n];
    // Match
    if (s1[m - 1] === s2[n - 1]) {
        memo[m][n] = 1 + leastCommonSubsequence(s1, s2, m - 1, n - 1, memo);
        return memo[m][n];
    }
    // Do not match
    memo[m][n] = Math.max(leastCommonSubsequence(s1, s2, m, n - 1, memo), leastCommonSubsequence(s1, s2, m - 1, n, memo));
    return memo[m][n];
}
function run() {
    const s1 = "AGGTAB";
    const s2 = "GS1TS1AS2B";
    const m = s1.length;
    const n = s2.length;
    const memo = Array.from({ length: m + 1 }, () => Array(n + 1).fill(-1));
    return leastCommonSubsequence(s1, s2, m, n, memo);
}
