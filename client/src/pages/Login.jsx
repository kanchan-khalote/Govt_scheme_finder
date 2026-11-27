import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="bg-white w-full max-w-sm p-8 rounded-xl shadow space-y-4">
        <h1 className="text-2xl font-bold text-blue-700">Login</h1>

        {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

        <input
          type="email" name="email" placeholder="Email" required
          value={form.email} onChange={onChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="password" name="password" placeholder="Password" required
          value={form.password} onChange={onChange}
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit" disabled={loading}
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? 'Please wait...' : 'Login'}
        </button>

        <p className="text-sm text-slate-600">
          Naya account? <Link to="/signup" className="text-blue-700 underline">Signup karein</Link>
        </p>
      </form>
    </div>
  );
}