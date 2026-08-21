// Levenshtein edit distance — counts how many single-character edits
// (insert/delete/replace) turn `a` into `b`. Lower = more similar.
function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}

// Ranks `items` (each with .name and .composition) against a typed query.
// Exact substring matches rank highest; otherwise falls back to edit-distance
// so typos like "paracetmol" still surface "Paracetamol".
export function fuzzySuggest(items, query, limit = 6) {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const scored = items.map((item) => {
    const name = item.name.toLowerCase()
    const composition = (item.composition || '').toLowerCase()

    let score
    if (name.startsWith(q)) score = 0
    else if (name.includes(q) || composition.includes(q)) score = 1
    else {
      const dist = Math.min(levenshtein(q, name.slice(0, q.length + 3)), levenshtein(q, name))
      score = 2 + dist
    }
    return { item, score }
  })

  return scored
    .filter((s) => s.score <= 6) // cuts off matches that are too different to be useful
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((s) => s.item)
}
