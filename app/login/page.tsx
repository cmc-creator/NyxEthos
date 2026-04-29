'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(_data: FormData) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast.info('Supabase auth not configured yet — connect your Supabase project to enable login.');
  }

  return (
    <div className="min-h-screen hex-pattern flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image src="/logo.png" alt="Auto-Docs" width={80} height={80} className="mx-auto" />
          </Link>
          <h1 className="text-3xl font-black text-white mb-1">Welcome Back</h1>
          <p className="text-[#7a8fb5] text-sm">Sign in to your Auto-Docs account</p>
        </div>

        <div className="glass-card rounded-3xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#94a3b8] mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a6090]" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0a1328] border border-[#1e3260] text-white placeholder:text-[#3a4f7a] focus:outline-none focus:border-[#e84c1a] transition-colors"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#94a3b8] mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a6090]" />
                <input
                  type={showPw ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-[#0a1328] border border-[#1e3260] text-white placeholder:text-[#3a4f7a] focus:outline-none focus:border-[#e84c1a] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a6090] hover:text-white transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs text-[#e84c1a] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#e84c1a] hover:bg-[#ff6b35] text-white font-bold text-sm transition-all glow-orange disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#1e3260]/50 text-center">
            <p className="text-[#7a8fb5] text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-[#e84c1a] font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-[#4a6090] mt-6">
          <Link href="/" className="hover:text-[#94a3b8]">← Back to Home</Link>
        </p>
      </motion.div>
    </div>
  );
}
