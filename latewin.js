// latewin.js：窗口聚合（基线：一律给空表）
import { bucketOf, isLate } from "./bucket.js";

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  throw error;
}

export function runWindow(spec) {
  const size = spec && spec.window;
  if (!Number.isInteger(size) || size <= 0) {
    fail("E_BAD_WINDOW", "window must be a positive integer");
  }
  const samples = (spec && spec.samples) || [];

  const counts = [];
  const sealed = [];
  const latePositions = [];
  let watermark = 0;
  let sealCursor = 0;

  for (let index = 0; index < samples.length; index += 1) {
    const at = samples[index];
    if (!Number.isInteger(at) || at < 0) {
      fail("E_BAD_SAMPLE", "sample timestamps must be non-negative integers");
    }

    if (isLate(at, watermark, size)) {
      latePositions.push(index + 1);
      continue;
    }

    const bucket = bucketOf(at, size);
    counts[bucket] = (counts[bucket] || 0) + 1;
    if (at > watermark) {
      watermark = at;
    }

    while ((sealCursor + 1) * size <= watermark) {
      if (counts[sealCursor] === undefined) {
        counts[sealCursor] = 0;
      }
      sealed.push(sealCursor);
      sealCursor += 1;
    }
  }

  for (let index = 0; index < counts.length; index += 1) {
    if (counts[index] === undefined) {
      counts[index] = 0;
    }
  }

  return {
    counts: counts,
    sealed: sealed,
    late: latePositions.length,
    late_positions: latePositions,
    watermark: watermark
  };
}
