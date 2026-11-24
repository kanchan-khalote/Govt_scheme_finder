const isEmpty = (v) =>
  v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0);

const norm = (v) => String(v).trim().toLowerCase();
const toList = (v) => (Array.isArray(v) ? v : [v]);
const inList = (list, value) => toList(list).map(norm).includes(norm(value));

// "ALL" (ya khali) ka matlab: is cheez par koi rule nahi
const isAll = (v) =>
  isEmpty(v) || (typeof v === 'string' && ['all', 'any'].includes(norm(v)));

// Ek user profile ko ek scheme ke rules se check karta hai
export function checkEligibility(profile, scheme) {
  const rules = scheme.eligibility || {};
  const failed = [];   // rule fail hua
  const unknown = [];  // user ne info di hi nahi

  // Age (minAge, maxAge dono inclusive)
  if (!isEmpty(rules.minAge) || !isEmpty(rules.maxAge)) {
    if (isEmpty(profile.age)) {
      unknown.push('Add your age');
    } else {
      if (!isEmpty(rules.minAge) && profile.age < rules.minAge)
        failed.push(`Minimum age is ${rules.minAge}`);
      if (!isEmpty(rules.maxAge) && profile.age > rules.maxAge)
        failed.push(`Maximum age is ${rules.maxAge}`);
    }
  }

  // Income (family ki saalana income)
  if (!isEmpty(rules.maxIncome)) {
    if (isEmpty(profile.annualIncome)) unknown.push('Add your annual family income');
    else if (profile.annualIncome > rules.maxIncome)
      failed.push(`Family income must be up to Rs ${rules.maxIncome.toLocaleString('en-IN')} per year`);
  }

  // State
  if (!isAll(rules.states)) {
    if (isEmpty(profile.state)) unknown.push('Add your state');
    else if (!inList(rules.states, profile.state))
      failed.push(`Only for: ${toList(rules.states).join(', ')}`);
  }

  // Category (General/OBC/SC/ST/EWS)
  if (!isAll(rules.categories)) {
    if (isEmpty(profile.category)) unknown.push('Add your category');
    else if (!inList(rules.categories, profile.category))
      failed.push(`Only for category: ${toList(rules.categories).join(', ')}`);
  }

  // Occupation
  if (!isAll(rules.occupations)) {
    if (isEmpty(profile.occupation)) unknown.push('Add your occupation');
    else if (!inList(rules.occupations, profile.occupation))
      failed.push(`Only for: ${toList(rules.occupations).join(', ')}`);
  }

  // Gender
  if (!isAll(rules.gender)) {
    if (isEmpty(profile.gender)) unknown.push('Add your gender');
    else if (norm(profile.gender) !== norm(rules.gender))
      failed.push(`Only for gender: ${rules.gender}`);
  }

  let status;
  if (failed.length > 0) status = 'not_eligible';
  else if (unknown.length > 0) status = 'need_more_info';
  else if (rules.needsOfficialCheck) status = 'possible';
  else status = 'eligible';

  return {
    status,
    failed,
    unknown,
    note: rules.needsOfficialCheck ? rules.conditionNote || null : null,
  };
}

// Saari schemes me se matching schemes nikalta hai
export function findMatchingSchemes(profile, schemes) {
  const order = { eligible: 0, possible: 1, need_more_info: 2 };

  return schemes
    .map((scheme) => ({ scheme, ...checkEligibility(profile, scheme) }))
    .filter((r) => r.status !== 'not_eligible')
    .sort((a, b) => order[a.status] - order[b.status]);
}