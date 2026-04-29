import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingWizard from '@/components/booking/BookingWizard';

export const metadata = {
  title: 'Book an Appointment | Auto-Docs Mobile Mechanic Arizona',
  description:
    'Schedule your mobile mechanic appointment in minutes. Choose your service, pick a time, and we\'ll come to you anywhere in the Greater Phoenix area.',
};

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 min-h-screen hex-pattern">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#e84c1a]/10 border border-[#e84c1a]/30 text-[#e84c1a] text-xs font-bold uppercase tracking-widest mb-4">
              Easy 5-Step Booking
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
              Book Your <span className="gradient-text">Appointment</span>
            </h1>
            <p className="text-[#7a8fb5]">
              Takes about 60 seconds. We'll confirm within 15 minutes.
            </p>
          </div>
          <BookingWizard />
        </div>
      </main>
      <Footer />
    </>
  );
}
