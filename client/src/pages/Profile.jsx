import { useEffect, useState } from 'react';
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api.js';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
  'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];
const GENDERS = ['Male', 'Female', 'Other'];
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];
const OCCUPATIONS = [
  'Student', 'Farmer', 'Construction Worker', 'Daily Wage Worker', 'Self-employed',
  'Private Employee', 'Government Employee', 'Homemaker', 'Unemployed', 'Other',
];

const empty = { age: '', gender: '', state: '', annualIncome: '', category: '', occupation: '' };

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100';

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export default function Profile() {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api
      .get('/users/me')
      .then(({ data }) => {
        const p = data.profile || {};
        setForm({
          age: p.age ?? '',
          gender: p.gender ?? '',
          state: p.state ?? '',
          annualIncome: p.annualIncome ?? '',
          category: p.category ?? '',
          occupation: p.occupation ?? '',
        });
      })
      .catch(() => setMessage({ type: 'error', text: 'unable to load this page' }))
      .finally(() => setLoading(false));
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      age: form.age === '' ? undefined : Number(form.age),
      gender: form.gender,
      state: form.state,
      annualIncome: form.annualIncome === '' ? undefined : Number(form.annualIncome),
      category: form.category,
      occupation: form.occupation,
    };

    try {
      await api.put('/users/profile', payload);
      setMessage({ type: 'success', text: 'Profile saved' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Unable to save' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-brand-700">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow sm:p-8">
      <h1 className="text-xl font-semibold text-slate-800">Meri Profile</h1>
      <p className="mb-6 text-sm text-slate-500">
        Ye jaankaari sirf aapke liye matching schemes dhundhne mein kaam aati hai.
        Hum aapka Aadhaar ya phone number nahi mangte.
      </p>

      {message && (
        <p
          className={`mb-4 flex items-center gap-2 rounded-lg p-2.5 text-sm ${
            message.type === 'success' ? 'bg-brand-50 text-brand-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </p>
      )}

      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Age (year)">
          <input type="number" name="age" min="0" max="120" value={form.age}
            onChange={onChange} className={inputCls} />
        </Field>

        <Field label="Gender">
          <select name="gender" value={form.gender} onChange={onChange} className={inputCls}>
            <option value="">Select</option>
            {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </Field>

        <Field label="State">
          <select name="state" value={form.state} onChange={onChange} className={inputCls}>
            <option value="">Select</option>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>

        <Field label="Annual income of your family(Rs)" hint="Poore parivaar ki saal bhar ki kul income">
          <input type="number" name="annualIncome" min="0" value={form.annualIncome}
            onChange={onChange} className={inputCls} />
        </Field>

        <Field label="Category">
          <select name="category" value={form.category} onChange={onChange} className={inputCls}>
            <option value="">Select</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <Field label="Occupation">
          <select name="occupation" value={form.occupation} onChange={onChange} className={inputCls}>
            <option value="">Select</option>
            {OCCUPATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>

        <div className="sm:col-span-2">
          <button type="submit" disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 font-medium text-white transition hover:bg-brand-700 disabled:opacity-60">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving...' : 'save your profile'}
          </button>
        </div>
      </form>
    </div>
  );
}