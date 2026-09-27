// latewin.js：窗口聚合（单次扫描，水位单调不减）
import { bucketOf, isLate } from "./bucket.js";

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export function runWindow(spec) {
  const size = spec ? spec.window : undefined;
  if (!Number.isInteger(size) || size <= 0) {
    throw fail("E_BAD_WINDOW", "window must be a positive integer");
  }
  const samples = spec && spec.samples !== undefined ? spec.samples : [];
  if (!Array.isArray(samples)) {
    throw fail("E_BAD_SAMPLE", "samples must be a list of timestamps");
  }

  const counts = [];
  const sealed = [];
  const latePositions = [];
  let watermark = 0;
  let sealedUpTo = 0; // 桶 [0, sealedUpTo) 已封口，封口集永远是前缀

  for (let index = 0; index < samples.length; index += 1) {
    const at = samples[index];
    if (!Number.isInteger(at) || at < 0) {
      throw fail("E_BAD_SAMPLE", "sample timestamp must be a non-negative integer");
    }
    const bucket = bucketOf(at, size);
    if (isLate(at, watermark, size) || bucket < sealedUpTo) {
      latePositions.push(index + 1);
      continue;
    }
    counts[bucket] = (counts[bucket] || 0) + 1;
    if (at > watermark) {
      watermark = at;
      const frontier = Math.floor(watermark / size);
      while (sealedUpTo < frontier) {
        sealed.push(sealedUpTo);
        sealedUpTo += 1;
      }
    }
  }

  for (let bucket = 0; bucket < counts.length; bucket += 1) {
    if (counts[bucket] === undefined) counts[bucket] = 0;
  }

  return {
    counts: counts,
    sealed: sealed,
    late: latePositions.length,
    late_positions: latePositions,
    watermark: watermark
  };
}
