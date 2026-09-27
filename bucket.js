// bucket.js：桶号与迟到判定（基线：一律给零与假）
export function bucketOf(at, size) {
  return 0;
}

export function isLate(at, watermark, size) {
  return false;
}
