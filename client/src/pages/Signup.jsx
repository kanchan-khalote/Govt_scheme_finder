import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/Authcontext.jsx';
import AuthLayout from '../components/AuthLayout.jsx';
import IconInput from '../components/IconInput.jsx';

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Free account banayein aur apni schemes dhundhein">
      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <p className="flex items-center gap-2 rounded-lg bg-red-50 p-2.5 text-sm text-red-700">
            <AlertCircle size={16} /> {error}
          </p>
        )}

        <IconInput icon={User} type="text" name="name" placeholder="Name" required
          value={form.name} onChange={onChange} />
        <IconInput icon={Mail} type="email" name="email" placeholder="Email" required
          value={form.email} onChange={onChange} />
        <IconInput icon={Lock} type="password" name="password" placeholder="Password (min 6 characters)"
          required minLength={6} value={form.password} onChange={onChange} />

        <button type="submit" disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 font-medium text-white transition hover:bg-brand-700 disabled:opacity-60">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
          {loading ? 'Please wait...' : 'Create account'}
        </button>

        <p className="text-center text-sm text-slate-600">
          Pehle se account hai?{' '}
          <Link to="/login" className="font-medium text-brand-700 hover:underline">Login karein</Link>
        </p>
      </form>
    </AuthLayout>
  );
}