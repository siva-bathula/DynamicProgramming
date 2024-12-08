//top-down approach
function leastCommonSubsequenceTopDown(s1: string, s2: string, m: number, 
    n: number, memo: Array<Array<number>>) {
    if (m === 0 || n === 0)
        return 0;

    // Already exists in the memo table
    if (memo[m][n] !== -1)
        return memo[m][n];

    // Match
    if (s1[m - 1] === s2[n - 1]) {
        memo[m][n] = 1 + leastCommonSubsequenceTopDown(s1, s2, m - 1, n - 1, memo);
        return memo[m][n];
    }

    // Do not match
    memo[m][n] = Math.max(leastCommonSubsequenceTopDown(s1, s2, m, n - 1, memo),
    leastCommonSubsequenceTopDown(s1, s2, m - 1, n, memo));
    return memo[m][n];
}

function leastCommonSubsequenceBottomUp(S1: string, S2: string) {
    const m = S1.length;
    const n = S2.length;

    // Initializing a matrix of size (m+1)*(n+1)
    const dp = Array.from({length : m + 1},
                          () => Array(n + 1).fill(0));

    // Building dp[m+1][n+1] in bottom-up fashion
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (S1[i - 1] === S2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            }
            else {
                dp[i][j]
                    = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // dp[m][n] contains length of LCS for
    // S1[0..m-1] and S2[0..n-1]
    return dp[m][n];
}

export function run() {
    const s1 = "AGGTABOOI";
    const s2 = "GS1TS1AS2BOOI";

    const m = s1.length;
    const n = s2.length;
    const memo = Array.from({length : m + 1},
                            () => Array(n + 1).fill(-1));
    var topDownStartTime = new Date();
    var topDownResult = leastCommonSubsequenceTopDown(s1, s2, m, n, memo);
    var result = 'top-down result: ' + topDownResult + ', time taken: ' + (new Date().getTime() - topDownStartTime.getTime());
    var bottomUpStartTime = new Date();
    var bottomUpResult = leastCommonSubsequenceBottomUp(s1, s2);
    result += '\n' + 'bottom-up result: ' + bottomUpResult + ', time taken: ' + (new Date().getTime() - bottomUpStartTime.getTime());
    return result;
}