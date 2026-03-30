'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthFormWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/SocialAuth';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaSyncAlt } from 'react-icons/fa';

type RegisterFormData = {
  username: string;
  email: string;
  nomorTelp: string;
  password: string;
  confirmPassword: string;
  captcha: string;
};

const generateRandomCaptcha = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const calculatePasswordStrength = (password: string) => {
  const strength = Math.min(
    100,
    (password.length > 7 ? 25 : 0) +
      (/[A-Z]/.test(password) ? 25 : 0) +
      (/[0-9]/.test(password) ? 25 : 0) +
      (/[^A-Za-z0-9]/.test(password) ? 25 : 0)
  );
  return strength;
};

const getPasswordStrengthColor = (strength: number) => {
  if (strength === 0) return 'bg-gray-300';
  if (strength <= 25) return 'bg-red-500';
  if (strength <= 50) return 'bg-yellow-500';
  return 'bg-green-500';
};

const RegisterPage = () => {
  const router = useRouter();
  const [captcha, setCaptcha] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);

  useEffect(() => {
    setCaptcha(generateRandomCaptcha());
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password', '');

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

  const handleRefreshCaptcha = () => {
    setCaptcha(generateRandomCaptcha());
  };

  const onSubmit = (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Konfirmasi password tidak cocok', { theme: 'dark' });
      return;
    }

    toast.success('Register Berhasil!', {
      theme: 'dark',
      position: 'top-right',
    });

    router.push('/auth/login');
  };

  return (
    <AuthFormWrapper title="Register">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-gray-700">
            Username <span className="text-gray-500 text-xs">(min 3, max 8 karakter)</span>
          </label>
          <input
            id="username"
            {...register('username', {
              required: 'Username wajib diisi',
              minLength: {
                value: 3,
                message: 'Username minimal 3 karakter',
              },
              maxLength: {
                value: 8,
                message: 'Username maksimal 8 karakter',
              },
            })}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan username"
          />
          {errors.username && (
            <p className="text-red-600 text-sm italic mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            {...register('email', {
              required: 'Email wajib diisi',
              validate: (value) => {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(value)) {
                  return 'Belum sesuai format email.';
                }
                return true;
              },
            })}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan email"
          />
          {errors.email && (
            <p className="text-red-600 text-sm italic mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="nomorTelp" className="text-sm font-medium text-gray-700">
            Nomor Telepon <span className="text-gray-500 text-xs">(minimal 10 karakter)</span>
          </label>
          <input
            id="nomorTelp"
            type="tel"
            {...register('nomorTelp', {
              required: 'Nomor telepon wajib diisi',
              minLength: {
                value: 10,
                message: 'Nomor telepon minimal 10 karakter',
              },
            })}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
            }}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.nomorTelp ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan nomor telepon"
          />
          {errors.nomorTelp && (
            <p className="text-red-600 text-sm italic mt-1">
              {errors.nomorTelp.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password <span className="text-gray-500 text-xs">(minimal 8 karakter)</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password wajib diisi',
                minLength: {
                  value: 8,
                  message: 'Password minimal 8 karakter',
                },
              })}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          
          {password && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${getPasswordStrengthColor(passwordStrength)} transition-all duration-300`}
                  style={{ width: `${passwordStrength}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                Strength: <span className="font-semibold">{passwordStrength}%</span>
              </p>
            </div>
          )}
          
          {errors.password && (
            <p className="text-red-600 text-sm italic mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Konfirmasi Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: 'Konfirmasi password wajib diisi',
                validate: (value) =>
                  value === password || 'Konfirmasi password tidak cocok',
              })}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan ulang password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm italic mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
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
            {...register('captcha', {
              required: 'Captcha wajib diisi',
              validate: (value) => {
                if (value !== captcha) {
                  return 'Captcha salah';
                }
                return true;
              },
            })}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.captcha ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan captcha"
          />
          {errors.captcha && (
            <p className="text-red-600 text-sm italic mt-1">
              {errors.captcha.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg"
        >
          Register
        </button>

        <SocialAuth />
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Sudah punya akun?{' '}
        <Link
          href="/auth/login"
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          Login
        </Link>
      </p>
    </AuthFormWrapper>
  );
};

export default RegisterPage;