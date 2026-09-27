// bucket.js：桶号与迟到判定
export function bucketOf(at, size) {
  return Math.floor(at / size);
}

export function isLate(at, watermark, size) {
  return at <= watermark - size;
}
