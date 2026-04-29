'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Wrench,
  Calendar,
  Car,
  User,
  CreditCard,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Droplets,
  CircleDot,
  Gauge,
  Battery,
  Thermometer,
  Zap,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BookingFormData } from '@/types';

/* ──────────────────────────────────────────────────────── */
/* Schema                                                     */
/* ──────────────────────────────────────────────────────── */
const schema = z.object({
  service_id: z.string().min(1, 'Please select a service'),
  scheduled_date: z.string().min(1, 'Please select a date'),
  scheduled_time: z.string().min(1, 'Please select a time'),
  address: z.string().min(5, 'Enter your street address'),
  city: z.string().min(2, 'Enter your city'),
  zip: z.string().regex(/^\d{5}$/, 'Enter a valid 5-digit ZIP code'),
  vehicle_year: z.string().min(4, 'Enter vehicle year'),
  vehicle_make: z.string().min(1, 'Enter vehicle make'),
  vehicle_model: z.string().min(1, 'Enter vehicle model'),
  vehicle_vin: z.string().optional(),
  notes: z.string().optional(),
  first_name: z.string().min(1, 'Enter your first name'),
  last_name: z.string().min(1, 'Enter your last name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(10, 'Enter a valid phone number'),
});

/* ──────────────────────────────────────────────────────── */
/* Service data                                              */
/* ──────────────────────────────────────────────────────── */
const services = [
  { id: 'oil-conventional', icon: Droplets, label: 'Conventional Oil Change', price: 39, color: '#f59e0b' },
  { id: 'oil-synthetic', icon: Droplets, label: 'Full Synthetic Oil Change', price: 75, color: '#f59e0b' },
  { id: 'brakes-front', icon: CircleDot, label: 'Front Brake Pad Replacement', price: 120, color: '#e84c1a' },
  { id: 'brakes-rear', icon: CircleDot, label: 'Rear Brake Pad Replacement', price: 110, color: '#e84c1a' },
  { id: 'brakes-both', icon: CircleDot, label: 'Front & Rear Brake Pads', price: 210, color: '#e84c1a' },
  { id: 'diagnostics-cel', icon: Gauge, label: 'Check Engine Light Scan', price: 65, color: '#6366f1' },
  { id: 'diagnostics-full', icon: Gauge, label: 'Full Vehicle Diagnostic', price: 120, color: '#6366f1' },
  { id: 'battery-standard', icon: Battery, label: 'Battery Replacement', price: 95, color: '#10b981' },
  { id: 'battery-jump', icon: Battery, label: 'Jump Start', price: 45, color: '#10b981' },
  { id: 'ac-recharge', icon: Thermometer, label: 'AC Recharge', price: 85, color: '#3b82f6' },
  { id: 'ac-check', icon: Thermometer, label: 'AC Performance Check', price: 65, color: '#3b82f6' },
  { id: 'electrical-alt', icon: Zap, label: 'Alternator Replacement', price: 220, color: '#eab308' },
  { id: 'electrical-starter', icon: Zap, label: 'Starter Replacement', price: 200, color: '#eab308' },
  { id: 'other', icon: Wrench, label: 'Other / Not sure', price: 0, color: '#94a3b8' },
];

const timeSlots = [
  '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
  '5:00 PM', '6:00 PM',
];

const steps = [
  { num: 1, label: 'Service', icon: Wrench },
  { num: 2, label: 'Schedule', icon: Calendar },
  { num: 3, label: 'Vehicle', icon: Car },
  { num: 4, label: 'Your Info', icon: User },
  { num: 5, label: 'Confirm', icon: CheckCircle2 },
];

/* ──────────────────────────────────────────────────────── */
/* Input component                                           */
/* ──────────────────────────────────────────────────────── */
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

function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'w-full px-4 py-3 rounded-xl bg-[#0a1328] border border-[#1e3260] text-white placeholder:text-[#3a4f7a] focus:outline-none focus:border-[#e84c1a] transition-colors',
        className
      )}
    />
  );
}

function Textarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'w-full px-4 py-3 rounded-xl bg-[#0a1328] border border-[#1e3260] text-white placeholder:text-[#3a4f7a] focus:outline-none focus:border-[#e84c1a] transition-colors resize-none',
        className
      )}
    />
  );
}

