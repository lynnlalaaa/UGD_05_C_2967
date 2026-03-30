'use client'

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Game1 from "../../components/Game1";
import { useAuth } from "../../context/AuthContext";
import { FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function Home() {
  const router = useRouter();
  const { isLoggedIn, isLoading, logout } = useAuth();
  const isLoggingOutRef = useRef(false);

  useEffect(() => {
    if (!isLoading && !isLoggedIn && !isLoggingOutRef.current) {
      router.push('/auth/not-authorized');
    }
  }, [isLoggedIn, isLoading, router]);

  const handleLogout = () => {
    isLoggingOutRef.current = true;
    logout();
    toast.info('Anda telah logout', {
      position: "top-right",
      theme: 'dark',
    });
    router.push('/auth/login');
  };

  if (isLoading || !isLoggedIn) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen">
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
        >
          <FaSignOutAlt size={18} />
          Logout
        </button>
      </div>
      <h1 className="text-4xl font-bold mb-4 textwhite">Selamat Datang!</h1>
      <Game1 />
    </div>
  );
}