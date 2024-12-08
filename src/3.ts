//recursion approach
function editDistRec(s1: string, s2: string, m: number, n: number): number {
    // If first string is empty, the only option is to
    // insert all characters of second string into first
    if (m === 0) return n;

    // If second string is empty, the only option is to
    // remove all characters of first string
    if (n === 0) return m;

    // If last characters of two strings are same, nothing
    // much to do. Get the count for
    // remaining strings.
    if (s1[m - 1] === s2[n - 1])
        return editDistRec(s1, s2, m - 1, n - 1);

    // If last characters are not same, consider all three
    // operations on last character of first string,
    // recursively compute minimum cost for all three
    // operations and take minimum of three values.
    return 1 + Math.min(editDistRec(s1, s2, m, n - 1),    // Insert
                        editDistRec(s1, s2, m - 1, n),    // Remove
                        editDistRec(s1, s2, m - 1, n - 1) // Replace
                        );
}

function editDist(s1: string, s2: string) {
    return editDistRec(s1, s2, s1.length, s2.length);
}

//top-down approach
function editDistTopDown(s1: string, s2: string, m: number, n: number, memo: Array<Array<number>>): number {
    if (m === 0) return n;

    if (n === 0) return m;

    if (memo[m][n] !== -1) {
        return memo[m][n];
    }

    if (s1[m - 1] === s2[n - 1]) {
        memo[m][n] = editDistTopDown(s1, s2, m - 1, n - 1, memo);
    } else {
        let insert = editDistTopDown(s1, s2, m, n - 1, memo);    // Insert
        let remove = editDistTopDown(s1, s2, m - 1, n, memo);    // Remove
        let replace = editDistTopDown(s1, s2, m - 1, n - 1, memo); // Replace
        memo[m][n] = 1 + Math.min(insert, remove, replace);
    }

    return memo[m][n];
}

function editDistTD(s1: string, s2: string) {
    const m = s1.length, n = s2.length;
    const memo = Array.from({ length: m + 1 }, () => Array(n + 1).fill(-1));
    return editDistTopDown(s1, s2, s1.length, s2.length, memo);
}
function editDistBottomUp(s1: string, s2: string): number {
    const m = s1.length;
    const n = s2.length;

    // Create a table to store results of subproblems
    const dp = Array.from(Array(m + 1), () => Array(n + 1));

    // Fill the known entries in dp[][]
    // If one string is empty, then answer 
    // is length of the other string
    for (let i = 0; i <= m; i++)
        dp[i][0] = i;
    for (let j = 0; j <= n; j++)
        dp[0][j] = j;

    // Fill the rest of dp[][]
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (s1[i - 1] === s2[j - 1])
                dp[i][j] = dp[i - 1][j - 1];
            else
                dp[i][j] = 1 + Math.min(dp[i][j - 1], dp[i - 1][j], dp[i - 1][j - 1]);
        }
    }

    return dp[m][n];
}

export function run() {
    var recursionStartTime = new Date();
    const s1 = "GEEXSFRGEEKKS";
    const s2 = "GEEKSFORGEEKS";
    var result = 'recursion result:' + editDist(s1, s2) + ' time taken: ' + (new Date().getTime() - recursionStartTime.getTime());
    var topDownStartTime = new Date();
    var topDownResult = editDistTD(s1, s2);
    result += '\n' + 'top-down result: ' + topDownResult + ', time taken: ' + (new Date().getTime() - topDownStartTime.getTime());
    var bottomUpStartTime = new Date();
    var bottomUpResult = editDistBottomUp(s1, s2);
    result += '\n' + 'bottom-up result: ' + bottomUpResult + ', time taken: ' + (new Date().getTime() - bottomUpStartTime.getTime());
    return result;
}