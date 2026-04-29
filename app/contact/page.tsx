'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  MessageSquare,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const schema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  service_type: z.string().min(1, 'Please select a service type'),
  vehicle: z.string().min(2, 'Enter your vehicle (year, make, model)'),
  message: z.string().min(10, 'Please describe what you need (min 10 characters)'),
});

type FormData = z.infer<typeof schema>;

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#94a3b8] mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl bg-[#0a1328] border border-[#1e3260] text-white placeholder:text-[#3a4f7a] focus:outline-none focus:border-[#e84c1a] transition-colors"
    />
  );
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(_data: FormData) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    toast.success('Message sent! We\'ll reach out within the hour.');
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-28 pb-20 min-h-screen hex-pattern">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-14">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#e84c1a]/10 border border-[#e84c1a]/30 text-[#e84c1a] text-xs font-bold uppercase tracking-widest mb-4">
              Get in Touch
            </span>
            <h1 className="text-5xl font-black text-white mb-4">
              Request a <span className="gradient-text">Free Quote</span>
            </h1>
            <p className="text-[#7a8fb5] text-lg max-w-xl mx-auto">
              Not sure what service you need? Just tell us what's going on — we'll diagnose and quote
              for free.
            </p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Contact info */}
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                  <MessageSquare size={18} className="text-[#e84c1a]" />
                  Contact Info
                </h3>
                <div className="space-y-5">
                  <a href="tel:+16025551234" className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-[#e84c1a]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#e84c1a] transition-colors">
                      <Phone size={16} className="text-[#e84c1a] group-hover:text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">(602) 555-1234</div>
                      <div className="text-[#7a8fb5] text-xs">Call or text — fastest response</div>
                    </div>
                  </a>
                  <a href="mailto:service@autodocs-az.com" className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-[#1e3260]/60 flex items-center justify-center flex-shrink-0 group-hover:bg-[#e84c1a] transition-colors">
                      <Mail size={16} className="text-[#94a3b8] group-hover:text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">service@autodocs-az.com</div>
                      <div className="text-[#7a8fb5] text-xs">Email us any time</div>
                    </div>
                  </a>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#1e3260]/60 flex items-center justify-center flex-shrink-0">
                      <Clock size={16} className="text-[#94a3b8]" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">Business Hours</div>
                      <div className="text-[#7a8fb5] text-xs">Mon–Sat 7AM–7PM</div>
                      <div className="text-[#7a8fb5] text-xs">Sun 9AM–4PM</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#1e3260]/60 flex items-center justify-center flex-shrink-0">
                      <MapPin size={16} className="text-[#94a3b8]" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">Service Area</div>
                      <div className="text-[#7a8fb5] text-xs">Greater Phoenix, AZ</div>
                      <div className="text-[#7a8fb5] text-xs">Scottsdale · Mesa · Tempe · Chandler</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response time badge */}
              <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Clock size={20} className="text-green-400" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">We respond fast</div>
                  <div className="text-[#7a8fb5] text-xs">
                    Typical reply time: under 30 minutes during business hours.
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#e84c1a]/20 flex items-center justify-center flex-shrink-0">
                  <Wrench size={20} className="text-[#e84c1a]" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Free Diagnostics</div>
                  <div className="text-[#7a8fb5] text-xs">
                    Not sure what's wrong? We'll diagnose and quote at no charge.
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card rounded-2xl p-10 text-center h-full flex flex-col items-center justify-center"
                >
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                    <CheckCircle2 size={36} className="text-green-400" />
                  </div>
                  <h2 className="text-2xl font-black text-white mb-3">Message Received!</h2>
                  <p className="text-[#94a3b8] max-w-sm">
                    Thanks for reaching out. We'll review your request and get back to you within
                    30 minutes during business hours.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card rounded-2xl p-6 sm:p-8"
                >
                  <h2 className="text-xl font-black text-white mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="First Name" error={errors.first_name?.message}>
                        <Input placeholder="John" {...register('first_name')} />
                      </Field>
                      <Field label="Last Name" error={errors.last_name?.message}>
                        <Input placeholder="Smith" {...register('last_name')} />
                      </Field>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Email" error={errors.email?.message}>
                        <Input type="email" placeholder="john@example.com" {...register('email')} />
                      </Field>
                      <Field label="Phone" error={errors.phone?.message}>
                        <Input type="tel" placeholder="(602) 555-1234" {...register('phone')} />
                      </Field>
                    </div>
                    <Field label="Service Needed" error={errors.service_type?.message}>
                      <select
                        {...register('service_type')}
                        className="w-full px-4 py-3 rounded-xl bg-[#0a1328] border border-[#1e3260] text-white focus:outline-none focus:border-[#e84c1a] transition-colors"
                      >
                        <option value="">Select a service type...</option>
                        <option>Oil Change</option>
                        <option>Brake Service</option>
                        <option>Diagnostics / Check Engine Light</option>
                        <option>Battery Service</option>
                        <option>AC / Heating</option>
                        <option>Electrical</option>
                        <option>Other / Not Sure</option>
                      </select>
                    </Field>
                    <Field label="Your Vehicle (Year, Make, Model)" error={errors.vehicle?.message}>
                      <Input placeholder="2019 Toyota Camry" {...register('vehicle')} />
                    </Field>
                    <Field label="Describe the Issue" error={errors.message?.message}>
                      <textarea
                        {...register('message')}
                        rows={5}
                        placeholder="Tell us what's going on — warning lights, symptoms, sounds, or just what service you'd like..."
                        className="w-full px-4 py-3 rounded-xl bg-[#0a1328] border border-[#1e3260] text-white placeholder:text-[#3a4f7a] focus:outline-none focus:border-[#e84c1a] transition-colors resize-none"
                      />
                    </Field>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#e84c1a] hover:bg-[#ff6b35] text-white font-bold text-base transition-all glow-orange hover:scale-[1.02] disabled:opacity-60"
                    >
                      {loading ? (
                        <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : (
                        <>
                          <Send size={16} />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
