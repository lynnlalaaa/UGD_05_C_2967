'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthFormWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/SocialAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaSyncAlt } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
  captchaInput: string;
  remberMe?: boolean;
}

interface ErrorObject {
  email?: string;
  password?: string;
  captcha?: string;
}

const generateRandomCaptcha = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const CORRECT_EMAIL = '2967@gmail.com';
const CORRECT_PASSWORD = '241712967';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    captchaInput: '',
  });
  const [errors, setErrors] = useState<ErrorObject>({});
  const [attemptCount, setAttemptCount] = useState<number>(3);
  const [captcha, setCaptcha] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    setCaptcha(generateRandomCaptcha());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleResetAttempts = () => {
    setAttemptCount(3);
    setFormData({
      email: '',
      password: '',
      captchaInput: '',
    });
    setErrors({});
    toast.info('Kesempatan login direset menjadi 3', { theme: 'dark', position: 'top-right' });
  };

  const handleRefreshCaptcha = () => {
    setCaptcha(generateRandomCaptcha());
    setFormData((prev) => ({ ...prev, captchaInput: '' }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (attemptCount === 0) {
      toast.error('Kesempatan login habis! Gunakan tombol reset.', { theme: 'dark', position: 'top-right' });
      return;
    }

    const newErrors: ErrorObject = {};
    if (!formData.email.trim()) newErrors.email = 'Email tidak boleh kosong';
    else if (formData.email !== CORRECT_EMAIL) newErrors.email = 'Email tidak sesuai!';
    
    if (!formData.password.trim()) newErrors.password = 'Password tidak boleh kosong';
    else if (formData.password !== CORRECT_PASSWORD) newErrors.password = 'Password salah!';
    
    if (!formData.captchaInput.trim()) {
      newErrors.captcha = 'Captcha belum diisi';
    } else if (formData.captchaInput !== captcha) {
      newErrors.captcha = 'Captcha salah';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const newAttemptCount = Math.max(0, attemptCount - 1);
      setAttemptCount(newAttemptCount);

      if (newAttemptCount === 0) {
        toast.error('Kesempatan login habis!', { theme: 'dark', position: 'top-right' });
      } else {
        toast.error(`Login Gagal! Sisa kesempatan: ${newAttemptCount}`, { theme: 'dark', position: 'top-right' });
      }
      return;
    }

    toast.success('Login Berhasil!', { theme: 'dark', position: 'top-right' });
    login();
    router.push('/home');
  };

  return (
    <AuthFormWrapper title="Login">
      <p className="text-center text-sm font-medium text-gray-700 -mt-4 mb-4">
        Sisa kesempatan: {attemptCount}
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-5 w-full">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukan email"
          />
          {errors.email && (
            <p className="text-red-600 text-sm italic mt-1">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Masukan password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-600 text-sm italic mt-1">{errors.password}</p>
          )}

          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                name="remberMe"
                checked={formData.remberMe || false}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, remberMe: e.target.checked }))
                }
                className="mr-2 h-4 w-4 rounded border-gray-300"
              />
              Ingat Saya
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Captcha:</span>
            <span className="font-mono text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded">
              {captcha}
            </span>
            <button
              type="button"
              onClick={handleRefreshCaptcha}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-gray-100 rounded transition-colors"
              title="Refresh Captcha"
            >
              <FaSyncAlt size={16} />
            </button>
          </div>
          <input
            type="text"
            name="captchaInput"
            value={formData.captchaInput}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.captcha ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukan captcha"
          />
          {errors.captcha && (
            <p className="text-red-600 text-sm italic mt-1">{errors.captcha}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={attemptCount === 0}
          className={`w-full font-semibold py-2.5 px-4 rounded-lg transition-colors ${
            attemptCount === 0
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Sign In
        </button>

        <button
          type="button"
          onClick={handleResetAttempts}
          disabled={attemptCount > 0}
          className={`w-full font-semibold py-2.5 px-4 rounded-lg transition-colors ${
            attemptCount === 0
              ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
              : 'bg-gray-400 text-white cursor-not-allowed'
          }`}
        >
          Reset Kesempatan
        </button>

        <SocialAuth />

        <p className="mt-6 text-center text-sm text-gray-600">
          Tidak punya akun?{' '}
          <Link
            href="/auth/register"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Daftar
          </Link>
        </p>
      </form>
    </AuthFormWrapper>
  );
};

export default LoginPage;