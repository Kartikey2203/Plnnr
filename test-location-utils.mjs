import { parseLocationSlug } from "./lib/location-utils.js";

console.log("Testing location utils...");

const tests = [
  { input: "bangalore--karnataka", expect: true, desc: "Double Hyphen with Alias (Bangalore)" },
  { input: "gurgaon-haryana", expect: true, desc: "Single Hyphen (Fallback)" },
  { input: "new-delhi--delhi", expect: true, desc: "Multi-word City Double Hyphen" },
  { input: "new-delhi-delhi", expect: true, desc: "Multi-word City Single Hyphen" },
  { input: "bengaluru-karnataka", expect: true, desc: "Original Name Single Hyphen" },
  { input: "atlantis--karnataka", expect: false, desc: "Invalid City" },
  { input: "bangalore--mars", expect: false, desc: "Invalid State" },
];

let allPassed = true;

for (const t of tests) {
  const result = parseLocationSlug(t.input);
  const passed = result.isValid === t.expect;
  if (!passed) allPassed = false;
  
  console.log(`[${passed ? "PASS" : "FAIL"}] ${t.desc}`);
  console.log(`  Input: ${t.input}`);
  console.log(`  Output: City="${result.city}", State="${result.state}", Valid=${result.isValid}`);
  console.log("---");
}

if (allPassed) {
  console.log("SUCCESS: All tests passed");
} else {
  console.log("FAILURE: Some tests failed");
}
