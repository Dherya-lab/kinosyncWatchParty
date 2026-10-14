export function computeFuzzyMatch(query, title, category, director, tags = []) {
  if (!query || !query.trim()) return { match: true, score: 100 };
  const q = query.toLowerCase().trim();
  const haystacks = [title, category, director, ...tags].map(s => (s || '').toLowerCase());

  for (const h of haystacks) {
    if (h.includes(q)) return { match: true, score: 98 };
  }

  const target = `${title} ${category} ${director} ${tags.join(' ')}`.toLowerCase();
  let qIdx = 0;
  let consecutive = 0;
  let maxConsecutive = 0;
  for (let i = 0; i < target.length && qIdx < q.length; i++) {
    if (target[i] === q[qIdx]) {
      qIdx++;
      consecutive++;
      if (consecutive > maxConsecutive) maxConsecutive = consecutive;
    } else {
      consecutive = 0;
    }
  }
  if (qIdx === q.length) {
    const score = Math.min(94, 65 + Math.round((maxConsecutive / q.length) * 28));
    return { match: true, score };
  }

  const words = target.split(/\s+/);
  let bestDist = 999;
  for (const w of words) {
    const sample = w.slice(0, Math.max(w.length, q.length));
    const dp = Array.from({ length: q.length + 1 }, () => Array(sample.length + 1).fill(0));
    for (let i = 0; i <= q.length; i++) dp[i][0] = i;
    for (let j = 0; j <= sample.length; j++) dp[0][j] = j;
    for (let i = 1; i <= q.length; i++) {
      for (let j = 1; j <= sample.length; j++) {
        const cost = q[i - 1] === sample[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    if (dp[q.length][sample.length] < bestDist) bestDist = dp[q.length][sample.length];
  }

  const tolerance = q.length <= 4 ? 1 : 2;
  if (bestDist <= tolerance) {
    return { match: true, score: Math.max(55, 85 - bestDist * 14) };
  }
  return { match: false, score: 0 };
}

export function formatTimecode(sec, includeFrames = false) {
  if (!Number.isFinite(sec) || sec < 0) return includeFrames ? '00:00.00' : '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const f = Math.floor((sec % 1) * 24);
  const base = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return includeFrames ? `${base}.${String(f).padStart(2, '0')}` : base;
}

export function extractYouTubeId(input) {
  if (!input) return null;
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export async function computeFileSignature(file) {
  if (!file) return null;
  const slice = file.slice(0, 65536);
  const buffer = await slice.arrayBuffer();
  const view = new Uint8Array(buffer);
  let hash = 2166136261;
  for (let i = 0; i < view.length; i += 64) {
    hash ^= view[i];
    hash = Math.imul(hash, 16777619);
  }
  const hex = (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
  const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
  return {
    name: file.name,
    sizeMB,
    signature: `0x${hex}-${file.size.toString(16).toUpperCase()}`
  };
}