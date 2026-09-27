// app.js：渲染结果
import { bucketOf, isLate } from "./bucket.js";
import { runWindow } from "./latewin.js";

export function render(spec) {
  const samples = spec.samples || [];
  const view = runWindow(spec);
  const counts = view.counts || [];
  const sealed = view.sealed || [];
  const lates = view.late_positions || [];
  const sealedTotal = sealed.reduce(function (sum, spot) { return sum + (counts[spot] || 0); }, 0);
  const openTotal = counts.reduce(function (sum, count, spot) {
    return sealed.indexOf(spot) === -1 ? sum + count : sum;
  }, 0);
  return { counts: counts, sealed: sealed, late: view.late || 0, late_positions: lates,
           watermark: view.watermark || 0, count: samples.length,
           conserved: sealedTotal + openTotal + lates.length === samples.length,
           tail: bucketOf(7, 3) };
}
