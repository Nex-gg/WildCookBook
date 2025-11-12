import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SignInFormProps {
  onSuccess: () => void;
  onSwitchToSignUp: () => void;
}

export default function SignInForm({ onSuccess, onSwitchToSignUp }: SignInFormProps) {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    const { error: signInError } = await signIn(formData.email, formData.password);
    setLoading(false);

    if (signInError) {
      setError(signInError);
    } else {
      onSuccess();
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-400 to-pink-400 rounded-2xl flex items-center justify-center">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to continue your culinary journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-full font-semibold text-lg hover:from-red-500 hover:to-pink-500 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignUp}
            className="text-red-500 font-medium hover:text-red-600"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
