import { Landmark } from 'lucide-react';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-brand-700 via-brand-600 to-accent-700 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center text-white">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <Landmark size={28} />
          </div>
          <h1 className="text-2xl font-bold">Scheme Finder</h1>
          <p className="text-sm text-white/80">Sarkari yojanayein, aapki profile ke hisaab se</p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
          <p className="mb-5 text-sm text-slate-500">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
