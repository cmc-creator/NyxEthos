'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react';

const schema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  password: z.string().min(8, 'Minimum 8 characters'),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(_data: FormData) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast.info('Connect your Supabase project to enable registration.');
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
          <h1 className="text-3xl font-black text-white mb-1">Create Account</h1>
          <p className="text-[#7a8fb5] text-sm">Track bookings, view invoices, manage your vehicles</p>
        </div>

        <div className="glass-card rounded-3xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'first_name', label: 'First Name', placeholder: 'John' },
                { name: 'last_name', label: 'Last Name', placeholder: 'Smith' },
              ].map(({ name, label, placeholder }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold text-[#94a3b8] mb-1">{label}</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a6090]" />
                    <input
                      {...register(name as keyof FormData)}
                      placeholder={placeholder}
                      className="w-full pl-9 pr-3 py-3 rounded-xl bg-[#0a1328] border border-[#1e3260] text-white placeholder:text-[#3a4f7a] focus:outline-none focus:border-[#e84c1a] transition-colors text-sm"
                    />
                  </div>
                  {errors[name as keyof FormData] && (
                    <p className="mt-1 text-[10px] text-red-400">
                      {errors[name as keyof FormData]?.message as string}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {[
              { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', Icon: Mail },
              { name: 'phone', label: 'Phone', type: 'tel', placeholder: '(602) 555-1234', Icon: Phone },
            ].map(({ name, label, type, placeholder, Icon }) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-[#94a3b8] mb-1">{label}</label>
                <div className="relative">
                  <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a6090]" />
                  <input
                    type={type}
                    {...register(name as keyof FormData)}
                    placeholder={placeholder}
                    className="w-full pl-9 pr-3 py-3 rounded-xl bg-[#0a1328] border border-[#1e3260] text-white placeholder:text-[#3a4f7a] focus:outline-none focus:border-[#e84c1a] transition-colors text-sm"
                  />
                </div>
                {errors[name as keyof FormData] && (
                  <p className="mt-1 text-[10px] text-red-400">
                    {errors[name as keyof FormData]?.message as string}
                  </p>
                )}
              </div>
            ))}

            {['password', 'confirm_password'].map((name) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-[#94a3b8] mb-1">
                  {name === 'password' ? 'Password' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a6090]" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    {...register(name as keyof FormData)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-3 rounded-xl bg-[#0a1328] border border-[#1e3260] text-white placeholder:text-[#3a4f7a] focus:outline-none focus:border-[#e84c1a] transition-colors text-sm"
                  />
                  {name === 'password' && (
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a6090] hover:text-white"
                    >
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  )}
                </div>
                {errors[name as keyof FormData] && (
                  <p className="mt-1 text-[10px] text-red-400">
                    {errors[name as keyof FormData]?.message as string}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#e84c1a] hover:bg-[#ff6b35] text-white font-bold text-sm transition-all glow-orange mt-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-[#1e3260]/50 text-center">
            <p className="text-[#7a8fb5] text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-[#e84c1a] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
