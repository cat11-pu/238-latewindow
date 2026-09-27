// latewin.js：窗口聚合（基线：一律给空表）
import { bucketOf, isLate } from "./bucket.js";

export function runWindow(spec) {
  return { counts: [], sealed: [], late: 0, late_positions: [], watermark: 0 };
}
