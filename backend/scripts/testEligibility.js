import fs from 'fs';
import { findMatchingSchemes } from '../src/services/eligibility.js';

const schemes = JSON.parse(
  fs.readFileSync(new URL('../data/schemes.json', import.meta.url), 'utf-8')
);

const profiles = {
  'Female, 30, MP, OBC, Student, income 1 lakh': {
    age: 30, gender: 'Female', state: 'Madhya Pradesh',
    annualIncome: 100000, category: 'OBC', occupation: 'Student',
  },
  'Male, 45, Bihar, Farmer, income 5 lakh': {
    age: 45, gender: 'Male', state: 'Bihar',
    annualIncome: 500000, category: 'General', occupation: 'Farmer',
  },
  'Khali profile': {},
};

for (const [label, profile] of Object.entries(profiles)) {
  const results = findMatchingSchemes(profile, schemes);
  console.log(`\n=== ${label} (${results.length}/${schemes.length} schemes) ===`);
  results.forEach((r) => {
    console.log(r.status.padEnd(15), '|', r.scheme.name);
    r.unknown.forEach((u) => console.log('      ?', u));
  });
}