'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Nevažeći reset link');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('Nevažeći reset token');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Lozinke se ne poklapaju');
      return;
    }

    if (newPassword.length < 6) {
      setError('Lozinka mora imati najmanje 6 karaktera');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Lozinka je uspešno resetovana! Preusmeravamo vas na login...');
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        setError(data.error || 'Greška pri resetovanju lozinke');
      }
    } catch (err) {
      setError('Greška pri povezivanju sa serverom');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-6">Greška</h1>
          <p className="text-gray-300">Nevažeći reset link. Molimo zatražite novi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">KBK PRINCIP</h1>
          <p className="text-gray-400 mt-2">Reset Lozinke</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Nova Lozinka</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
              placeholder="Unesite novu lozinku"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Potvrdi Lozinku</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
              placeholder="Potvrdite novu lozinku"
              required
            />
          </div>

          {error && (
            <div className="bg-red-600/20 border border-red-600 text-red-400 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-600/20 border border-green-600 text-green-400 px-4 py-2 rounded-lg">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetovanje...' : 'Resetuj Lozinku'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}