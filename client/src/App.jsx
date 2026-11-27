import { Routes, Route, Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import { useAuth } from './context/Authcontext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppLayout from './components/AppLayout.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Profile from './pages/Profile.jsx';

function Home() {
  const { user } = useAuth();
  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h1 className="text-2xl font-bold text-brand-700">Namaste, {user.name}!</h1>
      <p className="mt-2 text-slate-600">
        Apni schemes dhundhne ke liye pehle profile bharein. Chat aur matching schemes agle steps mein aayenge.
      </p>
      <Link
        to="/profile"
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700"
      >
        <UserRound size={18} /> Profile bharein
      </Link>
    </div>
  );
}

const Private = ({ children }) => (
  <ProtectedRoute>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Private><Home /></Private>} />
      <Route path="/profile" element={<Private><Profile /></Private>} />
    </Routes>
  );
}