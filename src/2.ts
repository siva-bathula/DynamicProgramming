//recursion approach
function longestIncreasingSubsequenceRecursion(arr: Array<number>, idx: number) {
    // Base case
    if (idx === 0)
        return 1;

    // Consider all elements on the left of idx,
    // recursively compute LISs ending with
    // them and consider the largest
    let mx = 1;
    for (let prev = 0; prev < idx; prev++) {
        if (arr[prev] < arr[idx]) {
            mx = Math.max(mx,
                longestIncreasingSubsequenceRecursion(arr, prev) + 1);
        }
    }
    return mx;
}

function lisRecursion(arr: Array<number>) {
    let n = arr.length;
    let res = 1;
    for (let idx = 1; idx < n; idx++) {
        res = Math.max(res, longestIncreasingSubsequenceRecursion(arr, idx));
    }
    return res;
}

//top-down approach
//top-down approach
function longestIncreasingSubsequenceTopDown(arr: Array<number>, idx: number, memo: Array<number>) {
    // Base case
    if (idx === 0) {
        return 1;
    }
    if (memo[idx] !== -Infinity) {
        return memo[idx];
    }

    // Consider all elements on the left of idx,
    // recursively compute LISs ending with
    // them and consider the largest
    let mx = 1;
    for (let prev = 0; prev < idx; prev++) {
        if (arr[prev] < arr[idx]) {
            mx = Math.max(mx,
                longestIncreasingSubsequenceRecursion(arr, prev) + 1);
        }
    }
    memo[idx] = mx;
    return memo[idx];
}

function lisTopDown(arr: Array<number>) {
    let n = arr.length;
    const memo = Array(n).fill(-Infinity);
    let res = 1;
    for (let idx = 1; idx < n; idx++) {
        res = Math.max(res, longestIncreasingSubsequenceTopDown(arr, idx, memo));
    }
    return res;
}

function longestIncreasingSubsequenceBottomUp(arr: Array<number>, n: number) {
    let lis = Array(n).fill(0);
    let max = 0;

    // Initialize LIS values for all indexes
    for (let i = 0; i < n; i++)
        lis[i] = 1;

    // Compute optimized LIS values in
    // bottom up manner 
    for (let i = 1; i < n; i++) {
        for (let prev = 0; prev < i; prev++) {
            if (arr[i] > arr[prev] && lis[i] < lis[prev] + 1)
                lis[i] = lis[prev] + 1;
        }
    }

    // Pick maximum of all LIS values 
    for (let i = 0; i < n; i++)
        if (max < lis[i])
            max = lis[i];

    return max;
}

export function run() {
    var recursionStartTime = new Date();
    let arr = [ 10, 22, 9, 33, 21, 50, 41, 60 ];
    var result = 'recursion result:' + lisRecursion(arr) + ' time taken: ' + (new Date().getTime() - recursionStartTime.getTime());
    var topDownStartTime = new Date();
    var topDownResult = lisTopDown(arr);
    result += '\n' + 'top-down result: ' + topDownResult + ', time taken: ' + (new Date().getTime() - topDownStartTime.getTime());
    var bottomUpStartTime = new Date();
    var bottomUpResult = longestIncreasingSubsequenceBottomUp(arr, arr.length);
    result += '\n' + 'bottom-up result: ' + bottomUpResult + ', time taken: ' + (new Date().getTime() - bottomUpStartTime.getTime());
    return result;
}