/* ──────────────────────────────────────────────────────── */
/* Wizard                                                     */
/* ──────────────────────────────────────────────────────── */
export default function BookingWizard() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<BookingFormData>({ resolver: zodResolver(schema) });

  const watchService = watch('service_id');
  const watchDate = watch('scheduled_date');
  const watchTime = watch('scheduled_time');
  const selectedService = services.find((s) => s.id === watchService);

  // Min date: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const stepFields: Record<number, (keyof BookingFormData)[]> = {
    1: ['service_id'],
    2: ['scheduled_date', 'scheduled_time', 'address', 'city', 'zip'],
    3: ['vehicle_year', 'vehicle_make', 'vehicle_model'],
    4: ['first_name', 'last_name', 'email', 'phone'],
  };

  async function nextStep() {
    const fields = stepFields[step];
    if (fields) {
      const valid = await trigger(fields);
      if (!valid) return;
    }
    setStep((s) => Math.min(s + 1, 5));
  }

  async function onSubmit(data: BookingFormData) {
    setIsLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setSubmitted(true);
    toast.success('Booking confirmed! Check your email for details.');
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-3xl p-10 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-black text-white mb-3">You're Booked!</h2>
        <p className="text-[#94a3b8] mb-8">
          We've received your appointment request and will confirm by text and email within 15 minutes.
        </p>
        <div className="bg-[#0a1328] rounded-2xl p-6 text-left space-y-3 mb-8">
          <div className="flex justify-between">
            <span className="text-[#7a8fb5] text-sm">Service</span>
            <span className="text-white font-semibold text-sm">{selectedService?.label}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7a8fb5] text-sm">Date &amp; Time</span>
            <span className="text-white font-semibold text-sm">{watchDate} at {watchTime}</span>
          </div>
        </div>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#e84c1a] text-white font-bold hover:bg-[#ff6b35] transition-colors"
        >
          Back to Home
        </a>
      </motion.div>
    );
  }

  return (
    <div className="glass-card rounded-3xl overflow-hidden">
      {/* Steps indicator */}
      <div className="px-6 pt-6 pb-4 border-b border-[#1e3260]/50">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div
                    className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300',
                      isDone
                        ? 'bg-green-500 text-white'
                        : isActive
                        ? 'bg-[#e84c1a] text-white'
                        : 'bg-[#1e3260]/60 text-[#4a6090]'
                    )}
                  >
                    {isDone ? <CheckCircle2 size={16} /> : <Icon size={15} />}
                  </div>
                  <span
                    className={cn(
                      'text-[10px] font-semibold uppercase tracking-wide hidden sm:block',
                      isActive ? 'text-[#e84c1a]' : isDone ? 'text-green-400' : 'text-[#4a6090]'
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      'h-0.5 flex-1 mx-2 transition-colors duration-300',
                      step > s.num ? 'bg-green-500/50' : 'bg-[#1e3260]/40'
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="p-6 sm:p-8"
          >
            {/* ─── Step 1: Service ─────────────────────────── */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-black text-white mb-1">Choose a Service</h2>
                <p className="text-[#7a8fb5] text-sm mb-6">Select the service you need. Not sure? Pick "Other" and we'll help.</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {services.map((svc) => {
                    const Icon = svc.icon;
                    const isSelected = watchService === svc.id;
                    return (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => setValue('service_id', svc.id)}
                        className={cn(
                          'flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200',
                          isSelected
                            ? 'border-[#e84c1a] bg-[#e84c1a]/10'
                            : 'border-[#1e3260]/60 hover:border-[#1e3260] bg-[#0a1328]/60 hover:bg-[#0a1328]'
                        )}
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${svc.color}20` }}
                        >
                          <Icon size={18} style={{ color: svc.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-semibold truncate">{svc.label}</div>
                          <div className="text-[#7a8fb5] text-xs">
                            {svc.price > 0 ? `From $${svc.price}` : 'Price quoted on-site'}
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 size={16} className="text-[#e84c1a] flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                {errors.service_id && (
                  <p className="mt-3 text-xs text-red-400">{errors.service_id.message}</p>
                )}
              </div>
            )}

            {/* ─── Step 2: Schedule + Location ─────────────── */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-black text-white mb-1">Pick a Date &amp; Location</h2>
                  <p className="text-[#7a8fb5] text-sm mb-6">When and where would you like us to come to you?</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Date" error={errors.scheduled_date?.message}>
                    <Input type="date" min={minDate} {...register('scheduled_date')} />
                  </Field>
                  <Field label="Time Preference">
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.slice(0, 6).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setValue('scheduled_time', t)}
                          className={cn(
                            'py-2 rounded-lg text-xs font-semibold border transition-all',
                            watchTime === t
                              ? 'bg-[#e84c1a] border-[#e84c1a] text-white'
                              : 'border-[#1e3260] text-[#94a3b8] hover:border-[#e84c1a]/50 hover:text-white bg-[#0a1328]'
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {timeSlots.slice(6).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setValue('scheduled_time', t)}
                          className={cn(
                            'py-2 rounded-lg text-xs font-semibold border transition-all',
                            watchTime === t
                              ? 'bg-[#e84c1a] border-[#e84c1a] text-white'
                              : 'border-[#1e3260] text-[#94a3b8] hover:border-[#e84c1a]/50 hover:text-white bg-[#0a1328]'
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    {errors.scheduled_time && (
                      <p className="mt-1 text-xs text-red-400">{errors.scheduled_time.message}</p>
                    )}
                  </Field>
                </div>
                <Field label="Street Address" error={errors.address?.message}>
                  <Input
                    placeholder="1234 Main St"
                    {...register('address')}
                  />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="City" error={errors.city?.message}>
                    <Input placeholder="Phoenix" {...register('city')} />
                  </Field>
                  <Field label="ZIP Code" error={errors.zip?.message}>
                    <Input placeholder="85001" maxLength={5} {...register('zip')} />
                  </Field>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <Clock size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-[#94a3b8]">
                    We'll confirm the exact arrival time by text within 15 minutes of your booking.
                    We service all of Greater Phoenix including Scottsdale, Mesa, Tempe, Chandler, and Gilbert.
                  </p>
                </div>
              </div>
            )}

            {/* ─── Step 3: Vehicle ─────────────────────────── */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-black text-white mb-1">Your Vehicle</h2>
                  <p className="text-[#7a8fb5] text-sm mb-6">Tell us about your car so we can bring the right parts.</p>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Field label="Year" error={errors.vehicle_year?.message}>
                    <Input placeholder="2019" maxLength={4} {...register('vehicle_year')} />
                  </Field>
                  <Field label="Make" error={errors.vehicle_make?.message}>
                    <Input placeholder="Toyota" {...register('vehicle_make')} />
                  </Field>
                  <Field label="Model" error={errors.vehicle_model?.message}>
                    <Input placeholder="Camry" {...register('vehicle_model')} />
                  </Field>
                </div>
                <Field label="VIN (optional)">
                  <Input
                    placeholder="1HGCM82633A004352"
                    maxLength={17}
                    {...register('vehicle_vin')}
                  />
                  <p className="mt-1 text-xs text-[#4a6090]">Helps us get exact parts. Found on the dashboard or door jamb.</p>
                </Field>
                <Field label="Additional Notes">
                  <Textarea
                    rows={3}
                    placeholder="Describe the issue, symptoms, warning lights... anything helpful."
                    {...register('notes')}
                  />
                </Field>
              </div>
            )}

            {/* ─── Step 4: Contact Info ─────────────────────── */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-black text-white mb-1">Your Contact Info</h2>
                  <p className="text-[#7a8fb5] text-sm mb-6">We'll use this to confirm your appointment and send updates.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="First Name" error={errors.first_name?.message}>
                    <Input placeholder="John" {...register('first_name')} />
                  </Field>
                  <Field label="Last Name" error={errors.last_name?.message}>
                    <Input placeholder="Smith" {...register('last_name')} />
                  </Field>
                </div>
                <Field label="Email" error={errors.email?.message}>
                  <Input type="email" placeholder="john@example.com" {...register('email')} />
                </Field>
                <Field label="Phone Number" error={errors.phone?.message}>
                  <Input type="tel" placeholder="(602) 555-1234" {...register('phone')} />
                </Field>
                <div className="p-4 rounded-xl bg-[#e84c1a]/10 border border-[#e84c1a]/20">
                  <p className="text-xs text-[#94a3b8]">
                    By booking, you agree to receive text / email updates about your appointment.
                    No spam — ever. We hate that too.
                  </p>
                </div>
              </div>
            )}

            {/* ─── Step 5: Review & Confirm ─────────────────── */}
            {step === 5 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-black text-white mb-1">Review &amp; Confirm</h2>
                  <p className="text-[#7a8fb5] text-sm mb-6">Double-check your details before we lock in your appointment.</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Service', value: selectedService?.label, accent: true },
                    { label: 'Estimated Price', value: selectedService?.price ? `Starting at $${selectedService.price}` : 'Quoted on-site' },
                    { label: 'Date', value: watch('scheduled_date') },
                    { label: 'Time', value: watch('scheduled_time') },
                    { label: 'Location', value: `${watch('address')}, ${watch('city')}, AZ ${watch('zip')}` },
                    { label: 'Vehicle', value: `${watch('vehicle_year')} ${watch('vehicle_make')} ${watch('vehicle_model')}` },
                    { label: 'Name', value: `${watch('first_name')} ${watch('last_name')}` },
                    { label: 'Email', value: watch('email') },
                    { label: 'Phone', value: watch('phone') },
                  ].map(({ label, value, accent }) => (
                    <div
                      key={label}
                      className="flex justify-between items-start py-3 border-b border-[#1e3260]/30 last:border-0"
                    >
                      <span className="text-[#7a8fb5] text-sm">{label}</span>
                      <span
                        className={cn(
                          'text-sm font-semibold text-right max-w-xs',
                          accent ? 'text-[#e84c1a]' : 'text-white'
                        )}
                      >
                        {value || '—'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#94a3b8]">
                    No payment required now. You'll only pay after the service is complete.
                    We accept cash, card, and Venmo.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="px-6 sm:px-8 pb-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(s - 1, 1))}
            disabled={step === 1}
            className={cn(
              'flex items-center gap-2 px-5 py-3 rounded-xl border font-semibold text-sm transition-all',
              step === 1
                ? 'border-[#1e3260]/30 text-[#3a4f7a] cursor-not-allowed'
                : 'border-[#1e3260] text-[#94a3b8] hover:text-white hover:border-[#e84c1a]/40'
            )}
          >
            <ChevronLeft size={16} />
            Back
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#e84c1a] hover:bg-[#ff6b35] text-white font-bold text-sm transition-all glow-orange hover:scale-105"
            >
              Next Step
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#e84c1a] hover:bg-[#ff6b35] text-white font-bold text-sm transition-all glow-orange hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Confirm Booking
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
