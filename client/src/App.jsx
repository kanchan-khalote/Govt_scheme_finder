import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/Authcontext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';

function Home() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <h1 className="text-2xl font-bold text-blue-700">Namaste, {user.name}!</h1>
        <p className="mt-2 text-slate-600">Login ho gaya. Baaki pages aage banenge.</p>
        <button onClick={logout} className="mt-4 bg-slate-800 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    </Routes>
  );
}