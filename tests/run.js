import assert from "node:assert";
import { bucketOf, isLate } from "../bucket.js";
import { runWindow } from "../latewin.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("bucketOf returns a number", () => {
  assert.strictEqual(typeof bucketOf(7, 3), "number");
});

check("isLate returns a flag", () => {
  assert.strictEqual(typeof isLate(0, 0, 3), "boolean");
});

check("runWindow returns counts", () => {
  assert.ok(Array.isArray(runWindow({ window: 3, samples: [] }).counts));
});

check("render counts samples", () => {
  assert.strictEqual(typeof render({ window: 3, samples: [] }).count, "number");
});

check("render exposes conserved flag", () => {
  assert.strictEqual(typeof render({ window: 3, samples: [] }).conserved, "boolean");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
