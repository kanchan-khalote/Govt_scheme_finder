import fs from 'fs';

const file = new URL('../data/schemes.json', import.meta.url);

let schemes;
try {
  schemes = JSON.parse(fs.readFileSync(file, 'utf-8'));
} catch (err) {
  console.log('JSON parse error:', err.message);
  process.exit(1);
}

if (!Array.isArray(schemes)) {
  console.log('schemes.json ek array [ ... ] hona chahiye');
  process.exit(1);
}

const errors = [];
const slugs = new Set();
const numOrNull = (v) => v === null || typeof v === 'number';
const allOrList = (v) => v === 'ALL' || (Array.isArray(v) && v.length > 0);
const eligKeys = ['minAge', 'maxAge', 'gender', 'maxIncome', 'states', 'categories', 'occupations'];

schemes.forEach((s, i) => {
  const id = s.slug || `#${i + 1}`;
  const err = (msg) => errors.push(`[${id}] ${msg}`);

  ['slug', 'name', 'category', 'sourceUrl', 'lastChecked'].forEach((f) => {
    if (!s[f] || typeof s[f] !== 'string') err(`${f} missing`);
  });

  if (slugs.has(s.slug)) err('duplicate slug');
  slugs.add(s.slug);

  if (s.sourceUrl && !s.sourceUrl.startsWith('https://')) err('sourceUrl https:// se shuru ho');
  if (s.category && s.category.includes(',')) err('category mein comma hai, ek hi value rakho');
  if (s.lastChecked && !/^\d{4}-\d{2}-\d{2}$/.test(s.lastChecked)) err('lastChecked YYYY-MM-DD ho');

  const e = s.eligibility;
  if (!e) {
    err('eligibility missing');
  } else {
    eligKeys.forEach((k) => {
      if (!(k in e)) err(`eligibility.${k} missing`);
    });
    if (!numOrNull(e.minAge) || !numOrNull(e.maxAge) || !numOrNull(e.maxIncome)) {
      err('minAge/maxAge/maxIncome number ya null hone chahiye');
    }
    if (e.minAge != null && e.maxAge != null && e.minAge > e.maxAge) err('minAge > maxAge');
    if (!['ALL', 'Male', 'Female', 'Other'].includes(e.gender)) err('gender galat hai');
    ['states', 'categories', 'occupations'].forEach((k) => {
      if (!allOrList(e[k])) err(`${k} "ALL" ya non-empty list hona chahiye`);
    });
    if (e.needsOfficialCheck && !e.conditionNote) err('needsOfficialCheck true hai to conditionNote do');
  }

  if (!Array.isArray(s.sections) || s.sections.length === 0) {
    err('sections missing');
  } else {
    s.sections.forEach((sec) => {
      if (!sec.title || !sec.text) err('section mein title/text missing');
      if (/\[cite|Redacted/i.test(sec.text || '')) {
        err(`"${sec.title}" mein [cite..] ya Redacted bacha hai`);
      }
    });
  }
});

if (errors.length) {
  console.log('Galtiyan mili:\n');
  errors.forEach((x) => console.log('-', x));
  process.exit(1);
}

console.log(`OK: ${schemes.length} schemes sahi hain`);
schemes.forEach((s) => console.log('-', s.slug, `(${s.sections.length} sections)`));