import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@handyhelper.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    await new Promise(r => setTimeout(r, 800));

    if (email === 'admin@handyhelper.com' && password === 'admin123') {
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">HandyHelper</h1>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1">Admin Dashboard</p>
        </div>

        <Card className="animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@handyhelper.com"
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 min-w-[32px] min-h-[32px] flex items-center justify-center transition-colors duration-150"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500 animate-shake">{error}</p>
            )}

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              Demo: admin@handyhelper.com / admin123
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
